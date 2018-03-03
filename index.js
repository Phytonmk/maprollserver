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
  	app.eventsListeners[eventCode] = [];
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

const loopFiles = fs.readdirSync('./loops');
for (let loop of loopFiles) {
  require(`./loops/${loop}`);
}

app.ex = express();
app.ex.use(express.static('public'));
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
        bot: new tgApi(org.botToken, {polling: false}
      )};
      app.bots[org.id].bot.getMe().then(botData => {
        app.bots[org.id].username = botData.username;
      });
    }
  }
});