import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { Application, RequestHandler } from "express";

export class SwaggerManager {
  private readonly path: string;
  private readonly document: object;
  private readonly serve: RequestHandler[];
  private readonly setup: RequestHandler;

  constructor() {
    const specFilePath = path.join(__dirname, "../../docs/swagger.yaml");

    this.document = YAML.load(specFilePath);

    this.path = "/docs";

    this.serve = swaggerUi.serve;
    this.setup = swaggerUi.setup(this.document);
  }

  public setupDocs(app: Application): void {
    app.use(this.path, ...this.serve, this.setup);
  }
}
