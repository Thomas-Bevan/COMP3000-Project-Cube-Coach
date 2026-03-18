import { useState, useEffect } from "react";

function TimerPage() {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [scramble, setScramble] = useState("R U R' U'");

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
            setRunning((prev) => !prev);
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const formatTime = (ms) => {
        const seconds = (ms / 1000).toFixed(2);
        return seconds;
    };

   // useEffect(() => {
   //     setScramble(generateScramble());
   // }, [])

    return (
        <div style={styles.container}>
            <p style={styles.scramble}>{scramble}</p>
            <h1 style={styles.timer}>{formatTime(time)}</h1>
            <p>Press SPACE to start/stop</p>
        </div>
    );
}

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
        color: "F9FAFB"
    },
};

export default TimerPage;