import { RequestHandler } from "express";
import Joi from "joi";

import { ApiError } from "../error/api-error";
import { ErrorKeys } from "../enums/error-keys";
import { Logger } from "../utils/logger";

export function validateSchemaFactory(schema: Joi.ObjectSchema, logger: Logger): RequestHandler {
  return (req, _res, next) => {
    logger.info(`Validating request body for ${req.method} ${req.originalUrl}`);

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      logger.error(`Validation error on ${req.method} ${req.originalUrl}`, error);
      const details = error.details.map((detail) => detail.message).join(", ");
      return next(new ApiError(ErrorKeys.PayloadValidationError, details));
    }

    next();
  };
}
