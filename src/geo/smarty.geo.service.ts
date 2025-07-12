import { ErrorKeys } from "../enums/error-keys";
import { ApiError } from "../error/api-error";
import { Logger } from "../utils/logger";

import { GeoService } from "./geo.service";

export class SmartyGeoService extends GeoService {
  private readonly authId: string;
  private readonly authToken: string;
  private readonly baseUrl: string;

  constructor(private readonly logger: Logger) {
    super();

    const authId = process.env.SMARTY_AUTH_ID;
    const authToken = process.env.SMARTY_AUTH_TOKEN;
    const baseUrl = process.env.SMARTY_BASE_URL;

    if (!authId || !authToken) throw new ApiError(ErrorKeys.MissingSmartyCredentials);
    if (!baseUrl) throw new ApiError(ErrorKeys.MissingSmartyURL);

    this.authId = authId;
    this.authToken = authToken;
    this.baseUrl = baseUrl;
  }

  async validateAddress(address: string): Promise<AddressValidationResult> {
    try {
      const data = await this.fetchData(address);

      if (!data.length) {
        this.logger.warn(`No address match found for: ${address}`);
        return { status: "unverifiable" };
      }

      const [result] = data;

      const formatted = this.formatData(result);

      return {
        status: "valid",
        address: formatted,
      };
    } catch (err) {
      this.logger.error("Error calling SmartyStreets API", err);
      if (err instanceof ApiError) throw err;
      throw new ApiError(ErrorKeys.SmartyStreetsApiError, err);
    }
  }

  private async fetchData(address: string): Promise<SmartyAPIResponse[]> {
    const queryParams = new URLSearchParams({
      "auth-id": this.authId,
      "auth-token": this.authToken,
      country: "US", // You can extract this dynamically or default to "BRA" for Brazil
      freeform: address,
    });

    const url = `${this.baseUrl}?${queryParams.toString()}`;

    const response = await fetch(url);

    if (!response.ok) throw new ApiError(ErrorKeys.SmartyStreetsApiError, response.statusText);

    return await response.json();
  }

  private formatData(data: SmartyAPIResponse): Address {
    return {
      number: data.components?.premise_number ?? null,
      street: data.components?.thoroughfare ?? null,
      city: data.components?.dependent_locality ?? data.components?.locality ?? null,
      state: data.components?.administrative_area ?? null,
      zipCode: data.components?.postal_code ?? null,
    };
  }
}
