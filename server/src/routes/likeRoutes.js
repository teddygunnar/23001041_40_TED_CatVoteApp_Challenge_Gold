const express = require("express");
const router = express.Router();
const likeController = require("../controller/likeController");

//define route
router.post("/cat", likeController.likeCat);

module.exports = router;
