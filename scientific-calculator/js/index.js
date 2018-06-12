var radian = true;
var inverse = false;
var neededPar = false;
var neededZero = false;
var decimalAllowed;
var lastExpression = "";
var value;
var valueFound;
var ans = 0;
var display = [];
var solve = [];
var timeoutId = 0;

// recursive joining of multidimentional array
function joinMulti(arr) {
  for (var i=0; i<arr.length; i++) {
    if (arr[i].constructor == Array) {
      joinMulti(arr[i]);
      arr[i] = arr[i].join("");
    }
  }
}

// push to end of array if array is the last item
function pushToArr(arr, item) {
  if (arr.length==0){
    arr.push(item);
  }
  else if (arr[arr.length-1].constructor===Array && arr[arr.length-1][arr[arr.length-1].length-1]!==")") {
    pushToArr(arr[arr.length-1], item);
  }
  else {
    arr.push(item);
  }
}

// check what most recent value is
function lastValue(arr) {
  valueFound = false;
  
  if (arr.length==0) {
    return "error";
  }
  else if (arr[arr.length-1].constructor===Array) {
    lastValue(arr[arr.length-1]);
  }
  else {
    value = arr[arr.length-1];
    valueFound = true;
  }
  if (valueFound) return value;
}

// delete most recent value
function deleteLastValue(arr) {
  valueFound = false;
  
  if (arr.length==0) {
    return;
  }
  else if (arr[arr.length-1].constructor===Array) {
    deleteLastValue(arr[arr.length-1]);
    if (arr[arr.length-1].length==0) {
      arr.pop();
    }
  }
  else {
    arr.pop();
    valueFound = true;
  }
  if (valueFound) return;
}

//modifys the solve array to create a base for the exponent function
function createBase(arr, strOne, strTwo) {
  valueFound = false;
  
  if (arr.length==0) {
    return;
  }
  else if (arr[arr.length-1].constructor===Array) {
    createBase(arr[arr.length-1], strOne, strTwo);
  }
  else if (arr[arr.length-1]==")") {
    let x = [];
    for (var i=arr.length-1; i>=0; i--) {
      x.unshift(arr[i]);
      arr.pop();
    }
    if (!radian) {
      evalDeg(x);
    }
    joinMulti(x);
    if (strOne=="factorial(") {
      arr.push(strOne + x.join("") + strTwo);
    }
    else {
      arr.push([strOne + x.join("") + strTwo]);
    }
    valueFound = true;
  }
  else {
    let x = [];
    for (var i=arr.length-1; i>=0; i--) {
      if (!isNaN(arr[i]) || arr[i]=="Math.E" || arr[i]=="Math.PI" || arr[i]=="ans" || arr[i]=="." || arr[i].charAt(0)=="f") {
        x.unshift(arr[i]);
        arr.pop();
      }
      else {
        break;
      }
    }
    if (!radian) {
      evalDeg(x);
    }
    joinMulti(x);
    if (strOne=="factorial(") {
      arr.push(strOne + x.join("") + strTwo);
    }
    else {
      arr.push([strOne + x.join("") + strTwo]);
    }
    valueFound = true;
  }
  if (valueFound) return;
}

// used with createBase to manage the display after creating exponent base
function manageDisplay(str) {
  let x = [];
  if (display.length-1==")") {
    for (var i=display.length-1; i>=0; i--) {
      if (display[i].indexOf("(")>=0) {
        x.unshift(display[i]);
        display.pop();
        break;
      }
      else {
        x.unshift(display[i]);
        display.pop();
      }
    }
  }
  else {
    for (var i=display.length-1; i>=0; i--) {
      if (!isNaN(display[i]) || display[i]=="e" || display[i].charAt(display[i].length-1)=="!" || display[i]=="π" || display[i]=="ans" || display[i]==".") {
        x.unshift(display[i]);
        display.pop();
      }
      else {
        break;
      }
    }
  }
  display.push(x.join("") + str);
}


// factorial of a number with str input
function factorial(str) {
  let int = eval(str);
  let x = int;
  for (var i=1; i<x; i++) {
    int *= i;
  }
  return int.toString();
}

