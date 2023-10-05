import { Request, Response } from "express";
import { env } from "../../../config/env";
import { signJwt } from "../../utils/jwt.utils";
import { validatePassword } from "../user/user.service";
import { createSession, findSessions, updateSession } from "./session.service";

export async function createUserSessionHandler(req: Request, res: Response) {
  // Validate the user's password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  // create a session
  const session = await createSession(user._id, req.get("user-agent") || "");

  // create an access token

  const accessToken = signJwt(
    { ...user, session: session._id },
    "ACCESS_TOKEN_PRIVATE_KEY",
    { expiresIn: env.ACCESS_TOKEN_TTL } // 15 minutes,
  );

  // create a refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    "REFRESH_TOKEN_PRIVATE_KEY",
    { expiresIn: env.REFRESH_TOKEN_TTL } // 15 minutes
  );

  // return access & refresh tokens

  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(_req: Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}
