const { SportmonksApi } = require("sportmonks");
const db = require("../helpers/db");
const env = require("../../env");

const sportmonks = new SportmonksApi(env.SPORTMONKS_API_KEY);

try {
	main();
} catch (err) {
	console.log(err);
}

/**
 * Main function
 */
async function main() {
	const resp = await sportmonks.get('v2.0/seasons');
	for (let seasonData of resp.data) {
		// check that season is not yet exists
		let sql = `SELECT id FROM season WHERE id = ?`;
		const seasons = await db.query(sql, [seasonData.id]);
		// if there is no such season then save it to DB
		if (seasons.length == 0) {
			sql = `INSERT INTO season SET ?`;
			const data = {
				id: seasonData.id,
				name: seasonData.name
			}
			await (db.query(sql, data));
		}
	}
	db.end();
}
