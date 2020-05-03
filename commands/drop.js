const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");

//modules
const capeModule = require(`${filePath}/cape.js`)

//database: Key == 
const { VultrexDB, SQLiteProvider } = require("vultrex.db");
const teamsDB = new VultrexDB({
    provider: 'sqlite',
    table: 'usertable',
    fileName: 'teamdatabase'
});

module.exports.run = async (client, message, args) =>{

    var teamData = await teamsDB.get(`${message.author.id}`, 0);
    if (teamData == 0 ) {
        message.reply("You have no data. Use `start` command to begin!");
        return;
    }
    if (teamData.capes.length == 1){
        message.reply("You can not drop your only cape.");
        return;
    }

    var targetCape = teamData.capes[args[0]-1] || "null"
    var index = 0
    // if they typed the name of the cape
    if (targetCape == "null") {
        for (var cape of teamData.capes)
            
            if (cape.name.toLowerCase() === (args[0]+" "+args[1]).toLowerCase()  || cape.name.toLowerCase() === args[0].toLowerCase()){
                targetCape = cape;
            }
            if (targetCape == "null"){
                index++;
            }

    }else{
        index = args[0]-1;
    }
    
    if (targetCape == "null"){
        message.reply("Could not identity cape."); 
        return;
    }


    if (targetCape.activity != 'none'){
        message.reply("You can not drop an active cape!");
        return;
    }
    
    const targetId = targetCape.id;

    const offer = await message.channel.send("React with ❌ in the next 5 minutes to drop "+targetCape.name+" from your team.\n"+
    "*Dropping this cape will lose you "+Math.floor(Math.abs(teamData.reputation/teamData.capes.length))+ " reputation.*"
    );

    offer.react("❌");  
    const filter = (reaction, user) => {
        return reaction.emoji.name === '❌' && user.id === message.author.id;
    };
    
    offer.awaitReactions(filter, { max: 1, time: 5*60*1000, errors: ['time'] })
    .then( async collected =>  {
        teamData = await teamsDB.get(`${message.author.id}`, 0);
        if (teamData.capes.length < 2){
            message.reply("Can not drop your last cape!");
            return;
        }

        for (var i = 0; i < teamData.capes.length; i++){
            const cape = teamData.capes[i];
            if (cape.id == targetId){
                if (cape.activity != "none"){
                    message.reply("You can not drop an active cape.");
                }
                else{
                    teamData.reputation = Math.ceil(teamData.reputation/teamData.capes.length*(teamData.capes.length-1));
                    teamData.capes.splice(i,1); // first element removed
                    await teamsDB.set(`${message.author.id}`, teamData);
                    message.reply("Dropped "+cape.name);
                    return;
                }
            }
        }
    })
    .catch(collected => {
        message.reply('You have not responded in time.');
    });
}

module.exports.help = {
    name: "drop",
    description: "Removes cape from team",
}

module.exports.requirements = {
    clientPerms: [],
    userPerms: [],
    ownerOnly: false
}
module.exports.setup = async(client) =>{
    await teamsDB.connect();
}