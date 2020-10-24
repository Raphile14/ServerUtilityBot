const reactionList = ['👍', '👈', '👉', '👆', '👇', '👊', '🤛', '🤜', '👐'];

module.exports = {
    name: 'nominationstop',
    description: 'Stop Nomination for Position',
    execute(message, cacheElection, Discord, prefix) {
        if (!cacheElection[message.guild.id]) {
            message.react('❌');
            message.reply("No ongoing election. Initiate by typing " + prefix + " election position"); 
            return;
        }
        if (!cacheElection[message.guild.id]['isOngoing']) {
            message.react('❌');
            message.reply("Election no longer ongoing."); 
            return;
        }
        if (cacheElection[message.guild.id]['Nominees'].length < 2) {
            message.react('❌');
            message.reply("Only " + cacheElection[message.guild.id]['Nominees'].length + ' person/people is/are nominated!\n' 
            + 'Nominate more by typing ' + prefix + ' nominate Name'); 
            return;
        }
        cacheElection[message.guild.id]['isOngoing'] = false;

        const embed = new Discord.MessageEmbed()
        .setTitle("Candidates!")
        .setColor(3447003)
        .setDescription('Here are the candidates for the position of ' + cacheElection[message.guild.id]['Position'] + '!' 
        + '\n\nVote your choice by pressing the corresponding emoji!' 
        +'\n\nWhen done type ' + prefix + ' electionStop' 
        +'\n\nCurrent Nominees');
        for (var x = 0; x < cacheElection[message.guild.id]['Nominees'].length; x++) {
            embed.addFields({
                name: cacheElection[message.guild.id]['Nominees'][x]['Name'],
                value: reactionList[x],
                inline: true
            });
        }
        message.reply(embed).then( sentEmbed => {
            for (var x = 0; x < cacheElection[message.guild.id]['Nominees'].length; x++) {
                sentEmbed.react(reactionList[x]);
            }
            // console.log("id: " + sentEmbed);
            cacheElection[message.guild.id]['messageId'] = sentEmbed;
        });        
    }
}