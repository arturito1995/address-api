import { AddressService } from "./address.service";

describe("AddressService", () => {
  let geoServiceMock: { validateAddress: jest.Mock };
  let loggerMock: { info: jest.Mock };
  let addressService: AddressService;

  beforeEach(() => {
    geoServiceMock = { validateAddress: jest.fn() };
    loggerMock = { info: jest.fn() };
    addressService = new AddressService(geoServiceMock as any, loggerMock as any);
  });

  it("should log and call geoService.validateAddress with the correct address", async () => {
    const testAddress = "123 Main St";
    const mockResult = {
      status: "valid",
      address: { number: "123", street: "Main St", city: "Test City", state: "TS", zipCode: "12345" },
    };

    geoServiceMock.validateAddress.mockResolvedValue(mockResult);

    const result = await addressService.validateAddress(testAddress);

    expect(loggerMock.info).toHaveBeenCalledWith(`Validating address: ${testAddress}`);
    expect(geoServiceMock.validateAddress).toHaveBeenCalledWith(testAddress);
    expect(result).toEqual(mockResult);
  });

  it("should propagate errors from geoService.validateAddress", async () => {
    const testAddress = "invalid address";
    const error = new Error("Geo service failed");
    geoServiceMock.validateAddress.mockRejectedValue(error);

    await expect(addressService.validateAddress(testAddress)).rejects.toThrow(error);
    expect(loggerMock.info).toHaveBeenCalledWith(`Validating address: ${testAddress}`);
  });
});