// include zero in empty parenthesis
function includeZero(arr) {
  if (arr[arr.length-1].constructor===Array) {
    includeZero(arr[arr.length-1]);
  }
  else if (!functionAddable()) {
    arr.push("0");
    display.push("0");
    document.getElementById("textBox").innerHTML = display.join("");
    neededZero = true;
  }
}

// if criteria is met, allow calculator function
function functionAddable() {
  if (!isNaN(lastValue(solve)) 
      || lastValue(solve)==")"
      || lastValue(solve)=="Math.E"
      || lastValue(solve)=="Math.PI"
      || lastValue(solve)=="ans"
      || lastValue(solve).charAt(0)=="f"
     ) {
    return true;
  }
  else {
    return false;
  }
}

// check if array can add a right parenthesis
function rightParAddable(arr) {
  if (arr[arr.length-1]!==")" 
      && isNaN(arr[0]) 
      && arr[0]!=="ans"
      && arr[0].charAt(0)!=="f"
      && arr[0]!=="Math.E"
      && arr[0]!=="Math.PI"
      && arr[0].constructor!==Array 
      && arr[0]!=="." 
      && (!isNaN(arr[arr.length-1])
          || arr[arr.length-1]=="Math.E"
          || arr[arr.length-1]=="Math.PI"
          || arr[arr.length-1]=="ans"
          || arr[arr.length-1][arr[arr.length-1].length-1]==")")
     ) {
    return true;
  }
  else {
    return false;
  }
}

// close all parenthesis
function closeAllPar(arr) {
  for (var i=arr.length-1; i>=0; i--) {
    if (arr[i].constructor===Array) {
      closeAllPar(arr[i]);
    }
    else if (rightParAddable(arr)) {
      arr.push(")");
      display.push(")");
      document.getElementById("textBox").innerHTML = display.join("");
      neededPar = true;
    }
  }
}

// adds one right parenthesis
function addRightPar(arr) {
  valueFound = false;
  
  for (var i=arr.length-1; i>=0; i--) {
    if (arr[i].constructor===Array) {
      addRightPar(arr[i]);
    }
    else if (rightParAddable(arr)) {
      arr.push(")");
      display.push(")");
      document.getElementById("textBox").innerHTML = display.join("");
      valueFound = true;
    }
    if (valueFound) return;
  }
}

// searches array to see if "decimalAllowed"
function canPlaceDecimal(arr) {
  if (arr.length==0) {
    decimalAllowed = true;
  }
  else if (arr[arr.length-1].constructor===Array) {
    canPlaceDecimal(arr[arr.length-1]);
  }
  else {
    decimalAllowed = true;
    for (var i=arr.length-1; i>=0; i--) {
      if (arr[i]==".") {
        decimalAllowed = false;
        break;
      }
      else if (arr[i]=="+" || arr[i]=="-" || arr[i]=="/" || arr[i]=="*") {
        decimalAllowed = true;
        break;
      }
    }
  }
}

// evaluates every sin, cos, and tan functions in an array in degrees
function evalDeg(arr) {
  for (var i=arr.length-1; i>=0; i--) {
    if (arr[i].constructor===Array) {
      evalDeg(arr[i]);
      if (arr[i][0]=="Math.sin(" || arr[i][0]=="Math.asin(" || arr[i][0]=="Math.cos(" || arr[i][0]=="Math.acos(" || arr[i][0]=="Math.tan(" || arr[i][0]=="Math.atan(") {
        z = arr[i][0];
        x = [];
        for (var j=1; j<arr[i].length-1; j++) {
          x.push(arr[i][j]);
        }
        joinMulti(x);
        y = eval(x.join("")) * (Math.PI/180);
        arr[i] = [z, y.toString(), ")"].join("");
      }
    }
  }
}

