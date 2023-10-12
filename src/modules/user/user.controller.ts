import { Request, Response } from "express";
import { pick } from "lodash";
import { env } from "../../../config/env";
import { catchAsyncError } from "../../middleware/catchAsyncErrors";
import { randomImageName } from "../../utils/generateRandomName";
import { deleteFileFromS3, pushFileToS3 } from "../../utils/s3";
import * as userService from "../user/user.service";
import { CreateUserInput, DeleteUserInput } from "./user.schema";

export const createUserHandler = catchAsyncError(
  async (
    req: Request<
      Record<string, never>,
      Record<string, never>,
      CreateUserInput["body"]
    >,
    res: Response
  ) => {
    if (req.file) {
      const imageName = "user/" + randomImageName();

      const params = {
        Key: imageName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const profile = await pushFileToS3(params);

      const fetchedUser = await userService.createUser({
        ...req.body,
        profile: imageName,
      });

      let user = pick(fetchedUser.toJSON(), [
        "name",
        "email",
        "profile",
        "_id",
      ]);

      user = {
        ...user,
        profile: env.CLOUDFRONT_BASE_URL + user.profile,
      };

      return res.status(200).json({
        message: "User and profile created sucessully",
        data: user,
      });
    }

    // const user = await userService.createUser(req.body);

    return res.status(200).json({
      message: "User created sucessully",
      // data: pick(user.toJSON(), ["name", "email", "_id"]),
    });
  }
);

export const deleteUser = catchAsyncError(
  async (
    req: Request<
      DeleteUserInput["params"],
      Record<string, never>,
      Record<string, never>,
      Record<string, never>
    >,
    res: Response
  ) => {
    const userId = req.params.id;

    const user = await userService.findUser({ _id: userId });

    if (!user) {
      return res.status(200).json({
        message: "User deleted sucessully",
        data: user,
      });
    }

    if (user?.profile) {
      const profile = await deleteFileFromS3({
        Key: user.profile,
      });

      const deletedUser = await userService.deleteUser(userId);
      return res.status(200).json({
        message: "User deleted sucessully",
        data: {
          profile,
          deletedUser,
        },
      });
    }

    const deletedUser = await userService.deleteUser(userId);

    return res.status(200).json({
      message: "User deleted sucessully",
      data: {
        deletedUser,
      },
    });
  }
);
