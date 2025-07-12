interface AddressValidationResult {
  status: "valid" | "corrected" | "unverifiable";
  address?: Address;
  error?: string;
}
