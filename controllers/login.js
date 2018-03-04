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

module.exports = (req, res) => {
  console.log(req.headers);
  if (req.headers.login === undefined || req.headers.pass === undefined) {
    e403(res, 1);
  } else {
    const body = req.headers;
		md5.string.quiet(body.pass, (err, passHash) => {
      if (err) {
        e500(res, err);
      } else {
        console.log(body.login + ';' + passHash);
        app.db.query(`SELECT id FROM users WHERE users.login="${body.login}" AND users.passhash="${passHash}"`, (err, data) => {
          if (err) {
            e500(res, err);
          } else if (data.length === 0) {
            e403(res, 2);
          } else {
            app.db.query(`SELECT accesstoken FROM accesstokens WHERE user=${data[0].id}`, (err, data) => {
              if (err) {
                e500(res, err);
              } else {
                res.status(200);
                res.send(data[0].accesstoken);
                res.end();
              }
            });
          }
        });
      }
   });
	}
}