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
 * Main function. Scrapes all matches for leagues in 'league' table. Populates table 'match'.
 */
async function main() {
	const leagues = await db.query(`SELECT * FROM league`);
	// for all available leagues
	for (let league of leagues) {
		// get rounds in season
		const rounds = await sportmonks.get(`v2.0/rounds/season/{season_id}`, { "season_id": league.season_id, "fixtures": true });
		// for all rounds in season
		for (let round of rounds.data) {
			// for all matches in round
			for (let match of round.fixtures.data) {
				// check that match is not yet exists
				const matches = await db.query(`SELECT id FROM ${env.DB_DATABASE}.match WHERE id = ?`, match.id);
				// if there is no such match then insert it to DB
				if (matches.length == 0) {
					const homeLeagueClub = (await db.query(`SELECT * FROM league_club WHERE league_id = ? AND club_id = ?`, [league.id, match.localteam_id]))[0];
					const awayLeagueClub = (await db.query(`SELECT * FROM league_club WHERE league_id = ? AND club_id = ?`, [league.id, match.visitorteam_id]))[0];
					await db.query(`INSERT INTO ${env.DB_DATABASE}.match SET ?`, {
						id: match.id,
						home_goals: match.scores.ft_score ? match.scores.localteam_score : null,
						away_goals: match.scores.ft_score ? match.scores.visitorteam_score : null,
						begin_at: match.time.starting_at.timestamp,
						home_league_club_id: homeLeagueClub.id,
						away_league_club_id: awayLeagueClub.id
					});
				} else {
					// update match details
					await db.query(`UPDATE ${env.DB_DATABASE}.match SET home_goals = ?, away_goals = ?, begin_at = ? WHERE id = ?`, [
						match.scores.ft_score ? match.scores.localteam_score : null,
						match.scores.ft_score ? match.scores.visitorteam_score : null,
						match.time.starting_at.timestamp,
						match.id
					]);
				}
			}
		}
	}
	db.end();
}
