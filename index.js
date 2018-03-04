global.app = {};
const express = require('express');
app.configs = require('./configs.json');

const fs = require('fs');

const mysql = require('mysql');
const connection = mysql.createConnection(app.configs.db);
connection.connect();
connection.query('SET NAMES utf8mb4', (err) => {
  if (err) console.log(err);
});
app.db = connection;

app.eventsListeners = {};
app.on = (eventCode, callback) => {
  if (app.eventsListeners[eventCode] === undefined)
  	app.eventsListeners[eventCode] = [callback];
  else
  	app.eventsListeners[eventCode].push(callback);
}
app.emit = (eventCode, data) => {
	if (app.eventsListeners[eventCode] !== undefined) {
	  for (let collback of app.eventsListeners[eventCode]) {
	  	collback(data);
	  }
	}
}
const controllersFiles = fs.readdirSync('./controllers');
app.controllers = {};
for (let controller of controllersFiles) {
  app.controllers[controller.replace('.js', '')] = require(`./controllers/${controller}`);
}

const botControllersFiles = fs.readdirSync('./botControllers');
app.botControllers = {};
for (let botController of botControllersFiles) {
  app.botControllers[botController.replace('.js', '')] = require(`./botControllers/${botController}`);
}

const loopFiles = fs.readdirSync('./loops');
for (let loop of loopFiles) {
  require(`./loops/${loop}`);
}

app.ex = express();
app.ex.use(express.static('public'));
app.ex.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.ex.use('/', require('./routers/api.js'));
app.ex.listen(3000);

const tgApi = require('node-telegram-bot-api');
app.bots = {};
app.db.query('SELECT id, botToken, paymentToken FROM organisations', (err, data) => {
	if (err) {
    console.log(err);
  } else {
    for (let org of data) {
      const botNumber = org.id;   
      app.bots[org.id] = {
        paymentToken: org.paymentToken,
        botToken: org.botToken,
        id: org.id,
        bot: new tgApi(org.botToken, {polling: true})
      };
      app.bots[org.id].bot.getMe().then(botData => {
        app.bots[org.id].username = botData.username;
      });
    }
    require('./routers/bots.js');
  }
});
