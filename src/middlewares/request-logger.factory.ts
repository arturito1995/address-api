import { RequestHandler } from "express";

import { Logger } from "../utils/logger";

export function requestLoggerFactory(logger: Logger): RequestHandler {
  return (req, _res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`, {
      query: req.query,
      body: req.body,
    });

    next();
  };
}
