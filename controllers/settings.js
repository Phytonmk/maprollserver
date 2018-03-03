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
  set: (req, res) => {
  	if (req.headers.accesstoken === undefined) {
      e403(res, 1);
    } else {
      app.db.query(`SELECT user FROM accesstokens WHERE accesstoken = "${req.headers.accesstoken}"`, (err, data) => {
        if (err) {
          e500(res, err);
        } else if (data.length === 0) {
          e403(res, 2);
        } else {
          const userId = data[0].user;
          app.db.query(`SELECT * FROM organisations WHERE owner = ${userId}`, (err, data) => {
            if (err) {
              e500(res, err);
            } else if (data.length === 0) {
              e500(res, '');
            } else {
              // *** GOVNOCODE ***
              const dbData = data[0];
              const settings = {};
              settings.title = dbData.title;
              settings.description = dbData.description;
              settings.balance = dbData.balance;
              settings.botToken = dbData.botToken;
              settings.paymentToken = dbData.paymentToken;
              if (req.body.title)
                settings.title = req.body.title;
              if (req.body.description)
                settings.description = req.body.description;
              if (req.body.balance)
                settings.balance = req.body.balance;
              if (req.body.botToken)
                settings.botToken = req.body.botToken;
              if (req.body.paymentToken)
                settings.paymentToken = req.body.paymentToken;
              app.db.query(`UPDATE organisations SET title="${settings.title}", ` +
                `description="${settings.description}",` + 
                ` balance="${settings.balance}", botToken="${settings.botToken}",` + 
                ` paymentToken="${settings.paymentToken}" WHERE owner = ${userId}`, (err) => {
                if (err) {
                  e500(res, err);
                } else {
                  res.status(200);
                  res.end('');
                }
              });
            }
          });
        }
      });
    }
  },
  get: (req, res) => {
    if (req.headers.accesstoken === undefined) {
      e403(res, 1);
    } else {
      app.db.query(`SELECT user FROM accesstokens WHERE accesstoken = "${req.headers.accesstoken}"`, (err, data) => {
        if (err) {
          e500(res, err);
        } else if (data.length === 0) {
          e403(res, 2);
        } else {
          app.db.query(`SELECT * FROM organisations WHERE owner = ${data[0].user}`, (err, data) => {
            if (err) {
              e500(res, err);
            } else if (data.length === 0) {
              e500(res, '');
            } else {
              const dbData = data[0];
              const settings = {};
              settings.title = dbData.title;
              settings.description = dbData.description;
              settings.balance = dbData.balance;
              settings.botToken = dbData.botToken;
              settings.paymentToken = dbData.paymentToken;
              res.status(200);
              res.send(JSON.stringify(settings));
              res.end();
            }
          });
        }
      });
    }
  }
}