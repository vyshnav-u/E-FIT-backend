
const express = require("express");

const {
    createDietController,
    getDietController,
    getUserDietController,
    updateDietController,
    deleteDietController
} = require("../controller/dietController");

const {
    getDailyMealLogsController,
    createMealLogController
} = require("../controller/mealLogController");

const authMiddleWare = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ADMIN DIET ROUTES

router.get(
    "/admin/diet",
    authMiddleWare,
    adminMiddleware,
    getDietController
);

router.post(
    "/admin/diet",
    authMiddleWare,
    adminMiddleware,
    createDietController
);

router.put(
    "/admin/diet/:id",
    authMiddleWare,
    adminMiddleware,
    updateDietController
);

router.delete(
    "/admin/diet/:id",
    authMiddleWare,
    adminMiddleware,
    deleteDietController
);

// USER DIET ROUTE

router.get(
    "/diet",
    authMiddleWare,
    getUserDietController
);

// USER MEAL TRACKING ROUTES

router.get(
    "/diet/logs",
    authMiddleWare,
    getDailyMealLogsController
);

router.post(
    "/diet/logs",
    authMiddleWare,
    createMealLogController
);

module.exports = router;
