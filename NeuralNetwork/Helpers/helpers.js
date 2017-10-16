"use strict";


// sum the numbers of an array
const sum = (numArray) => numArray.reduce((a, b) =>  a + b );
module.exports.sum = sum;

// get average of numbers in an array
module.exports.average = (numArray) => sum(numArray)/numArray.length;