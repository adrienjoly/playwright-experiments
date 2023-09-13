# playwright experiments

## 1. find execution paths (code coverage) for each value submitted through a form

See [tests/guess.test.ts](tests/guess.test.ts).

Run:

```sh
$ npm test
```

For each case, it prints blocks of code, with the number of times each block was run. (either 1 or 0)

How it's done: using [Chrome DevTools Protocol - Profiler domain](https://chromedevtools.github.io/devtools-protocol/tot/Profiler/) provided by Playwright.

Learnings: given these traces, we could:

- colorize parts of `index.js` that were run or not run for each case;
- determine the range of cases necessary to cover all the code.

## 2. fuzzing: find values that cause a function to throw/crash

See [src/fuzz-target.cjs](src/fuzz-target.cjs).

Run:

```sh
$ npx jazzer src/fuzz-target.cjs
```

How it's done: using [Jazzer](https://github.com/CodeIntelligenceTesting/jazzer.js), on a stripped-down version of our dummy web page's index.js file, because Jazzer was not designed to run from a browser/DOM.

Learnings:

- [Jazzer](https://github.com/CodeIntelligenceTesting/jazzer.js) only works on CommonJS modules
- stringified JSON buffers seems much harder for Jazzer to find
- they provide an [integration for Jest](https://github.com/CodeIntelligenceTesting/jazzer.js#using-test-framework-integration), which looks like a more approachable way to understand how to use Jazzer programmatically
- given [its architecture](https://github.com/CodeIntelligenceTesting/jazzer.js/blob/main/docs/architecture.md) and the fact that it uses Babel to instrument the code, running Jazzer from a browser may take weeks to achieve => it's probably faster to find an alternative

Additional resources:

- https://www.fuzzingbook.org/
- alternatives to consider: [Coverage-based fuzzing of JavaScript applications - Stack Overflow](https://stackoverflow.com/questions/63560866/coverage-based-fuzzing-of-javascript-applications) + [fuzzer - npm](https://www.npmjs.com/package/fuzzer) + [freingruber/JavaScript-Raider: JavaScript Fuzzing framework for v8](https://github.com/freingruber/JavaScript-Raider)
