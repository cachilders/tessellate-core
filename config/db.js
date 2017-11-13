const pgp = require('pg-promise')({});

const db = pgp({
  database : 'ebdb',
  host     : 'aa6nurrd0mhmx7.c6bfi1ziigsu.us-east-1.rds.amazonaws.com',
  password : 's3r4ph1m',
  port     : 5432,
  user     : 'cachilders',
});

module.exports = db;
