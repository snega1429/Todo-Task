//Create a typed function that adds two numbers
function add(a: number, b: number) : number {
    return a+b;
}
let result = add(10, 5);
console.log(result);


//Define an interface for User and create an object. 
interface User {
    name : String;
    age : Number;
    isAdmin : Boolean;
}
let user1: User = {
    name : "Sandhya",
    age : 10,
    isAdmin : false
};
console.log(user1);


// Create a TypeScript enum and use it
enum Grade {
    A = "Excellent",
    B = "Good",
    C = "Average",
    D = "poor"
};
function CheckGrade(grade:Grade) {
    console.log("student performance is:", grade);
}
let studentGrade : Grade = Grade.A;
CheckGrade(studentGrade);


//Write a function using optional parameters
function greet(name : string, age? : number) {
    if(age! == undefined) {
        console.log(`Hello $ {name}, you are $ {age} years old.`);
    }else{
        console.log(`Hello $ {name}`);
    }
}
greet("Sandhya");
greet("Sandhya", 10);


//Create a generic function in TypeScript
function getFirstElement<T>(arr: T[]): T {
    return arr[0];
}

let firstNum = getFirstElement([10, 20, 30]);
let firstStr = getFirstElement(["A", "B", "C"]);

console.log(firstNum);
console.log(firstStr);