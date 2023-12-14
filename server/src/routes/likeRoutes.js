const express = require("express");
const router = express.Router();
const likeController = require("../controller/likeController");

//define route
router.post("/cat", likeController.likeCat);
router.post("/unlike/:id", likeController.unlikeCat);

module.exports = router;
