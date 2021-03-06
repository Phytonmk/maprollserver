const express = require('express')
const bodyParser = require('body-parser');
const router = express.Router()
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(function timeLog (req, res, next) {
  console.log('----');
  console.log(req.headers);
  console.log(req.body);
  console.log(`[${new Date}] REQUEST TO "${req.url}"`);
  next();
})
const api = express.Router();
router.use('/api/v1.0/', api);
api.post('/reg', app.controllers.reg); // login and password - returns access token 
api.post('/login', app.controllers.login); // login and password - returns access token
api.get('/settings', app.controllers.settings.get); // access token - returns serialized JSON
api.post('/settings', app.controllers.settings.set); // access token, serialized JSON
api.get('/chatsPreview', app.controllers.chats.preview); // access token - returns JSON array of objects {name, order, lastMessage, unreadMessages(number)}
api.get('/chat', app.controllers.chats.one); // access token, JSON {chatId, offset, limit} - returns JSON array of messages {date, from, fromPic, text}
api.post('/message', app.controllers.chats.send); // access token, chatid, text
// api.put('/courier', app.controllers.courier); // access token, coureir name - returns couriers list
// api.delete('/courier', app.controllers.courier); // access token, courier id
// api.get('/couriers', app.controllers.courier); // access token - return couriers list 
// api.update('/courier', app.controllers.courier); // access token - return couriers list [{name, id, login & pass (if auto generated)}]
api.get('/staff', app.controllers.staffList); // access token
api.post('/regStaff', app.controllers.regStaff); // access token
api.put('/location', app.controllers.location); // access token
api.get('/order', app.controllers.order.get);
api.get('/orders', app.controllers.order.list);
api.post('/order', app.controllers.order.create);
api.post('/closeOrder', app.controllers.order.close);
module.exports = router;