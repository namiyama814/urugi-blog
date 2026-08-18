export type ScraperErrorKind =
  | "NOT_FOUND"
  | "UPSTREAM_ERROR"
  | "NETWORK_ERROR"
  | "TIMEOUT";

export class ScraperError extends Error {
  readonly kind: ScraperErrorKind;
  readonly url: string;
  readonly status?: number;

  constructor(
    kind: ScraperErrorKind,
    url: string,
    message?: string,
    status?: number,
  ) {
    super(message ?? `${kind} while fetching ${url}`);
    this.name = "ScraperError";
    this.kind = kind;
    this.url = url;
    this.status = status;
  }
}
