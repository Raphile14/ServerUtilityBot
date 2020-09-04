const worksheetSchema = require('../Schemas/worksheet-schema.js');

module.exports = {
    name: 'remove',
    description: "Remove Stored Worksheet",
    async remove(message, adminOnly, cacheData, mongoDB) {
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            message.react('❌');
            message.reply(adminOnly); 
            return;
        }
        await mongoDB.connect().then( async mongoose => {                
            try {
                delete cacheData[message.guild.id];            
                try {
                    await worksheetSchema.deleteOne({
                        _id: message.guild.id
                    });           
                    message.react('👍');                 
                    message.reply('Worksheet Data Deleted!');  
                }
                catch (e) {
                    message.react('❌');
                    message.reply('Unable to Delete Data!');  
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