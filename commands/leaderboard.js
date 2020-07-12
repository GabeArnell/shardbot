const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");


module.exports.run = async (client, message, args) =>{
    
}

module.exports.help = {
    name: "leaderboard",
    description: "Shows top players",
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