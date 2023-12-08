//init knex
const knex = require("knex");
const knexfile = require("../knexfile");

//init db
const db = knex(knexfile.development);

module.exports = db;
