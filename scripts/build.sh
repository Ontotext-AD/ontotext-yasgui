echo ''
echo '########################   Building -- Yasgui --   ###########################'
cd Yasgui
yarn run build

mkdir -p ../ontotext-yasgui-web-component/src/components/yasgui/
cp -v build/yasgui.min.js ../ontotext-yasgui-web-component/src/components/yasgui/yasgui-script.js
printf "\nexport const YASGUI_MIN_SCRIPT = () => {console.info('YASGUI was imported')}" >> ../ontotext-yasgui-web-component/src/components/yasgui/yasgui-script.js
cp -v build/yasgui.min.css ../ontotext-yasgui-web-component/src/components/yasgui/yasgui.min.scss

cd ..

echo ''
echo '#######################  Building -- ontotext-yasgui-web-component --  ############################'
cd ontotext-yasgui-web-component
npm run build
