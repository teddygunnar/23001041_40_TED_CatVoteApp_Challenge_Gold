const knex = require("../../config/db");

class Cats {
  // Will make a lot from this, probably with no update function
  static async getCats(userId) {
    const { rows } = await knex.raw(`
    select c."imageId", c."imageUrl",
    count(l."userId")::int as "numberOfLikes",
    bool_or(l."userId" = ${userId}) AS "userLiked"
    from cats c right join likes l on c."imageId" = l."imageId" 
    group by c."imageId"
      `);
    return rows;
  }

  static async insertCat(cat) {
    const { imageUrl } = cat;
    const _cat = {
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return await knex("cats").insert(_cat).returning("*");
  }

  static async deleteCat(imageId) {
    return await knex("cats").where("imageId", imageId).del();
  }
}

module.exports = Cats;
