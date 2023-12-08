const knex = require("../../config/db");

class User {
  static async getAllUser() {
    return knex("users").select("*");
  }

  static async getUserById(userId) {
    return knex("users").where({ userId }).first();
  }

  static async createUser(user) {
    const isUsernameTaken = await knex("users")
      .where({ username: user.username })
      .first();

    if (isUsernameTaken) {
      return { message: "Username is already taken", status: 409 };
    }
    return knex("users").insert(user).returning("*");
  }

  static async updateUser(userId, updatedUserData) {
    return knex("users")
      .where({ userId })
      .update(updatedUserData)
      .returning("*");
  }

  static async deleteUser(userId) {
    return knex("users").where({ userId }).del();
  }
}

module.exports = User;
