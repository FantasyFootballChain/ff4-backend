# Backend for fantasy football chain

Server and oracle for fantasy football chain

## How to deploy
1. Setup DB credentials for REST server in `src/datasources/db.datasource.json`. Example:
```
{
  "name": "db",
  "connector": "mysql",
  "url": "",
  "host": "localhost",
  "port": 3306,
  "user": "username",
  "password": "password",
  "database": "db_name"
}
```

2. Setup environment variables in `env.js`. Example:
```
module.exports = {
	DB_HOST: "host",
	DB_USER: "username",
	DB_PASSWORD: "password",
	DB_DATABASE: "db_name",
	SPORTMONKS_API_KEY: "api_key"
};
```

3. Run DB migrations
```
./node_modules/.bin/db-migrate --config database.js up
```

## Scraper for [Sportmonks API](https://www.sportmonks.com)
Add to cron the following scripts to parse data and save it to DB:
```
node scraper/scripts/seasons.js
node scraper/scripts/countries.js
node scraper/scripts/leagues.js
node scraper/scripts/clubs.js
node scraper/scripts/players.js
```

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)
