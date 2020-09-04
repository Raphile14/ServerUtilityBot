const worksheetSchema = require('../Schemas/worksheet-schema.js');

var acceptedQuiries = ["f", "false", "t", "true"];

module.exports = {
    name: 'repeatable',
    description: "Toggle if Data in Worksheet is reusable",
    async setRepeatable(message, adminOnly, cacheData, mongoDB) {
        let status = message.content;
        const split = status.split(' ');
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            message.react('❌');
            message.reply(adminOnly); 
            return;
        }
        if (split.length < 3) {
            message.react('❌');
            message.reply("Invalid Input! No toggle Status Detected!"); 
            return;
        } 
        if (!split[2].toLowerCase() in acceptedQuiries) {
            message.react('❌');
            message.reply("Invalid Input! Repeated Use can only accept True or False"); 
        }        
        cacheData[message.guild.id];
        // Obtain Data from database if not found in storage
        await mongoDB.connect().then( async mongoose => {                
            try {
                if (!cacheData[message.guild.id]) {
                    const result = await worksheetSchema.findOne({_id: message.guild.id});
                    cacheData[message.guild.id] = result.data[0];
                }            
                // console.log(cacheData[message.guild.id]);
                // After Obtaining Data from database
                if (split[2].toLowerCase() === "false" || split[2].toLowerCase() === "f") {
                    cacheData[message.guild.id]['Repeated Use'] = false;
                }
                else if (split[2].toLowerCase() === "true" || split[2].toLowerCase() === "t") {
                    cacheData[message.guild.id]['Repeated Use'] = true;
                }   
                try {
                    await worksheetSchema.findOneAndUpdate({
                        _id: message.guild.id
                    }, {
                        _id: message.guild.id,
                        data: cacheData[message.guild.id]
                    }, {
                        upsert: true
                    });                   
                    message.react('👍');             
                    message.reply('Changes saved!');  
                    // console.log(cacheData[message.guild.id]);
                }
                catch (e) {
                    message.react('❌');
                    // console.log(e);
                    message.reply('Unable to save changes unto Database');  
                }                
            }
            catch (e) {
                message.react('❌');
                // console.log(e);
                message.reply('No Stored Worksheet Database!');  
            }
            finally {
                mongoose.connection.close;
            }
        });                                    
    },    
}