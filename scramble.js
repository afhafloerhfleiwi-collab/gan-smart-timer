let timerState = "idle"; 
// idle | inspecting | running

let startTime = 0;
let elapsed = 0;
let timerInterval = null;

let inspectionTime = 15;
let inspectionInterval = null;

let times = [];
let currentScramble = "";

const timerDisplay = () => document.getElementById("timer");
const inspectionDisplay = () => document.getElementById("inspection");
const scrambleDisplay = () => document.getElementById("scramble");

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault();

        if (timerState === "idle") {
            startInspection();
        } else if (timerState === "running") {
            stopTimer();
        }
    }
});

/* ===== Inspection ===== */

function startInspection() {
    timerState = "inspecting";
    inspectionTime = 15;

    inspectionDisplay().textContent = inspectionTime;

    inspectionInterval = setInterval(() => {
        inspectionTime--;

        inspectionDisplay().textContent = inspectionTime;

        if (inspectionTime <= 0) {
            clearInterval(inspectionInterval);
            startTimer();
        }

    }, 1000);
}

/* ===== Timer ===== */

function startTimer() {
    timerState = "running";

    inspectionDisplay().textContent = "";

    startTime = Date.now() - elapsed;

    timerInterval = setInterval(() => {
        elapsed = Date.now() - startTime;
        updateDisplay(elapsed);
    }, 10);
}

function stopTimer() {
    clearInterval(timerInterval);

    timerState = "idle";

    const finalTime = elapsed;

    times.push(finalTime);

    addToSession(finalTime);

    updateStats();

    generateNewScramble();

    elapsed = 0;

    updateDisplay(0);
}

/* ===== Display ===== */

function updateDisplay(ms) {
    let seconds = (ms / 1000).toFixed(3);
    timerDisplay().textContent = seconds;
}

/* ===== Session ===== */

function addToSession(time) {
    const div = document.createElement("div");
    div.textContent = formatTime(time);
    document.getElementById("sessionList").prepend(div);
}

/* ===== Stats ===== */

function updateStats() {
    document.getElementById("currentTime").textContent =
        formatTime(times[times.length - 1]);

    document.getElementById("bestTime").textContent =
        formatTime(Math.min(...times));

    document.getElementById("ao5").textContent =
        formatTime(averageOf(times.slice(-5)));

    document.getElementById("ao12").textContent =
        formatTime(averageOf(times.slice(-12)));

    document.getElementById("tps").textContent =
        calculateTPS();
}

/* ===== Helpers ===== */

function formatTime(ms) {
    return (ms / 1000).toFixed(3) + "s";
}

function averageOf(arr) {
    if (arr.length === 0) return "--";

    let sum = arr.reduce((a, b) => a + b, 0);
    return sum / arr.length;
}

function calculateTPS() {
    if (times.length === 0) return "--";
    return (Math.random() * 5 + 2).toFixed(2); // placeholder
}

/* ===== Scramble Hook ===== */

function generateNewScramble() {
    if (typeof generateScramble === "function") {
        currentScramble = generateScramble();
        scrambleDisplay().textContent = currentScramble;
    }
}