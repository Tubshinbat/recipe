const arr = [23, 44, 12]

let myFunction = a => {
    console.log(`too : ${a}`);
}

const arr2 = [...arr, 44, 122];

myFunction(arr2[1]);