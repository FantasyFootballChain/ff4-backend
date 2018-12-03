const env = require("./env.js");

module.exports = {
	"dev": {
		"host": env.DB_HOST,
		"user": env.DB_USER,
		"password": env.DB_PASSWORD,
		"database": env.DB_DATABASE,
		"driver": "mysql",
		"multipleStatements": true
	}
}
