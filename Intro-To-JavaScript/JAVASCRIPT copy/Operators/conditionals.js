// if
// if -else
// if else if
// Switch case

// if (10 < 5) {
//    console.log("True!");
//} else {
 //   console.log("False");
// }

// var age = 21;

// if (age >= 18){
// console.log("You can vote");
// } else {
// console.log("You cant vote");
// }

var age = 16;
var hasDriversLicence = false;

if(age >= 18){
    console.log("You can vote!");

    if (hasDriversLicence){
        console.log("You can also drive!");
    } else {
        console.log("You are eligible to vote but not to drive!");
    }
} else {
    console.log("You can't drive nor vote");
}
