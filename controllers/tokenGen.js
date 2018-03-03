const alpahbet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0987654321_';

module.exports = () => {
	let result = '';
  for (let i = 0; i < 64; i++) {
    if (Math.random() > 0.5)
      result +=  alpahbet[Math.floor(Math.random() * alpahbet.length)];
    else
      result +=  alpahbet[Math.floor(Math.random() * alpahbet.length)].toLowerCase();
  }
  return result;
}