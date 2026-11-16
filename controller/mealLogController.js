
const MealLog = require("../models/MealLog");
const DietPlan = require("../models/DietPlan");

const getDailyMealLogsController = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({
                message: "A valid date is required"
            });
        }

        const logs = await MealLog.find({
            user: req.user.userId,
            date
        }).sort({ takenAt: 1 });

        return res.status(200).json({
            logs
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to Fetch Meal History"
        });
    }
};

const createMealLogController = async (req, res) => {
    try {
        const {
            dietPlanId,
            mealId,
            date,
            foods
        } = req.body;

        if (
            !dietPlanId ||
            !mealId ||
            !date ||
            !Array.isArray(foods) ||
            !/^\d{4}-\d{2}-\d{2}$/.test(date)
        ) {
            return res.status(400).json({
                message: "Invalid meal information"
            });
        }

        const dietPlan = await DietPlan.findOne({
            _id: dietPlanId,
            status: "Active"
        });

        if (!dietPlan) {
            return res.status(404).json({
                message: "Active Diet Plan Not Found"
            });
        }

        const meal = dietPlan.meals.id(mealId);

        if (!meal) {
            return res.status(404).json({
                message: "Meal Not Found"
            });
        }

        const consumedFoods = [];
        let totalCalories = 0;
        let totalProtein = 0;

        for (const item of foods) {
            const quantity = Number(item.quantity);

            if (!Number.isFinite(quantity) || quantity < 0) {
                return res.status(400).json({
                    message: "Invalid food quantity"
                });
            }

            if (quantity === 0) {
                continue;
            }

            const originalFood = meal.foods.id(item.foodItemId);

            if (!originalFood) {
                return res.status(400).json({
                    message: "Invalid food item in meal"
                });
            }

            const foodCalories =
                (quantity / 100) * originalFood.caloriesPer100g;

            const foodProtein =
                (quantity / 100) * originalFood.proteinPer100g;

            const roundedCalories = Number(foodCalories.toFixed(2));
            const roundedProtein = Number(foodProtein.toFixed(2));

            totalCalories += roundedCalories;
            totalProtein += roundedProtein;

            consumedFoods.push({
                food: originalFood.food,
                foodName: originalFood.foodName,
                quantity,
                caloriesPer100g: originalFood.caloriesPer100g,
                proteinPer100g: originalFood.proteinPer100g,
                totalCalories: roundedCalories,
                totalProtein: roundedProtein
            });
        }

        if (consumedFoods.length === 0) {
            return res.status(400).json({
                message: "Enter at least one food quantity greater than zero"
            });
        }

        const log = await MealLog.create({
            user: req.user.userId,
            dietPlan: dietPlan._id,
            mealId: meal._id,
            mealName: meal.mealName,
            foods: consumedFoods,
            totalCalories: Number(totalCalories.toFixed(2)),
            totalProtein: Number(totalProtein.toFixed(2)),
            date
        });

        return res.status(201).json({
            message: "Meal Consumption Recorded Successfully",
            log
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "You have already recorded this meal today"
            });
        }

        console.log(error);

        return res.status(500).json({
            message: error.message || "Failed to Record Meal"
        });
    }
};

module.exports = {
    getDailyMealLogsController,
    createMealLogController
};
