// Usage: $ npx jazzer src/fuzz-target.cjs

const VALUE_THAT_THROWS = "aRandomValue";

function aFunctionThatMayThrow(aRandomParam) {
  if (aRandomParam === VALUE_THAT_THROWS) {
    throw new Error("boom!");
  }
}

// from https://github.com/CodeIntelligenceTesting/jazzer.js#quickstart
module.exports.fuzz = function (data /*: Buffer */) {
  const fuzzerData = data.toString();
  aFunctionThatMayThrow(fuzzerData); // => writes the VALUE_THAT_THROWS to a crash file
};

// Note: ES modules seem to not be supported => jzz loops indefinitely
// cf https://github.com/CodeIntelligenceTesting/jazzer.js/issues/516#issuecomment-1645026135
