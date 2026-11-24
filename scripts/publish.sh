#!/bin/sh
# Publishes the web component to npm. Fails when `npm publish` fails, so the release
# job stops before it commits, tags and pushes a version that isn't on npm.
set -e

cd ontotext-yasgui-web-component

trap 'rm -f .npmrc' EXIT
echo "//registry.npmjs.org/:_authToken=${1}" > .npmrc
npm publish
