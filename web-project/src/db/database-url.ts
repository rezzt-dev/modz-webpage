export function resolveDatabaseUrl(value: string): string {
  const url = new URL(value);
  // Avoid Node's dual-stack AggregateError for the local development database.
  if (url.hostname === "localhost") url.hostname = "127.0.0.1";
  return url.toString();
}
