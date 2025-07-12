# Address Validation API

A Node.js/Express REST API to validate and standardize physical addresses using external geo-location services like Google Maps and SmartyStreets.

---

## Overview

This project was designed and built to create a modular, maintainable, and extensible address validation service with the following goals in mind:

- **Pluggable Geo Providers:** Easily switch between different geocoding services without changing core logic.
- **Robust API Design:** A clear and consistent REST interface with input validation, error handling, and rate limiting.
- **Developer Experience:** Good documentation, logging, and a testable architecture.
- **Configuration Flexibility:** Sensitive keys and options injected via environment variables.
- **Extensibility:** Simple to add new providers or extend existing functionality.

---

## Thought Process & Design Decisions

### 1. **Modularization**

The app is split into domain modules — primarily **GeoModule** and **AddressModule** — each encapsulating routing, services, and middleware relevant to their concerns. This improves code organization and testability.

### 2. **Abstraction Over Geo Providers**

We introduced a `GeoService` abstract class with concrete implementations for Google Maps and SmartyStreets. This design enables:

- Selecting provider via environment variables (`GEO_SERVICE_PROVIDER`).
- Throwing meaningful errors if config is missing or invalid.
- Future addition of providers with minimal disruption.

### 3. **API Input Validation**

Using Joi schemas (`addressPayloadSchema`), we validate incoming requests early in the pipeline. This prevents unnecessary processing and improves reliability.

### 4. **Error Handling Strategy**

A custom `ApiError` class carries domain-specific error keys and maps to HTTP status codes. Centralized error-handling middleware formats all errors into consistent JSON responses and logs them.

### 5. **Security and Stability**

Rate limiting (via `express-rate-limit`) protects the API from abuse, and CORS is configured to allow only POST methods, restricting unexpected access.

### 6. **Logging**

A simple `Logger` class wraps console methods for uniform logging. It’s injected throughout services and middleware to keep traceability consistent.

### 7. **Documentation**

Swagger UI is integrated with the OpenAPI spec (`docs/swagger.yaml`) to provide interactive API documentation at `/docs`.

### 8. **Testing**

Unit tests and integration tests are planned for critical modules. Test failures related to environment-dependent providers highlighted the importance of environment config in tests.

### 9. **Tooling**

- TypeScript for type safety and maintainability.
- Jest for testing.
- dotenv for environment configuration.
- ts-node-dev for fast development iteration.

---

## Development Journey

- **Initial Setup:** Created base project structure with TypeScript, Express, and essential middlewares.
- **Geo Provider Abstraction:** Designed `GeoService` interface and provider classes. Environment variables control selection.
- **Concrete Geo Provider Implementations:** Developed `GoogleGeoService` and `SmartyGeoService` to encapsulate all provider-specific logic including request construction, response parsing, and error handling.
- **Address Module:** Created routes, service, and controller for the address validation endpoint.
- **Input Validation & Error Handling:** Implemented Joi validation middleware and structured error response system.
- **Rate Limiting and Logging:** Added rate limiting and request logging for production readiness.
- **Swagger Documentation:** Added API docs for ease of use by clients and developers.
- **Testing Challenges:** Encountered and resolved environment dependency issues in tests by mocking and proper environment setup.
- **Snapshot & Code Organization:** Developed scripts for code snapshotting, with options for directories and extensions filtering, helping with review and audit.
- **Code Review & Evaluation:** Performed architectural and system design review emphasizing modularity, extensibility, and clean separation of concerns.
- **Comprehensive Documentation:** Created explanations for new developers including file-by-file walkthrough and README summarizing the design.

---

## How to Run

1. Clone the repo
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set environment variables (e.g., `.env`):

   ```bash
   GEO_SERVICE_PROVIDER=smarty
   SMARTY_AUTH_ID=your_auth_id
   SMARTY_AUTH_TOKEN=your_auth_token
   SMARTY_BASE_URL=www.gmaps.baseurl.com
   GOOGLE_MAPS_API_KEY=your_google_api_key
   GOOGLE_MAPS_BASE_URL=www.gmaps.baseurl.com
   PORT=3000
   ```

4. Start the server:

   ```bash
   npm run dev
   ```

5. Access Swagger docs at: [http://localhost:3000/docs](http://localhost:3000/docs)
6. Use `/address/validate` endpoint to validate addresses.

---
## API Keys Setup

### Getting Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select an existing project.
3. Navigate to **APIs & Services > Credentials**.
4. Click **Create Credentials > API key**.
5. Restrict the API key by setting application restrictions and enabling the **Maps JavaScript API** and **Geocoding API**.
6. Copy the generated API key for use in your application.

### Getting SmartyStreets API Keys

1. Visit the [SmartyStreets Signup Page](https://www.smartystreets.com/signup).
2. Register for a free account or log in if you already have one.
3. Navigate to the **API Keys** section in the dashboard.
4. Create a new API key and copy the **Auth ID** and **Auth Token**.
5. Use these credentials in your application to authenticate SmartyStreets API calls.

---

## Trade-offs Between Google Maps API and SmartyStreets API

| Feature/Aspect                | Google Maps API                            | SmartyStreets API                        |
|------------------------------|-------------------------------------------|-----------------------------------------|
| **Input Requirements**        | More flexible input, supports partial/approximate addresses | Requires stricter, well-structured input with defined country |
| **Country Specification**     | Country can be omitted, guesses location | Country must be explicitly specified in every request |
| **Accuracy & Validation**     | Good global coverage, less strict validation | Very strict validation, especially strong for US addresses |
| **Pricing Model**             | Pay-as-you-go with generous free tier    | Free tier available; paid plans based on usage |
| **Address Standardization**  | Provides geocoding and place info        | Focuses heavily on address verification and standardization |
| **Error Handling**            | Returns partial matches or suggestions   | May reject requests with incomplete data |
| **Use Case Suitability**      | Better for general geocoding and flexible inputs | Better for high-quality address validation and mailing use cases |

### Summary

- **Google Maps API** is easier to integrate when inputs are incomplete or loosely structured, useful for global geocoding with less strict validation.
- **SmartyStreets API** demands more precise and complete input, including mandatory country specification, but provides more reliable address verification and standardization, especially in the US. For this app, the international API was chosen, but it is restricted to the US on the moment of the call.
___

## Prompting

The relevant prompts used during the development of this project are available [here](./prompts.md).
___

## Next Steps & Improvements

- Add authentication and authorization.
- Support caching of validation results.
- Implement additional geo providers.
- Enhance logging with external services.
- Expand test coverage and CI/CD integration.

---

Feel free to reach out for questions, contributions, or to request walkthroughs!

---

**Author:** Arthur Bortolini (based on ChatGPT collaboration)
