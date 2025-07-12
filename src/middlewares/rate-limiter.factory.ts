import rateLimit from "express-rate-limit";
import { ErrorKeys } from "../enums/error-keys";
import { HTTPStatusCodes } from "../enums/http-status-codes";

const ONE_MINUTE_IN_MS = 60 * 1000;
const MAX_REQUESTS_PER_MINUTE = 10;

export function rateLimiterFactory() {
  return rateLimit({
    windowMs: ONE_MINUTE_IN_MS,
    max: MAX_REQUESTS_PER_MINUTE,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(HTTPStatusCodes.TooManyRequests).json({
        success: false,
        error: ErrorKeys.RateLimitExceeded,
      });
    },
  });
}
