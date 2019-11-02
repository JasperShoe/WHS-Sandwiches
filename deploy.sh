mkdir client
cp -R ./scripts ./client
cp -R ./styles ./client
cp *.html ./client
cp -R ./images ./client
cp user_types.json ./client
cp lunches.json ./client
cp 2019-20_calendar.ics ./client
cp blacklist ./client
cp whitelist ./client
cp letter_days.ics ./client
cp blacklist ./client
serverless client deploy
rm -rf client