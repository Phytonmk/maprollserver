module.exports = (orgId, msg, username) => {
  app.db.query('SELECT COUNT(*) FROM messages', (err, data) => {
    if (!err) {
      const id = data[0]['COUNT(*)'];
      app.db.query(`INSERT INTO messages VALUES(${id}, "${msg.text}", ${orgId}, ${msg.chat.id}, "${username}", 0, 0)`, (err) => {
        if (err) {
          console.log(err);
        } else {
          app.emit('newMessage', {toOrg: true, org: orgId, buyer: msg.chat.id, text: msg.text, username});
        }
      });
    }
  });
}