module.exports = {
    name: 'donate',
    description: "Help the dev out!",
    execute(message, Discord, description, url, args) {        
        const embed = new Discord.MessageEmbed()
        .setTitle('Donate')
        .setURL(url)
        .setColor(3447003)
        .setDescription(description + "\n\n" + url);
        message.react('❤️');    
        message.reply(embed);
    }
}