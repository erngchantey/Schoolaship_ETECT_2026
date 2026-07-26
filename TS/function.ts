function add(num1: number , num2: number) {
    return num1 + num2;
}

let result = add(10,20);
console.log(result);

// Optional parameter 

function  test(name: string , age: number): void{
    console.log(name);
    if(age){
        console.log(age);     
    }
    
}
test("Erng Chantey",22);

// arrow function 

let sum = (a: number, b: number): any => {
    return (a+b);
    
}
console.log(sum(20,30));




