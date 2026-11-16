
const mongoose = require("mongoose");

const workoutAssignmentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        planType: {
            type: String,
            enum: ["Admin", "Custom"],
            required: true
        },
        workoutPlan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WorkoutPlan",
            default: null
        },
        customWorkoutPlan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CustomWorkoutPlan",
            default: null
        },
        status: {
            type: String,
            enum: ["Active", "Completed", "Cancelled"],
            default: "Active"
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

workoutAssignmentSchema.pre("validate", function () {
    if (this.planType === "Admin") {
        if (!this.workoutPlan || this.customWorkoutPlan) {
            this.invalidate("workoutPlan", "Invalid admin workout plan reference.");
        }
    }

    if (this.planType === "Custom") {
        if (!this.customWorkoutPlan || this.workoutPlan) {
            this.invalidate("customWorkoutPlan", "Invalid custom workout plan reference.");
        }
    }
});

workoutAssignmentSchema.index(
    { user: 1 },
    {
        unique: true,
        partialFilterExpression: { status: "Active" }
    }
);

module.exports = mongoose.model("WorkoutAssignment", workoutAssignmentSchema);
