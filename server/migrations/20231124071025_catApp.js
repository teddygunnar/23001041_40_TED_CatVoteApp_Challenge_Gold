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
    .createTable("guests", (table) => {
      table.bigIncrements("guestId").primary();
      table.dateTime("createdAt");
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
      table.bigInteger("guestId").unsigned();
      table.foreign("guestId").references("guestId").inTable("guests");
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
    knex.schema.dropTable("guests"),
    knex.schema.dropTable("users"),
  ]);
};
