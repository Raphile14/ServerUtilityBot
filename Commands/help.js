module.exports = {
    name: 'help',
    description: 'Help Command',
    execute(message, Discord, prefix, commandContainer, args) {
        const embed = new Discord.MessageEmbed()
        .setTitle('Help')
        .setColor(3447003)
        .setDescription('Prefix: ' + prefix + '\n\n ' 
        + 'How to register? \n\nType ' + prefix + 'register YourStudentNumber Program YearLevel MCMEmail Name'
        + '\n\nExample: \n\n' + prefix + ' register 2018120303 CS 3 rlDalangin@mcm.edu.ph Dalangin, Raphael Loren (Labasano)' 
        + '\n\nStrictly follow the format.'
        + '\n\nExample Command for other actions: ' + prefix + ' ping \nList of Commands:');
        for (const command in commandContainer) {
            if (command !== "config") {
                embed.addFields({
                    name: `${commandContainer[command].name}`,
                    value: `${commandContainer[command].description}`,
                    inline: true
                });
            }            
        }
        message.react('👍');
        message.reply(embed);
    }
}