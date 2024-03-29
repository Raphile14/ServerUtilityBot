// Required Dependencies
const Discord = require('discord.js');
const UtilityClass = require('./Classes/Utility.js');
const Mongo = require('./Classes/Mongo.js');
const fs = require('fs');

// Instantiate Client
const client = new Discord.Client();
const utility = new UtilityClass(); 

//Storage
// Name and Description Holder
var commandContainer = new Object();
// For Welcome Messages
var cacheWelcome = {/* guild.id (key) : {'channelId': channel id (String), 'Text': Welcome Message (String)} */};
// For Data Storage
var cacheData = {/* guild.id (key) : {'Worksheet Data': data (json), 'Repeated Use': false (Boolean), 'Important Columns': [] (Array)} */};
// If Selecting Data (TEMPORARY)
var cacheInitiating = {/* guild.id (key) : {'isSelecting' : false (Boolean)} */};
// Election Cache
var cacheElection = {/* guild.id (key) : {'Position' : posName (String), isOngoing : false (Boolean), ('Nominees' : Name (String)) : Voters [] Array} */};

try {
    // Commands Instantiation from Commands Folder
    client.commands = new Discord.Collection();
    const commandFiles = fs.readdirSync('./Commands/').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./Commands/${file}`);

        client.commands.set(command.name, command);
        commandContainer[command.name] = {name: command.name, description: command.description}        
    }

    // Variables
    const botName = client.commands.get('config').bot_name;
    const prefix = client.commands.get('config').prefix;
    const description = client.commands.get('config').description;
    const donationURL = client.commands.get('config').donationURL;
    const donationDescription = client.commands.get('config').donation;
    const mongoPath = client.commands.get('config').mongoPath;
    const adminOnly = client.commands.get('config').messageAdminOnly;

    const reactionList = ['👍', '👈', '👉', '👆', '👇', '👊', '🤛', '🤜', '👐'];

    // Instantiation with Variables
    const mongo = new Mongo(mongoPath);

    // Logic
    // When Ready
    client.once('ready', async () => {
        utility.log(0, botName + ' is online!');
        client.user.setPresence({
            activity: {
                name: '🤔 Thinking About Life',
                type: 0
            }
        });
        // Test Mongo Server
        await mongo.connect().then(mongoose => {
            try {
                utility.log(0, 'Connected to Mongo Database!');
            }
            catch (e) {
                utility.log(1, 'Connected to Mongo Database Failed!');
            }
            finally {
                mongoose.connection.close();
            }
        });
    });

    // New Member
    // Create an event listener for new guild members
    client.on('guildMemberAdd', member => {
        // client.commands.get('setwc').sendWelcomeMessage(member, mongo, cacheWelcome);
    });

    // Detecting Reaction for election
    // Add Reaction
    client.on('messageReactionAdd', (reaction, user) => {
        if (user.id === '750496850733170809') return
        if (cacheElection[reaction.message.guild.id]) {
            if (!cacheElection[reaction.message.guild.id]['isOngoing'] && cacheElection[reaction.message.guild.id]['messageId'] == reaction.message.id) {
                var index = reactionList.indexOf(reaction.emoji.name);
                for (var x = 0; x < cacheElection[reaction.message.guild.id]['Nominees'].length; x++) {
                    for (var y = 0; y < cacheElection[reaction.message.guild.id]['Nominees'][x]['Voters'].length; y++) {
                        if (cacheElection[reaction.message.guild.id]['Nominees'][x]['Voters'][y][0] == user.id) return;
                    }
                }
                cacheElection[reaction.message.guild.id]['Nominees'][index]['Voters'].push([user.id, user.username]);
                // console.log(cacheElection[reaction.message.guild.id]['Nominees'][index]['Voters']);
                // console.log(reaction);
            }
        }        
    });
    
    // Remove Reaction
    client.on('messageReactionRemove', (reaction, user) => {    
        if (user.id === '750496850733170809') return    
        if (cacheElection[reaction.message.guild.id]) {
            if (!cacheElection[reaction.message.guild.id]['isOngoing'] && cacheElection[reaction.message.guild.id]['messageId'] == reaction.message.id) {
                var index = reactionList.indexOf(reaction.emoji.name);
                for (var y = 0; y < cacheElection[reaction.message.guild.id]['Nominees'][index]['Voters'].length; y++) {
                    if (cacheElection[reaction.message.guild.id]['Nominees'][index]['Voters'][y][0] == user.id) {
                        cacheElection[reaction.message.guild.id]['Nominees'][index]['Voters'].splice(y, 1);
                        // console.log(cacheElection[reaction.message.guild.id]['Nominees'][index]['Voters']);
                    };
                }                
            }
        }        
    });

    // When receiving a message
    client.on('message', async (message) => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        var args = message.content.split(" ");
        args.shift();

        // Debugging
        // console.log("arguments: " + args);
        // for (var x = 0; x < args.length; x++) {
        //     console.log(args[x]);
        // }

        // Queries
        // Ping
        if (args[0].toLowerCase() === 'ping') {
            client.commands.get('ping').execute(message, args);           
        }
        // Election
        else if (args[0].toLowerCase() === 'election') {
            client.commands.get('election').execute(message, adminOnly, cacheElection, Discord, prefix);  
        }
        // Nominate
        else if (args[0].toLowerCase() === 'nominate') {
            client.commands.get('nominate').execute(message, cacheElection, Discord, prefix);  
        }
        // nominationDone
        else if (args[0].toLowerCase() === 'nominationstop') {
            client.commands.get('nominationstop').execute(message, cacheElection, Discord, prefix);  
        }
        // electionStop
        else if (args[0].toLowerCase() === 'electionstop') {
            client.commands.get('electionstop').execute(message, cacheElection, Discord, prefix);  
        }
        // Initialize Basis Column Names
        else if (args[0].toLowerCase() === 'initiate') {
            // client.commands.get('initiate').execute(message, adminOnly, cacheData, cacheInitiating, Discord, mongo, prefix, args);
        }
        // Register
        else if (args[0].toLowerCase() === 'register') {
            client.commands.get('register').execute(message, cacheData, Discord, mongo, args);  
        }
        // TODO: Add select and done
        // Info
        else if (args[0].toLowerCase() === 'info') {
            client.commands.get('info').execute(message, Discord, description, args);
        }
        // Help
        else if (args[0].toLowerCase() === 'help') {
            client.commands.get('help').execute(message, Discord, prefix, commandContainer, args);                
        }
        // Avatar
        else if (args[0].toLowerCase() === 'avatar') {
            client.commands.get('avatar').execute(message, args);                
        }
        // Read Data
        else if (args[0].toLowerCase() === 'read') {
            // client.commands.get('read').check(message, adminOnly, cacheData, Discord, mongo, args);  
        }
        // Set Repeatable
        else if (args[0].toLowerCase() === 'repeatable') {
            client.commands.get('repeatable').setRepeatable(message, adminOnly, cacheData, mongo, args);  
        }
        // TODO: Add Remove Data Command
        else if (args[0].toLowerCase() === 'remove') {
            client.commands.get('remove').remove(message, adminOnly, cacheData, mongo, args);  
        }
        // Clear Channel Data
        else if (args[0].toLowerCase() === 'clear') {
            client.commands.get('clear').execute(message, adminOnly, args);  
        }
        // Donate
        else if (args[0].toLowerCase() === 'donate') {
            client.commands.get('donate').execute(message, Discord, donationDescription, donationURL, args);  
        }
        // Welcome Command
        else if (args[0].toLowerCase() === "setwc") {
            client.commands.get('setwc').setWelcome(message, adminOnly, mongo, cacheWelcome);
        }
        // Simulate join
        else if (args[0].toLowerCase() === "simjoin") {
            client.commands.get('setwc').sendWelcomeMessage(message.member, mongo, cacheWelcome);
        }

        // If input is not applicable
        else {
            message.channel.send('Sorry! I could\'nt understand ' + message.content + '! Type ' + prefix + ' help for more information.');
        }
    });

    // Must Be Last Line. Code to Login Bot to Discord Server
    // client.login(process.env.BOT_TOKEN);
    client.login('NzUwNDk2ODUwNzMzMTcwODA5.X07YqA.1iB2r7zSyvRtAL2DnyUVzpcNqSk');
}
catch (err) {
    utility.log(1, err); 
}
