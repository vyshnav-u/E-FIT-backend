
const WeightLog = require("../models/WeightLog");
const User = require("../models/User");

const getWeightController = async (req, res) => {
    try {
        const userId = req.user.userId;

        const logs = await WeightLog.find({ user: userId })
            .sort({ recordedAt: 1 });

        const user = await User.findById(userId).select("weight weightGoal");

        res.status(200).json({
            success: true,
            logs,
            currentWeight: user?.weight || null,
            weightGoal: user?.weightGoal || null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const addWeightController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const weight = Number(req.body.weight);

        if (!Number.isFinite(weight) || weight < 1 || weight > 500) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid weight."
            });
        }

        const log = await WeightLog.create({
            user: userId,
            weight
        });

        await User.findByIdAndUpdate(userId, { weight });

        res.status(201).json({
            success: true,
            message: "Weight recorded successfully.",
            log
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const setWeightGoalController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const weightGoal = Number(req.body.weightGoal);

        if (!Number.isFinite(weightGoal) || weightGoal < 1 || weightGoal > 500) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid target weight."
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { weightGoal },
            { new: true, runValidators: true }
        ).select("weight weightGoal");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Weight goal updated successfully.",
            weightGoal: user.weightGoal
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getWeightController,
    addWeightController,
    setWeightGoalController
};
