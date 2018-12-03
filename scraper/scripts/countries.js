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
	let resp = await sportmonks.get('v2.0/countries');
	await saveData(resp.data);
	for (let i = 2; i <= resp.meta.pagination.total_pages; i++) {
		resp = await sportmonks.get('v2.0/countries', { page: i });
		await saveData(resp.data);
	}
	db.end();
}

/**
 * Saves countries data to DB for 1 page
 * @param data
 */
async function saveData(data) {
	for (let countryData of data) {
		// check that country is not yet exists
		let sql = `SELECT id FROM country WHERE id = ?`;
		const countries = await db.query(sql, [countryData.id]);
		// if there is no such country then save it to DB
		if (countries.length == 0) {
			sql = `INSERT INTO country SET ?`;
			const data = {
				id: countryData.id,
				short_name: countryData.extra ? countryData.extra.fifa : null,
				full_name: countryData.name,
				// TODO: fix
				// flag_svg: countryData.extra.flag
			}
			await (db.query(sql, data));
		}
	}
}
