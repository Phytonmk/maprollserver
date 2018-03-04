module.exports = (org, msg) => {
  app.db.query('SELECT COUNT(*) FROM messages', (err, data) => {
    if (!err) {
      const id = data[0]['COUNT(*)'];
      console.log(org);
      app.db.query(`INSERT INTO messages VALUES(${id}, "${msg.text}", ${org.id}, ${msg.chat.id}, 0, 0)`, (err) => {
        if (err) {
          console.log(err);
        } else {
          app.emit('newMessage', {toOrg: true, org: org.id, buyer: msg.chat.id, text: msg.text});
        }
      });
    }
  });
}