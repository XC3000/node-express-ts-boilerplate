import mongoose from "mongoose";
import { env } from "../../config/env";
import logger from "./logger";

async function connect() {
  try {
    const db = await mongoose.connect(env.DATABASE_URL);
    logger.info(`DB connected to host ${db.connection.host}`);
  } catch (error) {
    logger.error("Could not connect to db");
    process.exit(1);
  }
}

export default connect;