// equal button
$("#equal").click(function() {
  let x;
  // do last operation if nothing was entered
  if (solve.length==0 && lastExpression!=="") {
    ans = eval("ans" + lastExpression);
    display = [];
    solve = [];
    document.getElementById("textBox").innerHTML = ans;
    if (isNaN(ans)) {
      ans = "0";
    }
    document.getElementById("answer").innerHTML = "Ans = " + ans;
    return;
  }
  
  includeZero(solve);
  closeAllPar(solve);
  
  // display added elements
  if (neededPar || neededZero) {
    neededPar = false;
    neededZero = false;
  }
  // display solution
  else {
    if (!radian) {
      evalDeg(solve);
    }
    joinMulti(solve);
    x = solve.join("");
    if (x.slice(0, 3)=="ans") {
      lastExpression = x.slice(3, x.length);
    }
    else {
      lastExpression = "";
    }
    ans = eval(x);
    display = [];
    solve = [];
    if (isNaN(ans)) {
      ans = "0";
      document.getElementById("textBox").innerHTML = "Undefined";
    }
    else {
      document.getElementById("textBox").innerHTML = ans;
    }
    document.getElementById("answer").innerHTML = "Ans = " + ans;
  }
});

// clear button on click
$("#clear").click(function() {
  deleteLastValue(solve);
  display.pop();
  let x = display.join("");
  if (x==[]) document.getElementById("textBox").innerHTML = "0";
  else document.getElementById("textBox").innerHTML = x;
});

// when clear is held down, all clear
$('#clear').on('mousedown', function() {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(function() {
    display = [];
    solve = [];
    document.getElementById("textBox").innerHTML = "0";
  }, 1000);
}).on('mouseup mouseleave', function() {
  clearTimeout(timeoutId);
});

// number buttons
$(".number").click(function() {
  let x = $("#" + this.id).text();
  if (lastValue(solve)==")" || lastValue(solve).charAt(0)=="f" || lastValue(solve)=="Math.E" || lastValue(solve)=="Math.PI" || lastValue(solve)=="ans") {
    pushToArr(solve, "*");
    pushToArr(solve, x);
    display.push("*");
    display.push(x);
    }
  else {
    pushToArr(solve, x);
    display.push(x);
  }
  document.getElementById("textBox").innerHTML = display.join("");
});

// operator buttons
$(".operator").click(function() {
  if (lastValue(solve)==".") return;
  let operator;
  if ($("#" + this.id).text()=="x") {
    operator = "*";
  }
  else if ($("#" + this.id).text()=="÷") {
    operator = "/";
  }
  else {
    operator = $("#" + this.id).text();
  }
  
  if (solve.length==0) {
    solve.push("ans");
    solve.push(operator);
    display.push("ans");
    display.push(operator);
    document.getElementById("textBox").innerHTML = display.join("");
  }
  else if (operator=="-" && (functionAddable() || isNaN(lastValue(solve)))) {
    pushToArr(solve, operator);
    display.push(operator);
    document.getElementById("textBox").innerHTML = display.join("");
  }
  else if (functionAddable()) {
    pushToArr(solve, operator);
    display.push(operator);
    document.getElementById("textBox").innerHTML = display.join("");
  }
});

// decimal button
$("#decimal").click(function() {
  canPlaceDecimal(solve);
  if (decimalAllowed && lastValue(solve)!=="Math.E" && lastValue(solve)!=="Math.PI" && lastValue(solve)!==")" && lastValue(solve).charAt(0)!=="f") {
    pushToArr(solve, ".");
    display.push(".");
    document.getElementById("textBox").innerHTML = display.join("");
  }
  decimalAllowed = false;
});

// left parenthesis button
$("#leftPar").click(function() {
  if (lastValue(solve)==".") return;
  let arr = ["("];
  if (functionAddable()) {
    pushToArr(solve, "*");
    pushToArr(solve, arr);
    display.push("*");
    display.push("(");
  }
  else {
    pushToArr(solve, arr);
    display.push("(");
  }
  document.getElementById("textBox").innerHTML = display.join("");
});

// right parenthesis button
$("#rightPar").click(function() {
  addRightPar(solve);
});

// radian-degree button
$("#rad").click(function() {
  if (radian) {
    $("#rad").text("Active: Deg");
    radian = false;
  }
  else {
    $("#rad").text("Active: Rad");
    radian = true;
  }
});

