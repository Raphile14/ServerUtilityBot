module.exports = {
    name: 'avatar',
    description: 'Avatar Command',
    execute(message, args) {
        message.reply(message.author.displayAvatarURL());
        // message.reply({embed: {
        //     color: 3447003,
        //     description: message.author.displayAvatarURL()
        // }});
    }
}