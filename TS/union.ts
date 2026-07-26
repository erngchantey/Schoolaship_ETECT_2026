// union Type

let id: string | number;

id = 100;
console.log(typeof (id));
console.log(id);


id = "ABC100";
console.log(typeof (id));
console.log(id);

// Union object---------------------------------------

const test = (id: string | number | boolean): string | number | void => {
    console.log(id);
}
test(1288);
test("Erng Chantey");
test(true);

//---------------------------------------

type Status = "loading" | "Success" | "Error";

let test1: Status;
test1 = "loading";
console.log(test1);

test1 = "Success";
console.log(test1);

test1 = "Error";
console.log(test1);


//----------------------------

type Admin = {
    name: string,
    role: 'Admin'
}

type User = {
    name: string
    role: 'User'
}

type Account = {
    name: string;
    role: 'User' | 'Admin' | 'Owner';
}

// type Account = string | number

const account1: Account = {
    name: "Erng Chantey",
    role: 'Admin'
}

const account2: Account = {
    name: "Erng Chantey",
    role: 'User'
}

console.log(account1);
console.log(account2);

//--------------------------------

function printValue(value: string | number) {
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

let array: (string | number | boolean)[] = [10, 20, 30.40, "Apple", "Banana"]
console.log(array);

let numbers: (string | number)[];

numbers = [20, "papaya"];
console.log(numbers);

//--------------------------

interface SuccessResponse {
    status: "Success";
    data: string;
}

interface ErrorResponse {
    status: "Error";
    data: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

// Example usage:
const res1: ApiResponse = { status: "Success", data: "All good" };
const res2: ApiResponse = { status: "Error", data: "Something went wrong" };

function handleResponse(respone: ApiResponse) {
    if (respone.status === "Success") {
        console.log(respone);  
    }
    if (respone.status === "Error") {
        console.log(respone);
        
    }
}

handleResponse(res1);
handleResponse(res2);
















