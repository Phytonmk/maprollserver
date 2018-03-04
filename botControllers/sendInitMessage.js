module.exports = (org, bot, query, username) => {
  app.db.query(`SELECT * FROM orders WHERE buyer=${query.message.chat.id} ORDER BY id DESC`, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
    } else {
      const orgId = data[0].seller; 
      app.db.query('SELECT COUNT(*) FROM messages', (err, data) => {
        if (!err) {
          const id = data[0]['COUNT(*)'];
          app.db.query(`INSERT INTO messages VALUES(${id}, "${query.message.reply_to_message.text}", ${orgId}, ${query.message.chat.id}, "${username}", 0, 0)`, (err) => {
            if (err) {
              console.log(err);
            } else {
              app.emit('newMessage', {toOrg: true, org: orgId, buyer: query.message.chat.id, text: query.message.text, username});
              bot.editMessageText('Отправлено. Вам скоро ответят 😊', {chat_id: query.message.chat.id, message_id: query.message.message_id});
            }
          });
        }
      });
    }
  });
}