import { Request, Response, NextFunction } from "express";
import { AddressController } from "./address.controller";
import { AddressService } from "./address.service";
import { Logger } from "../utils/logger";

describe("AddressController", () => {
  let mockAddressService: jest.Mocked<AddressService>;
  let mockLogger: jest.Mocked<Logger>;
  let controller: AddressController;

  beforeEach(() => {
    mockAddressService = {
      validateAddress: jest.fn(),
    } as any;

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as any;

    controller = new AddressController(mockAddressService, mockLogger);
  });

  it("should return success response with address on valid input", async () => {
    const mockReq = {
      body: { address: "123 Main St" },
    } as Request;

    const mockRes = {
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const mockNext = jest.fn() as NextFunction;

    const mockResult: AddressValidationResult = {
      status: "valid",
      address: {
        number: "123",
        street: "Main St",
        city: "Test City",
        state: "TS",
        zipCode: "12345",
      },
    };

    mockAddressService.validateAddress.mockResolvedValue(mockResult);

    await controller.validateAddress(mockReq, mockRes, mockNext);

    expect(mockAddressService.validateAddress).toHaveBeenCalledWith("123 Main St");
    expect(mockRes.json).toHaveBeenCalledWith({ success: true, ...mockResult });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next with error when service throws", async () => {
    const mockReq = {
      body: { address: "123 Main St" },
    } as Request;

    const mockRes = {
      json: jest.fn(),
    } as unknown as Response;

    const mockNext = jest.fn() as NextFunction;

    const error = new Error("Service failure");
    mockAddressService.validateAddress.mockRejectedValue(error);

    await controller.validateAddress(mockReq, mockRes, mockNext);

    expect(mockAddressService.validateAddress).toHaveBeenCalledWith("123 Main St");
    expect(mockRes.json).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
