// Usage: $ npx jazzer src/fuzz-target.cjs

const TARGET = 5; // Math.round(100 * Math.random());
const aFunctionThatMayThrow = (guess) => {
  if (guess > TARGET) {
    document.getElementById("feedback").textContent =
      "Your guess is bigger than the target";
  } else if (guess < TARGET) {
    document.getElementById("feedback").textContent =
      "Your guess is smaller than the target";
  }
  // rome-ignore lint/suspicious/noDoubleEquals: <explanation>
  else if (guess == TARGET) {
    document.getElementById(
      "feedback"
    ).textContent = `Congrats! The number was ${TARGET}`;
  } else {
    throw new Error(`${guess}is not a number`);
  }
};

// from https://github.com/CodeIntelligenceTesting/jazzer.js#quickstart
module.exports.fuzz = function (data /*: Buffer */) {
  const fuzzerData = data.toString();
  aFunctionThatMayThrow(fuzzerData); // => writes the VALUE_THAT_THROWS to a crash file
};

// Note: ES modules seem to not be supported => jzz loops indefinitely
// cf https://github.com/CodeIntelligenceTesting/jazzer.js/issues/516#issuecomment-1645026135
