const worksheetSchema = require('../Schemas/worksheet-schema.js');

module.exports = {
    name: 'initiate',
    description: "Initiate Role Assignment Using Worksheet",
    async execute(message, adminOnly, cacheData, cacheInitiating, Discord, mongoDB, prefix, args) {
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            message.react('❌');
            message.reply(adminOnly); 
            return;
        }
        await mongoDB.connect().then( async mongoose => {                
            try {                
                try {
                    if (!cacheData[message.guild.id]) {
                        const result = await worksheetSchema.findOne({_id: message.guild.id});
                        cacheData[message.guild.id] = result.data[0];
                        console.log(result);
                    }       
                    cacheInitiating[message.guild.id] = {'isSelecting' : true};
                    message.react('👍');                 
                    message.reply('Worksheet Data Found');
                    
                    // Print Detected Columns
                    const embedDetected = new Discord.MessageEmbed()
                    .setTitle('Detected Column Names')
                    .setColor(3447003)
                    .setDescription('Detected Column Names. Type ' + prefix + 'select ColumnName to select which Columns to check for member input.' 
                    + '\n\nExample: ' + prefix + ' select name' 
                    + '\n\n Do so until all desired Columns are selected. Finish by typing ' + prefix + ' done'); 
                    
                    var counter = 0;
                    for (var columnName in cacheData[message.guild.id]['Worksheet Data'][0]) {
                        if (columnName !== "RSUB Use Status") {
                            embedDetected.addFields({
                                name: 'Column',
                                value:  columnName,
                                inline: true
                            });
                            counter ++;
                        }                                
                    }
                    message.reply(embedDetected);
                }
                catch (e) {
                    message.react('❌');
                    console.log(e);
                    message.reply('Failed to access Worksheet Data!');  
                }                
            }
            catch (e) {
                message.react('❌');
                message.reply('No Stored Worksheet Database!');  
            }
            finally {
                mongoose.connection.close;
            }
        }); 
    }    
}