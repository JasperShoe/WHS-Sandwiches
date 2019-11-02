mkdir client
cp -R ./scripts ./client
cp -R ./styles ./client
cp *.html ./client
cp -R ./images ./client
cp user_types.json ./client
cp lunches.json ./client
<<<<<<< HEAD
cp 2019-20_calendar.ics ./client
cp blacklist ./client
cp whitelist ./client
=======
cp letter_days.ics ./client
cp blacklist ./client
>>>>>>> bea4bfda03b01ecc8817e8ff7e2e78e5288807ea
serverless client deploy
rm -rf client