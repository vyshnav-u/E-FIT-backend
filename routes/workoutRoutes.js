
const express = require("express");
const router = express.Router();

const authMiddleWare = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    createExerciseController,
    getExercisesController,
    updateExerciseController,
    deleteExerciseController
} = require("../controller/exerciseController");

const {
    createWorkoutController,
    getWorkoutsController,
    updateWorkoutController,
    deleteWorkoutController,
    getUserWorkoutsController,
    createCustomWorkoutController,
    activateWorkoutController,
    getActiveWorkoutController,
    saveWorkoutProgressController,
    getWorkoutLogsController
} = require("../controller/workoutController");

router.post("/admin/exercises", authMiddleWare, adminMiddleware, createExerciseController);
router.get("/admin/exercises", authMiddleWare, adminMiddleware, getExercisesController);
router.put("/admin/exercises/:id", authMiddleWare, adminMiddleware, updateExerciseController);
router.delete("/admin/exercises/:id", authMiddleWare, adminMiddleware, deleteExerciseController);

router.post("/admin/workouts", authMiddleWare, adminMiddleware, createWorkoutController);
router.get("/admin/workouts", authMiddleWare, adminMiddleware, getWorkoutsController);
router.put("/admin/workouts/:id", authMiddleWare, adminMiddleware, updateWorkoutController);
router.delete("/admin/workouts/:id", authMiddleWare, adminMiddleware, deleteWorkoutController);

router.get("/workouts", authMiddleWare, getUserWorkoutsController);
router.get("/exercises", authMiddleWare, getExercisesController);
router.post("/workouts/custom", authMiddleWare, createCustomWorkoutController);

router.post("/workouts/activate", authMiddleWare, activateWorkoutController);
router.get("/workouts/active", authMiddleWare, getActiveWorkoutController);
router.post("/workouts/progress", authMiddleWare, saveWorkoutProgressController);
router.get("/workouts/history", authMiddleWare, getWorkoutLogsController);

module.exports = router;
