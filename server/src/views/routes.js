const express = require("express");

const router = express.Router();

router.get("/home", (req, res) => {
  res.render("index.html");
});

router.get("/login", (req, res) => {
  res.render("login.html");
});

module.exports = router;
