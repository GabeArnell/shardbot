const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const { MessageEmbed } = require("discord.js");
const {capeIcon,prefix} = require("../config.js");

//database
const { VultrexDB, SQLiteProvider } = require("vultrex.db");
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
   message.reply(
        new MessageEmbed()
        .setAuthor(teamData.name + " Menu", capeIcon)
        .setColor('BLUE')
        .addField("**Funds**", "$"+teamData.funds, true)
        .addField("**Reputation**", teamData.reputation, true)
        
        .addField("**Statistics**","`"+prefix+"stats` Get an overview on your team stats. Can use `info capename/id` to see specifics.",false)
        .addField("**Name**","`"+prefix+"name` Rename your team or cape alias.",false)
        .addField("**Scout**","`"+prefix+"scout` Pay $250 to be offered a random recruit.")
        .addField("**Drop**","`"+prefix+"drop [capeid]` Remove a cape from your team at the cost of reputation.",false)
        .addField("**Operation**","`"+prefix+"op` Send a cape or a team of capes on a mission.",false)
        .addField("**Respond**","`"+prefix+"respond` Send a team to interupt someone else's operation.",false)
        .addField("**Shop**","`"+prefix+"shop` **[Coming Soon]** Buy gear for your team.",false)

        /*.addField("Further Information","Use the help command and a following word for details.\n"
        +"\n"
        )*/
   )
}

module.exports.help = {
    name: "menu",
    description: "Shows game's main menu.",
}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}