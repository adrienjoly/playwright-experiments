"use strict";
const TARGET = 5; // Math.round(100 * Math.random());
document.getElementById("gameForm").addEventListener("submit", (evt) => {
  evt.preventDefault();
  const guess = document.getElementById("number").value; // TODO: case with parseInt
  document.getElementById("number").value = "";
  if (guess > TARGET) {
    document.getElementById("feedback").textContent =
      "Your guess is bigger than the target";
  } else if (guess < TARGET) {
    document.getElementById("feedback").textContent =
      "Your guess is smaller than the target";
  }
  // eslint-disable-next-line eqeqeq
  else if (guess == TARGET) {
    document.getElementById("feedback").textContent =
      "Congrats! The number was " + TARGET;
  } else {
    throw new Error(guess + "is not a number");
  }
});
