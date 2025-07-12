import { GeoModule } from "./geo.module";
import { Logger } from "../utils/logger";
import { SmartyGeoService } from "./smarty.geo.service";
import { GoogleGeoService } from "./google.geo.service";
import { ErrorKeys } from "../enums/error-keys";

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
} as unknown as Logger;

describe("GeoModule", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("should initialize with SmartyGeoService when provider is 'smarty'", () => {
    process.env.GEO_SERVICE_PROVIDER = "smarty";
    process.env.SMARTY_AUTH_ID = "dummy_id";
    process.env.SMARTY_AUTH_TOKEN = "dummy_token";
    process.env.SMARTY_BASE_URL = "https://dummy.smarty.com";

    const module = new GeoModule(mockLogger);

    expect(module.service).toBeInstanceOf(SmartyGeoService);
    expect(mockLogger.info).toHaveBeenCalledWith("GeoModule initialized with smarty provider");
  });

  it("should initialize with GoogleGeoService when provider is 'google'", () => {
    process.env.GEO_SERVICE_PROVIDER = "google";
    process.env.GOOGLE_MAPS_API_KEY = "dummy_api_key";
    process.env.GOOGLE_MAPS_BASE_URL = "https://dummy.googleapis.com/maps/api/geocode/json";

    const module = new GeoModule(mockLogger);

    expect(module.service).toBeInstanceOf(GoogleGeoService);
    expect(mockLogger.info).toHaveBeenCalledWith("GeoModule initialized with google provider");
  });

  it("should throw MissingGeoServiceProvider if provider is undefined", () => {
    delete process.env.GEO_SERVICE_PROVIDER;

    expect(() => new GeoModule(mockLogger)).toThrow(ErrorKeys.MissingGeoServiceProvider);
  });

  it("should throw InvalidGeoServiceProvider for invalid provider", () => {
    process.env.GEO_SERVICE_PROVIDER = "invalid";

    expect(() => new GeoModule(mockLogger)).toThrow(ErrorKeys.InvalidGeoServiceProvider);
  });
});
