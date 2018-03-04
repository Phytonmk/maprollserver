module.exports = (bot, msg) => {
	const orderHash = msg.text.split(' ')[1];
	app.db.query(`SELECT * FROM orders WHERE hash="${orderHash}"`, (err, data) => {
		if (err) {
			console.log(err);
		} else if (data.length === 0) {
			bot.sendMessage(msg.chat.id, 'Заказ не найден(\nВероятно ссылка уже не работает');
		} else {
			const order = data[0];
			bot.sendMessage(msg.chat.id, `*Ваш заказ:* \`#${order.id}\`\n\n${order.description}\n\n` + 
			`Как только курьер возьмёт ваш заказ, бот пришлёт карту с его передвиженями.\n` +
			`При появлении любых вопросов просто напишите их в этот чат!`, {parse_mode: 'Markdown'});
			app.db.query(`UPDATE orders SET orders.buyer=${msg.chat.id}, orders.status=1 WHERE orders.id=${order.id}`, (err) => {
				if (err)
					console.log(err);
			});
		}
	});
}