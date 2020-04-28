const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");
const {prefix} = require("../config");


function printGeneral(message){
    message.reply(
        "Welcome to Pocket Capes v0.0\n\n"+
        
        "Pocket Capes is a worm idle game where you, the player, manage and grow a team of heros or villains.\n"+
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