/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.bigIncrements("userId").primary();
      table.string("username");
      table.string("password");
      table.dateTime("createdAt");
      table.datetime("updatedAt");
    })
    .createTable("cats", (table) => {
      table.bigIncrements("imageId").primary();
      table.string("imageUrl");
      table.dateTime("updatedAt");
      table.dateTime("createdAt");
    })
    .createTable("likes", (table) => {
      table.bigIncrements("likeId").primary();
      table.bigInteger("userId").unsigned();
      table.foreign("userId").references("userId").inTable("users");
      table.bigInteger("imageId").unsigned();
      table.foreign("imageId").references("imageId").inTable("cats");
      table.timestamp("createdAt").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTable("likes"),
    knex.schema.dropTable("cats"),
    knex.schema.dropTable("users"),
  ]);
};
