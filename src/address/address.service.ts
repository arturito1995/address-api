import { GeoService } from "../geo/geo.service";
import { Logger } from "../utils/logger";

export class AddressService {
  constructor(private readonly geoService: GeoService, private readonly logger: Logger) {}

  async validateAddress(address: string): Promise<AddressValidationResult> {
    this.logger.info(`Validating address: ${address}`);
    return await this.geoService.validateAddress(address);
  }
}
