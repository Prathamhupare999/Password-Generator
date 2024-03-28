const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generatebutton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*<>?{}[]():",'; 

let password = "";
let passwordLength = 10;
let checkCount = 0; 

handleSlider();
// set  strength circle color to grey
setColor("#ccc");


//set password
function handleSlider() {
     
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}
 
function setColor(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){

   return Math.floor(Math.random()*(max-min)) + min;

}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowercase(){
     return String.fromCharCode(getRndInteger(97,123))
}

function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbols(){
    const ranNum = getRndInteger(0,symbols.length)
    return symbols.charAt(ranNum);
}

function calstrength(){
    let hasupper = false;
    let haslower = false;
    let hasnum = false;
    let hassymbol = false;
    if(uppercaseCheck.checked) hasupper = true;
    if(lowercaseCheck.checked) haslower = true;
    if(numberCheck.checked) hasnum = true;
    if(symbolsCheck.checked) hassymbol = true;

    if(hasupper && haslower && (hasnum || hassymbol) && passwordLength >= 8){
        setColor("#0f0")
    }
    else if((haslower || hasupper) && (hasnum || hassymbol) && passwordLength>=6){
        setColor("#ff0")
    }
    else{
        setColor("#f00")
    }
}

async function copycontent(){

    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";

    }
    catch(e){
        copyMsg.innerText = "failed";

    }
    copyMsg.classList.add("active");

    setTimeout( ()=>{
        copyMsg.classList.remove("active");
    },2000);
    
}

function shufflePassword(array){
    // Finisher Yates Method
    for(let i = array.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str+=el));
    return str;

}

function handlecheckbox(){
    checkCount =0;
    allCheckBox .forEach( (checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    })
    // special case
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox .forEach((checkbox) => {
    checkbox.addEventListener('change', handlecheckbox);
});


inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copycontent();
    }

})

generateBtn.addEventListener('click',()=>{
    // none of the checkbox are selected
   
    if (checkCount <= 0) {
        return;
    }

    
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    //let's start the jorney to find new passsword

    //remove old password

    console.log("start");

    password = "";

    // let put the stuff mentioned by checkbox

    // if(uppercaseCheck.checked){
    //     password+=generateUppercase();
    // }
    // if(lowercaseCheckcaseCheck.checked){
    //     password+=generateLowercase();
    // }
    // if(uppercaseCheck.checked){
    //     password+=generateRanodomNumber();
    // }
    // if(uppercaseCheck.checked){
    //     password+=generateSymbols();
    // }

    let funarr = [];
    if (uppercaseCheck.checked) {
        funarr.push(generateUppercase);
    }

    if (lowercaseCheck.checked) {
        funarr.push(generateLowercase);
    }

    if (numberCheck.checked) {
        funarr.push(generateRandomNumber);
    }

    if (symbolsCheck.checked) {
        funarr.push(generateSymbols);
    }

    //compulsory addition

    for (let i = 0; i < funarr.length; i++) {
        password += funarr[i]();
    }
    console.log("Cstart");

    // remaining addition

    for (let i = 0; i < passwordLength - funarr.length; i++) {
        let ranInd = getRndInteger(0, funarr.length);
        password += funarr[ranInd]();
    }
    console.log("rstart");
    // shuffle the password

    password = shufflePassword(Array.from(password));
    console.log("Ustart");
    // show in UI

    passwordDisplay.value = password;

    // claculate strength
    console.log("cstart");

    calstrength();

})