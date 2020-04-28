const { MessageEmbed } = require("discord.js");
const { capeicon } = require('../config');
const { VultrexDB, SQLiteProvider } = require("vultrex.db");
const messageData = new VultrexDB({
    provider: new SQLiteProvider({
        name: "messages",
        fileName: "messages"
    })
});




module.exports.run = async (client, message, args ) => {
    await messageData.connect();
    // finds first person mentioned in the message, or if an id was given, if neither sets member to sender
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const messages = await messageData.get(`${message.guild.id}-${member.id}`,0);

    message.channel.send(new MessageEmbed()
    .setColor("RED")
    .setAuthor(`Data | ${member.user.username}`, capeicon)
    .addField("Messages Sent:", messages, true)
    );
}
module.exports.help = {
    name: "messages",
    description: "view the amount of messages sent by a member",
}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}