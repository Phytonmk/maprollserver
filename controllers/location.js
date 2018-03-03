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
    if (req.body.latitude !== undefined && req.body.longitude !== undefined) {
      app.db.query(`SELECT user FROM accessTokens WHERE accessToken = "${req.headers.accesstoken}"`, (err, data) => {
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
              app.db.query(`UPDATE users SET latitude=${req.body.latitude}, longitude=${req.body.longitude} WHERE id=${userId}`, err => {
                if (err) {
                  e500(res, err);
                } else {
                  if (req.body.orders !== undefined) {
                    let queryText = 'UPDATE orders SET status = 1 WHERE (';
                    let or = false;
                    for (let updatedOrderId of req.body.orders) {
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
          });
        }
      });
    } else {
      e505(res, 'wrong latitude or longitude');
    }
	}
}