// inverse button
$("#inv").click(function() {
  if (inverse) {
    $("#sin").text("sin");
    $("#cos").text("cos");
    $("#tan").text("tan");
    $("#ln").text("ln");
    $("#log").text("log");
    $("#sqRt").text("√");
    $("#exponent").text("xʸ");
    $("#e").text("e");
    $("#factorial").text("x!");
    inverse =  false;
  }
  else {
    $("#sin").text("sin⁻¹");
    $("#cos").text("cos⁻¹");
    $("#tan").text("tan⁻¹");
    $("#ln").text("eˣ");
    $("#log").text("10ˣ");
    $("#sqRt").text("x²");
    $("#exponent").text("ʸ√x");
    $("#e").text("ans");
    $("#factorial").text("π");
    inverse = true;
  }
});

// sine and inverse sine button
$("#sin").click(function() {
  if (lastValue(solve)==".") return;
  let x = [];
  // inverse sine
  if (inverse) {
    x = ["Math.asin("];
    if (functionAddable()) {
      pushToArr(solve, "*");
      pushToArr(solve, x);
      display.push("*");
      display.push("sin⁻¹(");
    }
    else {
      pushToArr(solve, x);
      display.push("sin⁻¹(");
    }
  }
  // sine
  else {
    x = ["Math.sin("];
    if (functionAddable()) {
      pushToArr(solve, "*");
      pushToArr(solve, x);
      display.push("*");
      display.push("sin(");
    }
    else {
      pushToArr(solve, x);
      display.push("sin(");
    }
  }
  document.getElementById("textBox").innerHTML = display.join("");
});

// cosine and inverse cosine button
$("#cos").click(function() {
  if (lastValue(solve)==".") return;
  // inverse cosine
  if (inverse) {
    x = ["Math.acos("];
    if (functionAddable()) {
      pushToArr(solve, "*");
      pushToArr(solve, x);
      display.push("*");
      display.push("cos⁻¹(");
    }
    else {
      pushToArr(solve, x);
      display.push("cos⁻¹(");
    }
  }
  // cosine
  else {
    x = ["Math.cos("];
    if (functionAddable()) {
      pushToArr(solve, "*");
      pushToArr(solve, x);
      display.push("*");
      display.push("cos(");
    }
    else {
      pushToArr(solve, x);
      display.push("cos(");
    }
  }
  document.getElementById("textBox").innerHTML = display.join("");
});

// tangent and inverse tangent button
$("#tan").click(function() {
  if (lastValue(solve)==".") return;
  // inverse tangent
  if (inverse) {
    x = ["Math.atan("];
    if (functionAddable()) {
      pushToArr(solve, "*");
      pushToArr(solve, x);
      display.push("*");
      display.push("tan⁻¹(");
    }
    else {
      pushToArr(solve, x);
      display.push("tan⁻¹(");
    }
  }
  // tangent
  else {
    x = ["Math.tan("];
    if (functionAddable()) {
      pushToArr(solve, "*");
      pushToArr(solve, x);
      display.push("*");
      display.push("tan(");
    }
    else {
      pushToArr(solve, x);
      display.push("tan(");
    }
  }
  document.getElementById("textBox").innerHTML = display.join("");
});

// natural log and eˣ buttons
$("#ln").click(function() {
  if (lastValue(solve)==".") return;
  let x = [];
  // eˣ
  if (inverse) {
    x = ["Math.exp("];
    if (functionAddable()) {
      pushToArr(solve, "*");
      pushToArr(solve, x);
      display.push("*");
      display.push("e^(");
    }
    else {
      pushToArr(solve, x);
      display.push("e^(");
    }
  }
  // natural log
  else {
    x = ["Math.log("];
    if (functionAddable()) {
      pushToArr(solve, "*");
      pushToArr(solve, x);
      display.push("*");
      display.push("ln(");
    }
    else {
      pushToArr(solve, x);
      display.push("ln(");
    }
  }
  document.getElementById("textBox").innerHTML = display.join("");
});

