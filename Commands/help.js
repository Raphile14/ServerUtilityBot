module.exports = {
    name: 'help',
    description: 'Help Command',
    execute(message, args) {
        message.reply({embed: {
            color: 3447003,
            description: 'Help List: '
        }});
    }
}