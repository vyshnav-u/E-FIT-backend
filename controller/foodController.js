
const Food = require("../models/Food");

const createFoodController = async (req, res) => {
    try {
        const { name, caloriesPer100g, proteinPer100g } = req.body;

        if (!name || caloriesPer100g === undefined || proteinPer100g === undefined) {
            return res.status(400).json({
                message: "Please enter all food details"
            });
        }

        const existingFood = await Food.findOne({
            name: name.trim()
        });

        if (existingFood) {
            return res.status(409).json({
                message: "Food already exists"
            });
        }

        const food = await Food.create({
            name,
            caloriesPer100g,
            proteinPer100g
        });

        return res.status(201).json({
            message: "Food Added Successfully",
            food
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to Add Food"
        });
    }
};

const getFoodController = async (req, res) => {
    try {
        const foods = await Food.find().sort({ name: 1 });

        return res.status(200).json({
            foods
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to Fetch Foods"
        });
    }
};

const updateFoodController = async (req, res) => {
    try {
        const { name, caloriesPer100g, proteinPer100g } = req.body;

        const updatedFood = await Food.findByIdAndUpdate(
            req.params.id,
            {
                name,
                caloriesPer100g,
                proteinPer100g
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedFood) {
            return res.status(404).json({
                message: "Food Not Found"
            });
        }

        return res.status(200).json({
            message: "Food Updated Successfully",
            food: updatedFood
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to Update Food"
        });
    }
};

const deleteFoodController = async (req, res) => {
    try {
        const deletedFood = await Food.findByIdAndDelete(req.params.id);

        if (!deletedFood) {
            return res.status(404).json({
                message: "Food Not Found"
            });
        }

        return res.status(200).json({
            message: "Food Deleted Successfully"
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to Delete Food"
        });
    }
};

module.exports = {
    createFoodController,
    getFoodController,
    updateFoodController,
    deleteFoodController
};
