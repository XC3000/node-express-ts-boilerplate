import { Request, Response } from "express";
import { CreateUserInput } from "./user.schema";
import { createUser } from "./user.service";
import { catchAsyncError } from "../../middleware/catchAsyncErrors";
import { pick } from "lodash";

// export async function createUserHandler(
//   req: Request<{}, {}, CreateUserInput["body"]>,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const user = await createUser(req.body);
//     return res.send(user);
//   } catch (e: any) {
//     // logger.error(e);
//     console.log(e);
//     next(e);
//     // return res.status(409).send(e.message);
//   }
// }

export const createUserHandler = catchAsyncError(
  async (
    req: Request<
      Record<string, never>,
      Record<string, never>,
      CreateUserInput["body"]
    >,
    res: Response
  ) => {
    const user = await createUser(req.body);

    return res.status(200).json({
      message: "User created sucessully",
      data: pick(user.toJSON(), ["name", "email"]),
    });
  }
);
