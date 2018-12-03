const mysql = require('mysql');
const util = require('util');
const env = require("../../env.js");

const conn = mysql.createConnection({
	host: env.DB_HOST,
	user: env.DB_USER,
	password: env.DB_PASSWORD,
	database: env.DB_DATABASE
});

conn.query = util.promisify(conn.query);

conn.connect();

module.exports = conn;
