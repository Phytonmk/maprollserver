module.exports = (bot, msg) => {
	bot.sendMessage(msg.chat.id, 'Отправить это сообщение нашему оператору?', {reply_markup: {
    inline_keyboard: [
      [{text: 'Отправить ✉️', callback_data: 'sendMessage'}],
      [{text: 'Не отправлять ❌', callback_data: 'cancelSending'}]
    ]
  },
  reply_to_message_id: msg.message_id
  })
}