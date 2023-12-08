const express = require("express");
const db = require("../../config/db");

const router = express.Router();

router.get("/", async (req, res) => {
  const response = await db("articles").select("*");
  res.status(200).send({ data: response });
});

module.exports = router;
