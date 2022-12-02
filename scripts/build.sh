echo ''
echo '########################   Building -- Yasgui --   ###########################'
cd Yasgui
yarn run build

cp -v build/yasgui.min.js ../ontotext-yasgui-web-component/src/components/yasgui/yasgui-script.js
sed -i '1s/^/export const YASGUI_MIN_SCRIPT = () => {\n /' ../ontotext-yasgui-web-component/src/components/yasgui/yasgui-script.js
printf "\n}" >> ../ontotext-yasgui-web-component/src/components/yasgui/yasgui-script.js
cp -v build/yasgui.min.css ../ontotext-yasgui-web-component/src/components/yasgui/yasgui.min.scss

cd ..

echo ''
echo '#######################  Building -- ontotext-yasgui-web-component --  ############################'
cd ontotext-yasgui-web-component
npm rum build