module.exports = {
    name: 'nominate',
    description: 'Nominate Someone for Election',
    execute(message, cacheElection, Discord, prefix) {
        if (!cacheElection[message.guild.id]) {
            message.react('❌');
            message.reply("No ongoing election. Initiate by typing " + prefix + " election position"); 
            return;
        }
        if (!cacheElection[message.guild.id]['isOngoing']) {
            console.log(cacheElection[message.guild.id]['isOngoing']);
            message.react('❌');
            message.reply("Nomination no longer ongoing"); 
            return;
        }
        var query = message.content.split(' ');
        if (query.length < 3) {
            message.react('❌');
            message.reply("No Name Specified"); 
            return;
        }
        query.shift();
        query.shift();
        var name = query.join(' ').toUpperCase();
        // console.log("length: " + cacheElection[message.guild.id]['Nominees'].length);

        if (cacheElection[message.guild.id]['Nominees'].length == 9) {
            message.react('❌');
            message.reply("Maximum of 9 nominations only"); 
            return;
        }
        // Nomination Check
        for (var y = 0; y < cacheElection[message.guild.id]['Nominees'].length; y++) {
            if (cacheElection[message.guild.id]['Nominees'][y]['Name'] == name) {
                message.react('❌');
                message.reply("Person already Nominated"); 
                return;
            }
        }
        cacheElection[message.guild.id]['Nominees'].push(
            {
                'Name' : name,
                'Voters' : []
            }
        );
        const embed = new Discord.MessageEmbed()
        .setTitle(name)
        .setColor(3447003)
        .setDescription(name + ' has been nominated for the position of ' + cacheElection[message.guild.id]['Position'] + '!' 
        + '\n\nNominate someone by typing: ' 
        + prefix + ' nominate Name' 
        +'\n\nWhen done type ' + prefix + ' nominationStop' 
        +'\n\nCurrent Nominees');
        for (var x = 0; x < cacheElection[message.guild.id]['Nominees'].length; x++) {
            embed.addFields({
                name: x + 1,
                value: cacheElection[message.guild.id]['Nominees'][x]['Name'],
                inline: true
            });
        }
        message.react('😮');
        message.reply(embed);
    }
}