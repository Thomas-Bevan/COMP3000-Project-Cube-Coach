import { useState } from "react";
import TimerPage from "./TimerPage";
import AnalysisPage from "./AnalysisPage";

function App() {
    const [page, setPage] = useState("timer");

    return (
        <div style={styles.app}>

            <div style={styles.nav}>
                <button onClick={() => setPage("timer")}>Timer</button>
                <button onClick={() => setPage("analysis")}>Analysis</button>
            </div>

     
            {page === "timer" && <TimerPage />}
            {page === "analysis" && <AnalysisPage />}

        </div>
    );
}

const styles = {
    app: {
        height: "100vh",
        width: "100vw",
        background: "#111827",
    },
    nav: {
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "10px",
    },
};

export default App;