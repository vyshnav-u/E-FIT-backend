const mongoose = require("mongoose");

const customWorkoutPlanSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
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
            default: "Custom workout plan generated from the exercise library."
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
                            ref: "Exercise",
                            required: true
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
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("CustomWorkoutPlan", customWorkoutPlanSchema);