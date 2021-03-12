const path = require("path");
const express = require("express");
const userController = require("./userController");
const router = express.Router();  
const multer = require("multer");

/**
 * Define path and naming for multer package to save images
 */
 const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/image/");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.id + path.extname(file.originalname)); //Appending extension
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 2097152 } });

// Register user
router.post("/register", userController.registerByEmail);
// Login user
router.post("/login", userController.loginByEmail);
// Update user data
router.post("/update", userController.updateUserData);
// Upload received image
 router.post("/image", upload.single("image"), userController.uploadImage);

module.exports = router;