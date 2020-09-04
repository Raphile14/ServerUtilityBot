const welcomeSchema = require('../Schemas/welcome-schema.js');

module.exports = {
    name: 'setwc',
    description: "Set Welcome Message",
    async setWelcome(message, adminOnly, mongoDB, cacheWelcome) {
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            message.react('❌');
            message.reply(adminOnly); 
            return;
        }
        await mongoDB.connect().then( async mongoose => {
            let text = message.content;
                const split = text.split(' ');

                if (split.length < 3) {
                    message.react('❌');
                    message.reply("Invalid Input! No welcome message detected!"); 
                    return;
                }                                
                split.shift();
                split.shift();
                text = split.join(' ');
                cacheWelcome[message.guild.id] = [message.channel.id, text];
            try {                
                await welcomeSchema.findOneAndUpdate({
                    _id: message.guild.id
                }, {
                    _id: message.guild.id,
                    channelId: message.channel.id,
                    text
                }, {
                    upsert: true
                });
                message.react('👍');
                message.reply("Welcome Message Set!"); 
            }
            finally {
                mongoose.connection.close;
            }
        });
    },

    async sendWelcomeMessage(member, mongoDB, cacheWelcome) {
        let data = cacheWelcome[member.guild.id];
        if (!data) {
            await mongoDB.connect().then( async mongoose => {
                try {
                    const result = await welcomeSchema.findOne({_id: member.guild.id});
                    cacheWelcome[member.guild.id] = data = [result.channelId, result.text];
                }
                finally {
                    mongoose.connection.close;
                }
            });
        }
        const channelId = data[0];
        const text = data[1];
        const channel = member.guild.channels.cache.get(channelId);
        channel.send(text.replace(/<@>/g, `<@${member.id}>`));
    }
}