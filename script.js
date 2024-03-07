
const inputSlider = document.querySelector("[data-slider]")
const lengthDisplay = document.querySelector("[data-lenghtNum]")

const copy = document.querySelector("[data-copy]")
const copymsg = document.querySelector("[data-copymsg]")

const passwordDisplay = document.querySelector("[data-passwordDisplay]")
const upperCheck = document.querySelector("#uppercase")
const lowerCheck = document.querySelector("#lowercase")
const numberCheck = document.querySelector("#number")
const symbolCheck = document.querySelector("#symbols")

const indicator = document.querySelector("[strength-indicator]")
const allCheckBox = document.querySelectorAll("input[type=checkbox]")
const generate = document.querySelector(".generateButton")


const symbols = "~!@#$%^&*()_+{}:<>?=\][;'/.,";
let password = "";
let passwordLength = "10";
let checkCount = 0;
handleSlider();
 

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max =  inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
    indicator.style.border = "4e solid black"
}

function getRandom(min, max){
   return Math.floor(Math.random()*(max-min))+min;
}

function getNumber(){
    return getRandom(0,9);
}

function getLowerCase(){
    return String.fromCharCode(getRandom(97,123));
}

function getUpperCase(){
    return String.fromCharCode(getRandom(65,91));
}

function getSymbol(){
    let index = getRandom(0, symbols.length);
    return symbols.charAt(index);
}


// Default Value of Indicator
setIndicator("#ccc");



function checkStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasSymbol = false;
    let hasNumber = false;

    if(upperCheck.checked){  
        hasUpper = true;
    }
    if(lowerCheck.checked){
        hasLower = true;
    } 
    if(symbolCheck.checked){
        hasSymbol = true;
    } 
    if(numberCheck.checked){
         hasNumber = true;
    }

    if(hasUpper && hasLower && (hasSymbol || hasNumber) && (passwordLength >= 10))
    {
        console.log("green");
        setIndicator("#0f0");
    } 
    else if( (hasUpper || hasLower) && (hasSymbol || hasNumber) && passwordLength >= 6)
    {
        console.log("orange");
        setIndicator("#ffaa00");
    } 
    else
    {
        console.log("red");
        setIndicator("#f00");
    }
}


function shufflePassword(array){
    for(let i = array.length-1 ; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));

        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((e) => str += e);
    return str;
}

function handleCheckedBox(){
    checkCount = 0;
    allCheckBox.forEach((element) => {
        if(element.checked){
            checkCount++;
        }
    });
    // console.log("handler checkbox");

    if(passwordLength <= checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

}

async function copyText(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copymsg.innerText = "Copied";
    } catch (error) {
        copymsg.innerText = "Failed";
    }
    copymsg.classList.add("active");
     
    setTimeout(() =>{
        copymsg.classList.remove("active");
    }, 2000);
}

inputSlider.addEventListener('input', (e) =>{
    passwordLength = e.target.value;
    handleSlider();
});

copy.addEventListener('click', () =>{
    if(passwordDisplay.value){
        copyText();
    }
});


allCheckBox.forEach((e) => {
    e.addEventListener('change', handleCheckedBox);
})



generate.addEventListener('click', () =>{
    if(checkCount <= 0) return;

    if(passwordLength <= checkCount){
        passwordLength = checkCount
        handleSlider();
    }

    password = "";
    let funArr = [];

    if(upperCheck.checked){
        funArr.push(getUpperCase);
    }
    if(lowerCheck.checked){
        funArr.push(getLowerCase);
    }
    if(numberCheck.checked){
        funArr.push(getNumber);
    }
    if(symbolCheck.checked){
        funArr.push(getSymbol);
    }
// Compulsory Condition
    for(let i =0; i<funArr.length ; i++){
        password += funArr[i]();
    }

// Remaining Condition

    for(let i = 0; i< passwordLength-funArr.length ; i++){
        let randIndex = getRandom(0, funArr.length);
        password += funArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    checkStrength();
});