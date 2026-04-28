import { useState } from "react";
import TimerPage from "./TimerPage";
import AnalysisPage from "./AnalysisPage";
import AlgorithmsPage from "./AlgorithmsPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

function App() {
    const [page, setPage] = useState("timer");

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");
        setPage("login");
    };

    return (
        <div style={styles.app}>
            <div style={styles.header}>
                <p style={styles.logo}>Cube Coach</p>

                <div style={styles.nav}>
                    <button
                        style={{
                            ...styles.navButton,
                            ...(page === "timer" ? styles.activeButton : {}),
                        }}
                        onClick={() => setPage("timer")}
                    >
                        ◷
                    </button>

                    <button
                        style={{
                            ...styles.navButton,
                            ...(page === "analysis" ? styles.activeButton : {}),
                        }}
                        onClick={() => setPage("analysis")}
                    >
                        ⌕
                    </button>

                    <button
                        style={{
                            ...styles.navButton,
                            ...(page === "algorithms" ? styles.activeButton : {}),
                        }}
                        onClick={() => setPage("algorithms")}
                    >
                        📖
                    </button>

                    <div style={styles.accountButtons}>
                        {user ? (
                            <>
                                <span style={styles.userEmail}>{user.email}</span>

                                <button style={styles.accountButton} onClick={handleLogout}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button style={styles.accountButton} onClick={() => setPage("login")}>
                                    Login
                                </button>

                                <button style={styles.accountButton} onClick={() => setPage("register")}>
                                    Register
                                </button>
                            </>
                        )}

                    </div>
                </div>

            </div>

            {page === "timer" && <TimerPage />}
            {page === "analysis" && <AnalysisPage />}
            {page === "algorithms" && <AlgorithmsPage />}
            {page === "login" && <LoginPage setPage={setPage} />}
            {page === "register" && <RegisterPage setPage={setPage} />}
        </div>
    );
}

const styles = {
    app: {
        minHeight: "100vh",
        width: "100vw",
        background: "#101624",
    },

    header: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "70px",
        background: "#101624",
        borderBottom: "1px solid #1F2A38",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
    },

    logo: {
        position: "absolute",
        left: "16px",
        color: "#F9FAFB",
        fontSize: "0.9rem",
    },

    nav: {
        display: "flex",
        gap: "16px",
        alignItems: "center",
    },

    navButton: {
        width: "56px",
        height: "56px",
        borderRadius: "14px",
        border: "none",
        background: "#1F2A38",
        color: "#D1D5DB",
        fontSize: "1.8rem",
        cursor: "pointer",
        position: "relative",
    },

    activeButton: {
        background: "#2563EB",
        color: "#FFFFFF",
        boxShadow: "0 0 12px rgba(37, 99, 235, 0.6)",
        borderBottom: "4px solid #60A5FA",
    },

    settingsButton: {
        position: "absolute",
        right: "16px",
        background: "none",
        border: "none",
        color: "#D1D5DB",
        fontSize: "1.5rem",
        cursor: "pointer",
    },
    accountButtons: {
        position: "absolute",
        right: "16px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },

    accountButton: {
        padding: "8px 12px",
        borderRadius: "8px",
        border: "none",
        background: "#1F2A38",
        color: "#F9FAFB",
        cursor: "pointer",
    },
    userEmail: {
        color: "#9CA3AF",
        fontSize: "0.85rem",
        marginRight: "6px",
    },
};

export default App;