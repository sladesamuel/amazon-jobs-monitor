# Amazon Jobs Monitor

A serverless solution that monitors the [Amazon Jobs board](https://amazon.jobs/en-gb) for newly posted jobs matching a specific job title (currently **Senior Solutions Architect**).

## Prerequisites

The following tools need to be installed to be able to build and deploy this project.

1. [Node Version Manager](https://github.com/nvm-sh/nvm#installing-and-updating) _alternately, you can simply install the version of Node.js that is specified in [.nvmrc](.nvmrc)_

## Getting started

To get started, once the [prerequisites](#prerequisites) are installed, run the following commands to build all the code and deploy it to your AWS Account.

```shell
# Optional: to make sure you're using the correct Node version
$ nvm install
$ nvm use

# If this is the first time running the project, you will need
# to run this command before deploying
$ make init

# Runs all build and deployment scripts
$ make setup
```

> Make sure that you have valid AWS credentials setup in the current shell session.

## Cleaning up

When you're done and no longer want the project running, run the following command in a terminal to fully teardown the entire project and delete all compiled binaries.

```shell
$ make teardown
```
