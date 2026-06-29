const MOVES = ["U", "D", "L", "R", "F", "B"];
const MODIFIERS = ["", "'", "2"];

// axis grouping to avoid invalid sequences
const AXIS = {
    U: "UD",
    D: "UD",
    L: "LR",
    R: "LR",
    F: "FB",
    B: "FB"
};

/* =========================
   WCA SCRAMBLE GENERATOR
   ========================= */

function generateScramble(length = 20) {
    let scramble = [];
    let lastAxis = null;
    let lastMove = null;

    while (scramble.length < length) {
        const move = MOVES[Math.floor(Math.random() * MOVES.length)];
        const modifier = MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)];

        const axis = AXIS[move];
        const fullMove = move + modifier;

        // ❌ prevent same axis twice in a row
        if (axis === lastAxis) continue;

        // ❌ prevent repeating same face (R R)
        if (move === lastMove) continue;

        scramble.push(fullMove);

        lastAxis = axis;
        lastMove = move;
    }

    return scramble.join(" ");
}

/* =========================
   OPTIONAL: 2x2 / variation
   ========================= */

function generateScramble2x2(length = 9) {
    const moves = ["U", "R", "F"];
    let scramble = [];
    let lastMove = null;

    while (scramble.length < length) {
        const move = moves[Math.floor(Math.random() * moves.length)];
        const mod = MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)];

        if (move === lastMove) continue;

        scramble.push(move + mod);
        lastMove = move;
    }

    return scramble.join(" ");
}

/* =========================
   INIT SCRAMBLE DISPLAY
   ========================= */

function initScramble() {
    const el = document.getElementById("scramble");
    if (!el) return;

    const scr = generateScramble(20);
    el.textContent = scr;

    return scr;
}

/* =========================
   UPDATE SCRAMBLE (called after solve)
   ========================= */

function newScramble() {
    const scr = generateScramble(20);

    const el = document.getElementById("scramble");
    if (el) el.textContent = scr;

    return scr;
}

/* =========================
   EXPORTS (GLOBAL)
   ========================= */

window.generateScramble = generateScramble;
window.generateScramble2x2 = generateScramble2x2;
window.initScramble = initScramble;
window.newScramble = newScramble;
