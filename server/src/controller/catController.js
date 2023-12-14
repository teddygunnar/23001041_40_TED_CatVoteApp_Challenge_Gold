const Cats = require("../models/cats");
const { isAuthenticated } = require("../utils/utils");

exports.getLikedCat = async (req, res) => {
  const { userId } = await isAuthenticated(req?.headers?.authorization);
  try {
    const cats = await Cats.getCats(userId);
    res.status(200).json({
      status: 200,
      payload: cats,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.insertLikedCat = async (req, res) => {
  try {
    await Cats.insertCat(body);
  } catch (error) {
    console.log(error);
  }
};
