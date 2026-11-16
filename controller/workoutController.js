
const mongoose = require("mongoose");

const WorkoutPlan = require("../models/WorkoutPlan");
const CustomWorkoutPlan = require("../models/CustomWorkoutPlan");
const WorkoutAssignment = require("../models/WorkoutAssignment");
const WorkoutLog = require("../models/WorkoutLog");
const Exercise = require("../models/Exercise");

const createWorkoutController = async (req, res) => {
    try {
        const workout = await WorkoutPlan.create(req.body);

        const populatedWorkout = await WorkoutPlan.findById(workout._id)
            .populate("days.exercises.exercise");

        return res.status(201).json({
            message: "Workout plan created successfully",
            workout: populatedWorkout
        });
    } catch (err) {
        return res.status(400).json({
            message: err.message
        });
    }
};

const getWorkoutsController = async (req, res) => {
    try {
        const workouts = await WorkoutPlan.find()
            .populate("days.exercises.exercise")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Workout plans fetched successfully",
            workouts
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch workout plans",
            error: err.message
        });
    }
};

const updateWorkoutController = async (req, res) => {
    try {
        const workout = await WorkoutPlan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate("days.exercises.exercise");

        if (!workout) {
            return res.status(404).json({
                message: "Workout plan not found"
            });
        }

        return res.status(200).json({
            message: "Workout plan updated successfully",
            workout
        });
    } catch (err) {
        return res.status(400).json({
            message: err.message
        });
    }
};

const deleteWorkoutController = async (req, res) => {
    try {
        const workout = await WorkoutPlan.findByIdAndDelete(req.params.id);

        if (!workout) {
            return res.status(404).json({
                message: "Workout plan not found"
            });
        }

        return res.status(200).json({
            message: "Workout plan deleted successfully"
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to delete workout plan",
            error: err.message
        });
    }
};

const getUserWorkoutsController = async (req, res) => {
    try {
        const userId = req.user.userId;

        const adminWorkouts = await WorkoutPlan.find({
            status: "Active"
        })
            .populate("days.exercises.exercise")
            .sort({ createdAt: -1 });

        const customWorkouts = await CustomWorkoutPlan.find({
            user: userId
        })
            .populate("days.exercises.exercise")
            .sort({ createdAt: -1 });

        const workouts = [
            ...adminWorkouts.map(workout => ({
                ...workout.toObject(),
                planType: "Admin"
            })),
            ...customWorkouts.map(workout => ({
                ...workout.toObject(),
                planType: "Custom"
            }))
        ];

        return res.status(200).json({
            message: "Workouts fetched successfully",
            workouts
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch workouts",
            error: err.message
        });
    }
};

const createCustomWorkoutController = async (req, res) => {
    try {
        const { name, goal, duration, level, days } = req.body;

        if (
            !name ||
            !goal ||
            !duration ||
            !level ||
            !Array.isArray(days) ||
            !days.length
        ) {
            return res.status(400).json({
                message: "Please provide all workout plan details."
            });
        }

        const exerciseIds = days.flatMap(day =>
            (day.exercises || []).map(item => item.exercise)
        );

        if (!exerciseIds.length) {
            return res.status(400).json({
                message: "Your plan must contain at least one exercise."
            });
        }

        const existingExercises = await Exercise.find({
            _id: { $in: exerciseIds }
        }).select("_id");

        if (
            existingExercises.length !==
            new Set(exerciseIds.map(String)).size
        ) {
            return res.status(400).json({
                message: "One or more selected exercises are invalid."
            });
        }

        const workout = await CustomWorkoutPlan.create({
            user: req.user.userId,
            name,
            goal,
            duration,
            level,
            days
        });

        const populatedWorkout = await CustomWorkoutPlan.findById(workout._id)
            .populate("days.exercises.exercise");

        return res.status(201).json({
            message: "Custom workout plan created successfully.",
            workout: populatedWorkout
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to create custom workout plan.",
            error: error.message
        });
    }
};

const activateWorkoutController = async (req, res) => {
    try {
        const { planId, planType } = req.body;
        const userId = req.user.userId;

        if (!mongoose.Types.ObjectId.isValid(planId)) {
            return res.status(400).json({
                message: "Invalid workout plan ID."
            });
        }

        if (!["Admin", "Custom"].includes(planType)) {
            return res.status(400).json({
                message: "Invalid workout plan type."
            });
        }

        let workout;

        if (planType === "Admin") {
            workout = await WorkoutPlan.findOne({
                _id: planId,
                status: "Active"
            });
        } else {
            workout = await CustomWorkoutPlan.findOne({
                _id: planId,
                user: userId
            });
        }

        if (!workout) {
            return res.status(404).json({
                message: "Workout plan not found or unavailable."
            });
        }

        const existingAssignment = await WorkoutAssignment.findOne({
            user: userId,
            status: "Active"
        });

        if (
            existingAssignment &&
            String(
                planType === "Admin"
                    ? existingAssignment.workoutPlan
                    : existingAssignment.customWorkoutPlan
            ) === String(planId) &&
            existingAssignment.planType === planType
        ) {
            return res.status(200).json({
                message: "This workout plan is already active.",
                assignment: existingAssignment
            });
        }

        await WorkoutAssignment.updateMany(
            { user: userId, status: "Active" },
            {
                $set: {
                    status: "Cancelled"
                }
            }
        );

        const assignmentData = {
            user: userId,
            planType,
            workoutPlan: planType === "Admin" ? planId : null,
            customWorkoutPlan: planType === "Custom" ? planId : null,
            status: "Active",
            startedAt: new Date()
        };

        const assignment = await WorkoutAssignment.create(assignmentData);

        const populatedAssignment = await WorkoutAssignment.findById(
            assignment._id
        )
            .populate("workoutPlan")
            .populate("customWorkoutPlan");

        return res.status(201).json({
            message: "Workout plan activated successfully.",
            assignment: populatedAssignment
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "You already have an active workout plan. Please try again."
            });
        }

        return res.status(500).json({
            message: "Unable to activate workout plan.",
            error: error.message
        });
    }
};

