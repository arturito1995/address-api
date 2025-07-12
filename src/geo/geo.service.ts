export abstract class GeoService {
  abstract validateAddress(address: string): Promise<AddressValidationResult>;

}
