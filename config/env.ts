import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_PUBLIC_KEY: z.string(),
  ACCESS_TOKEN_PRIVATE_KEY: z.string(),
  REFRESH_TOKEN_PRIVATE_KEY: z.string(),
  REFRESH_TOKEN_PUBLIC_KEY: z.string(),
  PORT: z.string().transform((v) => parseInt(v, 10)),
  ACCESS_TOKEN_TTL: z.string(),
  REFRESH_TOKEN_TTL: z.string(),
  SALT_WORK_FACTOR: z.string().transform((v) => parseInt(v, 10)),
});

export const env = envSchema.parse(process.env);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJs {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
