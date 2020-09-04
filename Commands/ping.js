module.exports = {
    name: 'ping',
    description: "Ping the Bot",
    execute(message, args) {
        message.react('👍');
        message.reply('pong!');        
    }
}