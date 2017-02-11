const pgp = require('pg-promise')()
const db = pgp(process.env.DATABASE_URL || 'postgres://tajenglish@localhost:5432/quedj');

module.exports = db;
