module.exports = {
    name: 'clear',
    description: "Clear text channel",
    execute(message, adminOnly, args) {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.messages.fetch().then((results) => {
                message.channel.bulkDelete(results)
            })
        }
        else {
            message.react('❌');
            message.reply(adminOnly);            
        }        
    }
}