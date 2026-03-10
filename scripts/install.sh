echo ''
echo '########################   Installing -- ontotext-yasgui-web-component --   ###########################'
cd ontotext-yasgui-web-component
npm install

cd ..

echo ''
echo '#########################   Installing -- Yasgui --   ##########################'
cd Yasgui
yarn install

cd ..

echo ''
echo '#########################   Installing -- Conformance tests --   ##########################'
cd conformance-tests
npm install
