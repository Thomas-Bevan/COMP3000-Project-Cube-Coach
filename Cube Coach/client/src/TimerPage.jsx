import { useState, useEffect } from "react";

function TimerPage() {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [scramble, setScramble] = useState("R U R' U'");
    const [solves, setSolves] = useState([]);
    const [isHolding, setIsHolding] = useState(false);
    const [isReady, setIsReady] = useState(false);
    

    useEffect(() => {
        let interval;

        if (running) {
            interval = setInterval(() => {
                setTime((prev) => prev + 10);
            }, 10);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [running]);

    useEffect(() => {
        let holdTimeout;

        const handleKeyDown = (e) => {
            if (e.code !== "Space") return;
            e.preventDefault();

            if (running) {
                setRunning(false);

                if (time > 0) {
                    setSolves((prev) => [{ time: time, penalty: 0 }, ...prev]);
                    
                    setScramble(generateScramble());
                }
                return;
            }

            if (e.repeat) return;

            setIsHolding(true);

            holdTimeout = setTimeout(() => {
                setIsReady(true);
            }, 400);
        };

        const handleKeyUp = (e) => {
            if (e.code !== "Space") return;
            e.preventDefault();

            if (isReady && !running) {
                setTime(0);
                setRunning(true);
            }

            setIsHolding(false);
            setIsReady(false);
            clearTimeout(holdTimeout);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            clearTimeout(holdTimeout);
        };
    }, [running, time, isReady]);

    

    const formatTime = (ms) => {
        const seconds = (ms / 1000).toFixed(2);
        return seconds;
    };

    const calculateAo5 = () => {
        if (solves.length < 5) return null;

        const last5 = solves.slice(0, 5);
        const dnfCount = last5.filter((s) => s.penalty === "DNF").length;

        if (dnfCount >= 2) return "DNF";
        const times = last5.map((s) =>
            s.penalty === "DNF" ? Infinity : s.time + s.penalty
        );

        const sorted = [...times].sort((a, b) => a - b);
        const middle = sorted.slice(1, 4);

        if (middle.includes(Infinity)) return "DNF";

        const avg = middle.reduce((a, b) => a + b, 0) / middle.length;
        return avg;
    };

    const addPlusTwo = (index) => {
        setSolves((prev) =>
            prev.map((solve, i) =>
                i === index
                    ? {
                        ...solve,
                        penalty: solve.penalty === 2000 ? 0 : 2000,
                    }
                    : solve
            )
        );
    };

    const setDNF = (index) => {
        setSolves((prev) =>
            prev.map((solve, i) =>
                i === index
                    ? {
                        ...solve,
                        penalty: solve.penalty === "DNF" ? 0 : "DNF",
                    }
                    : solve
            )
        );
    };

    const generateScramble = () => {
        const moves = ["R", "U", "F", "D", "B", "L"];
        const moveExtra = ["", "'", "2"];

        let scramble = [];
        const scrambleLength = 25 - (Math.floor(Math.random() * 6));
        let previousMove;
        

        for (let i = 0; i < scrambleLength; i++) {
            let moveFirst;

            do {
                moveFirst = moves[Math.floor(Math.random() * moves.length)];
            } while (moveFirst === previousMove);

            const moveSecond = moveExtra[Math.floor(Math.random() * moveExtra.length)];
            const move = moveFirst + moveSecond;

            previousMove = moveFirst;
            scramble.push(move);
        }

        return scramble.join(" ")
    }


    const createSolvedCube = () => ({
        U: Array(9).fill("white"),
        D: Array(9).fill("yellow"),
        F: Array(9).fill("green"),
        B: Array(9).fill("blue"),
        L: Array(9).fill("orange"),
        R: Array(9).fill("red"),
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


    const doScramble = (scramble) => {
        let cube = createSolvedCube();
        //scramble = "R2 F2 R2"
        const moves = scramble.split(" ");

        moves.forEach((move) => {
            let repeats;
            if (move.length === 1) { repeats = 1 }
            else if (move[1] === "'") { repeats = 3 }
            else (repeats = 2);
            for (let i = 0; i < repeats; i++) {
                if (move[0] === "U") cube = doU(cube);
                if (move[0] === "D") cube = doD(cube);
                if (move[0] === "R") cube = doR(cube);
                if (move[0] === "L") cube = doL(cube);
                if (move[0] === "F") cube = doF(cube);
                if (move[0] === "B") cube = doB(cube);
            };
        });

        return cube;
    }

    const [cubeState, setCubeState] = useState(createSolvedCube());

    useEffect(() => {
        setScramble(generateScramble());
    }, [])

    useEffect(() => {
        const newCube = doScramble(scramble);
        setCubeState(newCube);
    }, [scramble]);

    const ao5 = calculateAo5();

    return (
        <div style={styles.container}>
            <p style={styles.scramble}>{scramble}</p>
            <h1
                style={{
                    ...styles.timer,
                    color: isReady ? "#3F990B" : isHolding ? "#D43428" : "#F9FAFB",
                }}
            >
                {formatTime(time)}
            </h1>
            <p>Press SPACE to start/stop</p>
            <p style={styles.average}>
                Ao5: {ao5 === "DNF" ? "DNF" : ao5 ? formatTime(ao5) : "-"}
            </p>

            <div style={styles.solveList}>
                <h3>Solves</h3>

                {solves.map((solve, index) => (
                    <div key={index} style={styles.solveItem}>
                        <span>
                            {index + 1}.{" "}
                            {solve.penalty === "DNF"
                                ? "DNF"
                                : formatTime(solve.time + solve.penalty)}
                        </span>

                        <div>
                            <button onClick={() => addPlusTwo(index)}>+2</button>
                            <button onClick={() => setDNF(index)}>DNF</button>
                        </div>
                    </div>
                ))}
            </div>
            <div style={styles.cube}>

                <div style={{ ...styles.face, gridColumn: "2", gridRow: "1" }}>
                    {cubeState.U.map((color, i) => (
                        <div key={i} style={{ ...styles.square, backgroundColor: color }} />
                    ))}
                </div>

                <div style={{ ...styles.face, gridColumn: "1", gridRow: "2" }}>
                    {cubeState.L.map((color, i) => (
                        <div key={i} style={{ ...styles.square, backgroundColor: color }} />
                    ))}
                </div>

                <div style={{ ...styles.face, gridColumn: "2", gridRow: "2" }}>
                    {cubeState.F.map((color, i) => (
                        <div key={i} style={{ ...styles.square, backgroundColor: color }} />
                    ))}
                </div>

                <div style={{ ...styles.face, gridColumn: "3", gridRow: "2" }}>
                    {cubeState.R.map((color, i) => (
                        <div key={i} style={{ ...styles.square, backgroundColor: color }} />
                    ))}
                </div>

                <div style={{ ...styles.face, gridColumn: "4", gridRow: "2" }}>
                    {cubeState.B.map((color, i) => (
                        <div key={i} style={{ ...styles.square, backgroundColor: color }} />
                    ))}
                </div>

                <div style={{ ...styles.face, gridColumn: "2", gridRow: "3" }}>
                    {cubeState.D.map((color, i) => (
                        <div key={i} style={{ ...styles.square, backgroundColor: color }} />
                    ))}
                </div>

            </div>
        </div>



    );
};

const styles = {
    container: {
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#111827",
        color: "#F9FAFB",
    },
    timer: {
        fontSize: "5rem",
    },
    scramble: {
        position: "absolute",
        top: "40px",
        fontSize: "1.2rem",
        letterSpacing: "2px",
        color: "#F9FAFB"
    },
    solveList: {
        position: "absolute",
        right: "40px",
        top: "100px",
        textAlign: "right",
        maxHeight: "70vh",
        overflowY: "auto",
        color: "#9CA3AF"
    },
    average: {
        marginTop: "10px",
        color: "#9CA3AF"
    },
    solveItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "10px",
        marginBottom: "5px",
    },
    cube: {
        position: "absolute",
        left: "40px",
        bottom: "40px",
        display: "grid",
        gridTemplateColumns: "repeat(4, auto)",
        gridTemplateRows: "repeat(3, auto)",
        gap: "5px",
    },

    face: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 15px)",
        gap: "2px",
        marginBottom: "5px",
    },

    square: {
        width: "15px",
        height: "15px",
    },
};

export default TimerPage;