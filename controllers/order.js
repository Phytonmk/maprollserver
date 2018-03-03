const md5 = require('nodejs-md5');

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
	get: (req, res) => {
    if (req.headers.accesstoken !== undefined) {
      app.db.query(`SELECT user FROM accessTokens WHERE accessToken = "${req.headers.accesstoken}"`, (err, data) => {
        if (err) {
          e500(res, err);
        } else if (data.length === 0) {
          e403(res, 2);
        } else {
          app.db.query(`SELECT * FROM users WHERE id=${data[0].user}`, (err,data) => {
            if (err) {
              e500(res, err);
            } else {
              const user = data[0];
              app.db.query(`SELECT * FROM orders WHERE seller=${user.org} AND id=${req.headers.order}`, (err, data) => {
                if (err) {
                  e500(res, err);
                } else if (data.length === 0) {
                  res.status(404);
                  res.end('');
                } else {
                  const result = {};
                  console.log(data[0]);
                  result.id = data[0].id;
                  result.title = data[0].title;
                  result.description = data[0].description;
                  result.status = data[0].status;
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
      e403(res, 1)
    }
	},
  list: (req, res) => {
    if (req.headers.accesstoken !== undefined) {
      app.db.query(`SELECT user FROM accessTokens WHERE accessToken = "${req.headers.accesstoken}"`, (err, data) => {
        if (err) {
          e500(res, err);
        } else if (data.length === 0) {
          e403(res, 2);
        } else {
          app.db.query(`SELECT * FROM users WHERE id=${data[0].user}`, (err,data) => {
            if (err) {
              e500(res, err);
            } else {
              const user = data[0];
              app.db.query(`SELECT * FROM orders WHERE seller=${user.org}`, (err, data) => {
                if (err) {
                  e500(res, err);
                } else {
                  const orders = [];
                  for (let order of data) {
                    orders.push({
                      id: order.id,
                      title: order.title,
                      description: order.description,
                      status: order.status
                    });
                  }
                  res.status(200);
                  res.send(JSON.stringify(orders));
                  res.end('');
                }
              });
            }   
          });
        }
      });
    } else {
      e403(res, 1)
    }
  },
	create: (req, res) => {
		if (req.headers.accesstoken !== undefined) {
      const order = req.body;
      app.db.query(`SELECT user FROM accessTokens WHERE accessToken = "${req.headers.accesstoken}"`, (err, data) => {
        if (err) {
          e500(res, err);
        } else if (data.length === 0) {
          e403(res, 2);
        } else {
          const userId = data[0].user;
          app.db.query(`SELECT * from organisations WHERE owner=${userId}`, (err, data) => {
            if (err) {
              e500(res, err);
            } else if (data.length === 0) {
              e403(res, 3);
            } else {
              const org = data[0];
              app.db.query('SELECT COUNT(*) FROM orders', (err, data) => {
                if (err) {
                  e500(res, err);
                } else {
                  const id = data[0]['COUNT(*)'] * 1;
                  md5.string.quiet(id + 'YeahRock!!!', (err, idHash) => {
                    if (err) {
                      e500(res, err);
                    } else {
                      app.db.query(`INSERT INTO orders VALUES(${id}, "${idHash}", null, null,` + 
                      ` ${org.id}, ${order.price}, "${order.description}", "${order.title}", 0)`, (err) => {
                        if (err) {
                          e500(res, err);
                        } else {
                          res.status(200);
                          const result = {
                            order: {
                              id,
                              link: `http://t.me/${app.bots[org.id * 1].username}?start=${idHash}`
                            }
                          }
                          res.send(JSON.stringify(result));
                          res.end('');
                          app.emit('newOrder', {order: result.order, org: org.id});
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      e403(res, 4)
    }
	},
	close: (req, res) => {

	}
}