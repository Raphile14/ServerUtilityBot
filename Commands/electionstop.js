const reactionList = ['👍', '👈', '👉', '👆', '👇', '👊', '🤛', '🤜', '👐'];

module.exports = {
    name: 'electionstop',
    description: 'Stop Election and gather results',
    execute(message, cacheElection, Discord, prefix) {
        if (!cacheElection[message.guild.id]) {
            message.react('❌');
            message.reply("No ongoing election. Initiate by typing " + prefix + " election position"); 
            return;
        }
        if (cacheElection[message.guild.id]['isOngoing']) {
            message.react('❌');
            message.reply("Election is still ongoing. Stop by typing " + prefix + " nominationStop"); 
            return;
        }
        if (cacheElection[message.guild.id]['Nominees'].length < 2) {
            message.react('❌');
            message.reply("Only " + cacheElection[message.guild.id]['Nominees'].length + ' person/people is/are nominated!\n' 
            + 'Nominate more by typing ' + prefix + ' nominate Name'); 
            return;
        }
        var scores = [];
        for (var x = 0; x < cacheElection[message.guild.id]['Nominees'].length; x++) {
            scores[x] = {'Name' : cacheElection[message.guild.id]['Nominees'][x]['Name'], 'Score' : cacheElection[message.guild.id]['Nominees'][x]['Voters'].length, 'Voters' : cacheElection[message.guild.id]['Nominees'][x]['Voters']};
            // console.log(cacheElection[message.guild.id]['Nominees'][x]['Name']);
        }
        const embed = new Discord.MessageEmbed()
        .setTitle("Election Results for " + cacheElection[message.guild.id]['Position'] + "!")
        .setColor(3447003)
        .setDescription('Here are results');
        for (var x = 0; x < scores.length; x++) {
            embed.addFields({
                name: "Candidate: " + scores[x]['Name'],
                value: "Score: " + scores[x]['Score'],
                inline: true
            });
        }
        message.reply(embed);
        var text = "=====VOTER LIST=====\n\n";
        for (var x = 0; x < scores.length; x++) {
            text += "Candidate: " + scores[x]['Name'] 
            + "\nVoters ("+ scores[x]['Score'] + "):";
            for (var y = 0; y < scores[x]['Voters'].length; y++) {
               text += " " + `<@${scores[x]['Voters'][y][0]}> ` + " |";
            } 
            text += "\n\n";
        }
        message.channel.send(text)        
        // console.log(scores);       
        delete cacheElection[message.guild.id];
    }
}