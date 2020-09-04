const download = require('download');
const fs = require('fs');
const UtilityClass = require('../Classes/Utility.js');
const xlsx = require("xlsx");
const worksheetSchema = require('../Schemas/worksheet-schema.js');

const utility = new UtilityClass();
const reactionList = ['👍', '👈', '👉', '👆', '👇', '👊', '🤛', '🤜', '👐'];

// Variables
var file;
var selectedSheet;
var sheet; // raw data from sheet
var data; // converted to json
var newData; // mapped data

module.exports = {
    name: 'read',
    description: "Submit xlsx file for Bot to read",
    check(message, adminOnly, cacheData, Discord, mongoDB, args) {
        if (message.member.hasPermission("ADMINISTRATOR") && message.attachments.size == 1) {
            var attachmentArray = message.attachments.array();
            // console.log(attachmentArray);
            this.execute(message, attachmentArray, cacheData, Discord, mongoDB, args);
        }
        else {
            var error = "I didn\'t accept any file!";
            if (message.attachments.size > 1) {
                error = "I can only read one file at a time!";
            }
            else if (!message.member.hasPermission("ADMINISTRATOR")) {
                error = adminOnly;
            }
            this.executeInvalid(message, error, args);
        }
    },
    async execute(message, attachmentArray, cacheData, Discord, mongoDB, args) {
        var attachmentURL = attachmentArray[0].attachment;
        if(attachmentURL.endsWith('xlsx')) {
            try {
                await download(attachmentURL, "Files").then(() => {
                    message.react('👍');
                    message.reply('File ' + attachmentArray[0].name + ' accepted and received!');                    
                    utility.log(0, "Successfully Downloaded " + attachmentArray[0].name);                    
                    try {
                        file = xlsx.readFile("Files/" + attachmentArray[0].name, {cellDates: true});
                        
                        // console.log(file.SheetNames);
                        if (file.SheetNames.length == 1) {
                            selectedSheet = file.SheetNames[0];
                        }
                        else if (file.SheetNames.length > 1) {
                            var limit = file.SheetNames.length;
                            if (limit > 9) {
                                limit = 9;
                            }
                            const embed = new Discord.MessageEmbed()
                                .setTitle('Select Sheet')
                                .setColor(3447003)
                                .setDescription('I can only read one Sheet for now! What Sheet shall I read? (only first 9 sheets will be detected)' 
                                + '\n\nSelect the Sheet you want by reacting the corresponding number reaction. The first row should contain ' 
                                + 'the column headers. A Discord server can only retain a maximum of 1 worksheet data at a time. ' 
                                + 'Adding more will overwrite the past saved worksheet data.' 
                                + '\n\nBe sure to wait for all the reactions to appear. Only the sender can send a reaction.' 
                                + '\n\nYou only have 30 seconds.'); 
                                for (var x = 0; x < limit; x++) {
                                    embed.addFields({
                                        name: reactionList[x],
                                        value: (x + 1) + " : " + file.SheetNames[x],
                                        inline: true
                                    });
                                }
                                message.reply(embed).then(sentEmbed => {
                                    for (var x = 0; x < limit; x++) {
                                        sentEmbed.react(reactionList[x]);
                                    }
                                    const filter = (reaction, user) => reactionList.includes(reaction.emoji.name) && user.id === message.author.id;
                                    sentEmbed.awaitReactions(filter, {max: 1, time: 30000, errors: ['time']})
                                        .then(collected => {
                                            const reaction = collected.first();
                                            selectedSheet = file.SheetNames[reactionList.indexOf(reaction.emoji.name)];                                            
                                            message.reply("You have selected " + selectedSheet);
                                        })  
                                        .catch(collected => {
                                            message.reply('Times Up! No emoji Selected. You\'ll have to redo!');
                                        });
                                });
                        }
                        else {
                            message.reply('File ' + attachmentArray[0].name + ' doesn\'t have any Sheets!');  
                        } 
                        sheet = file.Sheets[selectedSheet];
                        data = xlsx.utils.sheet_to_json(sheet);

                        // Adding Confirmed-Used Attribute to know if data is used. False in initiation
                        for (var x = 0; x < data.length; x++) {
                            data[x]["RSUB Use Status"] = false;
                        }

                        // Assigning data to cacheData
                        cacheData[message.guild.id] = {'Worksheet Data': data, 'Repeated Use': false, 'Important Columns': []};

                        // Save Data in Database
                        mongoDB.connect().then( async mongoose => {
                            try {
                                await worksheetSchema.findOneAndUpdate({
                                    _id: message.guild.id
                                }, {
                                    _id: message.guild.id,
                                    data: cacheData[message.guild.id]
                                }, {
                                    upsert: true
                                });                                
                                message.reply('Worksheet ' + attachmentArray[0].name + ' saved!');  
                            }
                            catch (e) {
                                message.react('❌');
                                // console.log(e);
                                message.reply('Worksheet ' + attachmentArray[0].name + ' unable to save unto Database');  
                            } 
                            finally {
                                mongoose.connection.close;
                            }
                        }); 
                        
                        try {
                            // Print Detected Columns
                            const embedDetected = new Discord.MessageEmbed()
                            .setTitle('Detected Column Names')
                            .setColor(3447003)
                            .setDescription('Detected Column Names. If not the right one, resend another file. Be sure to put the column names on the first row.'); 

                            for (var columnName in cacheData[message.guild.id]['Worksheet Data'][0]) {
                                if (columnName !== "RSUB Use Status") {
                                    embedDetected.addFields({
                                        name: 'Column',
                                        value:  columnName,
                                        inline: true
                                    });
                                }                                
                            }
                            message.reply(embedDetected);
                        }
                        catch (e) {
                            // console.log(e);
                            message.react('❌');
                            message.reply('Failed to return column names');  
                        }                        
                    } 
                    catch (e) {
                        message.react('❌');
                        // console.log(e);
                        message.reply('File ' + attachmentArray[0].name + ' fail to read!');  
                    }
                    finally {
                        this.deleteFile(attachmentArray[0].name);
                    }
                });                
            }
            catch (e) {
                // console.log(e);
                message.react('❌');
                message.reply('File ' + attachmentArray[0].name + ' failed to download!');
                utility.log(1, "Failed to Download " + attachmentArray[0].name);
            }            
        }
        else {
            message.react('❌');
            message.reply('File Format of ' + attachmentArray[0].name + ' not accepted! RSUB only accepts xlsx file format!');
        }
    },    

    executeInvalid(message, error , args) {
        message.react('❌');
        message.reply(error);
    },
    deleteFile(path) {
        try {
            fs.unlinkSync("Files/" + path);   
            utility.log(0, "Successfully Deleted " + path)
        }
        catch (e) {
            utility.log(1, "Failed to delete " + path)
        }
        
    }
}