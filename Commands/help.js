module.exports = {
    name: 'help',
    description: 'Help Command',
    execute(message, args) {
        message.channel.send('Help List: ');
    }
}