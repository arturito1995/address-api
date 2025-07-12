import { ErrorKeys } from "../enums/error-keys";
import { errorKeyToStatusCodeMap } from "../maps/error-key-to-status-code.map";
import { HTTPStatusCodes } from "../enums/http-status-codes";

export class ApiError extends Error {
  public statusCode: HTTPStatusCodes;
  public details?: unknown;

  constructor(key: ErrorKeys, details?: unknown) {
    super(key);

    this.statusCode = errorKeyToStatusCodeMap[key] ?? HTTPStatusCodes.InternalServerError;
    this.details = !!details && typeof details !== "string" ? JSON.stringify(details) : details;
  }
}
