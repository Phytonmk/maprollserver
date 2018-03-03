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
	if (req.headers.accesstoken !== undefined) {
    app.db.query(`SELECT user FROM accesstokens WHERE accesstoken="${req.headers.accesstoken}"`, (err, data) => {
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
            if (user.status < 3 || req.body.reg === undefined || req.body.reg.status === undefined) {
              e403(res, 3);
            } else {
              req.body.reg.orgId = user.org;
              app.controllers.reg(req, res);
            }
  		    }
	    	});
      }
    });
  }
}