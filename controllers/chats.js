const e500 = (res, e) => {
  res.status(500);
  res.end('Internal server error');
  console.log(e);
}
const e403 = (res, place) => {
  res.status(403);
  res.end();
  console.log(`Error 403 [#${place}]`);
}

module.exports = {
	preview: (req, res) => {
    if (req.headers.accesstoken !== undefined) {
      app.db.query(`SELECT user FROM accesstokens WHERE accesstoken = "${req.headers.accesstoken}"`, (err, data) => {
        if (err) {
          e500(res, err);
        } else if (data.length === 0 || data[0].status < 2) {
          e403(res, 2);
        } else {
          const userId = data[0].user;
          app.db.query(`SELECT * FROM users WHERE id="${userId}"`, (err, data) => {
            if (err) {
              e500(res, err);
            } else {
              const user = data[0];
              app.db.query(`SELECT * FROM messages WHERE org=${user.org} GROUP BY buyer`, (err, data) => {
                if (err) {
                  e500(res, err);
                } else {
                  const result = [];
                  for (let lastMessage of data) {
                    result.push({from: lastMessage.buyer, text: lastMessage.text, username: lastMessage.username});
                  }
                  res.status(200);
                  res.send(JSON.stringify(result));
                  res.end('');
                }
              });
            }
          });
        }
      });
    } else {
      e403(res, 2);
    }
	},
  one: (req, res) => {
    if (req.headers.accesstoken !== undefined && req.headers.chatid !== undefined) {
      app.db.query(`SELECT user FROM accesstokens WHERE accesstoken = "${req.headers.accesstoken}"`, (err, data) => {
        if (err) {
          e500(res, err);
        } else if (data.length === 0 || data[0].status < 2) {
          e403(res, 2);
        } else {
          const userId = data[0].user;
          app.db.query(`SELECT * FROM users WHERE id="${userId}"`, (err, data) => {
            if (err) {
              e500(res, err);
            } else {
              const user = data[0];
              app.db.query(`SELECT * FROM messages WHERE org=${user.org} AND buyer=${req.headers.chatid} ORDER BY id DESC`, (err, data) => {
                if (err) {
                  e500(res, err);
                } else {
                  const result = [];
                  for (let message of data) {
                    result.push({from: message.buyer, text: message.text, fromorg: message.fromorg, username: message.username});
                  }
                  res.status(200);
                  res.send(JSON.stringify(result));
                  res.end('');
                }
              });
            }
          });
        }
      });
    } else {
      e403(res, 2);
    }
  },
  send: (req, res) => {
    if (req.headers.accesstoken !== undefined && req.headers.chatid !== undefined && req.body !== undefined) {
      app.db.query(`SELECT user FROM accesstokens WHERE accesstoken = "${req.headers.accesstoken}"`, (err, data) => {
        if (err) {
          e500(res, err);
        } else if (data.length === 0 || data[0].status < 2) {
          e403(res, 2);
        } else {
          const userId = data[0].user;
          app.db.query(`SELECT * FROM users WHERE id="${userId}"`, (err, data) => {
            if (err) {
              e500(res, err);
            } else {
              const user = data[0];
              app.db.query('SELECT COUNT(*) FROM messages', (err, data) => {
                if (!err) {
                  const id = data[0]['COUNT(*)'];
                  app.db.query(`INSERT INTO messages VALUES(${id}, "${req.body.text}", ${user.org}, ${req.headers.chatid}, "", 1, 0)`, (err) => {
                    if (err) {
                      e500(res, err);
                    } else {
                      res.status(200);
                      res.end('');
                    }
                  });
                } else {
                  e500(res, err);
                }
              });
            }
          });
        }
      });
    } else {
      e403(res, 2);
    }
  }
}