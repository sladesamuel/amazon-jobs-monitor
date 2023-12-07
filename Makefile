SHELL := /bin/bash

##########################################
# Modular commands
##########################################
.PHONY: init
init:
	(cd infra; yarn install && yarn cdk bootstrap)

.PHONY: build
build:
	(cd functions/fetch-page-content; yarn install && yarn build)
	(cd functions/filter-results; yarn install && yarn build)
	(cd infra; yarn install && yarn build)

.PHONY: test
test: build
	(cd functions/fetch-page-content; yarn --silent test)
	(cd functions/filter-results; yarn --silent test)
	(cd infra; yarn --silent test)

.PHONY: deploy
deploy:
	(cd infra; yarn cdk deploy -c phoneNumber=${MOBILE})

.PHONY: destroy
destroy:
	(cd infra; yarn cdk destroy)

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

