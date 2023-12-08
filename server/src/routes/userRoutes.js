const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

//define route
router.get("/", userController.getAllUser);
router.get("/:id", userController.getUserById);
router.post("/create", userController.createUser);
router.delete("/delete/:id", userController.deleteUser);

module.exports = router;
