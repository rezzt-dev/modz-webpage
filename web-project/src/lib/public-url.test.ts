import { describe, expect, it } from "vitest";

import { publicHttpUrl } from "./public-url";

describe("publicHttpUrl", () => {
  it("keeps public download links and rejects unsafe protocols", () => {
    expect(publicHttpUrl("https://example.com/mod.jar")).toBe(
      "https://example.com/mod.jar",
    );
    expect(publicHttpUrl("javascript:alert(1)")).toBeNull();
    expect(publicHttpUrl("data:text/html,test")).toBeNull();
    expect(publicHttpUrl("/relative/file.jar")).toBeNull();
  });
});
