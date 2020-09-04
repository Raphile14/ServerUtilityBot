module.exports = {
    name: 'info',
    description: "Returns Bot info",
    execute(message, Discord, description, args) {        
        const embed = new Discord.MessageEmbed()
        .setTitle('Information')
        .setColor(3447003)
        .setDescription(description);
        message.react('👍');    
        message.reply(embed);
    }
}