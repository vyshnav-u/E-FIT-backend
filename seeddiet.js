
require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Food = require("./models/Food");
const DietPlan = require("./models/DietPlan");

const foodData = [
    { name: "Chicken Breast", caloriesPer100g: 165, proteinPer100g: 31 },
    { name: "Whole Egg", caloriesPer100g: 143, proteinPer100g: 13 },
    { name: "Oats", caloriesPer100g: 389, proteinPer100g: 16.9 },
    { name: "White Rice (cooked)", caloriesPer100g: 130, proteinPer100g: 2.7 },
    { name: "Banana", caloriesPer100g: 89, proteinPer100g: 1.1 },
    { name: "Almonds", caloriesPer100g: 579, proteinPer100g: 21.2 },
    { name: "Paneer", caloriesPer100g: 265, proteinPer100g: 18.3 },
    { name: "Greek Yogurt", caloriesPer100g: 59, proteinPer100g: 10 },
    { name: "Sweet Potato (cooked)", caloriesPer100g: 90, proteinPer100g: 2 },
    { name: "Broccoli", caloriesPer100g: 34, proteinPer100g: 2.8 }
];

const dietData = [
    {
        name: "Muscle Gain",
        description: "A balanced diet plan designed to support muscle growth.",
        meals: [
            {
                mealName: "Meal 1 - Breakfast",
                foods: [
                    { name: "Oats", quantity: 80 },
                    { name: "Whole Egg", quantity: 100 },
                    { name: "Banana", quantity: 120 }
                ]
            },
            {
                mealName: "Meal 2 - Lunch",
                foods: [
                    { name: "Chicken Breast", quantity: 150 },
                    { name: "White Rice (cooked)", quantity: 200 },
                    { name: "Broccoli", quantity: 100 }
                ]
            },
            {
                mealName: "Meal 3 - Evening Snack",
                foods: [
                    { name: "Greek Yogurt", quantity: 150 },
                    { name: "Almonds", quantity: 20 }
                ]
            },
            {
                mealName: "Meal 4 - Dinner",
                foods: [
                    { name: "Paneer", quantity: 100 },
                    { name: "Sweet Potato (cooked)", quantity: 200 }
                ]
            }
        ]
    },
    {
        name: "Weight Maintenance",
        description: "A balanced meal plan for maintaining body weight.",
        meals: [
            {
                mealName: "Meal 1 - Breakfast",
                foods: [
                    { name: "Oats", quantity: 50 },
                    { name: "Whole Egg", quantity: 100 },
                    { name: "Banana", quantity: 100 }
                ]
            },
            {
                mealName: "Meal 2 - Lunch",
                foods: [
                    { name: "Chicken Breast", quantity: 120 },
                    { name: "White Rice (cooked)", quantity: 150 },
                    { name: "Broccoli", quantity: 100 }
                ]
            },
            {
                mealName: "Meal 3 - Snack",
                foods: [
                    { name: "Greek Yogurt", quantity: 150 },
                    { name: "Almonds", quantity: 10 }
                ]
            },
            {
                mealName: "Meal 4 - Dinner",
                foods: [
                    { name: "Paneer", quantity: 80 },
                    { name: "Sweet Potato (cooked)", quantity: 150 }
                ]
            }
        ]
    },
    {
        name: "High Protein",
        description: "A protein-focused diet plan with balanced meals.",
        meals: [
            {
                mealName: "Meal 1 - Breakfast",
                foods: [
                    { name: "Whole Egg", quantity: 150 },
                    { name: "Oats", quantity: 50 }
                ]
            },
            {
                mealName: "Meal 2 - Lunch",
                foods: [
                    { name: "Chicken Breast", quantity: 200 },
                    { name: "White Rice (cooked)", quantity: 150 },
                    { name: "Broccoli", quantity: 100 }
                ]
            },
            {
                mealName: "Meal 3 - Snack",
                foods: [
                    { name: "Greek Yogurt", quantity: 200 },
                    { name: "Almonds", quantity: 15 }
                ]
            },
            {
                mealName: "Meal 4 - Dinner",
                foods: [
                    { name: "Paneer", quantity: 100 },
                    { name: "Sweet Potato (cooked)", quantity: 100 }
                ]
            }
        ]
    }
];

const calculateFoodNutrition = (food, quantity) => {
    const totalCalories = (quantity / 100) * food.caloriesPer100g;
    const totalProtein = (quantity / 100) * food.proteinPer100g;

    return {
        food: food._id,
        foodName: food.name,
        quantity,
        caloriesPer100g: food.caloriesPer100g,
        proteinPer100g: food.proteinPer100g,
        totalCalories: Number(totalCalories.toFixed(2)),
        totalProtein: Number(totalProtein.toFixed(2))
    };
};

const seedDatabase = async () => {
    try {
        await connectDB();

        const savedFoods = {};

        for (const item of foodData) {
            const food = await Food.findOneAndUpdate(
                { name: item.name },
                item,
                { new: true, upsert: true, runValidators: true }
            );

            savedFoods[item.name] = food;
        }

        for (const plan of dietData) {
            let totalCalories = 0;
            let totalProtein = 0;

            const meals = plan.meals.map((meal) => {
                const foods = meal.foods.map((item) => {
                    const food = savedFoods[item.name];

                    if (!food) {
                        throw new Error(`Food not found: ${item.name}`);
                    }

                    return calculateFoodNutrition(food, item.quantity);
                });

                const mealCalories = foods.reduce(
                    (total, item) => total + item.totalCalories,
                    0
                );

                const mealProtein = foods.reduce(
                    (total, item) => total + item.totalProtein,
                    0
                );

                totalCalories += mealCalories;
                totalProtein += mealProtein;

                return {
                    mealName: meal.mealName,
                    foods,
                    totalCalories: Number(mealCalories.toFixed(2)),
                    totalProtein: Number(mealProtein.toFixed(2))
                };
            });

            await DietPlan.findOneAndUpdate(
                { name: plan.name },
                {
                    name: plan.name,
                    description: plan.description,
                    meals,
                    totalCalories: Number(totalCalories.toFixed(2)),
                    totalProtein: Number(totalProtein.toFixed(2)),
                    status: "Active"
                },
                { new: true, upsert: true, runValidators: true }
            );
        }

        console.log("Food Library seeded successfully!");
        console.log("Diet Plans seeded successfully!");
        console.log("10 foods and 3 diet plans are ready.");

    } catch (error) {
        console.error("Seeding failed:", error.message);
    } finally {
        await mongoose.disconnect();
    }
};

seedDatabase();
