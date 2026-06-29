class Cube {
    constructor() {
        this.reset();
    }

    reset() {
        // 每个面 9 个块
        this.state = {
            U: Array(9).fill("W"),
            D: Array(9).fill("Y"),
            F: Array(9).fill("G"),
            B: Array(9).fill("B"),
            L: Array(9).fill("O"),
            R: Array(9).fill("R")
        };
    }

    /* ===== Apply Move ===== */

    applyMove(move) {
        const base = move[0];
        const type = move.slice(1); // '', '2', "'"

        switch (base) {
            case "U":
                this.rotateU(type);
                break;
            case "D":
                this.rotateD(type);
                break;
            case "F":
                this.rotateF(type);
                break;
            case "B":
                this.rotateB(type);
                break;
            case "L":
                this.rotateL(type);
                break;
            case "R":
                this.rotateR(type);
                break;
        }
    }

    /* ===== Face Rotation Helper ===== */

    rotateFace(face, times = 1) {
        for (let i = 0; i < times; i++) {
            const f = this.state[face];
            this.state[face] = [
                f[6], f[3], f[0],
                f[7], f[4], f[1],
                f[8], f[5], f[2]
            ];
        }
    }

    /* ===== Moves ===== */

    rotateU(type) {
        this.rotateFace("U", type === "2" ? 2 : 1);

        const f = this.state;

        if (type === "2") {
            [f.F, f.R, f.B, f.L] = [f.B, f.L, f.F, f.R];
        } else if (type === "'") {
            [f.F, f.R, f.B, f.L] = [f.R, f.B, f.L, f.F];
        } else {
            [f.F, f.R, f.B, f.L] = [f.L, f.F, f.R, f.B];
        }
    }

    rotateD(type) {
        this.rotateFace("D", type === "2" ? 2 : 1);

        const f = this.state;

        if (type === "2") {
            [f.F, f.L, f.B, f.R] = [f.B, f.R, f.F, f.L];
        } else if (type === "'") {
            [f.F, f.L, f.B, f.R] = [f.R, f.F, f.L, f.B];
        } else {
            [f.F, f.L, f.B, f.R] = [f.L, f.B, f.R, f.F];
        }
    }

    rotateF(type) {
        this.rotateFace("F", type === "2" ? 2 : 1);

        const f = this.state;

        if (type === "2") {
            [f.U, f.R, f.D, f.L] = [f.D, f.L, f.U, f.R];
        } else if (type === "'") {
            [f.U, f.R, f.D, f.L] = [f.R, f.D, f.L, f.U];
        } else {
            [f.U, f.R, f.D, f.L] = [f.L, f.U, f.R, f.D];
        }
    }

    rotateB(type) {
        this.rotateFace("B", type === "2" ? 2 : 1);

        const f = this.state;

        if (type === "2") {
            [f.U, f.L, f.D, f.R] = [f.D, f.R, f.U, f.L];
        } else if (type === "'") {
            [f.U, f.L, f.D, f.R] = [f.L, f.D, f.R, f.U];
        } else {
            [f.U, f.L, f.D, f.R] = [f.R, f.U, f.L, f.D];
        }
    }

    rotateL(type) {
        this.rotateFace("L", type === "2" ? 2 : 1);

        const f = this.state;

        if (type === "2") {
            [f.U, f.F, f.D, f.B] = [f.D, f.B, f.U, f.F];
        } else if (type === "'") {
            [f.U, f.F, f.D, f.B] = [f.F, f.U, f.B, f.D];
        } else {
            [f.U, f.F, f.D, f.B] = [f.B, f.D, f.F, f.U];
        }
    }

    rotateR(type) {
        this.rotateFace("R", type === "2" ? 2 : 1);

        const f = this.state;

        if (type === "2") {
            [f.U, f.B, f.D, f.F] = [f.D, f.F, f.U, f.B];
        } else if (type === "'") {
            [f.U, f.B, f.D, f.F] = [f.B, f.U, f.F, f.D];
        } else {
            [f.U, f.B, f.D, f.F] = [f.F, f.D, f.B, f.U];
        }
    }

    /* ===== Scramble Apply ===== */

    applyScramble(scramble) {
        const moves = scramble.split(" ");

        for (let move of moves) {
            this.applyMove(move);
        }
    }

    /* ===== Debug ===== */

    print() {
        console.log(this.state);
    }
}

/* ===== Global instance ===== */

const cube = new Cube();

window.cube = cube;