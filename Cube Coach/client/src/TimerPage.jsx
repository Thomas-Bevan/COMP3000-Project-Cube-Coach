import { useState, useEffect } from "react";

function TimerPage() {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [scramble, setScramble] = useState("R U R' U'");
    const [solves, setSolves] = useState([]);

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

    const handleKeyDown = (e) => {
        if (e.code === "Space") {
            e.preventDefault();

            if (running) {
                setRunning(false);

                if (time > 0) {
                    setSolves((prev) => [{ time: time, penalty: 0 }, ...prev]);
                    setTime(0);
                    setScramble(generateScramble());
                }
            } else {
                setRunning(true);
            }

        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [running, time]);

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



    useEffect(() => {
        setScramble(generateScramble());
    }, [])

    const ao5 = calculateAo5();

    return (
        <div style={styles.container}>
            <p style={styles.scramble}>{scramble}</p>
            <h1 style={styles.timer}>{formatTime(time)}</h1>
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
};

export default TimerPage;