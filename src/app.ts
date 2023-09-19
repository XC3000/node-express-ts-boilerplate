import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import config from "config";
import morgan from "morgan";
import responseTime from "response-time";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes/v1/index";
import deserializeUser from "./middleware/deserializeUser";
import { restResponseTimeHistogram, startMetricsServer } from "./utils/metrics";
import swaggerDocs from "./utils/swagger";
import { globalErrorMiddleware } from "./middleware/error";

const port = config.get<number>("port");

const app = express();

app.use(express.json());

app.use(deserializeUser);

app.use(
  responseTime((req: Request, res: Response, time: number) => {
    if (req?.route?.path) {
      restResponseTimeHistogram.observe(
        {
          method: req.method,
          route: req.route.path,
          status_code: res.statusCode,
        },
        time * 1000
      );
    }
  })
);

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);

  await connect();

  // Development logging
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  app.use("/api", routes);

  app.use(globalErrorMiddleware);

  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
  });

  // Production metrics and docs
  if (process.env.NODE_ENV === "production") {
    startMetricsServer();
    swaggerDocs(app, port);
  }
});
