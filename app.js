let history = [];

function appendToDisplay(value) {
    document.getElementById("display").value += value;
}

function clearAll() {
    document.getElementById("display").value = "";
    document.getElementById("history").innerHTML = "";
    history = [];
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
        let result = eval(expression);
        result = Math.round(result * 100) / 100; // Redondea a 2 decimales
        history.push(`${expression} = ${result}`);
        updateHistory();
        display.value = result;
    } catch {
        display.value = "Error";
    }
}

function updateHistory() {
    let historyDiv = document.getElementById("history");
    historyDiv.innerHTML = history.slice(-5).join("<br>"); // Muestra solo las últimas 5 operaciones
}
