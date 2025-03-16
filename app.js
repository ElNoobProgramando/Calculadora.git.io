let history = [];
let isResultDisplayed = false; // Flag para saber si se mostró un resultado
let memory = 0; // Variable para almacenar el valor en memoria
let lastOperation = null; // Variable para almacenar la última operación

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

        // Validación para no permitir más de un punto decimal por número
        if (value === ".") {
            let lastNumber = getLastNumber(display.value);
            if (lastNumber && lastNumber.includes(".")) {
                return; // No permite más de un punto decimal por número
            }
        }

        // Validación para no permitir más de un símbolo de % por número
        if (value === "%") {
            let lastNumber = getLastNumber(display.value);
            if (lastNumber && lastNumber.includes("%")) {
                return; // No permite más de un % por número
            }
        }

        display.value += value;

        // Si se agrega un %, calcular el porcentaje automáticamente
        if (value === "%") {
            calculatePercentage();
        }
    }
}

function clearAll() {
    document.getElementById("display").value = "";
    document.getElementById("history").innerHTML = "";
    history = [];
    isResultDisplayed = false; // Reset flag
    memory = 0; // Limpiar la memoria
    lastOperation = null; // Limpiar la última operación
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

// Extrae el último número de la expresión (después de un operador)
function getLastNumber(value) {
    let numbers = value.split(/[\+\-\*\/]/); // Divide la cadena por operadores
    return numbers[numbers.length - 1]; // Devuelve el último número
}

// Funciones para M+, -M, MR y MC
function memoryAdd() {
    let display = document.getElementById("display");
    let value = parseFloat(display.value);
    if (!isNaN(value)) {
        if (lastOperation === null) {
            // Si es la primera operación, guarda el valor en memoria
            memory = value;
        } else {
            // Si no es la primera operación, suma el valor actual a la memoria
            memory += value;
        }
        lastOperation = "M+"; // Indica que se realizó una operación de suma en memoria
        display.value = ""; // Limpia el display para el siguiente número
    } else {
        display.value = "Error: Valor no válido";
    }
}

function memorySubtract() {
    let display = document.getElementById("display");
    let value = parseFloat(display.value);
    if (!isNaN(value)) {
        if (lastOperation === null) {
            // Si es la primera operación, guarda el valor en memoria
            memory = -value; // Resta el valor actual
        } else {
            // Si no es la primera operación, resta el valor actual de la memoria
            memory -= value;
        }
        lastOperation = "-M"; // Indica que se realizó una operación de resta en memoria
        display.value = ""; // Limpia el display para el siguiente número
    } else {
        display.value = "Error: Valor no válido";
    }
}

function memoryRecall() {
    let display = document.getElementById("display");
    if (lastOperation === "M+" || lastOperation === "-M") {
        // Si se presionó M+ o -M previamente, muestra el resultado acumulado
        display.value = memory;
        isResultDisplayed = true; // Indica que se mostró un resultado
    } else {
        display.value = "Error: No hay memoria acumulada";
    }
}

function memoryClear() {
    memory = 0; // Limpia la memoria
    lastOperation = null; // Reinicia la última operación
    document.getElementById("display").value = ""; // Limpia el display
}