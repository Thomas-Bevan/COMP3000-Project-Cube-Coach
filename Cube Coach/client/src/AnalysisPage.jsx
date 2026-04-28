import { useState } from "react";
import { findShorterCross } from "./utils/cubeUtils";
import { createSolvedCube, applyAlgorithm, applyZ2, findShorterF2L } from "./utils/cubeUtils";

function AnalysisPage() {
    const [scramble, setScramble] = useState("");
    const [crossSolution, setCrossSolution] = useState("");
    const [f2lPairs, setF2lPairs] = useState([
        { solution: "", slot: "FR" },
        { solution: "", slot: "FL" },
        { solution: "", slot: "BR" },
        { solution: "", slot: "BL" }
    ]);
    const [f2lSolution, setF2lSolution] = useState("");
    const [feedback, setFeedback] = useState("");
    const [ollSolution, setOllSolution] = useState("");
    const [pllSolution, setPllSolution] = useState("");
    const [cubeState, setCubeState] = useState(createSolvedCube());

    const countMoves = (moves) => {
        if (!moves.trim()) return 0;
        return moves.trim().split(/\s+/).length;
    };

    const updateCubePreview = () => {
        let cube = createSolvedCube();

        cube = applyAlgorithm(cube, scramble);
        cube = applyZ2(cube);
        cube = applyAlgorithm(cube, crossSolution);

        setCubeState(cube);
    };

    

    const handleAnalyse = () => {
        updateCubePreview();
        const crossMoveCount = countMoves(crossSolution);
        const crossResult = findShorterCross(scramble, crossSolution, 6);
        let crossFeedback = "";

        if (!crossResult.userCrossSolved) {
            crossFeedback = "Cross: Your entered cross solution does not solve the white cross";
        } else if (crossResult.shorterSolution) {
            crossFeedback =
                `Cross: You used ${crossResult.userMoveCount} moves.\n` +
                `A shorter cross was found: ${crossResult.shorterSolution}`;
        } else {
            crossFeedback =
                `Cross: You used ${crossResult.userMoveCount} moves.\n` +
                `No shorter cross was found up to depth 6.`;
        }

        const f2lResults = f2lPairs.map((pair, index) => {
            const previousSolutions = f2lPairs.slice(0, index);

            return findShorterF2L(
                scramble,
                crossSolution,
                previousSolutions,
                pair.slot,
                pair.solution,
                8
            );
        });

        const f2lFeedback = f2lResults
            .map((result, index) => {
                if (!result.userF2LSolved) {
                    return `F2L ${index + 1}: This solution does not solve the selected slot.`;
                }

                if (result.shorterSolution) {
                    return `F2L ${index + 1}: You used ${result.userMoveCount} moves. Shorter solution found: ${result.shorterSolution}`;
                }

                return `F2L ${index + 1}: You used ${result.userMoveCount} moves. No shorter solution found.`;
            })
            .join("\n");

        const ollMoveCount = countMoves(ollSolution);
        const pllMoveCount = countMoves(pllSolution);

        setFeedback("Cross used " + crossMoveCount + "moves + " + crossFeedback + "\n" + f2lFeedback + "\n" + "OLL uses " + ollMoveCount + " moves\n" + "PLL uses " + pllMoveCount + " moves");

    };

    const updateF2LPair = (index, field, value) => {
        setF2lPairs((prev) =>
            prev.map((pair, i) =>
                i === index ? { ...pair, [field]: value } : pair
            )
        );
    };

    const getMovesBeforeCursor = (text, cursorPosition) => {
        const beforeCursor = text.slice(0, cursorPosition).trim();

        if (!beforeCursor) return "";

        return beforeCursor.split(/\s+/).join(" ");
    };

    const previewAtCursor = (step, text, cursorPosition, f2lIndex = null) => {
        const partialMoves = getMovesBeforeCursor(text, cursorPosition);

        let cube = createSolvedCube();

        if (step === "scramble") {
            cube = applyAlgorithm(cube, partialMoves);
            setCubeState(cube);
            return;
        }

        cube = applyAlgorithm(cube, scramble);
        cube = applyZ2(cube);

        if (step === "cross") {
            cube = applyAlgorithm(cube, partialMoves);
        }

        if (step === "f2l") {
            cube = applyAlgorithm(cube, crossSolution);

            f2lPairs.forEach((pair, index) => {
                if (index < f2lIndex) {
                    cube = applyAlgorithm(cube, pair.solution);
                }
            });

            cube = applyAlgorithm(cube, partialMoves);
        }

        if (step === "oll") {
            cube = applyAlgorithm(cube, crossSolution);

            f2lPairs.forEach((pair) => {
                cube = applyAlgorithm(cube, pair.solution);
            });

            cube = applyAlgorithm(cube, partialMoves);
        }

        if (step === "pll") {
            cube = applyAlgorithm(cube, crossSolution);

            f2lPairs.forEach((pair) => {
                cube = applyAlgorithm(cube, pair.solution);
            });

            cube = applyAlgorithm(cube, ollSolution);
            cube = applyAlgorithm(cube, partialMoves);
        }

        setCubeState(cube);
    };

    const previewUpToStep = (stepType, f2lIndex = null) => {
        let cube = createSolvedCube();

        cube = applyAlgorithm(cube, scramble);
        cube = applyZ2(cube);



        if (stepType === "cross") {
            cube = applyAlgorithm(cube, crossSolution);
        }

        if (stepType === "f2l") {
            cube = applyAlgorithm(cube, crossSolution);

            f2lPairs.forEach((pair, index) => {
                if (index <= f2lIndex) {
                    cube = applyAlgorithm(cube, pair.solution);
                }
            });
        }

        if (stepType === "oll") {
            cube = applyAlgorithm(cube, crossSolution);

            f2lPairs.forEach((pair) => {
                cube = applyAlgorithm(cube, pair.solution);
            });

            cube = applyAlgorithm(cube, ollSolution);
        }

        if (stepType === "pll") {
            cube = applyAlgorithm(cube, crossSolution);

            f2lPairs.forEach((pair) => {
                cube = applyAlgorithm(cube, pair.solution);
            });

            cube = applyAlgorithm(cube, ollSolution);
            cube = applyAlgorithm(cube, pllSolution);
        }

        setCubeState(cube);
    };



    return (
        <div style={styles.container}>

            <div style={styles.left}>
                <div style={styles.cubeNet}>
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

                <div style={styles.scrambleBox}>
                    <h3>Scramble</h3>
                    <p>{scramble || "Input a scramble to preview it here"}</p>
                </div>
            </div>

            <div style={styles.right}>

                <div style={styles.card}>
                    <h1>Analysis</h1>
                    <p style={styles.subtitle}>
                        Input the scramble and the solution for feedback
                    </p>

                    <label style={styles.label}>Scramble</label>
                    <textarea
                        style={styles.textarea}
                        value={scramble}
                        onClick={(e) => previewAtCursor("scramble", scramble, e.target.selectionStart)}
                        onKeyUp={(e) => previewAtCursor("scramble", scramble, e.target.selectionStart)}
                        onChange={(e) => setScramble(e.target.value)}
                        placeholder="e.g. R U F L2 B' D'..."
                    />

                    <label style={styles.label}>Cross Solution</label>
                    <input
                        style={styles.input}
                        value={crossSolution}
                        onClick={(e) => previewAtCursor("cross", crossSolution, e.target.selectionStart)}
                        onKeyUp={(e) => previewAtCursor("cross", crossSolution, e.target.selectionStart)}
                        onChange={(e) => setCrossSolution(e.target.value)}
                        placeholder="e.g. L D' R2 F..."
                    />

                    <label style={styles.label}>F2L Solutions</label>

                    {f2lPairs.map((pair, index) => (
                        <div key={index} style={styles.f2lRow}>
                            <input
                                style={styles.f2lInput}
                                value={pair.solution}
                                onClick={(e) => previewAtCursor("f2l", pair.solution, e.target.selectionStart, index)}
                                onKeyUp={(e) => previewAtCursor("f2l", pair.solution, e.target.selectionStart, index)}
                                onChange={(e) => updateF2LPair(index, "solution", e.target.value)}
                                placeholder={`F2L Pair ${index + 1} solution`}
                            />

                            <select
                                style={styles.f2lSelect}
                                value={pair.slot}
                                onChange={(e) => updateF2LPair(index, "slot", e.target.value)}
                            >
                                <option value="FR">Front Right</option>
                                <option value="FL">Front Left</option>
                                <option value="BR">Back Right</option>
                                <option value="BL">Back Left</option>
                            </select>
                        </div>
                    ))}

                    <label style={styles.label}>OLL Solution</label>
                    <input
                        style={styles.input}
                        value={ollSolution}
                        onClick={(e) => previewAtCursor("oll", ollSolution, e.target.selectionStart)}
                        onKeyUp={(e) => previewAtCursor("oll", ollSolution, e.target.selectionStart)}
                        onChange={(e) => setOllSolution(e.target.value)}
                        placeholder="e.g. R U R' U R U2 R'"
                    />

                    <label style={styles.label}>PLL Solution</label>
                    <input
                        style={styles.input}
                        value={pllSolution}
                        onClick={(e) => previewAtCursor("pll", pllSolution, e.target.selectionStart)}
                        onKeyUp={(e) => previewAtCursor("pll", pllSolution, e.target.selectionStart)}
                        onChange={(e) => setPllSolution(e.target.value)}
                        placeholder="e.g. R U R' U' R' F R2 U' R' U' R U R' F'"
                    />

                    <button style={styles.button} onClick={handleAnalyse}>
                        Analyse Solve
                    </button>
                </div>

                <div style={styles.resultsCard}>
                    <h2>Feedback</h2>

                    {feedback ? (
                        <div style={styles.feedback}>
                            {feedback}
                        </div>
                    ) : (
                        <p style={styles.emptyFeedback}>
                            Run analysis to see feedback here.
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        width: "100vw",
        background: "#101624",
        color: "#F9FAFB",
        display: "flex",
        boxSizing: "border-box",
        padding: "80px 40px 40px",
        gap: "30px",
    },

    left: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
    },

    right: {
        width: "560px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        maxHeight: "calc(100vh - 120px)",
        overflowY: "auto",
    },

    card: {
        background: "#1F2A38",
        padding: "24px",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },

    resultsCard: {
        background: "#1F2A38",
        padding: "24px",
        borderRadius: "16px",
    },

    cubePlaceholder: {
        width: "260px",
        height: "260px",
        background: "#1F2A38",
        borderRadius: "16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#9CA3AF",
    },

    scrambleBox: {
        width: "80%",
        background: "#1F2A38",
        padding: "16px",
        borderRadius: "12px",
        textAlign: "center",
        color: "#D1D5DB",
    },

    subtitle: {
        color: "#9CA3AF",
        marginTop: "-5px",
        marginBottom: "10px",
    },

    label: {
        fontSize: "0.9rem",
        color: "#D1D5DB",
    },

    input: {
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        fontSize: "1rem",
    },

    textarea: {
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        fontSize: "1rem",
        minHeight: "80px",
        resize: "vertical",
    },

    f2lRow: {
        display: "flex",
        gap: "10px",
    },

    f2lInput: {
        flex: 1,
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        fontSize: "1rem",
    },

    f2lSelect: {
        width: "140px",
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        fontSize: "0.9rem",
    },

    button: {
        marginTop: "10px",
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        background: "#3880F5",
        color: "white",
        fontSize: "1rem",
        cursor: "pointer",
    },

    feedback: {
        marginTop: "10px",
        padding: "15px",
        background: "#111827",
        borderRadius: "10px",
        color: "#D1D5DB",
        whiteSpace: "pre-line",
    },

    emptyFeedback: {
        color: "#9CA3AF",
    },
    cubeNet: {
        background: "#1F2A38",
        padding: "20px",
        borderRadius: "16px",
        display: "grid",
        gridTemplateColumns: "repeat(4, auto)",
        gridTemplateRows: "repeat(3, auto)",
        gap: "6px",
    },

    face: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 28px)",
        gap: "3px",
    },

    square: {
        width: "28px",
        height: "28px",
        border: "1px solid #111827",
    }
};

export default AnalysisPage;