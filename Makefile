SHELL := /bin/bash

##########################################
# Modular commands
##########################################
.PHONY: build
build:
	echo "TODO: build"

.PHONY: deploy
deploy:
	echo "TODO: deploy"

.PHONY: clean
clean:
	rm -rf **/node_modules

##########################################
# Combined commands
##########################################
.PHONY: setup
setup: build deploy

.PHONY: teardown
teardown: clean

