import { test, expect } from "@playwright/test";
import type { Protocol } from "playwright-core/types/protocol.d.ts";

type ScriptId = string;

type SourceCode = string;

const sourceFiles = new Map<ScriptId, SourceCode>();

for (let number = 0; number <= 10; ++number) {
  test(`try number ${number}`, async ({ page }) => {
    // cf https://playwright.dev/docs/api/class-cdpsession
    const client = await page.context().newCDPSession(page);
    await client.send("Debugger.enable");

    // cf https://chromedevtools.github.io/devtools-protocol/
    client.on("Debugger.scriptParsed", async (opts) => {
      if (opts.scriptLanguage !== "JavaScript") return;
      if (opts.url === "") return; // TODO: reconnaitre aussi les scripts inline au html

      console.log(
        `${opts.url} ${opts.startLine}:${opts.startColumn} -> ${opts.endLine}:${opts.endColumn}`
      );
      const source = await client.send("Debugger.getScriptSource", {
        scriptId: opts.scriptId,
      });
      sourceFiles.set(opts.scriptId, source.scriptSource);
    });

    await page.goto("http://localhost:8080/");

    await client.send("Profiler.enable");
    await client.send("Profiler.startPreciseCoverage", {
      callCount: true,
      detailed: true,
    });

    await page.getByRole("textbox").type(number.toString());
    await page.getByRole("button").click();

    const { result } = await client.send("Profiler.takePreciseCoverage");
    result.forEach((scriptCoverage) => {
      const code = sourceFiles.get(scriptCoverage.scriptId);
      if (code) {
        const ranges = scriptCoverage.functions[0].ranges.map(
          (range) =>
            `(${range.count}) ${getCode(code, range)
              .replace(/\n/g, " ")
              .substring(0, 80)}`
        );

        console.log({ number, ranges });
      }
    });
  });

  function getCode(code: SourceCode, { startOffset, endOffset }) {
    return code.substring(startOffset, endOffset);
  }
}
