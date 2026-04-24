import { useState } from "react";

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        console.log("register deets:" + email + " " + password);

    };

    return (
        <div style={styles.container}>
            <form style={styles.form} onSubmit={handleSubmit}>
                <h1>Register</h1>

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

                <input
                    style={styles.input}
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button style={styles.button} type="submit">
                    Register
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

export default RegisterPage;