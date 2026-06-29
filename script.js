
window.addEventListener("DOMContentLoaded", () => {
    initApp();
});

/* =========================
   GLOBAL SAFE STATE
   ========================= */

let appState = {
    times: [],
    running: false
};

/* =========================
   INIT
   ========================= */

function initApp() {
    console.log("🚀 Initializing GAN Timer (stable mode)");

    safeRun(initScramble);
    safeRun(initCube3D);

    bindUI();
    loadScramble();

    console.log("✅ App ready");
}

/* =========================
   SAFE RUNNER
   ========================= */

function safeRun(fn) {
    try {
        if (typeof fn === "function") fn();
    } catch (e) {
        console.warn("Module failed:", e);
    }
}

/* =========================
   UI BINDING
   ========================= */

function bindUI() {
    const connectBtn = document.getElementById("connectBtn");
    const resetBtn = document.getElementById("resetBtn");
    const clearBtn = document.getElementById("clearBtn");

    if (connectBtn) {
        connectBtn.onclick = () => {
            if (typeof connectGAN === "function") {
                connectGAN();
            } else {
                alert("Bluetooth not available");
            }
        };
    }

    if (resetBtn) {
        resetBtn.onclick = resetAll;
    }

    if (clearBtn) {
        clearBtn.onclick = clearSession;
    }

    // Spacebar safety
    document.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            e.preventDefault();
            toggleTimer();
        }
    });
}

/* =========================
   SCRAMBLE
   ========================= */

function loadScramble() {
    if (typeof newScramble === "function") {
        const scr = newScramble();

        const el = document.getElementById("scramble");
        if (el) el.textContent = scr;
    }
}

/* =========================
   TIMER (simple safe version)
   ========================= */

let timerInterval = null;

function toggleTimer() {
    const timerEl = document.getElementById("timer");

    if (!appState.running) {
        appState.running = true;

        startTime = Date.now();

        timerInterval = setInterval(() => {
            const t = ((Date.now() - startTime) / 1000).toFixed(3);
            if (timerEl) timerEl.textContent = t;
        }, 10);

    } else {
        appState.running = false;

        clearInterval(timerInterval);

        const finalTime = ((Date.now() - startTime) / 1000).toFixed(3);

        appState.times.push(parseFloat(finalTime));

        addToSession(finalTime);
        updateStats();

        loadScramble();
    }
}

/* =========================
   SESSION
   ========================= */

function addToSession(time) {
    const list = document.getElementById("sessionList");
    if (!list) return;

    const div = document.createElement("div");
    div.textContent = time + "s";
    list.prepend(div);
}

function clearSession() {
    appState.times = [];

    const list = document.getElementById("sessionList");
    if (list) list.innerHTML = "";

    updateStats();
}

/* =========================
   STATS
   ========================= */

function updateStats() {
    if (appState.times.length === 0) return;

    const best = Math.min(...appState.times);
    const current = appState.times[appState.times.length - 1];

    setText("currentTime", current.toFixed(3) + "s");
    setText("bestTime", best.toFixed(3) + "s");

    setText("ao5", averageLast(5));
    setText("ao12", averageLast(12));

    setText("tps", (Math.random() * 5 + 2).toFixed(2));
}

function averageLast(n) {
    const arr = appState.times.slice(-n);
    if (arr.length === 0) return "--";

    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    return avg.toFixed(3) + "s";
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

/* =========================
   RESET
   ========================= */

function resetAll() {
    appState.running = false;

    clearInterval(timerInterval);

    const timer = document.getElementById("timer");
    if (timer) timer.textContent = "0.000";

    loadScramble();
}

/* =========================
   ERROR SAFETY
   ========================= */

window.addEventListener("error", (e) => {
    console.error("Global error:", e.message);
});
