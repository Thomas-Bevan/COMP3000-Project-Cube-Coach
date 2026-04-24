import { useState } from "react";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("login is:" + email + " " + password);

    };

    return (
        <div style={styles.container}>
            <form style={styles.form} onSubmit={handleSubmit}>
                <h1>Login</h1>

                <input
                    style={styles.input}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    style={styles.input}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button style={styles.button} type="submit">
                    Login
                </button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        width: "100vw",
        background: "#101624",
        color: "#F9FAFB",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    form: {
        width: "320px",
        padding: "30px",
        background: "#1F2A38",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    input: {
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        fontSize: "1rem",
    },
    button: {
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        background: "#3880F5",
        color: "white",
        fontSize: "1rem",
        cursor: "pointer",
    },
};

export default LoginPage;
