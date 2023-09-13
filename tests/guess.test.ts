import { test, expect } from "@playwright/test";
import type { Protocol } from "playwright-core/types/protocol.d.ts";

const sourceFiles: Record<
  string,
  Protocol.Debugger.getScriptSourceReturnValue
> = {};

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
    sourceFiles[opts.url] = source;
  });

  await page.goto("http://localhost:8080/");

  // const response = await client.send("Animation.getPlaybackRate");
  // console.log("playback rate is " + response.playbackRate);
  // await client.send("Animation.setPlaybackRate", {
  //   playbackRate: response.playbackRate / 2,
  // });

  await page.getByRole("textbox").type("50");

  await page.getByRole("button").click();
});
