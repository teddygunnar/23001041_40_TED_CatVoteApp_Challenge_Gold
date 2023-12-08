const knex = require("../../config/db");

class Cats {
  // Will make a lot from this, probably with no update function
  static async getCats() {
    const { rows } =
      await knex.raw(`SELECT cats."imageId", cats."imageUrl", likes."likeId", likes."userId" 
      FROM cats RIGHT JOIN likes 
      ON cats."imageId" = likes."imageId"`);
    return rows;
  }

  static async insertCat(cat) {
    console.log(cat);
    const { imageUrl } = cat;
    const _cat = {
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return await knex("cats").insert(_cat).returning("imageId");
  }

  static async getCatById(id) {
    return await knex("cats").select("*").where("imageId", id);
  }
}

module.exports = Cats;
