const Cats = require("../models/cats");
const Likes = require("../models/likes");
const { isAuthenticated } = require("../utils/utils");

exports.likeCat = async (req, res) => {
  const {
    body,
    headers: { authorization },
  } = req || {};
  const { userId } = await isAuthenticated(authorization);
  const { imageId } = body;
  try {
    let cat;
    if (!imageId) cat = await Cats.insertCat(body);
    console.log(cat);
    const { status, ...response } = await Likes.likedCat({
      imageId: imageId ? imageId : cat[0].imageId,
      userId,
    });
    if (status === 200) res.status(200).json({ status, ...response });
    else res.status(status).json({ message: response.message, status: status });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
