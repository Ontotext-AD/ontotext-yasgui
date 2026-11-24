#!/bin/sh
#
# Publishes ontotext-yasgui-web-component to npm. Fails when `npm publish` fails, so the
# release job stops before it commits, tags and pushes a version that isn't on npm.
#
# Usage:
#   NPM_TOKEN=<token> npm run publish
#

set -eu

: "${NPM_TOKEN:?Set NPM_TOKEN to an npm token that can publish the package}"

cd ontotext-yasgui-web-component

trap 'rm -f .npmrc' EXIT
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc
npm publish
