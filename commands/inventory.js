const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const { MessageEmbed } = require("discord.js");

//modules
const capeModule = require(`${filePath}/cape.js`)
const shopModule = require(`${filePath}/shop.js`)
const armoryModule = require('../structures/armory')


async function giveItem(client,teamData,message,args){
    var unusedItems = []

    for (item of teamData.armory){
        if (item.holderid < 0){
            unusedItems.push(item)
        }
    }

    //finding item
    var targetItem = unusedItems[args[0]-1] || null;
    if(targetItem == null){
        for (var item of unusedItems){
            if (item.name.toLowerCase()  == args[0].toLowerCase()){
                targetItem = item
            }
        }
    }

    if(targetItem == null){
        message.reply("Your item input is invalid.")
        return;
    }

    var targetCape = teamData.capes[args[1]-1] || null
    if (!targetCape){
        for (cape of teamData.capes){
            if (cape.name.toLowerCase() === args[1].toLowerCase() || cape.name.toLowerCase() === (args[1]+" "+args[2]).toLowerCase()){
                targetCape = cape;
            }
            if (targetCape == "null"){
                index++;
            }
        }
    }

    if (!targetCape){
        message.reply("Invalid cape.");
        return;
    }
    var data = armoryModule.getData(targetItem.name)

    if (targetCape.power.shape.toLowerCase() != "fists"&&targetCape.power.shape.toLowerCase() != "weapon"){
        if (data.class == "Weapon"){
            message.reply(targetCape.name+" already uses "+targetCape.power.shape+" as a weapon. They can use Costumes or Gadgets.")
            return;
        }
        
    }

    var result = "Gave "+targetCape.name+" the "
    if (targetCape.item != null){
        var oldItem = targetCape.item;
        oldItem.holderid = -1;
        teamData.armory.push(oldItem);
        if(targetCape.weapon){
            targetCape.weapon = null;
        }
        targetCape.item = null;
        result = "Swapped "+targetCape.name+"'s "+oldItem.name+" for the ";
    }

    result+= item.name+"."

    targetCape["item"] = targetItem;
    if (data.class.toLowerCase() == "weapon"){
        targetCape["weapon"] = item.name.toLowerCase();
    }
    targetItem.holderid = targetCape.id

    await client.teamsDB.set(`${message.author.id}`, teamData);

    message.reply(result);
}
async function takeItem(client,teamData,message,args){

    var targetCape = teamData.capes[args[0]-1] || null
    if (!targetCape){
        for (cape of teamData.capes){
            if (cape.name.toLowerCase() === args[0].toLowerCase() || cape.name.toLowerCase() === (args[0]+" "+args[1]).toLowerCase()){
                targetCape = cape;
            }
            if (targetCape == "null"){
                index++;
            }
        }
    }

    if (!targetCape){
        message.reply("Invalid cape.");
        return;
    }

    if (targetCape.item != null){
        var oldItem = targetCape.item;
        oldItem.holderid = -1;
        teamData.armory.push(oldItem);
        if(targetCape.weapon){
            targetCape.weapon = null;
        }
        targetCape.item = null;
        result = "Took the "+oldItem.name+" from "+targetCape.name+"."
    }else{
        message.reply(targetCape.name+" is not currently using an item.");
        return;
    }

    await client.teamsDB.set(`${message.author.id}`, teamData);

    message.reply(result);
}
async function trashItem(client,teamData,message,args){
    var unusedItems = []
    var unusedItemIndexes = []
    for (var i = 0; i<teamData.armory.length;i++){
        var item = teamData.armory[i]
        if (item.holderid < 0){
            unusedItems.push(item)
            unusedItemIndexes.push(i);
        }
    }
    //finding item
    var targetItem = unusedItems[args[0]-1] || null;
    var targetIndex = null
    if (targetItem){
        targetIndex = unusedItemIndexes[args[0]-1];
    }
    if(targetItem == null){
        for (var i = 0;i< unusedItems.length;i++){
            var item = unusedItems[i]
            if (item.name.toLowerCase()  == args[0].toLowerCase()){
                targetItem = item
                targetIndex = unusedItemIndexes[i]
            }
        }
    }
    //console.log(unusedItemIndexes[args[0]-1])

    if(targetItem == null){
        message.reply("Your item input is invalid.")
        return;
    }

    const offer = await message.channel.send("React with ❌ in the next 5 minutes to destroy the "+targetItem.name+" permanently.");

    offer.react("❌");  
    const filter = (reaction, user) => {
        return reaction.emoji.name === '❌' && user.id === message.author.id;
    };
    
    offer.awaitReactions(filter, { max: 1, time: 5*60*1000, errors: ['time'] })
    .then( async collected =>  {

        teamData = await client.teamsDB.get(`${message.author.id}`, 0);
        var updatedItem = teamData.armory[targetIndex];
        if (updatedItem.name == targetItem.name && updatedItem.durability == targetItem.durability){
                if (updatedItem.holderid > 0){
                    message.reply("You can not delete an item that is being held.");
                    return;
                }

                teamData.armory.splice(targetIndex,1); //removed

                await client.teamsDB.set(`${message.author.id}`, teamData);
                message.reply("Deleted "+updatedItem.name+".");
                return;
        }
        message.reply("Could not find "+targetItem.name+".");
        return;

    })
    .catch(collected => {
        message.reply('You have not responded in time.');
    });
}

module.exports.run = async (client, message, args) =>{
    const teamData = await client.teamsDB.get(`${message.author.id}`, 0);
    if (teamData == 0 ) {
        message.reply("You have no data. Use `start` command to begin!");
        return
    }
    if (!teamData.armory){
        message.reply("You have no items. Check the ,shop");
    }


    if (message.content.substring(1,5).toLowerCase() == "give" || message.content.substring(1,6).toLowerCase()=="equip"){
        giveItem(client,teamData,message,args);
        return;
    }
    if (message.content.substring(1,5).toLowerCase() == "take" || message.content.substring(1,8).toLowerCase()=="unequip"){
        takeItem(client,teamData,message,args);
        return;
    }
    if (message.content.substring(1,6).toLowerCase() == "trash"){
        trashItem(client,teamData,message,args);
        return;
    }

    var display = new MessageEmbed()
    .setColor("GREY")
    .setTitle(teamData.name +" Armory")

    var count = 0;

    var info = "";
    for (var item of teamData.armory){
        if (item.holderid < 0){
            var data = armoryModule.getData(item.name)

            info+= `(${++count}) **${item.name}** [${data.rarity} ${data.class}] \n`+
            "Durability: "+item.durability+" use(s).\n"+
            armoryModule.explainStats(data.bonus)+"\n*"+
            data.description+"*\n";
        }
    }
    if (info == ""){
        info = "You have no unused items. Visit the shop to check some out."
    }

    display.addField("**Unused Items**",info)
    display.addField("Actions",
    "Give an item: `,give [itemid] [capeid/name]`\n"+
    "Take an item: `,take [capeid.name]`\n"+
    "Trash an item: `,trash [item id]`"
    )
    message.reply(display);
}

module.exports.help = {
    name: "inventory",
    description: "Show's user's item inventory.",
}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}
