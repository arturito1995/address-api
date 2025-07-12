import Joi from "joi";
import { validateSchemaFactory } from "./validate-schema.factory";
import { ApiError } from "../error/api-error";
import { ErrorKeys } from "../enums/error-keys";

describe("validateSchemaFactory", () => {
  let loggerMock: { info: jest.Mock; error: jest.Mock };
  let req: any;
  let next: jest.Mock;

  const schema = Joi.object({
    name: Joi.string().required(),
  });

  beforeEach(() => {
    loggerMock = {
      info: jest.fn(),
      error: jest.fn(),
    };

    next = jest.fn();
  });

  it("should call next without error if validation passes", () => {
    req = {
      method: "POST",
      originalUrl: "/test",
      body: { name: "validName" },
    };

    const middleware = validateSchemaFactory(schema, loggerMock as any);
    middleware(req, {} as any, next);

    expect(loggerMock.info).toHaveBeenCalledWith("Validating request body for POST /test");
    expect(next).toHaveBeenCalledWith();
    expect(loggerMock.error).not.toHaveBeenCalled();
  });

  it("should call next with ApiError if validation fails", () => {
    req = {
      method: "POST",
      originalUrl: "/test",
      body: { name: 123 },
    };

    const middleware = validateSchemaFactory(schema, loggerMock as any);
    middleware(req, {} as any, next);

    expect(loggerMock.info).toHaveBeenCalledWith("Validating request body for POST /test");
    expect(loggerMock.error).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();

    const errorArg = next.mock.calls[0][0];
    expect(errorArg).toBeInstanceOf(ApiError);
    expect(errorArg.message).toBe(ErrorKeys.PayloadValidationError);
    expect(errorArg.details).toBeDefined();
  });
});
