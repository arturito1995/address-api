import { GoogleGeoService } from "../../src/geo/google.geo.service";
import { Logger } from "../../src/utils/logger";
import { ErrorKeys } from "../../src/enums/error-keys";

describe("GoogleGeoService", () => {
  const logger = new Logger();
  const fetchMock = jest.fn();

  process.env.GOOGLE_MAPS_API_KEY = "fake-key";
  process.env.GOOGLE_MAPS_BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

  const service = new GoogleGeoService(logger);

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = fetchMock;
  });

  it("should return a corrected address", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          results: [
            {
              address_components: [
                { long_name: "1600", types: ["street_number"] },
                { long_name: "Amphitheatre Parkway", types: ["route"] },
                { long_name: "Mountain View", types: ["locality"] },
                { long_name: "CA", types: ["administrative_area_level_1"] },
                { long_name: "94043", types: ["postal_code"] },
              ],
            },
          ],
        }),
    });

    const result = await service.validateAddress("1600 Amphitheatre Parkway");
    expect(result.status).toBe("corrected");
    expect(result.address?.city).toBe("Mountain View");
  });

  it("should throw error on failure", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    fetchMock.mockRejectedValueOnce("API ERROR");

    await expect(service.validateAddress("bad input")).rejects.toThrow(ErrorKeys.GoogleMapsApiError);
  });
});
