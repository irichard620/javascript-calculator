// Start when doc ready
$(document).ready(function() {
  var firstNumber = '0';
  var secondNumber = '0';
  var operator = '';
  
  // Potential states
  // 0 - cleared out
  // 1 - number in first
  // 2 - number in first and operator
  // 3 - number in first and operator and second
  var state = 0;
  
  function decimalPointExists(val) {
    if (val.indexOf('.') == -1) {
      return false;
    } else {
      return true;
    }
  }
  
  function atDigitThreshold(val) {
    if (val.indexOf('.') != -1 && val.length == 9 || val.indexOf('.') == -1 && val.length == 8) {
      return true;
    } else {
      return false;
    }
  }
  
  function isNegative(val) {
    if (val.charAt(0) == '-') {
      return true;
    } else {
      return false;
    }
  }
  
  function doCalcAndRound(num1, op, num2) {
    var float1 = parseFloat(num1);
    var float2 = parseFloat(num2);
    var result = 0;
    if (op == "/") {
      result = float1 / float2;
    } else if (op == "x") {
      result = float1 * float2;
    } else if (op == "+") {
      result = float1 + float2;  
    } else if (op == "-") {
      result = float1 - float2;
    }
    // Turn result back into string
    var resultStr = "" + result;
    var decimalIndex = resultStr.indexOf(".");
    if (decimalIndex != -1) {
      // Result has decimal
      
      // Too long
      if (resultStr.length > 9) {
        var numWholeDigits = resultStr.length - (resultStr.length - decimalIndex);
        if (numWholeDigits <= 8) {
          var numDecDigits = 8 - numWholeDigits;
          if (numDecDigits == 0) {
            return resultStr.substr(0, decimalIndex);
          } else {
            return resultStr.substr(0, 9);
          }
        } else {
          return 'MAX DIGITS';
        }
      } else {
        return resultStr;
      }
    } else {
      // No decimal in result
      if (resultStr.length > 8) {
        return 'MAX DIGITS';
      } else {
        return resultStr;
      }
    }
  }
  
  $("button").click(function() {
    // Get value of button
    console.log("hey");
    var item = $(this).attr("value");
    
    if (!isNaN(item)) {
      // If our item is a number
      if (state == 0) {
        // If cleared out, set first number
        if (item !== "0") {
          firstNumber = item;  
          state = 1;  
        }
      } else if (state == 1) {
        if (!atDigitThreshold(firstNumber)) {
          firstNumber += item;
        } else {
          firstNumber = 'MAX DIGITS';
          state = 0;
        }
      } else if (state == 2) {
        // Theres a first number and an operand
        secondNumber = item;
        state = 3;
      } else if (state == 3) {
        if (!atDigitThreshold(secondNumber)) {
          secondNumber += item;
        } else {
          firstNumber = 'MAX DIGITS';
          state = 0;
        }
      }
    } else {
      // Our item is not a number
      if (item == "c") {
        firstNumber = '0';
        state = 0;
      } else if (item == "sign") {
        if (state == 1 || state == 2) {
          if (isNegative(firstNumber)) {
            firstNumber = firstNumber.substr(1);
          } else {
            firstNumber = "-" + firstNumber;
          }
        } else if (state == 3)  {
          if (isNegative(secondNumber)) {
            secondNumber = secondNumber.substr(1);
          } else {
            secondNumber = "-" + secondNumber;
          }
        }
      } else if (item == "%") {
        // If state 0, do nothing
        // If state 1, divide by 100
        // If state 2, divide first number by 100
        // If state 3, divide second number by 100
        if (state == 1 || state == 2) {
          firstNumber = doCalcAndRound(firstNumber, "/", "100"); 
          if (firstNumber == 'MAX DIGITS') {
            state = 0;
          }
        } else if (state == 3) {
          secondNumber = doCalcAndRound(secondNumber, "/", "100"); 
          if (secondNumber == 'MAX DIGITS') {
            state = 0;
          }
        }
      } else if (item == "/" || item == "x" || item == "+" || item == "-") {
        // If state 0, 0 will be in firstNumber, add operator
        // If state 1, store operator, increment state
        // If state 2, change operator
        if (state == 0 || state == 1 || state == 2) {
          operator = item;
          state = 2;
        } else if (state == 3) {
          // Clicked operator when we have 2 numbers and operand - must do calculation of both to get new first number
          firstNumber = doCalcAndRound(firstNumber, operator, secondNumber);
          if (firstNumber == 'MAX DIGITS') {
            state = 0;
          } else {
            operator = item;
            state = 2;  
          }
        }
      } else if (item == ".") {
        if (state == 0) {
          firstNumber = "0.";
          state = 1;
        } else if (state == 1) {
          if (!decimalPointExists(firstNumber)) {
            firstNumber += ".";
          }
        } else if (state == 2) {
          secondNumber = "0.";
          state = 3;
        } else if (state == 3) {
          if (!decimalPointExists(secondNumber)) {
            secondNumber += ".";
          }
        }
      } else if (item == "=") {
        // If stage 0, do nothing
        // If stage 1, do nothing
        // IF stage 2, do operation with 2 of firstNumber and operator
        // If stage 3, do operation with both numbers and operator
        if (state == 2) {
          firstNumber = doCalcAndRound(firstNumber, operator, firstNumber);
          if (firstNumber == 'MAX DIGITS') {
            state = 0;
          } else {
            state = 1;  
          }
        } else if (state == 3) {
          firstNumber = doCalcAndRound(firstNumber, operator, secondNumber);
          if (firstNumber == 'MAX DIGITS') {
            state = 0;
          } else {
            state = 1;  
          }
        }
      }
    }
    // Display results
    if (state == 0 || state == 1 || state == 2) {
      $("#answer-text").html(firstNumber);
    } else if (state == 3) {
      $("#answer-text").html(secondNumber);
    }
  });
});