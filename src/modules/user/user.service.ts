import { omit } from "lodash";
import { FilterQuery, mongo } from "mongoose";
import UserModel, { UserDocument, UserInput } from "./user.model";

export async function createUser(input: UserInput) {
  return await UserModel.create(input);
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), "password");
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}

export async function deleteUser(id: string) {
  return UserModel.deleteOne(new mongo.ObjectId(id));
}
