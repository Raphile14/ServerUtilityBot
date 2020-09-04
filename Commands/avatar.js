module.exports = {
    name: 'avatar',
    description: "Return caller's avatar",
    execute(message, args) {
        message.react('👍');
        message.reply(message.author.displayAvatarURL());        
        // message.reply({embed: {
        //     color: 3447003,
        //     description: message.author.displayAvatarURL()
        // }});
    }
}