mkdir client
cp -R ./scripts ./client
cp -R ./styles ./client
cp *.html ./client
cp -R ./images ./client
cp -R ./res ./client
cp lunches.json ./client
serverless client deploy
rm -rf client