import { Logger } from "./logger";

describe("Logger", () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger();

    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("info", () => {
    it("should call console.log with message and data", () => {
      const message = "info message";
      const data = { key: "value" };

      logger.info(message, data);

      expect(console.log).toHaveBeenCalledWith(`[INFO] ${message}`, data);
    });

    it("should call console.log with message and empty string if no data", () => {
      const message = "info message";

      logger.info(message);

      expect(console.log).toHaveBeenCalledWith(`[INFO] ${message}`, "");
    });
  });

  describe("warn", () => {
    it("should call console.warn with message and data", () => {
      const message = "warn message";
      const data = { key: "value" };

      logger.warn(message, data);

      expect(console.warn).toHaveBeenCalledWith(`[WARN] ${message}`, data);
    });

    it("should call console.warn with message and empty string if no data", () => {
      const message = "warn message";

      logger.warn(message);

      expect(console.warn).toHaveBeenCalledWith(`[WARN] ${message}`, "");
    });
  });

  describe("error", () => {
    it("should call console.error with message and data", () => {
      const message = "error message";
      const data = { key: "value" };

      logger.error(message, data);

      expect(console.error).toHaveBeenCalledWith(`[ERROR] ${message}`, data);
    });

    it("should call console.error with message and empty string if no data", () => {
      const message = "error message";

      logger.error(message);

      expect(console.error).toHaveBeenCalledWith(`[ERROR] ${message}`, "");
    });
  });
});
