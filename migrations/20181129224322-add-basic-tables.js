'use strict';

const async = require('async');
const { getForeignKeySetup } = require('./helpers/helpers');

let dbm;
let type;
let seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = (options, seedLink) => {
	dbm = options.dbmigrate;
	type = dbm.dataType;
	seed = seedLink;
};

exports.up = (db, callback) => {
	async.series([
		db.createTable.bind(db, 'season', {
			id: { type: 'int', primaryKey: true, autoIncrement: true },
			name: 'string'
		}),
		db.createTable.bind(db, 'country', {
			id: { type: 'int', primaryKey: true, autoIncrement: true },
			flag_svg: 'text',
			short_name: 'string',
			full_name: 'string'
		}),
		db.createTable.bind(db, 'league', {
			id: { type: 'int', primaryKey: true, autoIncrement: true },
			name: 'string',
			country_id: getForeignKeySetup('league_country_id_fk', 'country'),
			season_id: getForeignKeySetup('league_season_id_fk', 'season')
		}),
		db.createTable.bind(db, 'player_position', {
			id: { type: 'int', primaryKey: true, autoIncrement: true },
			name: 'string'
		}),
		db.createTable.bind(db, 'player', {
			id: { type: 'int', primaryKey: true, autoIncrement: true },
			full_name: 'string',
			photo_url: 'text',
			country_id: getForeignKeySetup('player_country_id_fk', 'country'),
			position_id: getForeignKeySetup('player_position_id_fk', 'player_position')
		}),
		db.createTable.bind(db, 'club', {
			id: { type: 'int', primaryKey: true, autoIncrement: true },
			name: 'string',
			photo_url: 'text'
		}),
		db.createTable.bind(db, 'club_player', {
			id: { type: 'int', primaryKey: true, autoIncrement: true },
			price: 'decimal',
			club_id: getForeignKeySetup('club_player_club_id_fk', 'club'),
			player_id: getForeignKeySetup('club_player_player_id_fk', 'player'),
			season_id: getForeignKeySetup('club_player_season_id_fk', 'season'),
		}),
		db.createTable.bind(db, 'league_club', {
			id: { type: 'int', primaryKey: true, autoIncrement: true },
			league_id: getForeignKeySetup('league_club_league_id_fk', 'league'),
			club_id: getForeignKeySetup('league_club_club_id_fk', 'club')
		}),
		db.createTable.bind(db, 'match', {
			id: { type: 'int', primaryKey: true, autoIncrement: true },
			begin_at: 'int',
			home_goals: 'int',
			away_goals: 'int',
			home_league_club_id: getForeignKeySetup('match_home_league_club_id_fk', 'league_club'),
			away_league_club_id: getForeignKeySetup('match_away_league_club_id_fk', 'league_club')
		}),
		db.createTable.bind(db, 'stat', {
			id: { type: 'int', primaryKey: true, autoIncrement: true },
			name: 'string',
			desc: 'text'
		}),
		db.createTable.bind(db, 'match_player_stat', {
			id: { type: 'int', primaryKey: true, autoIncrement: true },
			value: 'int',
			match_id: getForeignKeySetup('match_player_stat_match_id_fk', 'match'),
			club_player_id: getForeignKeySetup('match_player_stat_club_player_id_fk', 'club_player'),
			stat_id: getForeignKeySetup('match_player_stat_stat_id_fk', 'stat')
		}),
		db.createTable.bind(db, 'user', {
			id: { type: 'int', primaryKey: true, autoIncrement: true },
			name: 'string'
		}),
		db.createTable.bind(db, 'message', {
			id: { type: 'int', primaryKey: true, autoIncrement: true },
			msg: 'text',
			user_id: getForeignKeySetup('message_user_id_fk', 'user')
		}),
	], callback);
};

exports.down = (db, callback) => {
	async.series([
		db.dropTable.bind(db, 'message'),
		db.dropTable.bind(db, 'user'),
		db.dropTable.bind(db, 'match_player_stat'),
		db.dropTable.bind(db, 'stat'),
		db.dropTable.bind(db, 'match'),
		db.dropTable.bind(db, 'league_club'),
		db.dropTable.bind(db, 'club_player'),
		db.dropTable.bind(db, 'club'),
		db.dropTable.bind(db, 'player'),
		db.dropTable.bind(db, 'player_position'),
		db.dropTable.bind(db, 'league'),
		db.dropTable.bind(db, 'season'),
		db.dropTable.bind(db, 'country')
	], callback);
};

exports._meta = {
	"version": 1
};
