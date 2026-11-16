
const express = require("express");

const {
    registrationController,
    loginController,
    profileController,
    updateProfileController,
    uploadProfileImageController,
    getAllUsersController,
    deleteUserController
} = require("../controller/authController");

const authMiddleWare = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/register", registrationController);
router.post("/login", loginController);

router.get("/profile", authMiddleWare, profileController);
router.put("/profile", authMiddleWare, updateProfileController);

router.put(
    "/profile/image",
    authMiddleWare,
    upload.single("profileImage"),
    uploadProfileImageController
);

router.get("/admin/users", authMiddleWare, adminMiddleware, getAllUsersController);
router.delete("/admin/users/:id", authMiddleWare, adminMiddleware, deleteUserController);

module.exports = router;
