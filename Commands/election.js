module.exports = {
    name: 'election',
    description: 'Conduct Election. Maximum of 9 Nominations',
    execute(message, adminOnly, cacheElection, Discord, prefix) {
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            message.react('❌');
            message.reply(adminOnly); 
            return;
        }
        var query = message.content.split(' ');
        if (query.length < 3) {
            message.react('❌');
            message.reply("No Position Specified"); 
            return;
        }
        query.shift();
        query.shift();
        var position = query.join(' ');
        cacheElection[message.guild.id] = {
            'Position': position,
            'isOngoing': true,
            'messageId' : '',
            'Nominees' : [/* name, voters */] 
        };
        const embed = new Discord.MessageEmbed()
        .setTitle(position)
        .setColor(3447003)
        .setDescription('Election initiated for the position of ' + position + '!' 
        + '\n\nNominate Someone by typing: ' 
        + prefix + ' nominate Name');
        message.react('😮');
        message.reply(embed);
    }
}