const interval = 5000;

const tgApi = require('node-telegram-bot-api');
setInterval(() => {
	app.db.query('SELECT * FROM organisations', (err, data) => {
		if (!err) {
      for (let org of data) {
        const orgId = org.id * 1;
        if (app.bots[orgId] !== undefined) {
          if (org.botToken != app.bots[orgId].botToken) {
            app.bots[orgId].bot = new tgApi(org.botToken, {polling: true});
          }
        } else {
          app.bots[org.id] = {
            paymentToken: org.paymentToken,
            botToken: org.botToken,
            bot: new tgApi(org.botToken, {polling: true})
          };
        }
        app.bots[orgId].bot.getMe().then(botData => {
          app.bots[orgId].username = botData.username;
        });
        app.bots[orgId].paymentToken = org.paymentToken;
        app.bots[orgId].id = org.orgId;
      }
    } else {
      console.log(err);
    }
	});
}, interval);