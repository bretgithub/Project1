

arr = [2, 1, 2, 1, 3, 3, 5, 7, 5, 8, 8]


function arrCheck(arr) {

    for (i = 0; i < arr.length; i++);

    var currentNum = arr[i]
    arr[i] = null
    if (!arr.includes(currentNum)) {
        return currentNum;
    }

    arr[i] = currentNum;

};

console.log(arrCheck([2, 1, 2, 1, 3, 3, 5, 7, 5, 8, 8]));

// start with each number and check it against the remaining numbers in the Array, if there is a match then move on. if there isn't a match, return that value

