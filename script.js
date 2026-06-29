
/* =========================
   GAN SMART TIMER - MAIN
   ========================= */

window.addEventListener("load", () => {
    initApp();
});

/* ===== Init ===== */

function initApp() {
    console.log("Initializing GAN Smart Timer...");

    // 1. init scramble
    initScramble();

    // 2. init 3D cube
    if (typeof initCube3D === "function") {
        initCube3D();
    }

    // 3. bind UI
    bindUI();

    // 4. generate first scramble
    generateNewScrambleUI();

    console.log("Ready.");
}

/* ===== UI Bindings ===== */

function bindUI() {
    const connectBtn = document.getElementById("connectBtn");
    const resetBtn = document.getElementById("resetBtn");
    const clearBtn = document.getElementById("clearBtn");

    // ===== Connect GAN =====
    if (connectBtn) {
        connectBtn.addEventListener("click", () => {
            if (typeof connectGAN === "function") {
                connectGAN();
            } else {
                alert("Bluetooth not supported or module missing.");
            }
        });
    }

    // ===== Reset =====
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            resetAll();
        });
    }

    // ===== Clear session =====
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            document.getElementById("sessionList").innerHTML = "";
            times = [];
            updateStatsSafe();
        });
    }
}

/* ===== Scramble ===== */

function generateNewScrambleUI() {
    if (typeof generateScramble === "function") {
        const scramble = generateScramble();
        const el = document.getElementById("scramble");

        if (el) el.textContent = scramble;

        // sync cube state
        if (window.cube) {
            cube.reset();
            cube.applyScramble(scramble);
        }

        return scramble;
    }
}

/* ===== Reset ===== */

function resetAll() {
    console.log("Resetting...");

    if (typeof timerState !== "undefined") {
        timerState = "idle";
    }

    if (typeof elapsed !== "undefined") {
        elapsed = 0;
    }

    const timerEl = document.getElementById("timer");
    if (timerEl) timerEl.textContent = "0.000";

    const inspectionEl = document.getElementById("inspection");
    if (inspectionEl) inspectionEl.textContent = "";

    generateNewScrambleUI();

    console.log("Reset done.");
}

/* ===== Stats Safe Update ===== */

function updateStatsSafe() {
    try {
        if (typeof updateStats === "function") {
            updateStats();
        }
    } catch (e) {
        console.warn("Stats update failed:", e);
    }
}

/* ===== Keyboard Fix Hook ===== */

document.addEventListener("keydown", (e) => {
    // prevent scroll
    if (e.code === "Space") {
        e.preventDefault();
    }
});