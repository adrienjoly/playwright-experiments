import { test, expect } from "@playwright/test";
import type { Protocol } from "playwright-core/types/protocol.d.ts";

type ScriptId = string;

const sourceFiles = new Map<
  ScriptId,
  Protocol.Debugger.getScriptSourceReturnValue
>();

test("guess the number", async ({ page }) => {
  // cf https://playwright.dev/docs/api/class-cdpsession
  const client = await page.context().newCDPSession(page);
  await client.send("Debugger.enable");

  // cf https://chromedevtools.github.io/devtools-protocol/
  client.on("Debugger.scriptParsed", async (opts) => {
    if (opts.scriptLanguage !== "JavaScript") return;
    if (opts.url === "") return;
    console.log(
      `${opts.url} ${opts.startLine}:${opts.startColumn} -> ${opts.endLine}:${opts.endColumn}`
    );
    const source = await client.send("Debugger.getScriptSource", {
      scriptId: opts.scriptId,
    });
    sourceFiles.set(opts.scriptId, source);
  });

  await client.send("Profiler.enable");
  await client.send("Profiler.startPreciseCoverage");
  await page.goto("http://localhost:8080/");

  await page.getByRole("textbox").type("50");

  await page.getByRole("button").click();

  const { result } = await client.send("Profiler.takePreciseCoverage");
  result.forEach(
    (c) =>
      sourceFiles.has(c.scriptId) &&
      console.log(c.functions.map((f) => f.ranges))
  );
});
