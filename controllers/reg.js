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
  try {
    const body = req.headers;
    if (body.reg !== undefined &&
     (body.reg.orgName !== undefined || body.reg.status !== undefined && body.reg.orgId !== undefined)) {
      regUser(req, res, body);
    } else {
      e403(res, 1);
    }   
  } catch (e) {
    e500(res, e);
  }
}
const regUser = (req, res, body) => {
  app.db.query(`SELECT * FROM users WHERE login="${body.reg.login}"`, (err, data) => {
    if (err) {
      e500(res, err);
    } else {
      if (data.length !== 0) {
        e403(res, 2);
      } else {
        app.db.query(`SELECT COUNT(*) FROM users`, (err, data) => {
          if (err) {
            e500(res, err);
          } else {
            const userId = data[0]['COUNT(*)'] * 1;
            md5.string.quiet(body.reg.pass, (err, passHash) => {
              if (err) {
                e500(res, err);
              } else {
                app.db.query(`INSERT INTO users VALUES (${userId}, null,` + 
                  ` "${body.reg.login.toLowerCase()}", "${passHash}", 0, null, null)`, (err) => {
                  if (err) {
                    e500(res, err);
                  } else {
                    if (body.reg.orgName !== undefined) {
                      regOrg(req, res, body, userId);
                    } else if (body.reg.orgId !== undefined) {
                      setUserOrg(req, res, body, userId, body.reg.orgId, body.reg.status);
                    }
                  }
                });
              }
            });
          }
        });
      }
    }
  });
}

const regOrg = (req, res, body, ownerId) => {
  app.db.query(`SELECT COUNT(*) FROM organisations`, (err, data) => {
    if (err) {
      e500(res, err);
    } else {
      const id = data[0]['COUNT(*)'] * 1;
      app.db.query(`INSERT INTO organisations VALUES (${id}, ${ownerId},` + 
        ` "${body.reg.orgName}", "", 0, "", "")`, (err) => {
          if (err) {
            e500(res, err);
          } else {
            setUserOrg(req, res, body, ownerId, id, 3);
          }
      });
    }
  });
}

const setUserOrg = (req, res, body, userId, orgId, status) => {
  app.db.query(`UPDATE users SET org=${orgId}, status=${status} WHERE id=${userId}`, (err) => {
    if (err) {
      e500(res, err)
    } else {
      genaccesstoken(res, userId);
    }
  });
}

const genaccesstoken = (res, userId) => {
  const token = app.controllers.tokenGen();
  app.db.query(`INSERT  INTO accesstokens VALUES(${userId}, "${token}")`, err => {
    if (err) {
      e500(res, err)
    } else {
      res.send(token);
      res.status(200);
      res.end('');
    }
  });
}