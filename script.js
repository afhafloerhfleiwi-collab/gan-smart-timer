
/* =========================
   GAN SMART TIMER - MAIN
   SAFE INITIALIZATION VERSION
   ========================= */

window.addEventListener("DOMContentLoaded", () => {
    initApp();
});

/* =========================
   INIT APP
   ========================= */

function initApp() {
    console.log("🚀 App initializing...");

    try {
        // 1. Scramble
        if (typeof initScramble === "function") {
            initScramble();
        }

        // 2. 3D Cube
        if (typeof initCube3D === "function") {
            initCube3D();
        }

        // 3. Bind buttons
        bindButtons();

        // 4. Generate first scramble
        refreshScramble();

        console.log("✅ App ready");
    } catch (err) {
        console.error("Init error:", err);
    }
}

/* =========================
   BUTTONS
   ========================= */

function bindButtons() {
    const connectBtn = document.getElementById("connectBtn");
    const resetBtn = document.getElementById("resetBtn");
    const clearBtn = document.getElementById("clearBtn");

    // 🔵 Connect GAN
    if (connectBtn) {
        connectBtn.addEventListener("click", () => {
            if (typeof connectGAN === "function") {
                connectGAN();
            } else {
                alert("Bluetooth module not loaded");
            }
        });
    }

    // 🔄 Reset
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            resetApp();
        });
    }

    // 🧹 Clear session
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            clearSession();
        });
    }

    // Spacebar safety fix (prevents page scroll)
    document.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            e.preventDefault();
        }
    });
}

/* =========================
   SCRAMBLE CONTROL
   ========================= */

function refreshScramble() {
    if (typeof newScramble === "function") {
        const scr = newScramble();

        const el = document.getElementById("scramble");
        if (el) el.textContent = scr;
    }
}

/* =========================
   RESET APP
   ========================= */

function resetApp() {
    console.log("🔄 Resetting app...");

    // reset timer variables safely
    if (typeof timerState !== "undefined") {
        timerState = "idle";
    }

    const timerEl = document.getElementById("timer");
    if (timerEl) timerEl.textContent = "0.000";

    const inspectionEl = document.getElementById("inspection");
    if (inspectionEl) inspectionEl.textContent = "";

    // new scramble
    refreshScramble();

    // reset cube if exists
    if (window.cube && typeof cube.reset === "function") {
        cube.reset();
    }
}

/* =========================
   SESSION CONTROL
   ========================= */

function clearSession() {
    const list = document.getElementById("sessionList");
    if (list) list.innerHTML = "";

    // reset stats if global exists
    if (typeof times !== "undefined") {
        times.length = 0;
    }

    console.log("🧹 Session cleared");
}

/* =========================
   SAFETY FALLBACKS
   ========================= */

window.addEventListener("error", (e) => {
    console.error("Global error caught:", e.message);
});
