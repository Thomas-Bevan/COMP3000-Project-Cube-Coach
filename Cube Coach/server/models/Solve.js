const mongoose = require("mongoose");

const solveSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        time: {
            type: Number,
            required: true
        },
        penalty: {
            type: String, // gonna be DNF 0 or 2000
            default: "0",
        },

        scramble: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Solve", solveSchema);