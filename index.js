const {token, prefix, postchannel} = require("./config");
const {Client, Collection} = require("discord.js");
const operations = require("./commands/operation.js")

const bot = new Client({
    disableEveryone: true,
    disabledEvents: ["TYPING_START"],
});


bot.prefix = prefix;
bot.commands = new Collection();
bot.limits = new Map();

const commands = require("./structures/command");
commands.run(bot);

const events = require('./structures/events');
events.run(bot);

bot.login(token);


bot.on('ready', () => {
bot.channels.cache.get(postchannel).send("Game is online!");
   operations.setup(bot);
})