module.exports = {
    name: 'ping',
    description: 'Ping Command',
    execute(message, args) {
        message.reply('pong!');
    }
}