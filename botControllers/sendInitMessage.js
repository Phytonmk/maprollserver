module.exports = (org, bot, query) => {
  app.db.query(`SELECT * FROM orders WHERE buyer=${query.message.chat.id} ORDER BY id DESC`, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      app.db.query(`SELECT * FROM users WHERE id=${data[0].currier}`, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          const orgId = data[0].org;
          app.db.query('SELECT COUNT(*) FROM messages', (err, data) => {
            if (!err) {
              const id = data[0]['COUNT(*)'];
              app.db.query(`INSERT INTO messages VALUES(${id}, "${query.message.reply_to_message.text}", ${orgId}, ${query.message.chat.id}, 0, 0)`, (err) => {
                if (err) {
                  console.log(err);
                } else {
                  app.emit('newMessage', {toOrg: true, org: orgId, buyer: query.message.chat.id, text: query.message.text});
                  bot.editMessageText('Отправлено. Вам скоро ответят 😊', {chat_id: query.message.chat.id, message_id: query.message.message_id});
                }
              });
            }
          });
        }
      });
    }
  });
}