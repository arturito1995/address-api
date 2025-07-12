import { RequestHandler, Router } from "express";

import { GeoModule } from "../geo/geo.module";
import { validateSchemaFactory } from "../middlewares/validate-schema.factory";
import { addressPayloadSchema } from "../schemas/address-payload.schema";
import { Logger } from "../utils/logger";

import { AddressController } from "./address.controller";
import { AddressService } from "./address.service";

export class AddressModule {
  public readonly router: Router;
  private readonly validateAddressMiddleware: RequestHandler;

  constructor(private readonly geoModule: GeoModule, private readonly logger: Logger) {
    this.validateAddressMiddleware = validateSchemaFactory(addressPayloadSchema, this.logger);

    const addressService = new AddressService(this.geoModule.service, this.logger);
    const addressController = new AddressController(addressService, this.logger);

    this.router = Router();

    this.attachRoutes(addressController);
  }

  private attachRoutes(controller: AddressController): void {
    this.router.post("/validate", this.validateAddressMiddleware, controller.validateAddress.bind(controller));
  }
}
