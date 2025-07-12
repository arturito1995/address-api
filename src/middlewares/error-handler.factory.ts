import { ErrorRequestHandler } from "express";

import { ApiError } from "../error/api-error";
import { HTTPStatusCodes } from "../enums/http-status-codes";
import { ErrorKeys } from "../enums/error-keys";
import { Logger } from "../utils/logger";

export function errorHandlerFactory(logger: Logger): ErrorRequestHandler {
  return (err, req, res, _next) => {
    logger.error(`Error on ${req.method} ${req.originalUrl}`, {
      message: err.message ?? ErrorKeys.InternalServerError,
      stack: err.details ?? err.stack ?? err,
    });

    const statusCode = err instanceof ApiError ? err.statusCode : HTTPStatusCodes.InternalServerError;
    const message = err instanceof ApiError ? err.message : ErrorKeys.InternalServerError;
    const details = err instanceof ApiError ? err.details : undefined;

    const body: Record<string, unknown> = {
      success: false,
      error: message,
    };

    if (details) body.details = details;

    return res.status(statusCode).json(body).end();
  };
}
