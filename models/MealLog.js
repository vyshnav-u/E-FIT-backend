
const mongoose = require("mongoose");

const consumedFoodSchema = new mongoose.Schema({
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
        required: true
    },
    foodName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    caloriesPer100g: {
        type: Number,
        required: true
    },
    proteinPer100g: {
        type: Number,
        required: true
    },
    totalCalories: {
        type: Number,
        required: true
    },
    totalProtein: {
        type: Number,
        required: true
    }
});

const mealLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        dietPlan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DietPlan",
            required: true
        },
        mealId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        mealName: {
            type: String,
            required: true
        },
        foods: {
            type: [consumedFoodSchema],
            required: true
        },
        totalCalories: {
            type: Number,
            default: 0
        },
        totalProtein: {
            type: Number,
            default: 0
        },
        date: {
            type: String,
            required: true
        },
        takenAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

mealLogSchema.index(
    {
        user: 1,
        dietPlan: 1,
        mealId: 1,
        date: 1
    },
    {
        unique: true
    }
);

const MealLog = mongoose.model("MealLog", mealLogSchema);

module.exports = MealLog;
