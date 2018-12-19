const express = require('express');

const db = require('../scraper/helpers/db');

const app = express();
const port = 3000;

app.use((req, res, next) => {
	res.append('Access-Control-Allow-Origin', ['*']);
	next();
});

app.get('/', (req, res) => res.send('It works!'));

app.get('/leagues', async (req, res) => {
	const leagues = await db.query(`
		SELECT
		league.id,
		league.name,
		league.season_id,
		league.country_id,
		season.name as season_name,
		country.full_name as country_name
		FROM league
		LEFT JOIN season ON season.id = league.season_id
		LEFT JOIN country ON country.id = league.country_id`
	);
	return res.json(leagues);
});

app.get('/players', async (req, res) => {
	const players = await db.query(`
		SELECT
		club_player.id,
		club_player.price,
		player.full_name,
		player.photo_url,
		player.position_id,
		player_position.name as position_name
		FROM club_player
		LEFT JOIN player ON player.id = club_player.player_id
		LEFT JOIN player_position ON player_position.id = player.position_id`
	);
	return res.json(players);
});

app.get('/players/:id', async (req, res) => {
	const players = await db.query(`
		SELECT
		club_player.id,
		club_player.price,
		player.full_name,
		player.photo_url,
		player.position_id,
		player_position.name as position_name
		FROM club_player
		LEFT JOIN player ON player.id = club_player.player_id
		LEFT JOIN player_position ON player_position.id = player.position_id
		WHERE club_player.id = ?`,
		req.params.id
	);
	if (players.length == 0) {
		res.status(400).send({ error: `Player with id ${req.params.id} not found` })
	} else {
		return res.json(players[0]);
	}
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
