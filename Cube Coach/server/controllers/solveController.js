const Solve = require("../models/Solve");

const createSolve = async (req, res) => {
    const { time, penalty, scramble } = req.body;

    const solve = await Solve.create({
        user: req.user._id,
        time,
        penalty,
        scramble
    });

    res.status(201).json(solve);
};

const updateSolve = async (req, res) => {
    const solve = await Solve.findById(req.params.id);

    if (!solve) {
        return res.status(404).json({ message: "Solve not found" });
    }

    if (solve.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
    }

    solve.penalty = req.body.penalty;

    const updatedSolve = await solve.save();

    res.json(updatedSolve);
};

const getSolves = async (req, res) => {
    const solves = await Solve.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(solves);
};

const deleteSolve = async (req, res) => {
    const solve = await Solve.findById(req.params.id);

    if (!solve) {
        return res.status(404).json({ message: "Solve not found" });
    }

    if (solve.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
    }

    await solve.deleteOne();

    res.json({ message: "Solve removed" });
};

module.exports = {
    createSolve,
    getSolves,
    updateSolve,
    deleteSolve
};