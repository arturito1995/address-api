import { SmartyGeoService } from "../../src/geo/smarty.geo.service";
import { Logger } from "../../src/utils/logger";
import { ErrorKeys } from "../../src/enums/error-keys";

describe("SmartyGeoService", () => {
  const logger = new Logger();
  const fetchMock = jest.fn();

  process.env.SMARTY_AUTH_ID = "fake-id";
  process.env.SMARTY_AUTH_TOKEN = "fake-token";
  process.env.SMARTY_BASE_URL = "https://international-street.api.smarty.com/verify";

  const service = new SmartyGeoService(logger);

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = fetchMock;
  });

  it("should return a valid address", async () => {
    fetchMock.mockResolvedValueOnce({
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

    const result = await service.validateAddress("Rua Ipanema 30 Quintas Natal RN");
    expect(result.status).toBe("valid");
    expect(result.address?.city).toBe("Quintas");
  });

  it("should handle empty results", async () => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    const result = await service.validateAddress("Unknown address");
    expect(result.status).toBe("unverifiable");
  });

  it("should throw API error", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    fetchMock.mockResolvedValueOnce({ message: "Unauthorized", status: 401 });

    await expect(service.validateAddress("test")).rejects.toThrow(ErrorKeys.SmartyStreetsApiError);
  });
});
