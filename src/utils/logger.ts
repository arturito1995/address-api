export class Logger {
  public info(message: string, data?: unknown) {
    console.log(`[INFO] ${message}`, data ?? "");
  }

  public warn(message: string, data?: unknown) {
    console.warn(`[WARN] ${message}`, data ?? "");
  }

  public error(message: string, data?: unknown) {
    console.error(`[ERROR] ${message}`, data ?? "");
  }
}
