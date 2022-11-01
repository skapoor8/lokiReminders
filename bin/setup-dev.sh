#!/bin/bash
SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
npm uninstall @skapoor/loki
npm i --save "$SCRIPTPATH/../.."
cd ..
npm ci
cd demo
npm ci
npx loki build