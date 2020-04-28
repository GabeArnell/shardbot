module.exports.run = (client, message, args) => {
    message.reply(`pong! ${client.ws.ping.toFixed(2)}ms`);
}

module.exports.help = {
    name: "ping",
    description: "ping command"
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: [],
    ownerOnly: false,
}