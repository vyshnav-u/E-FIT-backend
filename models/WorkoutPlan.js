
const mongoose = require("mongoose");

const workoutPlanSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        goal: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        level: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Beginner"
        },
        description: {
            type: String,
            default: ""
        },
        days: [
            {
                dayNumber: {
                    type: Number,
                    required: true
                },
                title: {
                    type: String,
                    default: ""
                },
                isRestDay: {
                    type: Boolean,
                    default: false
                },
                exercises: [
                    {
                        exercise: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "Exercise"
                        },
                        sets: {
                            type: Number,
                            default: 3
                        },
                        reps: {
                            type: String,
                            default: "12"
                        },
                        duration: {
                            type: Number,
                            default: 0
                        },
                        restSeconds: {
                            type: Number,
                            default: 60
                        }
                    }
                ]
            }
        ],
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        }
    },
    { timestamps: true }
);

const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);

module.exports = WorkoutPlan;
