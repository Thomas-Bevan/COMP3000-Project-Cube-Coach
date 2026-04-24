import { useState } from "react";
import TimerPage from "./TimerPage";
import AnalysisPage from "./AnalysisPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

function App() {
    const [page, setPage] = useState("timer");

    return (
        <div style={styles.app}>
            <nav style={styles.nav}>
                <button style={styles.button} onClick={() => setPage("timer")}>
                    Timer
                </button>

                <button style={styles.button} onClick={() => setPage("analysis")}>
                    Analysis
                </button>

                <button style={styles.button} onClick={() => setPage("login")}>
                    Login
                </button>

                <button style={styles.button} onClick={() => setPage("register")}>
                    Register
                </button>
            </nav>

            {page === "timer" && <TimerPage />}
            {page === "analysis" && <AnalysisPage />}
            {page === "login" && <LoginPage />}
            {page === "register" && <RegisterPage />}
        </div>
    );
}

const styles = {
    app: {
        height: "100vh",
        width: "100vw",
        background: "#101624",
    },
    nav: {
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "10px",
        zIndex: 10,
    },
    button: {
        padding: "10px 16px",
        borderRadius: "8px",
        border: "none",
        background: "#3880F5",
        color: "#F9FAFB",
        cursor: "pointer",
    },
};

export default App;