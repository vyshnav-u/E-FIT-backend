
const Exercise = require("../models/Exercise");
const WorkoutPlan = require("../models/WorkoutPlan");

const createExerciseController = async (req, res) => {
    try {
        const exercise = await Exercise.create(req.body);

        return res.status(201).json({
            message: "Exercise created successfully",
            exercise
        });
    } catch (err) {
        return res.status(400).json({
            message: err.message
        });
    }
};

const getExercisesController = async (req, res) => {
    try {
        const exercises = await Exercise.find().sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Exercises fetched successfully",
            exercises
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch exercises"
        });
    }
};

const updateExerciseController = async (req, res) => {
    try {
        const exercise = await Exercise.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!exercise) {
            return res.status(404).json({
                message: "Exercise not found"
            });
        }

        return res.status(200).json({
            message: "Exercise updated successfully",
            exercise
        });
    } catch (err) {
        return res.status(400).json({
            message: err.message
        });
    }
};

const deleteExerciseController = async (req, res) => {
    try {
        const exerciseId = req.params.id;

        const isUsed = await WorkoutPlan.exists({
            "days.exercises.exercise": exerciseId
        });

        if (isUsed) {
            return res.status(409).json({
                message: "This exercise is used in a workout plan. Remove it from the plan first."
            });
        }

        const exercise = await Exercise.findByIdAndDelete(exerciseId);

        if (!exercise) {
            return res.status(404).json({
                message: "Exercise not found"
            });
        }

        return res.status(200).json({
            message: "Exercise deleted successfully"
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to delete exercise"
        });
    }
};

module.exports = {
    createExerciseController,
    getExercisesController,
    updateExerciseController,
    deleteExerciseController
};
