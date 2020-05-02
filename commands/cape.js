const { MessageEmbed } = require("discord.js");
const { capeicon } = require('../config');
const { getName } = require('../chargen/names');
const {genInfo} = require('../chargen/powers')

// database
const { VultrexDB } = require("vultrex.db");

// class color themes
const classThemes = {
    ["Blaster"]: {["color"]: 'BLUE', ["icon"]: "https://i.imgur.com/sjt5y6L.png"},
    ['Striker']: {["color"]: 'ORANGE', ['icon']: "https://i.imgur.com/U76yllw.png"},
    ['Tinker']: {['color']: 'GREY', ['icon']: "https://i.imgur.com/Q64Pd7V.png"},
    ['Changer']: {['color']: 'GREEN', ['icon']: "https://i.imgur.com/iumdz1G.png"},
    ['Breaker']: {['color']: 'YELLOW', ['icon']: "https://i.imgur.com/evXkY6N.png"},
    ['Thinker']: {['color']: 'PURPLE', ['icon']: "https://i.imgur.com/SiEuyJd.png"},
    ['Shaker']: {['color']: '#40E0D0', ['icon']: "https://i.imgur.com/RcKnK5h.png"},
    ['Master']: {['color']: '#FF61E2', ['icon']: "https://i.imgur.com/ZpiBOzo.png"},
    ['Mover']: {['color']: '#99FF33', ['icon']: "https://i.imgur.com/hIPTu0J.png"},
    ['Brute']: {['color']: 'RED', ['icon']: "https://i.imgur.com/mQR6w6h.png"},
}
//
//baselines
const statBaseline = {
    strength: 3,
    vitality: 5,
    utility: 2,
    control: 2,
    technique: 3,
}

function newCape(args){
    var cape = new Object();
    var powerData = genInfo(args);

    cape["name"] = getName();
    cape["class"] = powerData.class;
    cape["age"] = Math.floor(Math.random()*12+15);
    cape["alias"] = cape.name;

    // randomizing stats from baseline
    cape["strength"] = statBaseline.strength + Math.floor(Math.random()*3) - 1;
    cape["vitality"] = statBaseline.vitality + Math.floor(Math.random()*3) - 1;
    cape["utility"] = statBaseline.utility + Math.floor(Math.random()*3) - 1;
    cape["control"] = statBaseline.control + Math.floor(Math.random()*3) - 1;
    cape["technique"] = statBaseline.technique + Math.floor(Math.random()*3) - 1;
    
    cape["power"] = {
        ["info"]: powerData.power,
        ["shape"]: powerData.shape,
    },

    cape['activity'] = 'none';
    //console.log(cape.class+ " / "+cape.power.info);
    // adding bonus stats
    for (var attribute of powerData.bonus[0]){
        cape[attribute]++;
    }
    for (var attribute of powerData.bonus[1]){
        cape[attribute]--;
    }

    if (cape.strength < 1){
        cape.strength = 1;
    }
    if (cape.vitality < 1){
        cape.vitality = 1;
    }
    if (cape.utility < 1){
        cape.utility = 1;
    }
    if (cape.control < 1){
        cape.control = 1;
    }
    if (cape.technique < 1){
        cape.technique = 1;
    }


    cape["id"] = 0;

    return cape;
}


function capeDisplay(cape, title){
    
    return (new MessageEmbed()
    .setColor(classThemes[cape.class].color)
    .setAuthor(title || `New Parahuman Recruit`, classThemes[cape.class].icon)
    .addField("Name:", cape.alias, true)
    .addField("Age:", `${cape.age} years old`, true)
    .addField("Class:", cape.class,true)
    .addField("Power:", cape.power.info, false)
    .addField("Stats:", `Strength: ${cape.strength} | Vitality: ${cape.vitality} | Utility: ${cape.utility} | Control: ${cape.control} | Technique: ${cape.technique}`, false)
    );
}


module.exports.run = async (client, message, args ) => {
    cape = newCape(args);
    message.reply(capeDisplay(cape, "Random Parahuman"));
}

module.exports.help = {
    name: "cape",
    description: "Generates a random cape. You can specify any of the currently added classes.",
}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}
module.exports.limits = {
    ratelimit: 2,
    cooldown: 1e4
}

//Secondary functions

module.exports.genCape = () =>{
    return newCape();
}
module.exports.showData = (cape, message, title) =>{
    message.reply(capeDisplay(cape, title));
}
