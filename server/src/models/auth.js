const knex = require("../../config/db");

class Auth {
  static async getUser(username) {
    return knex("users")
      .select("username", "password", "userId")
      .where("username", username);
  }
}

module.exports = Auth;
