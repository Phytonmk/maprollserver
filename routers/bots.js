const genUserName = (chat) => {
  let result = chat.first_name;
  if (chat.last_name)
    result += ' ' + chat.last_name;
  if (chat.username)
    result += ' @' + chat.username;
  result = result.replace(/[^\sa-z0-9абвгдеёжиклмнопрстуфхцчшщьыъэюя]/gi, '');
  return result;
}

for (let o in app.bots) {
  const org = app.bots[o];
  const orgId = org.id
  const bot = org.bot
  bot.on('message', (msg) => {
    if (msg.text !== undefined) {
      if (msg.text.substr(0, 7) === '/start ') {
        app.botControllers.start(bot, msg);
      } else {
        if (!msg.reply_to_message) {
          app.botControllers.messageCheck(bot, msg);
        } else {
          app.botControllers.sendMessage(orgId, msg, genUserName(msg.chat));
        }
      }
    }
  });
  bot.on('callback_query', (query) => {
    console.log(query);
    if (query.data.substr(0, 4) === 'rate') {
      app.botControllers.ratesHandler(org, bot, query);
    } else if (query.data === 'cancelSending') {
      bot.deleteMessage(query.message.chat.id, query.message.message_id);
    } else if (query.data === 'sendMessage') {
      app.botControllers.sendInitMessage(org, bot, query, genUserName(query.message.chat));
    }
  });
}