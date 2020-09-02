// Required Dependencies
const Discord  = require('discord.js');
const UtilityClass = require('./Classes/Utility.js');
const fs = require('fs');

// Instantiate Client
const client = new Discord.Client();
const utility = new UtilityClass(); 

try {
    // Commands Instantiation from Commands Folder
    client.commands = new Discord.Collection();
    const commandFiles = fs.readdirSync('./Commands/').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./Commands/${file}`);

        client.commands.set(command.name, command);
    }

    // Variables
    const botName = client.commands.get('config').bot_name;
    const prefix = client.commands.get('config').prefix;

    // Logic
    // When Ready
    client.once('ready', () => {
        console.log(utility.returnTimeUpdate() + botName + ' is online!');        
    });

    // New Member
    // Create an event listener for new guild members
    client.on('guildMemberAdd', member => {
        // Send the message to a designated channel on a server:
        const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
        if (!channel) return;
        channel.send(`Welcome to the server, ${member}`);
    });

    // When receiving a message
    client.on('message', message => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        // console.log(message.content);
        var args = message.content.split(" ");
        args.shift();

        // Debugging
        // console.log("arguments: " + args);
        // for (var x = 0; x < args.length; x++) {
        //     console.log(args[x]);
        // }

        // Queries
        // For One Command
        if (args.length == 1) {
            // Ping
            if (args[0].toLowerCase() === 'ping') {
                client.commands.get('ping').execute(message, args);           
            }
            // Info
            else if (args[0].toLowerCase() === 'info') {
                client.commands.get('info').execute(message, args);
            }
            // Help
            else if (args[0].toLowerCase() === 'help') {
                client.commands.get('help').execute(message, args);                
            }
            // Avatar
            else if (args[0].toLowerCase() === 'avatar') {
                client.commands.get('avatar').execute(message, args);                
            }
        } 

        // If input is not applicable
        else {
            message.channel.send('Sorry! I could\'nt understand ' + message.content + '! Type !rsub help for more information.');
        }
    });

    // Must Be Last Line. Code to Login Bot to Discord Server
    client.login(process.env.BOT_TOKEN);     
}
catch (err) {
    console.log(utility.returnTimeError() + err);
}
