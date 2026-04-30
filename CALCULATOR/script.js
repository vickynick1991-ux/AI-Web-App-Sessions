let display = document.getElementById("display");
let voiceStatus = document.getElementById("voiceStatus");

let firstNumber = null;
let operator = null;
let waitingForSecond = false;

/* Calculator logic */
function inputNumber(num) {
    if (waitingForSecond) {
        display.value = num;
        waitingForSecond = false;
    } else {
        display.value = display.value === "0" ? num : display.value + num;
    }
}

function inputDecimal() {
    if (!display.value.includes(".")) {
        display.value += ".";
    }
}

function inputOperator(op) {
    if (operator !== null) calculate();
    firstNumber = parseFloat(display.value);
    operator = op;
    waitingForSecond = true;
}

function calculate() {
    if (operator === null || waitingForSecond) return;

    let secondNumber = parseFloat(display.value);
    let result;

    switch (operator) {
        case "+": result = firstNumber + secondNumber; break;
        case "-": result = firstNumber - secondNumber; break;
        case "*": result = firstNumber * secondNumber; break;
        case "/": result = secondNumber === 0 ? "Error" : firstNumber / secondNumber;
    }

    display.value = result;
    firstNumber = result;
    operator = null;
}

function clearAll() {
    display.value = "0";
    firstNumber = null;
    operator = null;
    waitingForSecond = false;
}

function deleteOne() {
    display.value = display.value.length > 1
        ? display.value.slice(0, -1)
        : "0";
}

/* 🎤 VOICE WITH INDICATOR */
function startVoice() {
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Voice not supported");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    voiceStatus.style.display = "flex"; // 🔴 SHOW RED ICON

    recognition.onresult = function (event) {
        let text = event.results[0][0].transcript.toLowerCase();

        text = text
            .replace(/plus/g, "+")
            .replace(/minus/g, "-")
            .replace(/multiply|into/g, "*")
            .replace(/divide|divided by/g, "/")
            .replace(/ /g, "");

        try {
            display.value = eval(text);
        } catch {
            display.value = "Error";
        }
    };

    recognition.onend = function () {
        voiceStatus.style.display = "none"; // ⚪ HIDE ICON
    };

    recognition.start();
}