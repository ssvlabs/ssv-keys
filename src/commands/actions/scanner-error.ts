export function getScannerErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const shortMessage = Reflect.get(error, "shortMessage");
    if (typeof shortMessage === "string" && shortMessage.trim().length > 0) {
      return shortMessage.trim();
    }

    const details = Reflect.get(error, "details");
    if (typeof details === "string" && details.trim().length > 0) {
      return details.trim().split("\n")[0] ?? details.trim();
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message.trim().split("\n")[0] ?? error.message.trim();
  }

  return "Unknown scanner error.";
}
