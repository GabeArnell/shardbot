const {token, prefix, postchannel} = require("./config");
const {Client, Collection} = require("discord.js");
const operations = require("./commands/operation.js")

const bot = new Client({
    disableEveryone: true,
    disabledEvents: ["TYPING_START"],
});

//database: Key == 
const { VultrexDB } = require("vultrex.db");
const teamsDB = new VultrexDB({
    provider: 'sqlite',
    table: 'usertable',
    fileName: 'teamdatabase'
});
const questsDB = new VultrexDB({
    provider: "sqlite",
    table: 'questtable',
    fileName: 'questdatabase'
});
console.log("booting")
teamsDB.connect().then(()=>{
    console.log("got teamsdb");
    questsDB.connect().then(() => {
        console.log("got questsDB");
        bot.prefix = prefix;
        bot.commands = new Collection();
        bot.limits = new Map();
        bot.teamsDB = teamsDB;
        bot.questsDB = questsDB;
        
        const commands = require("./structures/command");
        commands.run(bot);
        
        const events = require('./structures/events');
        events.run(bot);
        
        bot.login(token);
        
        
        bot.on('ready', () => {
        bot.channels.cache.get(postchannel).send("Game is online!");
           operations.setup(bot);
        })
    });
});



