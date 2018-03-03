for (let o in app.bots) {
  const org = app.bots[o];
  const bot = org.bot
  bot.on('message', (msg) => {
    console.log(msg);
    if (msg.text !== undefined) {
      if (msg.text.substr(0, 7) === '/start ') {
        app.botControllers.start(bot, msg);
      }
    }
  });
  bot.on('callback_query', (query) => {
    console.log(query);
    if (query.data.substr(0, 4) === 'rate') {
      app.botControllers.ratesHandler(org, bot, query);
    }
  });
}