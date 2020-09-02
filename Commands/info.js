module.exports = {
    name: 'info',
    description: 'Info Command',
    execute(message, args) {
        // message.reply('Why is Raphael so Handsome?');
        message.reply({embed: {
            color: 3447003,
            description: "Why is Raphael so Handsome?"
        }});
    }
}