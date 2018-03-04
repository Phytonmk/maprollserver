const interval = 10 * 1000;

setInterval(() => {
	app.db.query('SELECT * FROM messages WHERE messages.read=0 AND messages.fromorg=1;', (err, data) => {
		if (!err) {
      for (let message of data) {
        console.log(message);
        const msgText = '`Ответ оператора`\n' + message.text;
        app.bots[message.org].bot.sendMessage(message.buyer, msgText, {parse_mode: 'Markdown', reply_markup: {
          force_reply: true
        }}).then(() => {
          app.db.query(`UPDATE messages SET messages.read=1 WHERE messages.id=${message.id}`, (err) => {
            if (err)
              console.log(err);
          });
        });
      }
    } else {
      console.log(err);
    }
	});
}, interval);