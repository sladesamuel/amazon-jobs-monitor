# Amazon Jobs Monitor

A serverless solution that monitors the [Amazon Jobs board](https://amazon.jobs/en-gb) for newly posted jobs matching a specific job title (currently **Solutions Architect**).

[![Solution Design](./images/Amazon%20Jobs%20Board%20Monitor%20-%20Solution%20design.jpg)](https://miro.com/app/board/uXjVNS3q0IE=/?share_link_id=842511830880)

## Prerequisites

The following tools need to be installed to be able to build and deploy this project.

1. [Node Version Manager](https://github.com/nvm-sh/nvm#installing-and-updating) _alternately, you can simply install the version of Node.js that is specified in [.nvmrc](.nvmrc)_

## Before you start

To run this app, you will need to either setup a [verified sandbox destination phone number](https://eu-west-2.console.aws.amazon.com/sns/v3/home?region=eu-west-2#/sms-sandbox/create-phone-number) (to receive SMS messages), or deploy the infrastructure into an AWS Account that is no longer using the [SMS Sandbox](https://docs.aws.amazon.com/sns/latest/dg/sns-sms-sandbox.html).

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

> Make sure that you have valid AWS credentials setup in the current shell session.
