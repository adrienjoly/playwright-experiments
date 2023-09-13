// Usage: $ npx jazzer src/fuzz-target.cjs

/**
 * Goal:
 * Given a webpage with a form made of a single field,
 * The goal of the experiment is to find which value can make it crash
 */

const TARGET = 5; // Math.round(100 * Math.random());
const aFunctionThatMayThrow = (evt) => {
  const document = {
    getElementById() {
      let value = undefined;
      try {
        value = JSON.parse(evt).value;
      } catch (err) {
        console.error(err);
      }
      return { value };
    },
  };

  // evt.preventDefault();
  const guess = document.getElementById("number").value; // TODO: case with parseInt
  document.getElementById("number").value = "";
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
    throw new Error(`Congrats! The number was ${TARGET}`);
  }
  // else {
  //   throw new Error(`${guess}is not a number`);
  // }
};

// aFunctionThatMayThrow('{"value":5}');

// from https://github.com/CodeIntelligenceTesting/jazzer.js#quickstart
module.exports.fuzz = function (data /*: Buffer */) {
  const fuzzerData = data.toString();
  aFunctionThatMayThrow(fuzzerData); // => writes the VALUE_THAT_THROWS to a crash file
};

// Note: ES modules seem to not be supported => jzz loops indefinitely
// cf https://github.com/CodeIntelligenceTesting/jazzer.js/issues/516#issuecomment-1645026135
