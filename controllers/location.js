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

module.exports = (req, res) => {
	if (req.headers.accesstoken === undefined) {
    e403(res, 1);
  } else {
    //latitude and longitude
    if (req.headers.latitude !== undefined && req.headers.longitude !== undefined) {
      app.db.query(`SELECT user FROM accesstokens WHERE accesstoken = "${req.headers.accesstoken}"`, (err, data) => {
        if (err) {
          e500(res, err);
        } else if (data.length === 0) {
          e403(res, 2);
        } else {
          const userId = data[0].user;
          app.db.query(`SELECT * FROM users WHERE id=${userId}`, (err, data) => {
            if (err) {
              e500(res, err);
            } else {
              const user = data[0];
              if (user.status !== 1) {
                e403(res, 3);
              } else {
                app.db.query(`UPDATE users SET latitude=${req.headers.latitude}, longitude=${req.headers.longitude} WHERE id=${userId}`, err => {
                  if (err) {
                    e500(res, err);
                  } else {
                    if (req.headers.orders !== undefined) {
                      const ordersList = req.headers.orders.split(',');
                      let queryText = `UPDATE orders SET status=1, currier=${userId}  WHERE (`;
                      let or = false;
                      for (let updatedOrderId of ordersList) {
                        if (or)
                          queryText += ' OR ';
                        or = true;
                        queryText += 'id=' + (updatedOrderId + '').replace(/[^0-9]/g, '') + ' ';   
                        app.emit('locationUpdate', {
                          orderId: updatedOrderId
                        });
                      };
                      queryText += `) AND status=0 AND seller=${user.org}`;
                      app.db.query(queryText, err => {
                        if (err)
                          console.log(err);
                      });
                    }
                    res.status(200);
                    res.end('');
                  }
                });
              } 
            }
          });
        }
      });
    } else {
      e500(res, 'wrong latitude or longitude');
    }
	}
}