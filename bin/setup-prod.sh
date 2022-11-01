#!/bin/bash
SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
cd "$SCRIPTPATH/.."
npm uninstall @skapoor8/loki
npm i @skapoor8/loki
npm ci
npx loki build