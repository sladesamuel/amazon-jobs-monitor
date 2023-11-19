SHELL := /bin/bash

##########################################
# Modular commands
##########################################
.PHONY: build
build:
	(cd functions/fetch-page-content; yarn install && yarn build)

.PHONY: deploy
deploy:
	echo "TODO: deploy"

.PHONY: clean
clean:
	rm -rf functions/**/node_modules \
		functions/**/dist \
		functions/**/*.zip

##########################################
# Combined commands
##########################################
.PHONY: setup
setup: build deploy

.PHONY: teardown
teardown: clean

