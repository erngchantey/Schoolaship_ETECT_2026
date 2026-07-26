"use strict";
function add(num1, num2) {
    return num1 + num2;
}
let result = add(10, 20);
console.log(result);
// Optional parameter 
function test(name, age) {
    console.log(name);
    if (age) {
        console.log(age);
    }
}
test("Erng Chantey", 22);
// arrow function 
let sum = (a, b) => {
    return (a + b);
};
console.log(sum(20, 30));
