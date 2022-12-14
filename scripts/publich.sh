cd ontotext-yasgui-web-component

echo //registry.npmjs.org/:_authToken=${1} > .npmrc && npm publis

rm -f .npmrc