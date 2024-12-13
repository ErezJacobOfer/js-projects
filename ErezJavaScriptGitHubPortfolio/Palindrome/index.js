const input = document.getElementById("input")

function check(){
    const value = input.value;
    const reverse = reverseString(value)
    if (value === reverse){
        alert("Palindrome")
    }
    else {
        alert("Try Again")
    }

}

function reverseString(str){
return str.split("").reverse().join("")
}

// https://github.com/ErezJacobOfer/js-projects