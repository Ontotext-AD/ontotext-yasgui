#!/bin/sh
# Publishes ontotext-yasgui-web-component to npm. $1 is the npm auth token.
# Exits non-zero if the publish fails, so the release pipeline stops before it commits and tags the release.
set -e

if [ -z "${1}" ]; then
  echo "publish.sh: no npm token given" >&2
  exit 1
fi

cd ontotext-yasgui-web-component

trap 'rm -f .npmrc' EXIT

echo "//registry.npmjs.org/:_authToken=${1}" > .npmrc
npm whoami
npm publish
