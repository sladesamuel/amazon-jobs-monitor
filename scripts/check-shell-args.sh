#!/bin/bash

set -e

ERROR="\033[0;31m"
CLEAR="\033[0m"

if [ -z "$MOBILE" ];
then
  echo -e "${ERROR}MOBILE is missing from the env vars${CLEAR}"
  exit 1
fi

if [ -z "$EMAIL" ];
then
  echo -e "${ERROR}EMAIL is missing from the env vars${CLEAR}"
  exit 1
fi
