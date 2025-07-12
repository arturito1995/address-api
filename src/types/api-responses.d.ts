interface GoogleMapsAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GoogleMapsResult {
  address_components: GoogleMapsAddressComponent[];
  formatted_address: string;
  geometry: object;
  place_id: string;
  types: string[];
}

interface GoogleMapsAPIResponse {
  results: GoogleMapsResult[];
  status: string;
}

interface SmartyAddressComponents {
  administrative_area: string;
  administrative_area_iso2: string;
  country_iso_3: string;
  locality: string;
  dependent_locality: string;
  postal_code: string;
  postal_code_short: string;
  premise: string;
  premise_number: string;
  thoroughfare: string;
}

interface SmartyAPIResponse {
  input_index: number;
  candidate_index: number;
  components: SmartyAddressComponents;
  metadata: {
    latitude: number;
    longitude: number;
    precision: string;
  };
}
