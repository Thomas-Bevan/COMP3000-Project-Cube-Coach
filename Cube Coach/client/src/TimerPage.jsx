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
                    setSolves((prev) => [time, ...prev]);
                    setTime(0);
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
        const sorted = [...last5].sort((a, b) => a - b);
        const middle = sorted.slice(1, 4);
        const average = middle.reduce((a, b) => a + b, 0) / middle.length;
        return average;
    };

   // useEffect(() => {
   //     setScramble(generateScramble());
   // }, [])

    return (
        <div style={styles.container}>
            <p style={styles.scramble}>{scramble}</p>
            <h1 style={styles.timer}>{formatTime(time)}</h1>
            <p>Press SPACE to start/stop</p>
            <p style={styles.average}>
                Ao5: {calculateAo5() ? formatTime(calculateAo5()) : " - " }
            </p>

            <div style={styles.solveList}>
                <h3>Solves</h3>
                {solves.map((solve, index) => (
                    <p key={index}>
                        {index + 1}. {formatTime(solve)}
                    </p>
                ))}
            </div>
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
    }
};

export default TimerPage;