import { get } from "lodash";
import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { SessionDocument } from "./session.model";

import { env } from "../../../config/env";
import { signJwt, verifyJwt } from "../../utils/jwt.utils";
import { findUser } from "../user/user.service";

export async function createSession(userId: string, userAgent: string) {
  const session = await SessionModel.create({ user: userId, userAgent });

  return session.toJSON();
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
  return SessionModel.find(query).lean();
}

export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) {
  return SessionModel.updateOne(query, update);
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJwt(refreshToken, "REFRESH_TOKEN_PUBLIC_KEY");

  if (!decoded || !get(decoded, "session")) return false;

  const session = await SessionModel.findById(get(decoded, "session"));

  if (!session || !session.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  const accessToken = signJwt(
    { ...user, session: session._id },
    "ACCESS_TOKEN_PRIVATE_KEY",
    { expiresIn: env.ACCESS_TOKEN_TTL } // 15 minutes
  );

  return accessToken;
}
