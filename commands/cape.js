const { MessageEmbed } = require("discord.js");
const { capeicon } = require('../config');
const { getName } = require('../chargen/names');
const {genInfo} = require('../chargen/powers')
const armoryModule = require('../structures/armory')
const levelModule = require('../structures/level')

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
    ['Stranger']: {['color']: 'BLACK', ['icon']: "https://i.imgur.com/zLsMIPu.png"},
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

    cape["level"] = 0;
    cape["xp"] = 0;
    
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

const statList = [
    "strength",
    "vitality",
    "utility",
    "technique",
    "control"
]

function capeDisplay(cape, title){
    var display = new MessageEmbed()
    .setColor(classThemes[cape.class].color)
    .setAuthor(title || `New Parahuman Recruit`, classThemes[cape.class].icon)
    .addField("**Name**", cape.alias, true)
    .addField("**Age**", `${cape.age} years old`, true)
    .addField("**Class**", cape.class,true)
    .addField("**Power**", cape.power.info, false);


    if (!cape.item){
        display.addField("**Stats**", `Strength: ${cape.strength} | Vitality: ${cape.vitality} | Utility: ${cape.utility} | Control: ${cape.control} | Technique: ${cape.technique}`, false)
    }
    else{
        const data = armoryModule.getData(cape.item.name)
        const bonus = data.bonus;
        const set = bonus.set;
        const alter = bonus.alter;

        var fakeStats = {}
        for (var stat of statList){
            if (set[stat]){
                fakeStats[stat] = set[stat]
            }
        }
        for (var stat of statList){
            if (alter[stat]){
                fakeStats[stat] = cape[stat]+alter[stat]
                if (fakeStats[stat] < 1){
                    fakeStats[stat] = 1
                }
            }
        }
        var info = `Strength: ${cape.strength} `;
        if (fakeStats["strength"]){
            info+="("+fakeStats["strength"]+")";
        }
        info+= ` | Vitality: ${cape.vitality}`;
        if (fakeStats["vitality"]){
            info+="("+fakeStats["vitality"]+")";
        }
        info+= ` | Utility: ${cape.utility}`;
        if (fakeStats["utility"]){
            info+="("+fakeStats["utility"]+")";
        }
        info+= ` | Control: ${cape.control}`;
        if (fakeStats["control"]){
            info+="("+fakeStats["control"]+")";
        }
        info+= ` | Technique: ${cape.technique}`;
        if (fakeStats["technique"]){
            info+="("+fakeStats["technique"]+")";
        }
        display.addField("**Stats**", info,false)
        display.addField("Item",
        `**${cape.item.name}** (${data.class})`+
        " | Durability: "+cape.item.durability+" use(s)\n"+
            armoryModule.explainStats(data.bonus)+"\n*"+data.description+"*"
        )
    }
    
    if (cape.level && cape.level > 0){
        var xpData = levelModule.returnLevel(cape);
        const fillChar = `\\`
        const emptyChar = "\xa0"
        display.addField("Level: "+cape.level,
            "`["+fillChar.repeat(xpData[2])+emptyChar.repeat(20-xpData[2])+"]`"+`(${xpData[1]}%)`
        )
    }

    return (display);
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
    ratelimit: 1,
    cooldown: 1000*2
}

//Secondary functions

module.exports.genCape = () =>{
    return newCape();
}
module.exports.showData = (cape, message, title) =>{
    message.reply(capeDisplay(cape, title));
}
