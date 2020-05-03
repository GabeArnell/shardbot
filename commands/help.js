const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const {prefix} = require("../config");

function printGeneral(message){
    message.reply(
        "Shardbot v0.0\n\n"+
        
        "Shardbot is a Worm idle game where you, the player, manage and grow a team of heros or villains.\n"+
        "To start your own game use command `"+prefix+"start` or reset your game with `"+prefix+"start RESET`.\n"+
        "Use `"+prefix+"menu` to see your options and `"+prefix+"stats` for detailed information about your team."
        +
        "\n\n"+"For more information type `"+prefix+"help combat` for info on fighting and stats."
    );
}

function printFight(message){
    message.reply("\nStats\n"+
    "**Strength** - Cape's attack value. When they land a hit they subtract strength from the target's Vitality\n"+
    "**Vitality** - Cape's hit points. When vitality hits zero the cape is defeated.\n"+
    "**Utility** - Cape's mission effectiveness. Higher utility capes complete objectives faster.\n"+
    "**Control** - Cape's battlefield influence. Contributes to determining initiative each round.\n"+
    "**Technique** - Cape's fighting skill. Increases chance to hit and dodge attacks.\n\n"
    
    )
}
function printCredit(message){
    message.reply("\**Credits**\n"+
    "**Programmer and Game Designer:** - QuantumToast#7675\n"+
    "*\n"+
    "**Project Contributors**\n"+
    "hyperflare#4131\ngrenade_beam#0022\nOberon#8180\nAaronRyuchi#8171\nSal#2011\n"
    
    )
}

module.exports.run = (client, message, args) => {
    if (!args[0]){
        printGeneral(message);
    }
    else{
        const arg = args[0]
        if (arg == "combat"){
            printFight(message);
            return;
        }
        if (arg == "credits"){
            //printCredit(message);
            return;
        }
        var cmd = client.commands.get(arg.toLowerCase())
        if (cmd){
            message.reply(cmd.help.name+": "+cmd.help.description);
        }

    }
}

module.exports.help = {
    name: "help",
    description: "user guide"
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: [],
    ownerOnly: false,
}