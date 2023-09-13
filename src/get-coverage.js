//@ts-check

// from https://gist.github.com/paulirish/78f46a302083dd757288b5fcc660d75c
import * as chromeLauncher from "chrome-launcher";
import CDP from "chrome-remote-interface";

const chrome = await chromeLauncher.launch({
  chromeFlags: ["--disable-gpu", "--headless"],
});

const protocol = await CDP({ port: chrome.port });
try {
  const { Page, Profiler } = protocol;
  await Profiler.enable();
  await Page.enable();

  await Profiler.startPreciseCoverage();

  Page.navigate({ url: "http://localhost:8080/" });
  await Page.loadEventFired();

  const res = await Profiler.takePreciseCoverage();
  await Profiler.stopPreciseCoverage();

  // const coverage = calculateCoverage(res);
  res.result[0].functions.forEach((fct) => console.log(fct));
  /* prints:
  {
    functionName: '',
    ranges: [ { startOffset: 0, endOffset: 785, count: 1 } ],
    isBlockCoverage: false
  }
  {
    functionName: '',
    ranges: [ { startOffset: 125, endOffset: 782, count: 0 } ],
    isBlockCoverage: false
  }
  */
} finally {
  protocol.close();
  chrome.kill();
}
