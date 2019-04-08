bin := node_modules/.bin/

now = `date -u +"%Y-%m-%dT%H:%M:%SZ"`
log = echo "$(now) $(1)"

# By default, make will run in silent mode
ifndef VERBOSE
.SILENT:
endif

# In layman's terms: node_modules directory depends on the state of package.json
# Make will compare their timestamps and only if package.json is newer, it will run this target.
node_modules: package.json
	$(call log,"Installing dependencies ...")
	npm install
	$(call log,"Dependencies installed.")

install: node_modules

lint:
	$(call log,"Running ESLint ...")
	$(bin)eslint --ext .js ./api ./core
	$(call log,"ESLint run completed.")

test: install
	$(call log,"Running tests ...")
	NODE_ENV=test $(bin)mocha --opts ./api/tests/mocha.opts ./api/tests
	$(call log,"Tests completed.")

coverage: install
	$(call log,"Generating coverage ...")
	NODE_ENV=test $(bin)nyc --report-dir api/coverage $(bin)mocha --opts ./api/tests/mocha.opts ./api/tests
	$(call log,"Coverage report generated.")

security-test:
	$(call log,"Running security test ...")
	$(bin)snyk test
	$(call log,"Security test completed.")

clean:
	$(call log,"Cleaning ...")
	rm -rf ./.nyc_output
	rm -rf ./api/coverage
	$(call log,"Clean done.")

run:
	node api/src/cluster.js | $(bin)bunyan

debug:
	node --inspect-brk api/src/app.js | $(bin)bunyan

watch:
	$(bin)nodemon --watch ./api/src --exec "node ./api/src/app.js | $(bin)bunyan"

# ------ Infrastructure commands ----------------------------------------------

infra:
	$(call log,"Starting services ...")
	docker-compose up -d --force-recreate
	$(call log,"Services started.")

infra-stop:
	$(call log,"Stopping services ...")
	docker-compose stop
	$(call log,"Services stopped.")

infra-restart: infra-stop infra

.PHONY: compile
	run
	debug
	watch
	lint
	test
	security-test
	clean
	infra
	infra-stop
	infra-restart
	db-migrate
	db-migrate-test
	db-reset
	db-reset-test
