import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt.utils";

import z from "zod";
import { reIssueAccessToken } from "../modules/session/session.service";

const refreshTokenSchema = z.string().optional();

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  if (!accessToken) {
    return next();
  }
  // const refreshToken = get(req, "headers.x-refresh");

  const refreshToken = refreshTokenSchema.parse(get(req, "headers.x-refresh"));

  if (!refreshToken) {
    return next();
  }

  const { decoded, expired } = verifyJwt(
    accessToken,
    "ACCESS_TOKEN_PUBLIC_KEY"
  );

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
    }

    const result = verifyJwt(
      newAccessToken as string,
      "ACCESS_TOKEN_PUBLIC_KEY"
    );

    res.locals.user = result.decoded;
    return next();
  }

  return next();
};

export default deserializeUser;
