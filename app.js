let history = [];
let isResultDisplayed = false; // Flag para saber si se mostró un resultado

function appendToDisplay(value) {
    let display = document.getElementById("display");
    
    if (isResultDisplayed) {
        // Si ya se mostró un resultado, se deshabilita la modificación
        display.value = value;
        isResultDisplayed = false;
    } else {
        let lastChar = display.value.charAt(display.value.length - 1);
        
        // Validación para no permitir dos signos consecutivos
        if (isOperator(value) && isOperator(lastChar)) {
            return; // No hace nada si se intenta agregar otro signo
        }
        
        // Validación para no permitir que el primer carácter sea un operador
        if (display.value === "" && isOperator(value)) {
            return; // No hace nada si el primer valor es un signo
        }

        // Validación para no permitir más de dos decimales en un solo número
        if (value === ".") {
            // Si el último número ingresado ya tiene un punto decimal, no agregar otro
            let lastNumber = getLastNumber(display.value);
            if (lastNumber && countDecimals(lastNumber) >= 2) {
                return; // No agrega más de dos decimales en un número
            }
        }

        display.value += value;
    }
}

function clearAll() {
    document.getElementById("display").value = "";
    document.getElementById("history").innerHTML = "";
    history = [];
    isResultDisplayed = false; // Reset flag
}

function clearLastDigit() {
    let display = document.getElementById("display");
    display.value = display.value.slice(0, -1);
}

function clearLastOperation() {
    document.getElementById("display").value = "";
}

function calculateResult() {
    let display = document.getElementById("display");
    let expression = display.value;
    
    try {
        // Evaluar la expresión de forma segura
        if (isOperator(expression.charAt(expression.length - 1))) {
            throw "Error: Operador final no permitido"; // No permitir operadores al final
        }

        let result = eval(expression);
        result = Math.round(result * 100) / 100; // Redondear a 2 decimales
        history.push(`${expression} = ${result}`);
        updateHistory();
        display.value = result;
        isResultDisplayed = true; // Después de calcular, no se puede cambiar el valor
    } catch (error) {
        display.value = error;
        isResultDisplayed = false;
    }
}

function calculatePercentage() {
    let display = document.getElementById("display");
    let value = parseFloat(display.value);
    if (!isNaN(value)) {
        display.value = value / 100;
        isResultDisplayed = true;
    } else {
        display.value = "Error";
        isResultDisplayed = false;
    }
}

function updateHistory() {
    let historyDiv = document.getElementById("history");
    historyDiv.innerHTML = history.slice(-5).join("<br>"); // Muestra solo las últimas 5 operaciones
}

// Verifica si un carácter es un operador
function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
}

// Cuenta los decimales en un número dado
function countDecimals(value) {
    let decimalPointIndex = value.indexOf(".");
    if (decimalPointIndex === -1) {
        return 0; // No tiene decimales
    }
    return value.length - decimalPointIndex - 1; // Contar decimales después del punto
}

// Extrae el último número de la expresión (después de un operador)
function getLastNumber(value) {
    let numbers = value.split(/[\+\-\*\/]/); // Divide la cadena por operadores
    return numbers[numbers.length - 1]; // Devuelve el último número
}