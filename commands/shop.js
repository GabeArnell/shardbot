const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const { MessageEmbed } = require("discord.js");


//modules
const armoryModule = require('../structures/armory')

/*
Item Rarities:
Market: 30%
Expensive: 20%
Fortune: 10%
Scrap Tech: 10%
Tinker Tech: 10%
Premium Tech: 5%
*/


var currentSales = [];
var currentDate = null;

const maxItems = 6;
const basePrices = {
    ["Scrap Tech"]: 200,
    ["Market"]: 500,
    ["Expensive"]: 1000,
    ["Fortune"]: 2500,
    ["Tinker Tech"]: 5000,
    ["Premium Tech"]: 10000,
}



function newItems(){
    currentDate = new Date();
    currentSales = [];
    var randomNum;
    for (var i = 0;i<3;i++){
        randomNum = Math.floor(Math.random()*100);
        if (randomNum < 30)
            currentSales.push(armoryModule.returnRandomRarity("Market"));
        else if(randomNum < 50)
            currentSales.push(armoryModule.returnRandomRarity("Expensive"));//expensive
        else if(randomNum < 65)
            currentSales.push(armoryModule.returnRandomRarity("Fortune"));//fortune
        else if(randomNum < 82)
            currentSales.push(armoryModule.returnRandomRarity("Scrap Tech"));//scrap tech
        else if(randomNum < 92)
            currentSales.push(armoryModule.returnRandomRarity("Tinker Tech"));//tinker tech
        else
            currentSales.push(armoryModule.returnRandomRarity("Premium Tech"));// premium tec
    }
    for (i of currentSales){
        console.log("Now Selling: "+i.name)
    }
}


async function buyItem(client,teamData,message,args){
    
    var targetItem = currentSales[args[0]-1] || null
    // if they typed the name of the item
    if (targetItem == null) {
        for (item of currentSales){
            if (item.name.toLowerCase()==args[0].toLowerCase()){
                targetItem = item;
            }
        }
    }

    if (teamData.armory  && teamData.armory.length >= maxItems){
        message.reply("Your inventory is full.");
        return;
    }

    if(targetItem == null){
        message.reply(args[0]+" is not currently being sold.");
        return;
    }
    var price = Math.floor(basePrices[targetItem.rarity]*targetItem.payscale);
    if (teamData.funds < price){
        message.reply("You do not have enough funds to purchase the "+targetItem.name);
        return;
    }

    teamData.funds = teamData.funds - price;
    boughtItem = new Object();
    boughtItem["name"] = targetItem.name;
    boughtItem["durability"] = targetItem.durability;
    boughtItem["holderid"] = -1;

    //adding to armory, also adding armory if it was not there beforehand
    if (teamData.armory){
        teamData.armory.push(boughtItem);
    }
    else{
        teamData["armory"] = [];
        teamData.armory.push(boughtItem);
    }
    
    await client.teamsDB.set(`${message.author.id}`, teamData);
    
    message.reply("You have bought the "+boughtItem.name+" for $"+price+".");

}


module.exports.run = async (client, message, args) =>{
    var teamData = await client.teamsDB.get(`${message.author.id}`, 0);
    if (teamData == 0 ) {
        message.reply("You have no data. Use `start` command to begin!");
        return
    }

    if (message.content.substring(1,4).toLowerCase() == "buy"){
        buyItem(client,teamData,message,args);
        return;
    }

    const newDate = new Date();
    if (newDate.getDate() != currentDate.getDate()){
        //console.log(newDate.getDate());
        //console.log(currentDate.getDate());
        newItems();
    }

    var display = new MessageEmbed()
    .setColor("#FFCC00")
    .setTitle("Shop")
    .addField("**Funds**", "$"+teamData.funds, false)
    .setFooter("Shop refreshes with new items in "+(24-newDate.getHours()) + " hours.");

    var sales = ""
    var count = 0;

    for (item of currentSales){
        sales+= `(${++count})**${item.name}** [${item.rarity} ${item.class}] \n`+
        "Price: $"+Math.floor(basePrices[item.rarity]*item.payscale)+" | "+
        "Durability: "+item.durability+" use(s).\n"+
        armoryModule.explainStats(item.bonus)+"\n*"+item.description+"*"+"\n\n";
    }
    display.addField("**Available Products**",sales,false)
    display.addField("Help","Use command `,buy [item name/id]` to purchase."),false
    message.reply(display);
}

module.exports.help = {
    name: "shop",
    description: "Check the current market place. Items change every 24h",
}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}

module.exports.limits = {
    ratelimit: 3,
    cooldown: 1000*5
}

module.exports.setup = async ()=>{
    newItems();
}