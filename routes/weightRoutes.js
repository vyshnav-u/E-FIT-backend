
const express = require("express");

const {
    addWeightController,
    getWeightController,
    setWeightGoalController
} = require("../controller/weightController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/weight", authMiddleware, addWeightController);
router.get("/weight", authMiddleware, getWeightController);
router.put("/weight/goal", authMiddleware, setWeightGoalController);

module.exports = router;