const getActiveWorkoutController = async (req, res) => {
    try {
        const assignment = await WorkoutAssignment.findOne({
            user: req.user.userId,
            status: "Active"
        })
            .populate({
                path: "workoutPlan",
                populate: {
                    path: "days.exercises.exercise"
                }
            })
            .populate({
                path: "customWorkoutPlan",
                populate: {
                    path: "days.exercises.exercise"
                }
            });

        if (!assignment) {
            return res.status(200).json({
                message: "No active workout plan.",
                assignment: null,
                workout: null
            });
        }

        const workout = assignment.planType === "Admin"
            ? assignment.workoutPlan
            : assignment.customWorkoutPlan;

        return res.status(200).json({
            message: "Active workout fetched successfully.",
            assignment,
            workout
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to fetch active workout.",
            error: error.message
        });
    }
};

const saveWorkoutProgressController = async (req, res) => {
    try {
        const { dayNumber, dateKey, completedExercises } = req.body;
        const userId = req.user.userId;

        if (
            !Number.isInteger(Number(dayNumber)) ||
            Number(dayNumber) < 1 ||
            !/^\d{4}-\d{2}-\d{2}$/.test(dateKey || "") ||
            !Array.isArray(completedExercises)
        ) {
            return res.status(400).json({
                message: "Invalid workout progress data."
            });
        }

        const assignment = await WorkoutAssignment.findOne({
            user: userId,
            status: "Active"
        });

        if (!assignment) {
            return res.status(404).json({
                message: "You do not have an active workout plan."
            });
        }

        const workout = assignment.planType === "Admin"
            ? await WorkoutPlan.findById(assignment.workoutPlan)
            : await CustomWorkoutPlan.findOne({
                _id: assignment.customWorkoutPlan,
                user: userId
            });

        if (!workout) {
            return res.status(404).json({
                message: "Workout plan not found."
            });
        }

        const selectedDay = workout.days.find(
            day => day.dayNumber === Number(dayNumber)
        );

        if (!selectedDay || selectedDay.isRestDay) {
            return res.status(400).json({
                message: "Invalid workout day."
            });
        }

        const validExerciseIds = selectedDay.exercises.map(item =>
            String(item.exercise)
        );

        const uniqueCompletedIds = [...new Set(
            completedExercises.map(String)
        )];

        const invalidExercise = uniqueCompletedIds.some(id =>
            !mongoose.Types.ObjectId.isValid(id) ||
            !validExerciseIds.includes(id)
        );

        if (invalidExercise) {
            return res.status(400).json({
                message: "One or more completed exercises do not belong to this workout day."
            });
        }

        const completed = validExerciseIds.length > 0 &&
            validExerciseIds.every(id => uniqueCompletedIds.includes(id));

        const log = await WorkoutLog.findOneAndUpdate(
            {
                assignment: assignment._id,
                dayNumber: Number(dayNumber),
                dateKey
            },
            {
                $set: {
                    user: userId,
                    dayTitle: selectedDay.title || "",
                    completedExercises: uniqueCompletedIds.map(id => ({
                        exercise: id
                    })),
                    status: completed ? "Completed" : "In Progress",
                    completedAt: completed ? new Date() : null
                },
                $setOnInsert: {
                    startedAt: new Date()
                }
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        ).populate("completedExercises.exercise");

        return res.status(200).json({
            message: completed
                ? "Workout day completed successfully."
                : "Workout progress saved successfully.",
            log
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Workout progress already exists for this day and date."
            });
        }

        return res.status(500).json({
            message: "Unable to save workout progress.",
            error: error.message
        });
    }
};

const getWorkoutLogsController = async (req, res) => {
    try {
        const assignments = await WorkoutAssignment.find({
            user: req.user.userId
        }).select("_id");

        const assignmentIds = assignments.map(item => item._id);

        const logs = await WorkoutLog.find({
            user: req.user.userId,
            assignment: { $in: assignmentIds }
        })
            .populate("completedExercises.exercise")
            .sort({ dateKey: -1, createdAt: -1 });

        return res.status(200).json({
            message: "Workout history fetched successfully.",
            logs
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to fetch workout history.",
            error: error.message
        });
    }
};

module.exports = {
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
};
