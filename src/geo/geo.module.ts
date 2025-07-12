import { ErrorKeys } from "../enums/error-keys";
import { ApiError } from "../error/api-error";
import { Logger } from "../utils/logger";

import { GeoService } from "./geo.service";
import { GoogleGeoService } from "./google.geo.service";
import { SmartyGeoService } from "./smarty.geo.service";

type GeoServiceProvider = "google" | "smarty";

export class GeoModule {
  public readonly service: GeoService;
  private readonly provider?: GeoServiceProvider;

  constructor(private readonly logger: Logger) {
    this.provider = process.env.GEO_SERVICE_PROVIDER as GeoServiceProvider;

    this.service = this.createGeoService(this.provider);

    this.logger.info(`GeoModule initialized with ${this.provider} provider`);
  }

  private createGeoService(provider?: GeoServiceProvider): GeoService {
    switch (provider) {
      case "google":
        return new GoogleGeoService(this.logger);
      case "smarty":
        return new SmartyGeoService(this.logger);
      case undefined:
        throw new ApiError(ErrorKeys.MissingGeoServiceProvider);
      default:
        throw new ApiError(ErrorKeys.InvalidGeoServiceProvider);
    }
  }
}
