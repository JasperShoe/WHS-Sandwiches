mkdir client
cp -R ./scripts ./client
cp -R ./styles ./client
cp *.html ./client
cp -R ./images ./client
serverless client deploy
rm -rf client