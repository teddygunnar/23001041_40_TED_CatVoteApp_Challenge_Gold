const express = require("express");
const router = express.Router();
const catsController = require("../controller/catController");

//define route
router.get("/", catsController.getLikedCat);
// router.posh("/insert", catsController.insertLikedCat);

module.exports = router;
