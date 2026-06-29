window.addEventListener("DOMContentLoaded", () => {
    console.log("App starting...");

    initSafe();
});

function initSafe() {
    try {
        if (typeof initCube3D === "function") initCube3D();
        if (typeof initScramble === "function") initScramble();

        bindButtons();

        console.log("App ready.");
    } catch (e) {
        console.error("Init error:", e);
    }
}

function bindButtons() {
    const connectBtn = document.getElementById("connectBtn");
    const resetBtn = document.getElementById("resetBtn");
    const clearBtn = document.getElementById("clearBtn");

    if (connectBtn) {
        connectBtn.onclick = () => {
            if (window.connectGAN) connectGAN();
            else alert("Bluetooth not loaded");
        };
    }

    if (resetBtn) {
        resetBtn.onclick = () => {
            location.reload();
        };
    }

    if (clearBtn) {
        clearBtn.onclick = () => {
            const list = document.getElementById("sessionList");
            if (list) list.innerHTML = "";
        };
    }
}
