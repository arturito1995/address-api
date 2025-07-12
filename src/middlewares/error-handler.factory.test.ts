import { Request, Response } from "express";
import { errorHandlerFactory } from "./error-handler.factory";
import { ApiError } from "../error/api-error";
import { HTTPStatusCodes } from "../enums/http-status-codes";
import { ErrorKeys } from "../enums/error-keys";

describe("errorHandlerFactory", () => {
  let loggerMock: { error: jest.Mock };
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let endMock: jest.Mock;
  let next: jest.Mock;

  beforeEach(() => {
    loggerMock = { error: jest.fn() };

    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    endMock = jest.fn().mockReturnThis();

    res = {
      status: statusMock,
      json: jsonMock,
      end: endMock,
    };

    req = {
      method: "GET",
      originalUrl: "/test-url",
    };

    next = jest.fn();
  });

  it("should log error and respond with ApiError details", () => {
    const error = new ApiError(ErrorKeys.BadRequestError, { info: "details" });

    const middleware = errorHandlerFactory(loggerMock as any);

    middleware(error, req as any, res as any, next);

    expect(loggerMock.error).toHaveBeenCalledWith(
      `Error on GET /test-url`,
      expect.objectContaining({
        message: error.message,
        stack: error.details,
      })
    );

    expect(statusMock).toHaveBeenCalledWith(error.statusCode);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: error.message,
      details: error.details,
    });
    expect(endMock).toHaveBeenCalled();
  });

  it("should log error and respond with InternalServerError for generic errors", () => {
    const genericError = new Error("Something went wrong");

    const middleware = errorHandlerFactory(loggerMock as any);

    middleware(genericError, req as any, res as any, next);

    expect(loggerMock.error).toHaveBeenCalledWith(
      `Error on GET /test-url`,
      expect.objectContaining({
        message: genericError.message,
        stack: genericError.stack,
      })
    );

    expect(statusMock).toHaveBeenCalledWith(HTTPStatusCodes.InternalServerError);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: ErrorKeys.InternalServerError,
    });
    expect(endMock).toHaveBeenCalled();
  });

  it("should handle errors with missing message or stack gracefully", () => {
    const errorWithoutMessageOrStack = {} as any;

    const middleware = errorHandlerFactory(loggerMock as any);

    middleware(errorWithoutMessageOrStack, req as any, res as any, next);

    expect(loggerMock.error).toHaveBeenCalledWith(
      `Error on GET /test-url`,
      expect.objectContaining({
        message: ErrorKeys.InternalServerError,
        stack: errorWithoutMessageOrStack,
      })
    );

    expect(statusMock).toHaveBeenCalledWith(HTTPStatusCodes.InternalServerError);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: ErrorKeys.InternalServerError,
    });
    expect(endMock).toHaveBeenCalled();
  });
});
