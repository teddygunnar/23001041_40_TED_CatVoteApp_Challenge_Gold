const knex = require("../../config/db");

class Likes {
  static async likeCat(res) {
    const { userId, imageId } = res;
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

    const response = await knex("likes").insert({
      userId,
      imageId,
      guestId: null,
      createdAt: knex.fn.now(),
    });

    if (response) {
      return { message: "SUCCESS", status: 200 };
    }
  }

  static async unlikeCat(res) {
    const { userId, imageId } = res;
    if (userId && imageId) {
      const res = await knex("likes")
        .where({ imageId: imageId, userId: userId })
        .del();
      return { message: "Deleted", status: 200, data: res };
    }

    return { message: "Delete Failed", status: 404 };
  }

  static async getUpdatedLikeCount(imageId, userId) {
    const { rows } = await knex.raw(
      `select c."imageId", c."imageUrl",
      count(l."userId")::int as "numberOfLikes",
      bool_or(l."userId" = ${userId}) AS "userLiked"
      from cats c right join likes l on c."imageId" = l."imageId"
      where c."imageId" = ${imageId}
      group by c."imageId"`
    );

    return rows[0];
  }
}

module.exports = Likes;
