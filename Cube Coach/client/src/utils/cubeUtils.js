export const createSolvedCube = () => ({
    U: Array(9).fill("white"),
    D: Array(9).fill("yellow"),
    F: Array(9).fill("green"),
    B: Array(9).fill("blue"),
    L: Array(9).fill("orange"),
    R: Array(9).fill("red"),
});

const cloneCube = (cube) => ({
    U: [...cube.U],
    D: [...cube.D],
    F: [...cube.F],
    B: [...cube.B],
    L: [...cube.L],
    R: [...cube.R],
});

const rotateFace = (face) => {
    let buffer;

    // rotate face
    // 0 1 2
    // 3 4 5
    // 6 7 8

    // corners
    buffer = face[0]
    face[0] = face[6];
    face[6] = face[8];
    face[8] = face[2];
    face[2] = buffer;

    // edges
    buffer = face[1]
    face[1] = face[3];
    face[3] = face[7];
    face[7] = face[5];
    face[5] = buffer;

    return face;
}

const doU = (cube) => {

    let buffer;

    cube.U = rotateFace(cube.U);

    // move bars
    buffer = [cube.F[0], cube.F[1], cube.F[2]];
    [cube.F[0], cube.F[1], cube.F[2]] = [cube.R[0], cube.R[1], cube.R[2]];
    [cube.R[0], cube.R[1], cube.R[2]] = [cube.B[0], cube.B[1], cube.B[2]];
    [cube.B[0], cube.B[1], cube.B[2]] = [cube.L[0], cube.L[1], cube.L[2]];
    [cube.L[0], cube.L[1], cube.L[2]] = buffer;

    return cube;

};

const doD = (cube) => {
    let buffer;

    cube.D = rotateFace(cube.D);

    buffer = [cube.F[6], cube.F[7], cube.F[8]];
    [cube.F[6], cube.F[7], cube.F[8]] = [cube.L[6], cube.L[7], cube.L[8]];
    [cube.L[6], cube.L[7], cube.L[8]] = [cube.B[6], cube.B[7], cube.B[8]];
    [cube.B[6], cube.B[7], cube.B[8]] = [cube.R[6], cube.R[7], cube.R[8]];
    [cube.R[6], cube.R[7], cube.R[8]] = buffer;

    return cube;
};

const doR = (cube) => {
    let buffer;

    cube.R = rotateFace(cube.R);

    buffer = [cube.U[2], cube.U[5], cube.U[8]];
    [cube.U[2], cube.U[5], cube.U[8]] = [cube.F[2], cube.F[5], cube.F[8]];
    [cube.F[2], cube.F[5], cube.F[8]] = [cube.D[2], cube.D[5], cube.D[8]];
    [cube.D[2], cube.D[5], cube.D[8]] = [cube.B[6], cube.B[3], cube.B[0]];
    [cube.B[6], cube.B[3], cube.B[0]] = buffer;

    return cube;
};

const doL = (cube) => {
    let buffer;

    cube.L = rotateFace(cube.L);

    buffer = [cube.U[0], cube.U[3], cube.U[6]];
    [cube.U[0], cube.U[3], cube.U[6]] = [cube.B[8], cube.B[5], cube.B[2]];
    [cube.B[8], cube.B[5], cube.B[2]] = [cube.D[0], cube.D[3], cube.D[6]];
    [cube.D[0], cube.D[3], cube.D[6]] = [cube.F[0], cube.F[3], cube.F[6]];
    [cube.F[0], cube.F[3], cube.F[6]] = buffer;

    return cube;
};

const doF = (cube) => {
    let buffer;

    cube.F = rotateFace(cube.F);

    buffer = [cube.U[6], cube.U[7], cube.U[8]];
    [cube.U[6], cube.U[7], cube.U[8]] = [cube.L[8], cube.L[5], cube.L[2]];
    [cube.L[8], cube.L[5], cube.L[2]] = [cube.D[2], cube.D[1], cube.D[0]];
    [cube.D[2], cube.D[1], cube.D[0]] = [cube.R[0], cube.R[3], cube.R[6]];
    [cube.R[0], cube.R[3], cube.R[6]] = buffer;

    return cube;
};

