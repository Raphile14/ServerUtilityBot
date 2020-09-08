const worksheetSchema = require('../Schemas/worksheet-schema.js');

module.exports = {
    name: 'register',
    description: "Register User to Receive Roles",
    async execute(message, cacheData, Discord, mongoDB, args) {
        await mongoDB.connect().then( async mongoose => {                
            try {                
                try {
                    if (!cacheData[message.guild.id]) {
                        const result = await worksheetSchema.findOne({_id: message.guild.id});
                        cacheData[message.guild.id] = result.data[0];
                    }   
                    let registration = message.content;
                    let split = registration.split(' ');
                    // console.log(split);

                    // Student Details
                    split.shift();
                    split.shift();
                    let studentNumber = split.shift();;
                    let studentProgram = split.shift();;
                    let studentYear = split.shift();;
                    let studentEmail = split.shift();;
                    let studentName = split.join(' ');
                    let acceptedYears = ['1', '2', '3'];

                    // console.log(studentNumber);
                    // console.log(studentProgram);
                    // console.log(studentYear);
                    // console.log(studentEmail);
                    // console.log(studentName);

                    // console.log(cacheData[message.guild.id]);
                    var found = false;          
                    for (var x = 0; x < cacheData[message.guild.id]['Worksheet Data'].length; x++) {
                        if (cacheData[message.guild.id]['Worksheet Data'][x]['Student #'] == studentNumber 
                        && cacheData[message.guild.id]['Worksheet Data'][x]['Prg'] == studentProgram
                        && cacheData[message.guild.id]['Worksheet Data'][x]['Email'] == studentEmail
                        && cacheData[message.guild.id]['Worksheet Data'][x]['Name'].toLowerCase() == studentName.toLowerCase()
                        && acceptedYears.includes(studentYear)) {    
                            if (!cacheData[message.guild.id]['Worksheet Data'][x]['RSUB Use Status']) {
                                const roleProgram = message.guild.roles.cache.find(role => role.name === studentProgram);
                                var roleYear = message.guild.roles.cache.find(role => role.name === '1st Year');
                                if (studentYear == '2') {
                                    roleYear = message.guild.roles.cache.find(role => role.name === '2nd Year');
                                }
                                else if (studentYear == '3') {
                                    roleYear = message.guild.roles.cache.find(role => role.name === '3rd Year');
                                }
                                try {
                                    // console.log(split[0] + " " + split[1]);
                                    if (message.guild.me.hasPermission('MANAGE_NICKNAMES')) {
                                        // message.guild.members.fetch(message.member.id).setNickname("Raphael's Server Utility Bot");
                                        // console.log(message.guild.members.fetch(message.member.id));                                        
                                    }
                                    // // message.member.setNickname(message.content.replace('changeNick ', ''));
                                    // message.member.setNickname(split[0] + " " + split[1]);
                                }
                                catch (e) {
                                    console.log(e);
                                }                                
                                message.member.roles.add(roleProgram);
                                message.member.roles.add(roleYear);
                                cacheData[message.guild.id]['Worksheet Data'][x]['RSUB Use Status'] = true;
                                found = true;

                                // Add Roles
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
                                    }
                                    catch (e) {
                                        message.reply('Worksheet ' + attachmentArray[0].name + ' unable to save unto Database');  
                                    } 
                                    finally {
                                        mongoose.connection.close;
                                    }
                                });
                                message.react('👍');   
                                message.reply('Congrats ' + studentName +"! You are registered!");
                                break;
                            }
                            else if (cacheData[message.guild.id]['Worksheet Data'][x]['RSUB Use Status']) {
                                message.react('❌');   
                                message.reply('Student ' + studentName + ' is already registered');
                                found = true;
                                break;
                            }                            
                                
                        }                                                                        
                    }
                    if (!found) {
                        message.react('😢');   
                        message.reply('Student ' + studentName + ' not found in database. Check your input!');
                    }
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