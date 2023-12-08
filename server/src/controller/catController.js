const Cats = require("../models/cats");

exports.getLikedCat = async (req, res) => {
  try {
    const cats = await Cats.getCats();
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
    const cat = await Cats.insertCat(body);
    console.log(cat);
  } catch (error) {
    console.log(error);
  }
};
