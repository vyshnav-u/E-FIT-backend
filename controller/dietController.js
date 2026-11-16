
const DietPlan = require("../models/DietPlan");
const Food = require("../models/Food");

const calculateMealTotals = (meal) => {
    let totalCalories = 0;
    let totalProtein = 0;

    meal.foods = meal.foods.map((item) => {
        const quantity = Number(item.quantity);

        const totalFoodCalories =
            (quantity / 100) * item.caloriesPer100g;

        const totalFoodProtein =
            (quantity / 100) * item.proteinPer100g;

        totalCalories += totalFoodCalories;
        totalProtein += totalFoodProtein;

        return {
            ...item,
            totalCalories: Number(totalFoodCalories.toFixed(2)),
            totalProtein: Number(totalFoodProtein.toFixed(2))
        };
    });

    meal.totalCalories = Number(totalCalories.toFixed(2));
    meal.totalProtein = Number(totalProtein.toFixed(2));

    return meal;
};

const prepareDietMeals = async (meals) => {
    const preparedMeals = [];

    for (const meal of meals) {
        const preparedFoods = [];

        for (const item of meal.foods) {
            const quantity = Number(item.quantity);

            if (!Number.isFinite(quantity) || quantity <= 0) {
                throw new Error("Invalid food quantity");
            }

            const food = await Food.findById(item.food);

            if (!food) {
                throw new Error("Food Not Found");
            }

            preparedFoods.push({
                food: food._id,
                foodName: food.name,
                quantity,
                caloriesPer100g: food.caloriesPer100g,
                proteinPer100g: food.proteinPer100g,
                totalCalories: 0,
                totalProtein: 0
            });
        }

        const preparedMeal = calculateMealTotals({
            mealName: meal.mealName,
            foods: preparedFoods
        });

        preparedMeals.push(preparedMeal);
    }

    return preparedMeals;
};

const calculateDietTotals = (meals) => {
    const totalCalories = meals.reduce(
        (total, meal) => total + meal.totalCalories,
        0
    );

    const totalProtein = meals.reduce(
        (total, meal) => total + meal.totalProtein,
        0
    );

    return {
        totalCalories: Number(totalCalories.toFixed(2)),
        totalProtein: Number(totalProtein.toFixed(2))
    };
};

// ADMIN: Get all diet plans
const getDietController = async (req, res) => {
    try {
        const diets = await DietPlan.find()
            .populate("meals.foods.food")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            diets
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to Fetch Diet Plans"
        });
    }
};

// USER: Get only active diet plans
const getUserDietController = async (req, res) => {
    try {
        const diets = await DietPlan.find({
            status: "Active"
        })
            .populate("meals.foods.food")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            diets
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to Fetch Available Diet Plans"
        });
    }
};

// ADMIN: Create diet plan
const createDietController = async (req, res) => {
    try {
        const { name, description, meals, status } = req.body;

        if (!name || !Array.isArray(meals) || meals.length === 0) {
            return res.status(400).json({
                message: "Enter a diet plan name and at least one meal"
            });
        }

        for (const meal of meals) {
            if (!meal.mealName || !Array.isArray(meal.foods) || meal.foods.length === 0) {
                return res.status(400).json({
                    message: "Every meal must have a name and at least one food"
                });
            }
        }

        const preparedMeals = await prepareDietMeals(meals);
        const totals = calculateDietTotals(preparedMeals);

        const diet = await DietPlan.create({
            name,
            description,
            meals: preparedMeals,
            totalCalories: totals.totalCalories,
            totalProtein: totals.totalProtein,
            status
        });

        return res.status(201).json({
            message: "Diet Plan Created Successfully",
            diet
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: error.message || "Failed to Create Diet Plan"
        });
    }
};

// ADMIN: Update diet plan
const updateDietController = async (req, res) => {
    try {
        const { name, description, meals, status } = req.body;

        if (!name || !Array.isArray(meals) || meals.length === 0) {
            return res.status(400).json({
                message: "Enter a diet plan name and at least one meal"
            });
        }

        for (const meal of meals) {
            if (!meal.mealName || !Array.isArray(meal.foods) || meal.foods.length === 0) {
                return res.status(400).json({
                    message: "Every meal must have a name and at least one food"
                });
            }
        }

        const preparedMeals = await prepareDietMeals(meals);
        const totals = calculateDietTotals(preparedMeals);

        const updatedDiet = await DietPlan.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                meals: preparedMeals,
                totalCalories: totals.totalCalories,
                totalProtein: totals.totalProtein,
                status
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedDiet) {
            return res.status(404).json({
                message: "Diet Plan Not Found"
            });
        }

        return res.status(200).json({
            message: "Diet Plan Updated Successfully",
            diet: updatedDiet
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: error.message || "Failed to Update Diet Plan"
        });
    }
};

// ADMIN: Delete diet plan
const deleteDietController = async (req, res) => {
    try {
        const deletedDiet = await DietPlan.findByIdAndDelete(req.params.id);

        if (!deletedDiet) {
            return res.status(404).json({
                message: "Diet Plan Not Found"
            });
        }

        return res.status(200).json({
            message: "Diet Plan Deleted Successfully"
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to Delete Diet Plan"
        });
    }
};

module.exports = {
    createDietController,
    getDietController,
    getUserDietController,
    updateDietController,
    deleteDietController
};
