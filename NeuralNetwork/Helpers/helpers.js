"use strict";

// sum the numbers of an array
const sum = (arr, transform = x => x) => arr.reduce((acc, curr) => {
  return acc + transform(curr);
}, 0);
module.exports.sum = sum;

// get average of numbers in an array
module.exports.average = (numArray) => sum(numArray)/numArray.length;