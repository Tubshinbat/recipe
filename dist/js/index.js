"use strict";

const arr = [23, 44, 12];

let myFunction = a => {
  console.log("too : ".concat(a));
};

const arr2 = [...arr, 44, 122];
myFunction(arr2[1]);