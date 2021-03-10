const express = require("express");
const userController = require("./userController");
const router = express.Router();  

// Register user
router.post("/register", userController.registerByEmail);
// Login user
router.post("/login", userController.loginByEmail);
// Update user data
router.post("/update", userController.updateUserData);

module.exports = router;