// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      port: 5432,
      database: "CatVotingApp",
      user: "postgres",
      password: "Semangat@1",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migration: {
      tableName: "knex_migrations",
    },
  },
};
