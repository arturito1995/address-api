import express from "express";
import request from "supertest";
import { rateLimiterFactory } from "./rate-limiter.factory";
import { ErrorKeys } from "../enums/error-keys";
import { HTTPStatusCodes } from "../enums/http-status-codes";

describe("rateLimiterFactory", () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(rateLimiterFactory());
    app.get("/", (_req, res) => res.status(200).json({ success: true }));
  });

  it("should allow requests within the limit", async () => {
    for (let i = 0; i < 10; i++) {
      const response = await request(app).get("/");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    }
  });

  it("should block requests over the limit", async () => {
    for (let i = 0; i < 10; i++) {
      await request(app).get("/");
    }

    const response = await request(app).get("/");

    expect(response.status).toBe(HTTPStatusCodes.TooManyRequests);
    expect(response.body).toEqual({
      success: false,
      error: ErrorKeys.RateLimitExceeded,
    });
  });
});
