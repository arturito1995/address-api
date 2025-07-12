import { NextFunction, Request, Response } from "express";

import { Logger } from "../utils/logger";

import { AddressService } from "./address.service";

export class AddressController {
  constructor(private readonly addressService: AddressService, private readonly logger: Logger) {}

  async validateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as AddressPayload;

      const result = await this.addressService.validateAddress(payload.address);

      return res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }
}
