# MaSo web

[![Build Status](https://travis-ci.org/snEk42/MaSo.svg?branch=master)](https://travis-ci.org/snEk42/MaSo)

## What's included
- Koa 2
- Mocha tests with Instanbul (Nyc) code coverage
- ESlint with STRV JavaScript rules
- Sequelize migrations
- Database initialization with Docker
- Swagger documentation
- Travis build configuration
- Snyk security check

## Running the project

### Prerequisites
- install Node.js current release (<https://nodejs.org/en/>)
- instal Docker (<https://docs.docker.com/engine/installation/mac/>)

### Run
1. `npm i` - to install Node.js packages
2. start Docker
3. `make infra` - to initialize project services (starts the Postgres database)
4. rename `.env-sample` file in the project root to `.env` and setup your connection string values (if you are running database with docker you can use default values)
5. `make db-migrate` - to migrate database to the latest version
6. `make run` - to start the API server
7. open <http://localhost:3000>

### Documentation
- run the project and open `http://localhost:3000/docs`

## Available commands

> To turn on make autocomplete put the code below into your `.bash_profile`
```
complete -W "\`grep -oE '^[a-zA-Z0-9_-]+:([^=]|$)' Makefile | sed 's/[^a-zA-Z0-9_-]*$//'\`" make
```

### Infrastructure:
- `make infra-restart` - restarts all project services
- `make infra-start` - starts all project services
- `make infra-stop` - stops all project services

### Code QA:
- `make lint` - runs ESlint
- `make test` - runs Mocha tests
- `make coverage` - generates Istanbul coverage
- `make clean` - removes generated files
- `make security-test` - runs security test

### Database:
- `make db-migrate` - runs sequelize database migrations (dev database)
- `make db-migrate-test` - the same as above for test database
- `make db-reset` - resets database into initial state (reverts all migrations, seeds the database and migrates to the latest version)
- `make db-reset-test` - the same as above for test database

### Server start:
- `make run` - runs the API server
- `make debug` - runs code in debug mode
- `make watch` - runs server in the watch mode (autorestarts when change is made)


## Integrations
Sendgrid (email service, email campaigns)
New Relic (monitoring)
Logentries (serchable logs)