const doB = (cube) => {
    let buffer;

    cube.B = rotateFace(cube.B);

    buffer = [cube.U[0], cube.U[1], cube.U[2]];
    [cube.U[0], cube.U[1], cube.U[2]] = [cube.R[2], cube.R[5], cube.R[8]];
    [cube.R[2], cube.R[5], cube.R[8]] = [cube.D[8], cube.D[7], cube.D[6]];
    [cube.D[8], cube.D[7], cube.D[6]] = [cube.L[6], cube.L[3], cube.L[0]];
    [cube.L[6], cube.L[3], cube.L[0]] = buffer;

    return cube;
};


export const applyMove = (cube, move) => {
    const face = move[0];
    const modifier = move.slice(1);

    let repeats = 1;
    if (modifier === "2") repeats = 2;
    if (modifier === "'") repeats = 3;

    for (let i = 0; i < repeats; i++) {
        if (face === "U") cube = doU(cube);
        if (face === "D") cube = doD(cube);
        if (face === "R") cube = doR(cube);
        if (face === "L") cube = doL(cube);
        if (face === "F") cube = doF(cube);
        if (face === "B") cube = doB(cube);
    }

    return cube;
};

export const applyAlgorithm = (cube, algorithm) => {
    if (!algorithm.trim()) return cube;

    const moves = algorithm.trim().split(/\s+/);

    moves.forEach((move) => {
        cube = applyMove(cube, move);
    });

    return cube;
};

export const isWhiteCrossSolved = (cube) => {
    return (
        cube.D[1] === "white" &&
        cube.D[3] === "white" &&
        cube.D[5] === "white" &&
        cube.D[7] === "white" &&

        cube.F[7] === "green" &&
        cube.R[7] === "orange" &&
        cube.B[7] === "blue" &&
        cube.L[7] === "red"
    );
};

const searchMoves = [
    "U", "U'", "U2",
    "D", "D'", "D2",
    "R", "R'", "R2",
    "L", "L'", "L2",
    "F", "F'", "F2",
    "B", "B'", "B2",
];

const dfsCross = (cube, depth, path, previousFace) => {
    if (depth === 0) {
        return isWhiteCrossSolved(cube) ? path : null;
    }

    for (const move of searchMoves) {
        const face = move[0];

        if (face === previousFace) continue;

        const nextCube = cloneCube(cube);
        applyMove(nextCube, move);

        const result = dfsCross(nextCube, depth - 1, [...path, move], face);

        if (result) return result;
    }

    return null;
};

const rotateFace180 = (face) => {
    return [
        face[8], face[7], face[6],
        face[5], face[4], face[3],
        face[2], face[1], face[0],
    ];
};

export const applyZ2 = (cube) => {
    return {
        U: rotateFace180(cube.D),
        D: rotateFace180(cube.U),
        F: rotateFace180(cube.F),
        B: rotateFace180(cube.B),
        L: rotateFace180(cube.R),
        R: rotateFace180(cube.L),
    };
};

export const findShorterCross = (scramble, userCrossSolution, maxDepth = 6) => {
    let scrambledCube = applyAlgorithm(createSolvedCube(), scramble);
    scrambledCube = applyZ2(scrambledCube);

    const userCube = cloneCube(scrambledCube);
    applyAlgorithm(userCube, userCrossSolution);
    console.log(userCube);

    const userCrossSolved = isWhiteCrossSolved(userCube);
    const userMoveCount = userCrossSolution.trim()
        ? userCrossSolution.trim().split(/\s+/).length
        : 0;

    let searchDepth = Math.min(maxDepth, userMoveCount - 1);

    if (searchDepth < 1) {
        return {
            userCrossSolved,
            userMoveCount,
            shorterSolution: null,
        };
    }

    for (let depth = 1; depth <= searchDepth; depth++) {
        const result = dfsCross(scrambledCube, depth, [], null);

        if (result) {
            return {
                userCrossSolved,
                userMoveCount,
                shorterSolution: result.join(" "),
            };
        }
    }

    return {
        userCrossSolved,
        userMoveCount,
        shorterSolution: null,
    };
};