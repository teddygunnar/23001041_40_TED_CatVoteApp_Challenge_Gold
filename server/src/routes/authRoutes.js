const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

//define route
router.post("/login", authController.loginUser);

module.exports = router;
