/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("cats").del();
  await knex("cats").insert([
    {
      imageUrl:
        "https://i.kym-cdn.com/photos/images/original/002/496/287/ac2.jpg",
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
  ]);

  await knex("users").del();
  await knex("users").insert([
    {
      username: "danang",
      password: "test1234",
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    },
  ]);
};
