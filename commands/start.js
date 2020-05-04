const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");

//modules
const capeModule = require(`${filePath}/cape.js`);
const infoModule = require(`${filePath}/stats.js`);
const customModule = require("../chargen/customs.js");

module.exports.run = async (client, message, args) =>{

    const hasData = await client.teamsDB.get(`${message.author.id}`, 0);
    if (hasData != 0 && args[0] != "RESET") {
        message.reply("You are already playing. To reset your data use 'start RESET' command.");
        return;
    }
    else if (hasData != 0){
        for (cape of hasData.capes){
            if (cape.activity != "none"){
                message.reply("You can not reset your data while you are on an operation.");
                return;
            }
        }
    }

    
    var teamData = new Object();
    teamData["userid"] = message.author.id;
    teamData["name"] = (message.member.nickname || message.member.user.username)+"'s Team";
    teamData["funds"] = 1000;
    teamData["reputation"] = 0;
    teamData["network"] = 0;

    teamData["capes"] = [capeModule.genCape()];


    teamData["nextid"] = 1; // cape ids
    teamData["activecapes"] = []; // capes on operations


    //adding customs if they have them
    teammData = customModule.run(teamData,message.author.id);
    
    await client.teamsDB.set(`${message.author.id}`, teamData);
    message.reply("New Game Created!");
    message.channel.send(infoModule.teamDisplay(teamData));
    for (cape of teamData.capes){
        capeModule.showData(cape, message);
    }
    message.channel.send("You can rename your team with `name team [teamname]`");
    
}

module.exports.help = {
    name: "start",
    description: "Sets up a new game for the user",
}

module.exports.requirements = {
    clientPerms: [],
    userPerms: [],
    ownerOnly: false
}