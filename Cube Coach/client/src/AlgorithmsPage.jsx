import { useState } from "react";

const algorithms = [
    {
        name: "Aa Perm",
        category: "PLL",
        alg: "x R' U R' D2 R U' R' D2 R2 x'"
    },
    {
        name: "Ab Perm",
        category: "PLL",
        alg: "x R2 D2 R U R' D2 R U' R x'"
    },
    {
        name: "E Perm",
        category: "PLL",
        alg: "x' R U' R' D R U R' D' R U R' D R U' R' D' x"
    },
    {
        name: "F Perm",
        category: "PLL",
        alg: "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R"
    },
    {
        name: "Ga Perm",
        category: "PLL",
        alg: "R2 U R' U R' U' R U' R2 D U' R' U R D'"
    },
    {
        name: "Gb Perm",
        category: "PLL",
        alg: "D R' U' R U D' R2 U R' U R U' R U' R2"
    },
    {
        name: "Gc Perm",
        category: "PLL",
        alg: "R2 U' R U' R U R' U R2 D' U R U' R' D"
    },
    {
        name: "Gd Perm",
        category: "PLL",
        alg: "R U R' U' D R2 U' R U' R' U R' U R2 D'"
    },
    {
        name: "H Perm",
        category: "PLL",
        alg: "M2 U' M2 U2 M2 U' M2"
    },
    {
        name: "Ja Perm",
        category: "PLL",
        alg: "R' U L' U2 R U' R' U2 R L"
    },
    {
        name: "Jb Perm",
        category: "PLL",
        alg: "R U R' F' R U R' U' R' F R2 U' R"
    },
    {
        name: "Na Perm",
        category: "PLL",
        alg: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'"
    },
    {
        name: "Nb Perm",
        category: "PLL",
        alg: "R' U R U' R' F' U' F R U R' F R' F' R U' R"
    },
    {
        name: "Ra Perm",
        category: "PLL",
        alg: "R U' R' U' R U R D R' U' R D' R' U2 R'"
    },
    {
        name: "Rb Perm",
        category: "PLL",
        alg: "R' U2 R U2 R' F R U R' U' R' F' R2"
    },
    {
        name: "T Perm",
        category: "PLL",
        alg: "R U R' U' R' F R2 U' R' U' R U R' F'"
    },
    {
        name: "Ua Perm",
        category: "PLL",
        alg: "M2 U M U2 M' U M2"
    },
    {
        name: "Ub Perm",
        category: "PLL",
        alg: "M2 U' M U2 M' U' M2"
    },
    {
        name: "V Perm",
        category: "PLL",
        alg: "R' U R' U' R D' R' D R' U D' R2 U' R2 D R2"
    },
    {
        name: "Y Perm",
        category: "PLL",
        alg: "F R U' R' U' R U R' F' R U R' U' R' F R F"
    },
    {
        name: "Z Perm",
        category: "PLL",
        alg: "M' U' M2 U' M2 U' M' U2 M2"
    },
    {
        name: "OLL 1",
        category: "OLL",
        alg: "R U2 R2 F R F' U2 R' F R F'"
    },
    {
        name: "OLL 2",
        category: "OLL",
        alg: "R U' R2 D' r U r' D R2 U R'"
    },
    {
        name: "OLL 3",
        category: "OLL",
        alg: "f R U R' U' f' U' F R U R' U' F'"
    }


]
function AlgorithmsPage() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const categories = [
        "Beginner Method",
        "OLL",
        "PLL",
        "Winter Variation",
        "COLL",
        "ZBLL",
        "ZBLS",
        "F2L",
    ];

    const filteredAlgorithms = algorithms.filter(
        (a) => a.category === selectedCategory
    );

    return (
        <div style={styles.container}>
            {!selectedCategory ? (
                <div style={styles.grid}>
                    {categories.map((category) => (
                        <button
                            key={category}
                            style={styles.categoryButton}
                            onClick={() => {
                                if (category === "OLL" || category === "PLL") {
                                    setSelectedCategory(category);
                                }
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            ) : (
                <div style={styles.content}>
                    <button
                        style={styles.backButton}
                        onClick={() => setSelectedCategory(null)}
                    >
                        Back
                    </button>

                    <h1>{selectedCategory}</h1>

                    <div style={styles.cardGrid}>
                        {filteredAlgorithms.map((alg) => (
                            <div key={alg.name} style={styles.card}>
                                <h2>{alg.name}</h2>
                                <p style={styles.case}>{alg.case}</p>
                                <p style={styles.alg}>{alg.alg}</p>
                                {alg.notes && (
                                    <p style={styles.notes}>{alg.notes}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
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
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "70px",
        boxSizing: "border-box",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 140px)",
        gap: "45px",
    },

    categoryButton: {
        height: "80px",
        borderRadius: "10px",
        border: "none",
        background: "#1F2A38",
        color: "#F9FAFB",
        fontSize: "0.9rem",
        cursor: "pointer",
    },
};

export default AlgorithmsPage;