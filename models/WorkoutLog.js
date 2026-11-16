
const mongoose = require("mongoose");

const workoutLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        assignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WorkoutAssignment",
            required: true
        },
        dayNumber: {
            type: Number,
            required: true
        },
        dayTitle: {
            type: String,
            default: ""
        },
        dateKey: {
            type: String,
            required: true
        },
        completedExercises: [
            {
                exercise: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Exercise",
                    required: true
                }
            }
        ],
        status: {
            type: String,
            enum: ["In Progress", "Completed"],
            default: "In Progress"
        },
        startedAt: {
            type: Date,
            default: Date.now
        },
        completedAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

workoutLogSchema.index(
    { assignment: 1, dayNumber: 1, dateKey: 1 },
    { unique: true }
);

module.exports = mongoose.model("WorkoutLog", workoutLogSchema);
