type RateLimitHeaders = {
  unit: string;
  remaining: string;
  reset?: string;
  used: string;
};

const RATE_LIMIT_HEADERS: Record<string, RateLimitHeaders> = {
  sandboxes: {
    unit: "sandboxes",
    remaining: "x-csb-sandbox-hourly-remaining",
    reset: "x-csb-sandbox-hourly-reset",
    used: "x-csb-sandbox-hourly-used",
  },
  requests: {
    unit: "requests",
    remaining: "x-csb-rate-hourly-remaining",
    reset: "x-csb-rate-hourly-reset",
    used: "x-csb-rate-hourly-used",
  },
  vms: {
    unit: "concurrently running vms",
    remaining: "x-csb-vms-remaining",
    used: "x-csb-vms-used",
  },
};

export class RateLimitError extends Error {
  public type = "rate-limit";

  static fromResponse(
    response: Response,
    errorPrefix: string,
    serverError: string
  ) {
    const headers = response.headers;

    const rateLimitRemainingExceeded = Object.values(RATE_LIMIT_HEADERS).find(
      (headers) => {
        const remaining = response.headers.get(headers.remaining);

        return remaining && parseInt(remaining) <= 0;
      }
    );

    if (rateLimitRemainingExceeded) {
      const total =
        parseInt(
          response.headers.get(rateLimitRemainingExceeded.remaining) ?? "0"
        ) +
        parseInt(response.headers.get(rateLimitRemainingExceeded.used) ?? "0");

      let message = `${errorPrefix}: 0 of ${total} ${rateLimitRemainingExceeded.unit} remaining.`;

      if (rateLimitRemainingExceeded.reset) {
        message += ` Limit resets at ${headers.get(
          rateLimitRemainingExceeded.reset
        )}.`;
      }

      message += " Contact hello@codesandbox.io to raise your rate limit.";

      return new RateLimitError(message);
    }

    return new RateLimitError(`${errorPrefix}: ${serverError}`);
  }
}
