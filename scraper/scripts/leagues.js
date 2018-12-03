const { SportmonksApi } = require("sportmonks");
const db = require("../helpers/db");
const env = require("../../env.js");

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
	let resp = await sportmonks.get('v2.0/leagues');
	await saveData(resp.data);
	for (let i = 2; i <= resp.meta.pagination.total_pages; i++) {
		resp = await sportmonks.get('v2.0/leagues', { page: i });
		await saveData(resp.data);
	}
	db.end();
}

/**
 * Saves leagues data to DB for 1 page
 * @param data
 */
async function saveData(data) {
	for (let leagueData of data) {
		// check that league is not yet exists
		let sql = `SELECT id FROM league WHERE id = ?`;
		const leagues = await db.query(sql, [leagueData.id]);
		// if there is no such league then save it to DB
		if (leagues.length == 0) {
			sql = `INSERT INTO league SET ?`;
			const data = {
				id: leagueData.id,
				name: leagueData.name,
				season_id: leagueData.current_season_id,
				country_id: leagueData.country_id
			}
			await (db.query(sql, data));
		}
	}
}
