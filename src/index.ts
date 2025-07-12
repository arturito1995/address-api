import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { AddressModule } from "./address/address.module";
import { GeoModule } from "./geo/geo.module";

import { Logger } from "./utils/logger";
import { SwaggerManager } from "./utils/swagger-manager";

import { requestLoggerFactory } from "./middlewares/request-logger.factory";
import { errorHandlerFactory } from "./middlewares/error-handler.factory";
import { rateLimiterFactory } from "./middlewares/rate-limiter.factory";

dotenv.config();

function main() {
  const logger = new Logger();
  const swaggerManager = new SwaggerManager();

  logger.info("Bootstrapping application...");

  const app = express();

  swaggerManager.setupDocs(app);

  const geoModule = new GeoModule(logger);
  const addressModule = new AddressModule(geoModule, logger);

  const requestLoggerMiddleware = requestLoggerFactory(logger);
  const errorHandleMiddleware = errorHandlerFactory(logger);
  const rateLimiter = rateLimiterFactory();

  app.use(rateLimiter);

  app.use(cors({ methods: ["POST"] }));
  app.use(express.json());

  app.use(requestLoggerMiddleware);

  app.use("/address", addressModule.router);

  app.use(errorHandleMiddleware);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
  });
}

main();
