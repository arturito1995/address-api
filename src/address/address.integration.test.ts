import request from "supertest";
import express, { Express } from "express";

import { AddressModule } from "./address.module";
import { GeoModule } from "../geo/geo.module";
import { rateLimiterFactory } from "../middlewares/rate-limiter.factory";
import { errorHandlerFactory } from "../middlewares/error-handler.factory";
import { requestLoggerFactory } from "../middlewares/request-logger.factory";
import { Logger } from "../utils/logger";
import { HTTPStatusCodes } from "../enums/http-status-codes";
import { ErrorKeys } from "../enums/error-keys";
import { mock } from "node:test";

function createTestApp(): Express {
  const app = express();
  const logger = new Logger();

  const geoModule = new GeoModule(logger);
  const addressModule = new AddressModule(geoModule, logger);

  app.use(rateLimiterFactory());
  app.use(express.json());
  app.use(requestLoggerFactory(logger));
  app.use("/address", addressModule.router);
  app.use(errorHandlerFactory(logger));

  return app;
}

process.env.GEO_SERVICE_PROVIDER = "smarty";
process.env.SMARTY_AUTH_ID = "dummy_id";
process.env.SMARTY_AUTH_TOKEN = "dummy_token";
process.env.SMARTY_BASE_URL = "https://api.smartystreets.com";

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "info").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("Integration: /address/validate", () => {
  let app: Express;
  const mockFetch = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = mockFetch;
    app = createTestApp();
  });

  it("should return 200 and valid address response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            components: {
              premise_number: "30",
              thoroughfare: "Rua Ipanema",
              dependent_locality: "Quintas",
              locality: "Natal",
              administrative_area: "RN",
              postal_code: "59035-110",
            },
          },
        ]),
    });

    const res = await request(app)
      .post("/address/validate")
      .send({ address: "1600 Amphitheatre Parkway, Mountain View, CA" });

    expect(res.status).toBe(HTTPStatusCodes.OK);
    expect(res.body.success).toBe(true);
  });

  it("should return 400 on missing address", async () => {
    const res = await request(app).post("/address/validate").send({});

    expect(res.status).toBe(HTTPStatusCodes.BadRequest);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe(ErrorKeys.PayloadValidationError);
  });

  it("should enforce rate limit after 10 requests", async () => {
    for (let i = 0; i < 10; i++) {
      const res = await request(app).post("/address/validate").send({ address: "test" });
      expect(res.status).not.toBe(HTTPStatusCodes.TooManyRequests);
    }

    const res = await request(app).post("/address/validate").send({ address: "test" });

    expect(res.status).toBe(HTTPStatusCodes.TooManyRequests);
    expect(res.body).toEqual({
      success: false,
      error: ErrorKeys.RateLimitExceeded,
    });
  });

  it("should crash on invalid geo service", async () => {
    process.env.GEO_SERVICE_PROVIDER = "invalid";

    expect(() => createTestApp()).toThrow(ErrorKeys.InvalidGeoServiceProvider);
  });
});
