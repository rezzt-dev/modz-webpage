import { describe, expect, it } from "vitest";

import { resolveDatabaseUrl } from "./database-url";

describe("resolveDatabaseUrl", () => {
  it("uses IPv4 for a local database without altering remote hosts", () => {
    expect(
      resolveDatabaseUrl("postgresql://user:pass@localhost:5432/modz"),
    ).toBe("postgresql://user:pass@127.0.0.1:5432/modz");
    expect(
      resolveDatabaseUrl("postgresql://user:pass@db.internal:5432/modz"),
    ).toBe("postgresql://user:pass@db.internal:5432/modz");
  });
});
