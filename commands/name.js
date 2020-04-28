const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const { MessageEmbed } = require("discord.js");

//modules
const capeModule = require(`${filePath}/cape.js`)

//database: Key == 
const { VultrexDB } = require("vultrex.db");
const teamsDB = new VultrexDB({
    provider: 'sqlite',
    table: 'usertable',
    fileName: 'teamdatabase'
});

teamsDB.connect();

module.exports.run = async (client, message, args) =>{
    var teamData = await teamsDB.get(`${message.author.id}`, 0);
    if (teamData == 0 ) {
        message.reply("You have no data. Use `start` command to begin!");
        return
    }

    if (args[0] == undefined){
        message.reply(this.help.description);
        return;
    }

    // renaming team
    if (args[0].toLowerCase() == "team" && args[1]){
        const name = message.content.substring(11);

        if (name.length > 20){
            message.reply("Name is too long. Max is 20 characters."); 
            return;
        }

        teamData.name = name;
        message.reply("Set team name to " + name);
        await teamsDB.set(`${message.author.id}`, teamData);
       
    }else if (args[0].toLowerCase() == "team"){
        message.reply("Invalid team name.");
    }

    // naming capes
    if (args[0].toLowerCase() == "cape" && args[1]){
        var targetCape = teamData.capes[args[1]-1] || "null"

        var offset = 2
        if (targetCape && args[1]>9){ // if cape position was in double digits offset increases
            offset = 3;
        }

        // if they typed the name of the cape
        if (targetCape == "null") {
            console.log("searching for name");
            for (var cape of teamData.capes)
                console.log(message.content.substring(11, 11+cape.name.length));
                console.log(cape.name);
                if (cape.name.toLowerCase() === (args[1]+" "+args[2]).toLowerCase() || cape.name.toLowerCase() === (args[1]).toLowerCase()){
                    targetCape = cape;
                    offset = cape.name.length+1;
                    console.log("found!");
                }     
        }
        
        if (targetCape == "null"){
            message.reply("Could not identity cape."); 
            return;
        }

        const name = message.content.substring(11+offset);
        if (name.length > 20){
            message.reply("Name is too long. Max is 20 characters."); 
            return;
        }
        message.reply("Changed " + targetCape.name + "'s name to "+name+".");
        targetCape.name = name;
        await teamsDB.set(`${message.author.id}`, teamData);


    }else if (args[0].toLowerCase() == "cape"){
        message.reply("needs a second argument. Either the cape's name or their number");
    }
     
    if (args[0].toLowerCase() != 'team' && args[0].toLowerCase() != 'cape'){
        message.reply("Error, invalid entry command. Specify if you want to change your team or cape first!.");
    }
    
}

module.exports.help = {
    name: "name",
    description: "Rename your team or capes. `name team [teamname]` or `name cape [capeslot or cape name] [newname]`",
}

module.exports.requirements = {
    clientPerms: [],
    userPerms: [],
    ownerOnly: false
}