const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const { MessageEmbed } = require("discord.js");
const {capeIcon,prefix} = require("../config.js");



module.exports.run = async (client, message, args) =>{

    var teamData = await client.teamsDB.get(`${message.author.id}`, 0);
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
        
        .addField("**Team Management**",
        "`"+prefix+"stats` Get an overview on your team stats.\n`"+prefix+"stats capename/id` to see specifics.\n"+
        "`"+prefix+"name` Rename your team or cape alias.\n"+
        "`"+prefix+"scout` Pay $500 to be offered a random recruit.\n"+
        "`"+prefix+"drop [capeid]` Remove a cape from your team at the cost of reputation.\n",false)
        
        .addField("**Missions**",
        "`"+prefix+"op` Send a cape or a team of capes on a mission.\n"+
        "`"+prefix+"respond` Send a team to interupt someone else's operation.",false)

        .addField("**Armory**",
        "`"+prefix+"shop` Check what items are currently being sold. Offers change every 24 hours.\n"+
        "`"+prefix+"buy [catalog number]` Purchase an item from the shop.\n"+
        "`"+prefix+"inventory` View your unused items.\n"+
        "`"+prefix+"give [item id] [cape id]` Give an unused item you own to a cape.\n"+
        "`"+prefix+"take [cape id]` Return an item the cape was using to your inventory.\n"+
        "`"+prefix+"trash [item id]` Remove an item from your inventory, no returns.\n"
        ,false)

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