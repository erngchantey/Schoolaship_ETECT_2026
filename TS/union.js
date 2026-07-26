"use strict";
// union Type
let id;
id = 100;
console.log(typeof (id));
console.log(id);
id = "ABC100";
console.log(typeof (id));
console.log(id);
// Union object---------------------------------------
const test = (id) => {
    console.log(id);
};
test(1288);
test("Erng Chantey");
test(true);
let test1;
test1 = "loading";
console.log(test1);
test1 = "Success";
console.log(test1);
test1 = "Error";
console.log(test1);
// type Account = string | number
const account1 = {
    name: "Erng Chantey",
    role: 'Admin'
};
const account2 = {
    name: "Erng Chantey",
    role: 'User'
};
console.log(account1);
console.log(account2);
//--------------------------------
function printValue(value) {
    if (typeof value === "string") {
        console.log(value.toUpperCase());
    }
    if (typeof value === "number") {
        console.log(value.toFixed(2));
    }
}
printValue("Erng Chantey");
printValue(1288.8888888888888);
//------------------------
let array = [10, 20, 30.40, "Apple", "Banana"];
console.log(array);
let numbers;
numbers = [20, "papaya"];
console.log(numbers);
// Example usage:
const res1 = { status: "Success", data: "All good" };
const res2 = { status: "Error", data: "Something went wrong" };
function handleResponse(respone) {
    if (respone.status === "Success") {
        console.log(respone);
    }
    if (respone.status === "Error") {
        console.log(respone);
    }
}
handleResponse(res1);
handleResponse(res2);