// log and 10ˣ buttons
$("#log").click(function() {
  if (lastValue(solve)==".") return;
  let x = [];
  // 10ˣ
  if (inverse) {
    x = ["Math.pow(10,"];
    if (functionAddable()) {
      pushToArr(solve, "*");
      pushToArr(solve, x);
      display.push("*");
      display.push("10^(");
    }
    else {
      pushToArr(solve, x);
      display.push("10^(");
    }
  }
  // log
  else {
    x = ["Math.log10("];
    if (functionAddable()) {
      pushToArr(solve, "*");
      pushToArr(solve, x);
      display.push("*");
      display.push("log(");
    }
    else {
      pushToArr(solve, x);
      display.push("log(");
    }
  }
  document.getElementById("textBox").innerHTML = display.join("");
});

// square root and squared button
$("#sqRt").click(function() {
  if (lastValue(solve)==".") return;
  let x = [];
  // squared
  if (inverse) {
    if (functionAddable()) {
      createBase(solve, "Math.pow(", ",");
      pushToArr(solve, "2");
      pushToArr(solve, ")");
      manageDisplay("^(");
      display.push("2");
      display.push(")");
    }
    else if (solve.length==0) {
      pushToArr(solve, "ans");
      display.push("ans");
      createBase(solve, "Math.pow(", ",");
      pushToArr(solve, "2");
      pushToArr(solve, ")");
      manageDisplay("^(");
      display.push("2");
      display.push(")");
    }
  }
  // square root
  else {
    x = ["Math.sqrt("];
    if (functionAddable()) {
      pushToArr(solve, "*");
      pushToArr(solve, x);
      display.push("*");
      display.push("√(");
    }
    else {
      pushToArr(solve, x);
      display.push("√(");
    }
  }
  document.getElementById("textBox").innerHTML = display.join("");
});

// exponent and root button
$("#exponent").click(function() {
  if (lastValue(solve)==".") return;
  // root
  if (inverse) {
    if (functionAddable()) {
      createBase(solve, "Math.pow(", ",1/");
      manageDisplay("^(1/");
    }
    else if (solve.length==0) {
      pushToArr(solve, "ans");
      display.push("ans");
      createBase(solve, "Math.pow(", ",1/");
      manageDisplay("^(1/");
    }
  }
  // exponent
  else {
    if (functionAddable()) {
      createBase(solve, "Math.pow(", ",");
      manageDisplay("^(");
    }
    else if (solve.length==0) {
      pushToArr(solve, "ans");
      display.push("ans");
      createBase(solve, "Math.pow(", ",");
      manageDisplay("^(");
    }
  }
  document.getElementById("textBox").innerHTML = display.join("");
});

// factorial and pi button
$("#factorial").click(function() {
  if (lastValue(solve)==".") return;
  let x;
  // pi button
  if (inverse) {
    x = "Math.PI";
    if (functionAddable()) {
      pushToArr(solve, "*");
      pushToArr(solve, x);
      display.push("*");
      display.push("π");
    }
    else {
      pushToArr(solve, x);
      display.push("π");
    }
  }
  // factorial button
  else {
    if (functionAddable()) {
      createBase(solve, "factorial(", ")");
      manageDisplay("!");
    }
    else if (solve.length==0) {
      pushToArr(solve, "ans");
      display.push("ans");
      createBase(solve, "factorial(", ")");
      manageDisplay("!");
    }
    
  }
  document.getElementById("textBox").innerHTML = display.join("");
});

// e and ans button
$("#e").click(function() {
  if (lastValue(solve)==".") return;
  let x;
  // ans button
  if (inverse) {
    x = "ans";
    if (functionAddable()) {
      pushToArr(solve, "*");
      pushToArr(solve, x);
      display.push("*");
      display.push("ans");
    }
    else {
      pushToArr(solve, x);
      display.push("ans");
    }
  }
  //e button
  else {
    x = "Math.E";
    if (functionAddable()) {
      pushToArr(solve, "*");
      pushToArr(solve, x);
      display.push("*");
      display.push("e");
    }
    else {
      pushToArr(solve, x);
      display.push("e");
    }
  }
  document.getElementById("textBox").innerHTML = display.join("");
});