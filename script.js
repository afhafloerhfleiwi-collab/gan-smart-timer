
(() => {

    /* =========================
       SAFE GLOBAL STATE (NO CONFLICTS)
       ========================= */

    const App = {
        times: [],
        running: false,
        startTime: 0,
        timerInterval: null
    };

    /* =========================
       INIT
       ========================= */

    window.addEventListener("DOMContentLoaded", () => {
        console.log("🚀 App starting (crash-proof mode)");

        safeCall(initScramble);
        safeCall(initCube3D);

        bindUI();
        loadScramble();

        console.log("✅ App ready");
    });

    /* =========================
       SAFE CALL WRAPPER
       ========================= */

    function safeCall(fn) {
        try {
            if (typeof fn === "function") fn();
        } catch (e) {
            console.warn("Module skipped:", e.message);
        }
    }

    /* =========================
       UI
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
            resetBtn.onclick = resetApp;
        }

        if (clearBtn) {
            clearBtn.onclick = clearSession;
        }

        // Spacebar timer
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
        try {
            if (typeof newScramble === "function") {
                const scr = newScramble();
                const el = document.getElementById("scramble");
                if (el) el.textContent = scr;
            } else {
                const el = document.getElementById("scramble");
                if (el) el.textContent = "Scramble not loaded";
            }
        } catch (e) {
            console.warn("Scramble error:", e.message);
        }
    }

    /* =========================
       TIMER
       ========================= */

    function toggleTimer() {
        const timerEl = document.getElementById("timer");

        if (!App.running) {

            App.running = true;
            App.startTime = Date.now();

            App.timerInterval = setInterval(() => {
                const t = ((Date.now() - App.startTime) / 1000).toFixed(3);
                if (timerEl) timerEl.textContent = t;
            }, 10);

        } else {

            App.running = false;
            clearInterval(App.timerInterval);

            const final = ((Date.now() - App.startTime) / 1000).toFixed(3);

            App.times.push(parseFloat(final));

            addSession(final);
            updateStats();
            loadScramble();
        }
    }

    /* =========================
       SESSION
       ========================= */

    function addSession(time) {
        const list = document.getElementById("sessionList");
        if (!list) return;

        const div = document.createElement("div");
        div.textContent = time + "s";
        list.prepend(div);
    }

    function clearSession() {
        App.times = [];

        const list = document.getElementById("sessionList");
        if (list) list.innerHTML = "";

        updateStats();
    }

    /* =========================
       STATS
       ========================= */

    function updateStats() {
        if (App.times.length === 0) return;

        const best = Math.min(...App.times);
        const current = App.times[App.times.length - 1];

        set("currentTime", current.toFixed(3) + "s");
        set("bestTime", best.toFixed(3) + "s");

        set("ao5", avg(5));
        set("ao12", avg(12));
    }

    function avg(n) {
        const arr = App.times.slice(-n);
        if (!arr.length) return "--";

        const a = arr.reduce((x, y) => x + y, 0) / arr.length;
        return a.toFixed(3) + "s";
    }

    function set(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    /* =========================
       RESET
       ========================= */

    function resetApp() {
        App.running = false;
        clearInterval(App.timerInterval);

        const timer = document.getElementById("timer");
        if (timer) timer.textContent = "0.000";

        loadScramble();
    }

    /* =========================
       GLOBAL ERROR SAFETY
       ========================= */

    window.addEventListener("error", (e) => {
        console.error("App error:", e.message);
    });

})();
