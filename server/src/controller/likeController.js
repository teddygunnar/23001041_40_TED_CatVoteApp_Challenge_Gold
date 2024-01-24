const Cats = require("../models/cats");
const Likes = require("../models/likes");
const { isAuthenticated, socketBroadcast } = require("../utils/utils");

exports.likeCat = async (req, res) => {
  const {
    body,
    headers: { authorization },
    server,
  } = req || {};

  const { userId } = await isAuthenticated(authorization);
  const { imageId } = body;
  try {
    let cat;
    if (!imageId) {
      cat = await Cats.insertCat(body);
      socketBroadcast(server, { action: "add", ...cat[0], userId });
    }
    const { status, ...response } = await Likes.likeCat({
      imageId: imageId ? imageId : cat[0].imageId,
      userId,
    });
    if (status === 200 && imageId) {
      const count = await Likes.getUpdatedLikeCount(imageId, userId);
      socketBroadcast(server, { action: "update", ...count, userId });
      res.status(200).json({ status, ...response });
    } else
      res.status(status).json({ message: response.message, status: status });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.unlikeCat = async (req, res) => {
  const {
    headers: { authorization },
    params,
    server,
  } = req || {};

  const { userId } = await isAuthenticated(authorization);
  const { id: imageId } = params;

  try {
    const { status, message, data } = await Likes.unlikeCat({
      userId,
      imageId,
    });
    if (status === 200) {
      const count = await Likes.getUpdatedLikeCount(imageId, userId);
      if (!count) {
        await Cats.deleteCat(imageId);
        socketBroadcast(server, { action: "delete", imageId, userId });
      } else {
        socketBroadcast(server, { action: "update", ...count, userId });
      }
      res.status(status).send({ status: status, message: message, data: data });
    }
  } catch (error) {
    console.log(error);
  }
};
