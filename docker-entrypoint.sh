#!/bin/sh
set -eu

node scripts/migrate.mjs
node scripts/seed.mjs
exec node server.js
