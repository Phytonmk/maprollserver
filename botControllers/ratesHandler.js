module.exports = (org, bot, query) => {
  console.log(query.message.chat.id);
  console.log(query.data.split('_')[2]);
	app.db.query((`SELECT * FROM orders WHERE buyer=${query.message.chat.id} AND` +
    ` id=${query.data.split('_')[2]}`), (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data.length !== 0) {
        const order = data[0];
        app.db.query(`SELECT * FROM rates WHERE buyer=${query.message.chat.id} AND orderId=${query.data.split('_')[2]}`, (err, data) => {
          if (err) {
            console.log(err)
          } else {
            if (data.length === 0) {
              app.db.query(`INSERT INTO rates VALUES(${query.data.split('_')[1]}, ${order.id}, ${order.currier}, ${order.buyer})`);
            } else {
              app.db.query(`UPDATE rates SET rate=${query.data.split('_')[1]} WHERE orderId=${order.id}`);
            }
            console.log(order.id);
            let inline_keyboard = [];
            switch(query.data.split('_')[1] * 1) {
              case 1:
                inline_keyboard = [
                  [{text: '[⭐️]', callback_data: 'rate_1_' + order.id}, {text: '⭐️⭐️', callback_data: 'rate_2_' + order.id}, {text: '⭐️⭐️⭐️', callback_data: 'rate_3'}],
                  [{text: '⭐️⭐️⭐️⭐️', callback_data: 'rate_4_' + order.id}, {text: '⭐️⭐️⭐️⭐️⭐️', callback_data: 'rate_5_' + order.id}]
                ];
                break;
              case 2:
                inline_keyboard = [
                  [{text: '⭐️', callback_data: 'rate_1_' + order.id}, {text: '[⭐️⭐️]', callback_data: 'rate_2_' + order.id}, {text: '⭐️⭐️⭐️', callback_data: 'rate_3'}],
                  [{text: '⭐️⭐️⭐️⭐️', callback_data: 'rate_4_' + order.id}, {text: '⭐️⭐️⭐️⭐️⭐️', callback_data: 'rate_5_' + order.id}]
                ];
                break;
              case 3:
                inline_keyboard = [
                  [{text: '⭐️', callback_data: 'rate_1_' + order.id}, {text: '⭐️⭐️', callback_data: 'rate_2_' + order.id}, {text: '[⭐️⭐️⭐️]', callback_data: 'rate_3'}],
                  [{text: '⭐️⭐️⭐️⭐️', callback_data: 'rate_4_' + order.id}, {text: '⭐️⭐️⭐️⭐️⭐️', callback_data: 'rate_5_' + order.id}]
                ];
                break;
              case 4:
                inline_keyboard = [
                  [{text: '⭐️', callback_data: 'rate_1_' + order.id}, {text: '⭐️⭐️', callback_data: 'rate_2_' + order.id}, {text: '⭐️⭐️⭐️', callback_data: 'rate_3'}],
                  [{text: '[⭐️⭐️⭐️⭐️]', callback_data: 'rate_4_' + order.id}, {text: '⭐️⭐️⭐️⭐️⭐️', callback_data: 'rate_5_' + order.id}]
                ];
                break;
              case 5:
                inline_keyboard = [
                  [{text: '⭐️', callback_data: 'rate_1_' + order.id}, {text: '⭐️⭐️', callback_data: 'rate_2_' + order.id}, {text: '⭐️⭐️⭐️', callback_data: 'rate_3'}],
                  [{text: '⭐️⭐️⭐️⭐️', callback_data: 'rate_4_' + order.id}, {text: '[⭐️⭐️⭐️⭐️⭐️]', callback_data: 'rate_5_' + order.id}]
                ];
                break;
            }
            bot.editMessageText('*Оценка качетсва доставки:*', {
              parse_mode: 'Markdown',
              chat_id: order.buyer,
              message_id: query.message.message_id,
              reply_markup: {inline_keyboard}
            });
          }
        });
      }
    }
  });
}