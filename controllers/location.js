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
                    if (req.headers.orders !== undefined && req.headers.orders.split(',').length > 0) {
                      let ordersList = req.headers.orders.split(',');
                      for (let i = 0; i < ordersList.length;) {
                        if (ordersList[i] === '')
                          ordersList.splice(i, 1);
                        else
                          i++;
                      }
                      if (ordersList.length > 0) {
                        let queryText = `UPDATE orders SET orders.status=1, orders.currier=${userId}  WHERE `;
                        let or = false;
                        const idsForEmmiting = [];
                        console.log(ordersList);
                        for (let updatedOrderId of ordersList) {
                          if (or)
                            queryText += ' OR ';
                          or = true;
                          idsForEmmiting.push(updatedOrderId);
                          queryText += 'orders.id=' + updatedOrderId;   
                          // queryText += 'id=' + (updatedOrderId + '').replace(/[^0-9]/g, '') + ' ';   
                        };
                        queryText += ` AND orders.status=0 AND orders.seller=${user.org}`;
                        console.log(queryText);
                        app.db.query(queryText, err => {
                          if (err) {
                            console.log(err);
                          } else {
                            for (let emmitId of idsForEmmiting) {
                              app.emit('locationUpdate', {
                                orderId: emmitId
                              });
                            }
                          }
                        });
                      }
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