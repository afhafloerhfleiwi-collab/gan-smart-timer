let moveBuffer = [];
let lastMoveTime = 0;

/* ===== Main Entry ===== */

function processGANMove(rawMove) {
    const now = Date.now();

    const move = normalizeMove(rawMove);

    if (!move) return;

    // timestamp delta
    const delta = now - lastMoveTime;

    lastMoveTime = now;

    moveBuffer.push({
        move,
        time: now,
        delta
    });

    // keep buffer small
    if (moveBuffer.length > 200) {
        moveBuffer.shift();
    }

    handleMoveEvent(move, delta);
}

/* ===== Normalize Moves ===== */

function normalizeMove(move) {
    // ensure valid format
    const valid = [
        "U","U'","U2",
        "D","D'","D2",
        "L","L'","L2",
        "R","R'","R2",
        "F","F'","F2",
        "B","B'","B2"
    ];

    if (!valid.includes(move)) return null;

    return move;
}

/* ===== Move Optimization ===== */

function simplifyMoves(buffer) {
    // merges canceling moves (R R' = nothing)

    let stack = [];

    for (let i = 0; i < buffer.length; i++) {
        let move = buffer[i].move;

        let last = stack[stack.length - 1];

        if (!last) {
            stack.push(move);
            continue;
        }

        if (isCancel(last, move)) {
            stack.pop();
        } else {
            stack.push(move);
        }
    }

    return stack;
}

function isCancel(a, b) {
    const cancelPairs = {
        "U": "U'",
        "U'": "U",
        "D": "D'",
        "D'": "D",
        "L": "L'",
        "L'": "L",
        "R": "R'",
        "R'": "R",
        "F": "F'",
        "F'": "F",
        "B": "B'",
        "B'": "B"
    };

    return cancelPairs[a] === b;
}

/* ===== TPS Calculation ===== */

function calculateRealTPS() {
    if (moveBuffer.length < 2) return 0;

    let totalTime = (moveBuffer[moveBuffer.length - 1].time - moveBuffer[0].time) / 1000;

    if (totalTime <= 0) return 0;

    let moves = simplifyMoves(moveBuffer).length;

    return (moves / totalTime).toFixed(2);
}

/* ===== Export ===== */

function getMoveBuffer() {
    return moveBuffer;
}

function resetMoveBuffer() {
    moveBuffer = [];
    lastMoveTime = 0;
}

/* expose */
window.processGANMove = processGANMove;
window.calculateRealTPS = calculateRealTPS;
window.getMoveBuffer = getMoveBuffer;
window.resetMoveBuffer = resetMoveBuffer;