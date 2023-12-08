const knex = require("../../config/db");

class Likes {
  // some create and delete stuff in here for users who records their likes
  // will return after the strucutre of cats is solid

  static async getLikesById() {
    return knex("likes").select("*");
  }

  static async likedCat(res) {
    const userId = res.userId;
    const imageId = res.imageId;

    // validate if the user is already liked the cat if it has, the user is unable to like it again.
    const isUserExist = await knex("users")
      .select("userId")
      .where("userId", userId);
    const isImageExist = await knex("cats")
      .select("imageId")
      .where("imageId", imageId);
    const isDuplicate = await knex("likes")
      .select("imageId", "userId")
      .where({ imageId, userId });

    if (!isUserExist.length) {
      console.error("User is not exist", userId);
      return { message: "User is not exist", status: 404 };
    }

    if (!isImageExist.length) {
      console.error("Image is not exist", imageId);
      return { message: "Image is not exist", status: 404 };
    }

    if (isDuplicate.length) {
      console.error("User already liked the image", userId);
      return { message: "User already liked the image", status: 409 };
    }

    const response = await knex("likes")
      .insert({
        userId,
        imageId,
        guestId: null,
        createdAt: knex.fn.now(),
      })
      .returning("*");

    if (response) {
      return { message: "SUCCESS", status: 200 };
    }
  }
}

module.exports = Likes;
