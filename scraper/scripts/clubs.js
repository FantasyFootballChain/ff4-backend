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
 * Main function. Scrapes all teams for leagues from 'league' table
 */
async function main() {
	let sql = `SELECT * FROM league`;
	const leagues = await db.query(sql);
	// for all available leagues
	for (let league of leagues) {
		const resp = await sportmonks.get('v2.0/teams/season/{season}', { season: league.season_id, include: `country:filter(id|${league.country_id})` });
		for (let clubData of resp.data) {
			// check that club is not yet exists
			sql = `SELECT id FROM club WHERE id = ?`;
			const clubs = await db.query(sql, clubData.id);
			// if there is no such club then save it to DB
			if (clubs.length == 0) {
				sql = `INSERT INTO club SET ?`;
				const data = {
					id: clubData.id,
					name: clubData.name,
					photo_url: clubData.logo_path
				};
				await (db.query(sql, data));
			}
		}
	}
	db.end();
}
