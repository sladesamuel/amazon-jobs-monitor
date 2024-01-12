MAKEFLAGS += --silent
SHELL := /bin/bash

##########################################
# Modular commands
##########################################
.PHONY: check-shell-args
check-shell-args:
	scripts/check-shell-args.sh

.PHONY: build
build:
	(cd functions/fetch-page-content; yarn install && yarn build)
	(cd functions/filter-results; yarn install && yarn build)
	(cd functions/generate-email; yarn install && yarn build)
	(cd infra; yarn install && yarn build)

.PHONY: test
test: build
	(cd functions/fetch-page-content; yarn --silent test)
	(cd functions/filter-results; yarn --silent test)
	(cd functions/generate-email; yarn --silent test)
	(cd infra; yarn --silent test)

.PHONY: plan
plan: check-shell-args
	(cd infra; yarn install && yarn cdk bootstrap -c phoneNumber=${MOBILE} -c emailAddress=${EMAIL})

.PHONY: deploy
deploy: check-shell-args
	(cd infra; yarn cdk deploy -c phoneNumber=${MOBILE} -c emailAddress=${EMAIL})

.PHONY: destroy
destroy: check-shell-args
	(cd infra; yarn cdk destroy -c phoneNumber=${MOBILE} -c emailAddress=${EMAIL})

.PHONY: clean
clean:
	rm -rf **/node_modules \
		functions/**/dist \
		functions/**/*.zip \
		infra/cdk.out

##########################################
# Combined commands
##########################################
.PHONY: setup
setup: build deploy

.PHONY: teardown
teardown: destroy clean

