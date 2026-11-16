
const mongoose = require("mongoose");

const dietFoodSchema = new mongoose.Schema(
    {
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
            min: 1
        },
        caloriesPer100g: {
            type: Number,
            required: true,
            min: 0
        },
        proteinPer100g: {
            type: Number,
            required: true,
            min: 0
        },
        totalCalories: {
            type: Number,
            required: true,
            min: 0
        },
        totalProtein: {
            type: Number,
            required: true,
            min: 0
        }
    }
);

const mealSchema = new mongoose.Schema(
    {
        mealName: {
            type: String,
            required: true
        },
        foods: {
            type: [dietFoodSchema],
            default: []
        },
        totalCalories: {
            type: Number,
            default: 0
        },
        totalProtein: {
            type: Number,
            default: 0
        }
    }
);

const dietPlanSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: ""
        },
        meals: {
            type: [mealSchema],
            default: []
        },
        totalCalories: {
            type: Number,
            default: 0
        },
        totalProtein: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        }
    },
    {
        timestamps: true
    }
);

const DietPlan = mongoose.model("DietPlan", dietPlanSchema);

module.exports = DietPlan;
