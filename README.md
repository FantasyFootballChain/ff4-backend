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

2. Setup DB credentials for migrations in `database.json`. Example:
```
{
	"dev": {
		"host": "localhost",
		"user": "user",
		"password": "password",
		"database": "db_name",
		"driver": "mysql",
		"multipleStatements": true
	}
}
```

3. Run DB migrations
```
./node_modules/.bin/db-migrate up
```

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)
