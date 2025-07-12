import { requestLoggerFactory } from "./request-logger.factory";
import { Logger } from "../utils/logger";

describe("requestLoggerFactory", () => {
  let loggerMock: Logger;
  let next: jest.Mock;

  beforeEach(() => {
    loggerMock = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as unknown as Logger;

    next = jest.fn();
  });

  it("should log request method and url with query and body, then call next", () => {
    const req = {
      method: "GET",
      originalUrl: "/some/path",
      query: { q: "search" },
      body: { key: "value" },
    } as any;

    const res = {} as any;

    const middleware = requestLoggerFactory(loggerMock);
    middleware(req, res, next);

    expect(loggerMock.info).toHaveBeenCalledWith("GET /some/path", {
      query: req.query,
      body: req.body,
    });

    expect(next).toHaveBeenCalled();
  });
});
