const axios = require('axios');

const hoursOffset = 3;

app.controllers.formatTime = (secondsOffset) => {
  const now = new Date().getTime();
  const arriving = new Date(now + secondsOffset * 1000);
  let result = '';
  if ((arriving.getDate() + '').length === 1)
    result += '0';
  result += arriving.getDate();
  result += '.';
  if (((arriving.getMonth() + 1) + '').length === 1)
    result += '0';
  result += (arriving.getMonth() + 1);
  result += ' ';
  if (((arriving.getHours() + hoursOffset) + '').length === 1)
    result += '0';
  result += (arriving.getHours() + hoursOffset);
  result += ':';
  if (((arriving.getMinutes() + 1) + '').length === 1)
    result += '0';
  result += (arriving.getMinutes() + 1);
  return result;
}
app.on('locationUpdate', (updateData) => {
  app.db.query(`SELECT * FROM orders WHERE id=${updateData.orderId}`,  (err, data) => {
    if (!err) {
      for (let order of data) {
        app.db.query(`SELECT * FROM users WHERE id=${order.currier}`, (err, data) => {
          if (!err && data.length > 0) {
            const user = data[0];
            app.db.query(`SELECT * FROM livelocations WHERE chatId=${order.buyer} AND orderId=${order.id}`, (err, result) => {
              if (!err) {
                axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${user.latitude},${user.longitude}&` + 
                `destinations=${order.latitude},${order.longitude}&key=${app.configs.googleMapsApiKey}`).then(googleMapsResponse => {
                    // console.log(JSON.stringify(googleMapsResponse.data, null, 4))
                    let time, msgText;
                    if (googleMapsResponse.data !== undefined && googleMapsResponse.data.rows.length > 0 && googleMapsResponse.data.rows[0].elements[0].duration !== undefined) {
                      time = app.controllers.formatTime(googleMapsResponse.data.rows[0].elements[0].duration.value);
                      msgText = `*Расчётное время прибытия курьера*\n\`${time}\``;
                    } else {
                      msgText = `*Расчётное время прибытия курьера*\n🤪🤯`;
                    }
                    if (result.length === 0) {
                      app.bots[user.org].bot.sendLocation(order.buyer, user.latitude, user.longitude, {live_period: 86400}).then(locationMsg => {
                        app.bots[user.org].bot.sendMessage(order.buyer, msgText, {parse_mode: 'Markdown'}).then(infoMsg => {
                          app.db.query(`INSERT INTO livelocations VALUES(${order.buyer}, ${locationMsg.message_id}, ${infoMsg.message_id}, ${order.id})`);
                        });
                      });
                    } else {
                      axios.get(`https://api.telegram.org/bot${app.bots[user.org].botToken}/` + 
                      `editMessageLiveLocation?latitude=${user.latitude}&longitude=${user.longitude}&` +
                      `chat_id=${result[0].chatId}&message_id=${result[0].mapMessageId}&live_period=86400`).then(() => {}).catch(console.log);
                      app.bots[user.org].bot.editMessageText(msgText, {parse_mode: 'Markdown', chat_id: result[0].chatId, message_id: result[0].subtitleMessageId})
                      // axios.get(`https://api.telegram.org/bot${app.bots[user.org].botToken}/` + 
                      // `editMessageText?text=${msgText}&parse_mode=Markdown&` +
                      // `chat_id=${result[0].chatId}&message_id=${result[0].subtitleMessageId}`).then(() => {}).catch(console.log);
                    }

                }).catch(console.log);
              } else {
                console.log(err);
              }
            });
          } else {
            console.log(err);
          }
        });
      }
    } else {
      console.log(err);
    }
	});
	console.log(updateData);
});