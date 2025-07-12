import { ErrorKeys } from "../enums/error-keys";
import { HTTPStatusCodes } from "../enums/http-status-codes";

export const errorKeyToStatusCodeMap: Record<ErrorKeys, HTTPStatusCodes> = {
  [ErrorKeys.InternalServerError]: HTTPStatusCodes.InternalServerError,
  [ErrorKeys.BadRequestError]: HTTPStatusCodes.BadRequest,
  [ErrorKeys.MissingGeoServiceProvider]: HTTPStatusCodes.InternalServerError,
  [ErrorKeys.InvalidGeoServiceProvider]: HTTPStatusCodes.InternalServerError,
  [ErrorKeys.MissingGoogleApiKey]: HTTPStatusCodes.InternalServerError,
  [ErrorKeys.MissingSmartyCredentials]: HTTPStatusCodes.InternalServerError,
  [ErrorKeys.PayloadValidationError]: HTTPStatusCodes.BadRequest,
  [ErrorKeys.RateLimitExceeded]: HTTPStatusCodes.TooManyRequests,
  [ErrorKeys.SmartyStreetsApiError]: HTTPStatusCodes.InternalServerError,
  [ErrorKeys.GoogleMapsApiError]: HTTPStatusCodes.InternalServerError,
  [ErrorKeys.MissingGoogleMapsURL]: HTTPStatusCodes.InternalServerError,
  [ErrorKeys.MissingSmartyURL]: HTTPStatusCodes.InternalServerError,
};
