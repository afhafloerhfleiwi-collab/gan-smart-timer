let ganDevice = null;
let ganServer = null;
let ganCharacteristic = null;

let isConnected = false;

/* ===== Connect ===== */

async function connectGAN() {
    try {
        console.log("Scanning GAN cube...");

        ganDevice = await navigator.bluetooth.requestDevice({
            filters: [
                { namePrefix: "GAN" },
                { services: [0xfff0] } // common BLE service for cubes
            ],
            optionalServices: [0xfff0]
        });

        ganDevice.addEventListener("gattserverdisconnected", onDisconnect);

        ganServer = await ganDevice.gatt.connect();

        const service = await ganServer.getPrimaryService(0xfff0);

        ganCharacteristic = await service.getCharacteristic(0xfff1);

        await ganCharacteristic.startNotifications();

        ganCharacteristic.addEventListener(
            "characteristicvaluechanged",
            handleData
        );

        isConnected = true;

        updateConnectUI(true);

        console.log("GAN connected!");

    } catch (err) {
        console.error("Connection failed:", err);
    }
}

/* ===== Disconnect ===== */

function onDisconnect() {
    console.log("GAN disconnected");
    isConnected = false;
    updateConnectUI(false);
}

/* ===== Data Handler ===== */

function handleData(event) {
    const value = event.target.value;

    let data = new Uint8Array(value.buffer);

    console.log("GAN data:", data);

    parseGANData(data);
}

/* ===== GAN Protocol Parser (simplified) ===== */

function parseGANData(data) {
    // ⚠️ 真实 GAN 协议是加密/压缩的，这里做简化模拟

    // 假设：
    // data[0] = move type
    // data[1] = timestamp / state

    if (!data || data.length === 0) return;

    const moveCode = data[0];

    const moveMap = {
        0: "U",
        1: "U'",
        2: "U2",
        3: "D",
        4: "D'",
        5: "D2",
        6: "L",
        7: "L'",
        8: "L2",
        9: "R",
        10: "R'",
        11: "R2",
        12: "F",
        13: "F'",
        14: "F2",
        15: "B",
        16: "B'",
        17: "B2"
    };

    const move = moveMap[moveCode];

    if (move) {
        handleMove(move);
    }
}

/* ===== Move Handler ===== */

function handleMove(move) {
    console.log("Move:", move);

    // TODO: later connect to cube3d animation
    // TODO: later TPS counting

    // Auto start timer if idle
    if (typeof timerState !== "undefined" && timerState === "idle") {
        console.log("Auto ready from GAN move");
    }
}

/* ===== UI ===== */

function updateConnectUI(state) {
    const btn = document.getElementById("connectBtn");

    if (!btn) return;

    if (state) {
        btn.textContent = "🟢 GAN Connected";
        btn.style.background = "#00c853";
    } else {
        btn.textContent = "🔵 Connect GAN";
        btn.style.background = "";
    }
}

/* ===== Expose ===== */

window.connectGAN = connectGAN;