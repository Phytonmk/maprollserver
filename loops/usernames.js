const interval = 5000;

const tgApi = require('node-telegram-bot-api');
setInterval(() => {
	app.db.query('SELECT * FROM organisations', (err, data) => {
		if (!err) {
      for (let org of data) {
        const orgId = org.id * 1;
        if (app.bots[orgId] !== undefined) {
          if (org.botToken != app.bots[orgId].botToken) {
            app.bots[orgId].bot = new tgApi(org.botToken, {polling: false});
          }
        } else {
          app.bots[org.id] = {
            paymentToken: org.paymentToken,
            bot: new tgApi(org.botToken, {polling: false})
          };
        }
        app.bots[orgId].bot.getMe().then(botData => {
          app.bots[orgId].username = botData.username;
        });
        app.bots[orgId].paymentToken = org.paymentToken;
      }
    } else {
      console.log(err);
    }
	});
}, interval);