const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");

const maxCapes = 9;
const basePrice = 500;
//modules
const capeModule = require(`${filePath}/cape.js`)

module.exports.run = async (client, message, args) =>{

    var teamData = await client.teamsDB.get(`${message.author.id}`, 0);
    if (teamData == 0 ) {
        message.reply("You have no data. Use `start` command to begin!");
        return
    }
    if (teamData.capes.length >= maxCapes){
        message.reply("You are at maximum capes already");
        return;
    }
    if (teamData.funds < 500){
        message.reply("Your funds are too low. Scouting requires $"+basePrice+".");
        return;
    }

    teamData.funds = teamData.funds - basePrice;
    await client.teamsDB.set(`${message.author.id}`, teamData);


    // genning cape

    message.reply("Scouting a cape for recruitment.");
    var cape = capeModule.genCape();

    capeModule.showData(cape, message);
    

    const offer = await message.channel.send("React with ✅ in the next 5 minutes to add this cape to your team.")
    offer.react("✅");  
    const filter = (reaction, user) => {
        return reaction.emoji.name === '✅' && user.id === message.author.id;
    };
    
    offer.awaitReactions(filter, { max: 1, time: 5*60*1000, errors: ['time'] })
    .then( async collected =>  {
        teamData = await client.teamsDB.get(`${message.author.id}`, 0);
        if (teamData.capes.length >= maxCapes){
            message.reply("You are at maximum capes already");
            return;
        }
        //saving data
        teamData.capes.push(cape);
        cape["id"] = teamData.nextid;
        cape["level"] = 1;
        teamData.nextid++;
        await client.teamsDB.set(`${message.author.id}`, teamData);

        message.channel.send(`Recruited ${cape.name} to ${teamData.name}!\n You can rename your cape with 'name cape [capeid] newname'`);
    })
    .catch(async collected => {
        message.channel.reply('You have not responded in time.');
    });

}

module.exports.help = {
    name: "scout",
    description: "Pay $"+basePrice+" to be offered a new cape recruit. ",
}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}

module.exports.limits = {
    ratelimit: 3,
    cooldown: 2e4
}