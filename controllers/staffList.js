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
            if (user.status < 3) {
              e403(res, 3);
            } else {
              const orgId = user.org;
              app.db.query(`SELECT * FROM users WHERE org=${orgId}`, (err, data) => {
                if (err) {
                  e500(res, err);
                } else {
                  const results = [];
                  for (let user of data) {
                    results.push({status: user.status, login: user.login});
                  }
                  res.status(200);
                  res.send(JSON.stringify(results));
                  res.end('');
                }
              });
            }
  		    }
      	});
      }
    });
  }
}