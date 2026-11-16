
const express = require("express");

const {
    createFoodController,
    getFoodController,
    updateFoodController,
    deleteFoodController
} = require("../controller/foodController");

const authMiddleWare = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/admin/foods", authMiddleWare, adminMiddleware, getFoodController);
router.post("/admin/foods", authMiddleWare, adminMiddleware, createFoodController);
router.put("/admin/foods/:id", authMiddleWare, adminMiddleware, updateFoodController);
router.delete("/admin/foods/:id", authMiddleWare, adminMiddleware, deleteFoodController);

module.exports = router;
