import { ErrorKeys } from "../enums/error-keys";
import { ApiError } from "../error/api-error";
import { Logger } from "../utils/logger";

import { GeoService } from "./geo.service";

export class GoogleGeoService extends GeoService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private readonly logger: Logger) {
    super();

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const baseUrl = process.env.GOOGLE_MAPS_BASE_URL;

    if (!apiKey) throw new ApiError(ErrorKeys.MissingGoogleApiKey);
    if (!baseUrl) throw new ApiError(ErrorKeys.MissingGoogleMapsURL);

    this.apiKey = apiKey;
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

      const components = this.extractComponents(result.address_components);

      const formatted = this.formatData(components);

      return {
        status: "corrected",
        address: formatted,
      };
    } catch (err) {
      this.logger.error("Error calling Google Maps Geocoding API", err);
      if (err instanceof ApiError) throw err;
      throw new ApiError(ErrorKeys.GoogleMapsApiError, err);
    }
  }

  private async fetchData(address: string): Promise<GoogleMapsResult[]> {
    const encodedAddress = encodeURIComponent(address);

    const url = `${this.baseUrl}?address=${encodedAddress}&key=${this.apiKey}`;

    const response = await fetch(url);

    if (!response.ok) throw new ApiError(ErrorKeys.GoogleMapsApiError, response.statusText);

    const data: GoogleMapsAPIResponse = await response.json();

    return data.results;
  }

  private extractComponents(components: GoogleMapsAddressComponent[]): Record<string, string | undefined> {
    const map: Record<string, string | undefined> = {};

    for (const component of components) {
      for (const type of component.types) {
        map[type] = component.long_name;
      }
    }

    return map;
  }

  private formatData(components: Record<string, string | undefined>): Address {
    return {
      number: components.street_number ?? null,
      street: components.route ?? null,
      city: components.locality ?? components.sublocality ?? components.administrative_area_level_2 ?? null,
      state: components.administrative_area_level_1 ?? null,
      zipCode: components.postal_code ?? null,
    };
  }
}
