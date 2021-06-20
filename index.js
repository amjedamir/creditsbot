require("dotenv").config();
const{ Client, MessageEmbed, MessageAttachment} = require('discord.js');
const mongoose = require('mongoose');
const client = new Client();
const message_data = require('./databases/data');
var prefix = "$";
var url = "mongodb.connect";
var _list = "";
var commands = {
    credits : "to show your credits count \n you can use this command to show the user credits count by mention him !",
    daily : "to get your daily credits every 24h"
}



mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((db) => {
    console.log('Connected to the database +1')
  })
  .catch((err) => {
    console.error(err);
});


client.on('ready', () => {
    console.log(`[ ${client.user.username} ] : I'm Readyyyy :D \n isBot : ${client.user.bot} `);
    client.user.setActivity('eee', ({type: "WATCHING"}))
})


client.on('message',message => {
    const user = message.mentions.users.first();
    if(message.author.bot == false) {
        if(message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).trim().split(' ');
            const cmd = args.shift().toLowerCase();
            if(cmd == "help") {
                for(let _listcom in commands) {
                    _list = "**" + _listcom + " :**" + commands[_listcom]
                    message.author.send(_list)
                    message.react('✅')
                }
                message.channel.send('**Check you DM**')
            }
            if(cmd == "credits") {
                if(!user){
                    message_data.findOne({id:message.author.id},(error,resp) => {
                        if(error) return;
                        if(resp ) {
                            if(resp.banned == false) {
                                message.channel.send('**' + message.author.username + '** credits : ' + resp.credits);
                            }else {
                                message.channel.send('Sorry , but you are banned from this bot')
                            }
                        }else {
                            const CrNewUser = new message_data({
                                id : message.author.id,
                                credits : 0,
                                daily : 0,
                                banned : false,
                            })
                            CrNewUser.save((err,res) => {
                                message.channel.send('**' + message.author.username + '** credits : ' + res.credits)
                                if(err) return;
                                if(res) {
                                    console.log(res);
                                }
                            })
                        }
                    })
                }
                if(user) {
                    if(args[1]) {
                        message_data.findOne({id:message.author.id},(err,re) => {
                            if(err) return;
                            if(re) {
                                message_data.findOne({id:user.id},(cf,ct) => {
                                    if(cf) return;
                                    if(ct) {
                                        if(re.credits >= args[1]) {
                                            if(args[1] > 0) {
                                                message.channel.send('Done , The conversion was successful ! \n **- ' + parseInt(args[1],10) + '**')
                                                message_data.updateOne({id:user.id},{$set : {credits : ct.credits + parseInt(args[1],10)}},(err,tr) => {});
                                                message_data.updateOne({id:message.author.id},{$set : {credits : re.credits - parseInt(args[1],10)}},(e,r) => {})
                                            }else {
                                                message.channel.send('😅 **' + args[1] + '** ?')
                                            }
                                        }else {
                                            message.channel.send('You do not have this amount                                            ')
                                        }
                                    }else {
                                        message.channel.send("I don't have any information about this user")
                                    }
                                })
                            }
                        })
                    }else {
                        message_data.findOne({id:user.id},(er,re) => {
                            if(er) return;
                            if(re) {
                                if(re.banned == false) {
                                    message.channel.send('**' + user.username +  ' **credits : ' + re.credits);
                                }else {
                                    message.channel.send('** This user is banned **')
                                }
                            }else {
                                message.channel.send("I didn't have any information about this user :(");
                            }
                        })
                    }
                }
            }
            if(cmd == "daily") {
                message_data.findOne({id:message.author.id},(err,res) => {
                    if(err) return;
                    if(res) {
                        let lastDaily = res.daily;
                        if(Date.now()  > lastDaily + 86400000) {
                            const math = Math.floor(Math.random() * 200);
                            const count = res.credits + math
                            message_data.updateOne({id:message.author.id},{$set : {credits : count , daily: Date.now()}},(erro,respo) => {
                                message.channel.send('Wooohoo !!! **' + message.author.username + '**I will send to you ' + math + ' credits !!');
                                if(erro) return;
                                if(respo) {
                                    console.log(respo)
                                }
                            })
                        }else {
                            message_data.updateOne({id:message.author.id},{$set : {daily : Date.now()}},(err,res) => {
                                console.log('Time : Updated ')
                                if(err) return;
                                if(res) return;
                            })
                            message.channel.send("You can't use this command now , come back after 24 hours");
                        }
                    }
                })
            }
        }
    }
})







client.login(TOKEN);
