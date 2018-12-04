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
 * Main function. Scrapes all players for clubs from 'league_club' table. Populates tables: 'player_position', 'player', 'club_player'.
 */
async function main() {
	const leagueClubs = await db.query(`SELECT * FROM league_club`);
	// for all available leagueClubs
	for (let leagueClub of leagueClubs) {
		// load players from club
		const resp = await sportmonks.get(`v2.0/teams/{team_id}`, { "team_id": leagueClub.club_id, "squad.position,squad.player": true });
		for (let player of resp.data.squad.data) {
			// check that player is not yet exists
			const players = await db.query(`SELECT id FROM player WHERE id = ?`, player.player_id);
			// if there is no such player then save it to DB
			if (players.length == 0) {
				// if there is no such player position then save it to DB
				const playerPositions = await db.query(`SELECT id FROM player_position WHERE id = ?`, player.position_id);
				if (playerPositions.length == 0) {
					await (db.query(`INSERT INTO player_position SET ?`, {
						id: player.position_id,
						name: player.position.data.name
					}));
				}
				// save player to DB
				const league = (await db.query(`SELECT * FROM league WHERE id = ?`, leagueClub.league_id))[0];
				await db.query(`INSERT INTO player SET ?`, {
					id: player.player_id,
					full_name: player.player.data.fullname,
					photo_url: player.player.data.image_path,
					position_id: player.position_id,
					country_id: league.country_id
				});
				// save player to club_player table
				await db.query(`INSERT INTO club_player SET ?`, {
					price: null, // TODO
					club_id: leagueClub.club_id,
					player_id: player.player_id,
					season_id: league.season_id
				});
			}
		}
	}
	db.end();
}
