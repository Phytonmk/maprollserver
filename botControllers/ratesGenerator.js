const axios = require('axios');
app.on('orderClose', (orderId) => {
  app.db.query(`SELECT * FROM orders WHERE id=${orderId}`,  (err, data) => {
	 if (err) {
    console.log(err);
   } else {
      for (let order of data) {
        app.db.query(`SELECT * FROM users WHERE id=${order.currier}`, (err, data) => {
          if (!err) {
            const user = data[0];
            app.db.query(`SELECT * FROM livelocations WHERE chatId=${order.buyer} AND orderId=${order.id}`, (err, result) => {
              if (!err) {
                axios.get(`https://api.telegram.org/bot${app.bots[user.org].botToken}/` + 
                `stopMessageLiveLocation?chat_id=${result[0].chatId}&message_id=${result[0].mapMessageId}`
                ).then(() => {}).catch(console.log);
                app.bots[user.org].bot.editMessageText(`*Ваш заказ был доставлен* \`${app.controllers.formatTime(0)}\``, {
                  parse_mode: 'Markdown',
                  chat_id: result[0].chatId,
                  message_id: result[0].subtitleMessageId
                });
                setTimeout(() => {
                  app.bots[user.org].bot.sendMessage(order.buyer, '*Оценка качества доставки:*', {parse_mode: 'Markdown', reply_markup: {
                    inline_keyboard: [
                      [{text: '⭐️', callback_data: 'rate_1_' + order.id}, {text: '⭐️⭐️', callback_data: 'rate_2_' + order.id}, {text: '⭐️⭐️⭐️', callback_data: 'rate_3_' + order.id}],
                      [{text: '⭐️⭐️⭐️⭐️', callback_data: 'rate_4_' + order.id}, {text: '⭐️⭐️⭐️⭐️⭐️', callback_data: 'rate_5_' + order.id}]
                    ]
                  }})
                }, 3 * 1000);
              } else {
                console.log(err);
              }
            });
          } else {
            console.log(err);
          }
        });
      }
   }
  });
});