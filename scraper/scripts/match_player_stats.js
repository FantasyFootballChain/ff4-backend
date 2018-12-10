const { SportmonksApi } = require("sportmonks");
const db = require("../helpers/db");
const env = require("../../env");

const sportmonks = new SportmonksApi(env.SPORTMONKS_API_KEY);

// stats constants
const STAT_MINUTES_PLAYED = 1;
const STAT_GOALS_SCORED = 2;
const STAT_ASSISTS = 3;
const STAT_PENALTIES_EARNED = 4;
const STAT_BLOCKED_PENALTIES = 5;
const STAT_SAVES = 6;
const STAT_MISSED_PENALTIES = 7;
const STAT_YELLOW_CARDS = 8;
const STAT_RED_CARDS = 9;

try {
	seed().then(() => {
		main().then(() => {
			process.exit();
		});
	});
} catch (err) {
	console.log(err);
}

/**
 * Main function. Scrapes all match stats for players in 'match' table. Populates table 'match_player_stat' for all played matches that do not have stats yet.
 */
async function main() {
	let matchIds = [];
	// find matches that are already played
	const matchesPlayed = await db.query(`SELECT * FROM ${env.DB_DATABASE}.match WHERE home_goals IS NOT NULL`);
	// if match is without stats then add it to array to fetch stats from API
	for (let matchPlayed of matchesPlayed) {
		const matchStats = await db.query(`SELECT id FROM match_player_stat WHERE match_id = ?`, matchPlayed.id);
		if (matchStats.length == 0) matchIds.push(matchPlayed.id);
	}
	// transform match ids to array of chunks of size 25 that is API max
	let chunks = [];
	const chunksCount = Math.ceil(matchIds.length / 25);
	for (let i = 0; i < chunksCount; i++) {
		const beginIndex = i * 25;
		const endIndex = 25 + 25 * i;
		chunks.push(matchIds.slice(beginIndex, endIndex));
	}

	// TODO: delete
	chunks = [
		[10328705]
	];

	// for each chunk of 25 matches get stats
	for (let chunk of chunks) {
		const matches = await sportmonks.get(`v2.0/fixtures/multi/{match_ids_string}`, { "match_ids_string": chunk.join(), "lineup": true, "bench": true });
		// for each match
		for (let match of matches.data) {
			// combine main squad and players on bench
			const squad = match.lineup.data.concat(match.bench.data);
			// for each player save stats
			for (let playerData of squad) {
				await saveStat(playerData.player_id, playerData.team_id, match.season_id, match.id, STAT_MINUTES_PLAYED, playerData.stats.other.minutes_played);
				// TODO: add other stats
			}
		}
	}
}

/**
 * Saves player stat to DB
 */
async function saveStat(playerId, clubId, seasonId, matchId, statId, statValue) {

	// find club_player model
	let clubPlayer = (await db.query(`SELECT * FROM club_player WHERE club_id = ? AND player_id = ? AND season_id = ?`, [clubId, playerId, seasonId]))[0];

	// if there is no such club player then insert him into DB
	if (!clubPlayer) {
		// save player to DB
		const playerFullInfo = await sportmonks.get(`v2.0/players/{player_id}`, { "player_id": playerId });
		await db.query(`INSERT INTO player SET ?`, {
			id: playerId,
			full_name: playerFullInfo.data.fullname,
			photo_url: playerFullInfo.data.image_path,
			position_id: playerFullInfo.data.position_id,
			country_id: playerFullInfo.data.country_id
		});
		// save player to club_player table
		await db.query(`INSERT INTO club_player SET ?`, {
			price: Math.floor(Math.random() * 10) + 1, // TODO: get real price
			club_id: clubId,
			player_id: playerId,
			season_id: seasonId
		});
	}

	// if stat not exists then insert stat into DB
	clubPlayer = (await db.query(`SELECT * FROM club_player WHERE club_id = ? AND player_id = ? AND season_id = ?`, [clubId, playerId, seasonId]))[0];
	const matchPlayerStats = await db.query(`SELECT id FROM match_player_stat WHERE club_player_id = ? AND match_id = ? AND stat_id = ?`, [clubPlayer.id, matchId, statId]);
	if (matchPlayerStats.length == 0) {
		await db.query(`INSERT INTO match_player_stat SET ?`, {
			club_player_id: clubPlayer.id,
			match_id: matchId,
			stat_id: statId,
			value: statValue
		});
	} else {
		// update stat
		await db.query(`UPDATE match_player_stat SET value = ? WHERE id = ?`, [statValue, matchPlayerStats[0].id]);
	}
}

/**
 * Inserts initial data into 'stat' table
 */
async function seed() {
	const stats = [
		{ id: STAT_MINUTES_PLAYED, name: 'minutes_played', desc: 'Minutes played' },
		{ id: STAT_GOALS_SCORED, name: 'goals_scored', desc: 'Goals scored' },
		{ id: STAT_ASSISTS, name: 'assists', desc: 'Assists' },
		{ id: STAT_PENALTIES_EARNED, name: 'penalties_earned', desc: 'Penalties earned' },
		{ id: STAT_BLOCKED_PENALTIES, name: 'blocked_penalties', desc: 'Blocked penalties(keeper only)' },
		{ id: STAT_SAVES, name: 'saves', desc: 'Saves(keeper only)' },
		{ id: STAT_MISSED_PENALTIES, name: 'missed_penalties', desc: 'Missed penalties' },
		{ id: STAT_YELLOW_CARDS, name: 'yellow_cards', desc: 'Yellow cards' },
		{ id: STAT_RED_CARDS, name: 'red_cards', desc: 'Red cards' }
	];
	for (let stat of stats) {
		// check that stat not yet exists
		const stats = await db.query(`SELECT id FROM stat WHERE id = ?`, stat.id);
		// if there is no such stat then insert it to DB
		if (stats.length == 0) {
			await db.query(`INSERT INTO stat SET ?`, {
				id: stat.id,
				name: stat.name,
				desc: stat.desc
			});
		}
	}
}
