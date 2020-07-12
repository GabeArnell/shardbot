const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const { MessageEmbed } = require("discord.js");

//modules
const capeModule = require(`${filePath}/cape.js`)

module.exports.teamDisplay = function (team){
    var result = new MessageEmbed()
    .setColor("GREEN")
    .setAuthor(team.name)
    .addField("**Funds**", "$"+team.funds,true)
    .addField("**Reputation**", team.reputation, true)
    .addField("**Network**", team.network, true);

    // adding capes
    var count = 0;
    var info = "";
    const spaceChar = `\xa0`;
    for (cape of team.capes){
        count++;
        var repeats = 20-cape.name.length;
        if (repeats < 1){ repeats = 1;}
        info += "`"+count+") "+cape.name+""+spaceChar.repeat(repeats)
        if (cape.level){
            info+=" lv"+cape.level
        }
        //cape.class+
        info+=
        " | STR-"+cape.strength+
        " | VIT-"+cape.vitality+
        " | UTL-"+cape.utility+
        " | CTR-"+cape.control+
        " | TEQ-"+cape.technique+
        "`\n";
    }
    result.addField("**Capes**", info, false);

    result.addField('**Help**', 
    "Funds: How much money you currently have.\nReputation: How your group is seen. Higher is heroic, lower is villainous.\nNetwork: How well connected you are. Ability to find new capes.\n"+
    "stats [id/name] to get specific cape information", false);

    result.setFooter(`Use command ",help combat" for further info on stats.`)
    return result;
}



module.exports.run = async (client, message, args) =>{
    const teamData = await client.teamsDB.get(`${message.author.id}`, 0);
    if (teamData == 0 ) {
        message.reply("You have no data. Use `start` command to begin!");
        return
    }
    if (args[0]){
        var targetCape = teamData.capes[args[0]-1] || "null"

        // if they typed the name of the cape
        if (targetCape == "null") {
            for (var cape of teamData.capes)
                if (cape.name.toLowerCase() === (args[0]+" "+args[1]).toLowerCase()  || cape.name.toLowerCase() === args[0].toLowerCase()){
                targetCape = cape;
                }     
        }
        if (targetCape == "null"){
            message.reply("Could not identity cape."); 
            return;
        }
        capeModule.showData(targetCape, message, targetCape.name+" | Character Sheet");
        return;
    }

    //team info
    message.reply(this.teamDisplay(teamData));
}

module.exports.help = {
    name: "stats",
    description: "Show's users team stats",
}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}
