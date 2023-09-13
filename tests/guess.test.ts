import { test, expect } from "@playwright/test";

test("guess the number", async ({ page }) => {
  // cf https://playwright.dev/docs/api/class-cdpsession
  const client = await page.context().newCDPSession(page);
  await client.send("Debugger.enable");

  // cf https://chromedevtools.github.io/devtools-protocol/
  client.on("Debugger.scriptParsed", (opts) =>
    console.log("Debugger.scriptParsed", opts)
  );

  await page.goto("http://localhost:8080/");

  // const response = await client.send("Animation.getPlaybackRate");
  // console.log("playback rate is " + response.playbackRate);
  // await client.send("Animation.setPlaybackRate", {
  //   playbackRate: response.playbackRate / 2,
  // });

  await page.getByRole("textbox").type("50");

  await page.getByRole("button").click();
});
