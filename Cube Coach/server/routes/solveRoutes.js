const express = require("express");
const router = express.Router();

const { createSolve, getSolves, updateSolve, deleteSolve } = require("../controllers/solveController");
const { protect } = require("../middleware/authMiddleware");


router.post("/", protect, createSolve);
router.get("/", protect, getSolves);
router.put("/:id", protect, updateSolve);
router.delete("/:id", protect, deleteSolve);

module.exports = router;