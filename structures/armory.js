/*
Item:{
    String name: X
    String class: Weapon/Costume/Gadget
    String rarity: Market/Expensive/Fortune/Scrap Tech/Tinker Tech/Premium Tech
    String description: flavor text
    int durability: X (deincrementing each time)
    num payscale = X.X

    bonus:{
        set:{
            [stat]: overwrite value
        }
        alter: {
            [stat]: modifier
        }
    }
}

Cape:
Item: {
    Item: Name
    Durability: 
}
Weapon: (Name of the weapon)


(market/scrap should +0-+1),
 Expensive (+1-+2),
 fortune +2-+3
 tinker tech +3-+4
 premium tech, +4-+5
*/





const pistol = {
    name: "Pistol",
    class: "Weapon",
    rarity: "Market",

    description: "A classic firearm.",
    payscale: 1,
    durability: 20,

    bonus: {
        set: {
            ["strength"]: 3,
            ["technique"]: 3,
        },
        alter:{}
    }
}
const sniper = {
    name: "Sniper Rifle",
    class: "Weapon",
    rarity: "Expensive",

    description: "A powerful but delicate rifle.",
    payscale: 1.4,
    durability: 20,

    bonus: {
        set: {
            ["strength"]: 5,
        },
        alter:{
            ["control"]: -2,
        }
    }
}
const flamethrower = {
    name: "Flamethrower",
    class: "Weapon",
    rarity: "Fortune",

    description: "BURN BABY.",
    payscale: 1.3,
    durability: 25,

    bonus: {
        set: {
        },
        alter:{
            ["strength"]: 2,
            ["control"]: +1,
            ["technique"]: -1,
        }
    }
}
const grenadelauncher = {
    name: "Grenade Launcher",
    class: "Weapon",
    rarity: "Fortune",

    description: "BOOM BABY.",
    payscale: 1.2,
    durability: 15,

    bonus: {
        set: {
            ["strength"]: 4,
        },
        alter:{
            ["vitality"]: -2,
        }
    }
}
const assaultrifle = {
    name: "Assault Rifle",
    class: "Weapon",
    rarity: "Expensive",

    description: "A practical killing machine.",
    payscale: .9,
    durability: 30,

    bonus: {
        set: {
            ["strength"]: 4,
        },
        alter:{
            ["control"]: -1,
        }
    }
}
const sword = {
    name: "Sword",
    class: "Weapon",
    rarity: "Market",

    description: "The LARPer said it was usable.",
    payscale: .5,
    durability: 26,

    bonus: {
        set: {
        },
        alter:{
            ["strength"]: 1,
        }
    }
}
const bustersword = {
    name: "Buster Sword",
    class: "Weapon",
    rarity: "Tinker Tech",

    description: "It's not a phase mom.",
    payscale: 1,
    durability: 16,

    bonus: {
        set: {
        },
        alter:{
            ["strength"]: 3,
            ["control"]: -1,
        }
    }
}
const steelplate = {
    name: "Steel Plate",
    class: "Costume",
    rarity: "Expensive",

    description: "Protective metal armor.",
    payscale: 1.7,
    durability: 20,

    bonus: {
        set: {
        },
        alter:{
            ["vitality"]: 3,
            ["technique"]: -1,
        }
    }
}
const homemadecostume = {
    name: "Cheap Costume",
    class: "Costume",
    rarity: "Market",

    description: "Barebones protection.",
    payscale: .5,
    durability: 10,

    bonus: {
        set: {
        },
        alter:{
            ["vitality"]: 1,
        }
    }
}
const kevlarvest = {
    name: "Kevlar Vest",
    class: "Costume",
    rarity: "Expensive",

    description: "Professional ballistic covering.",
    payscale: 1,
    durability: 8,

    bonus: {
        set: {
        },
        alter:{
            ["vitality"]: 2,
        }
    }
}
const smokegrenade = {
    name: "Smoke Grenade",
    class: "Gadget",
    rarity: "Market Item",

    description: "Spews blinding clouds when triggered.",
    payscale: .3,
    durability: 4,

    bonus: {
        set: {
            ["control"]: 3,

        },
        alter:{
        }
    }
}
const pipebomb = {
    name: "Pipe Bomb",
    class: "Gadget",
    rarity: "Scrap Tech",

    description: "Junkyard explosive. Powerful and cheap.",
    payscale: 1,
    durability: 4,

    bonus: {
        set: {

        },
        alter:{
            ["control"]: 1,
        }
    }
}
const molotov = {
    name: "Molotov",
    class: "Gadget",
    rarity: "Scrap Tech",

    description: "The anarchist classic.",
    payscale: 3,
    durability: 7,

    bonus: {
        set: {
            ["strength"]: 5,
            ["control"]: 5,

        },
        alter:{
            ["vitality"]: -2,
        }
    }
}
const spear = {
    name: "Spear",
    class: "Weapon",
    rarity: "Market",

    description: "Good for controling engagements",
    payscale: .75,
    durability: 16,

    bonus: {
        set: {
        },
        alter:{
            ["strength"]: -1,
            ["control"]: 2,
        }
    }
}
const jetpack = {
    name: "Jetpack",
    class: "Gadget",
    rarity: "Tinker Tech",

    description: "Boost into the skies. Hope you can steer.",
    payscale: 1.4,
    durability: 18,

    bonus: {
        set: {
        },
        alter:{
            ["vitality"]: 1,
            ["control"]: 3,
            ["technique"]: -1,
        }
    }
}
const knife = {
    name: "Knife",
    class: "Weapon",
    rarity: "Scrap Tech",

    description: "Hard edged shiv.",
    payscale: .3,
    durability: 15,

    bonus: {
        set: {
        },
        alter:{
            ["strength"]: 1,
            ["control"]: -1,
        }
    }
}
const powerarmor = {
    name: "Power Armor",
    class: "Costume",
    rarity: "Tinker Tech",

    description: "BWAHAHAHAHAHA.",
    payscale: 1.8,
    durability: 25,

    bonus: {
        set: {
        },
        alter:{
            ["strength"]: 2,
            ["vitality"]: 2,
            ["control"]: -1,
            ["technique"]: -1,
        }
    }
}
const combatAI = {
    name: "Combat Analyzer AI",
    class: "Gadget",
    rarity: "Premium Tech",

    description: "Observes your enemies and guides your movements for the optimal outcome.",
    payscale: 1,
    durability: 35,

    bonus: {
        set: {
            ["technique"]: 5,
        },
        alter:{
            ["control"]: -2,
            ["utility"]: 3,

        }
    }
}
const mechasuit = {
    name: "Mecha Suit",
    class: "Costume",
    rarity: "Premium Tech",

    description: "Giant and powerful tinker armor.",
    payscale: 2,
    durability: 25,

    bonus: {
        set: {
            ["strength"]: 5,
            ["vitality"]: 8,
        },
        alter:{
            ["control"]: 1,
            ["utility"]: 1,

        }
    }
}
const grapplinghook = {
    name: "Grappling Hook",
    class: "Gadget",
    rarity: "Expensive",

    description: "Make sure you aim correctly.",
    payscale: 1.4,
    durability: 16,

    bonus: {
        set: {
        },
        alter:{
            ["control"]: 2,
            ["utility"]: 1,

        }
    }
}
const lasergun = {
    name: "Laser Gun",
    class: "Weapon",
    rarity: "Tinker Tech",

    description: "Pew pew.",
    payscale: 1,
    durability: 20,

    bonus: {
        set: {
            ["strength"]: 6,
        },
        alter:{
            ["technique"]: 1,
        }
    }
}
const enhancerdrugs = {
    name: "Enhancer Drugs",
    class: "Gadget",
    rarity: "Fortune",

    description: "Super steriods.",
    payscale: 1,
    durability: 15,

    bonus: {
        set: {
        },
        alter:{
            ["strength"]: 1,
            ["vitality"]: 1,
            ["control"]: -1,
        }
    }
}
const plasmablade = {
    name: "Plasma Blade",
    class: "Weapon",
    rarity: "Tinker Tech",

    description: "Editted for copyright reasons.",
    payscale: 1.5,
    durability: 25,

    bonus: {
        set: {
        },
        alter:{
            ["strength"]: 3,
            ["technique"]: 1,
            ["vitality"]: -1,
        }
    }
}
const baseballbat = {
    name: "Baseball Bat",
    class: "Weapon",
    rarity: "Scrap Tech",

    description: "Call me Casey.",
    payscale: .5,
    durability: 20,

    bonus: {
        set: {
        },
        alter:{
            ["technique"]: 1,
        }
    }
}
const nanofilamentblade = {
    name: "Nanofilament blade",
    class: "Weapon",
    rarity: "Premium Tech",

    description: "Cuts through bones AND feelings.",
    payscale: 1.5,
    durability: 40,

    bonus: {
        set: {

            ["technique"]: 4,
        },
        alter:{
            ["strength"]:4
        }
    }
}
const armory = [
    pistol,
    sniper,
    flamethrower,
    grenadelauncher,
    bustersword,
    steelplate,
    homemadecostume,
    kevlarvest,
    smokegrenade,
    pipebomb,
    molotov,
    spear,
    jetpack,
    knife,
    powerarmor,
    combatAI,
    mechasuit,
    grapplinghook,
    lasergun,
    enhancerdrugs,
    plasmablade,
    baseballbat,
    nanofilamentblade,

];

module.exports.returnRandomRarity = (rarity)=>{ // returns a random item of given rarity
    var rareItems = [];
    for (item of armory){
        if (item.rarity.toLowerCase() == rarity.toLowerCase()){
            rareItems.push(item);
        }
    }
    return (rareItems[Math.floor(Math.random()*rareItems.length)])
}


const statList = [
    "strength",
    "vitality",
    "utility",
    "technique",
    "control"
]
module.exports.explainStats = (bonus)=>{
    var text = "| ";
    for (stat of statList){
        if (bonus.set[stat]){
            text+=" "+stat+" = "+bonus.set[stat]+" | "
        }
        if (bonus.alter[stat]){
           
            text+=stat+" "
            if (bonus.alter[stat] >0){
                text+="+"
            }
            text+=bonus.alter[stat]+" | "
        }
    }
    

    return (text)
}


module.exports.getData = (itemName)=>{
    itemName = itemName.toLowerCase();
    for (item of armory){
        if (itemName == item.name.toLowerCase()){
            return item;
        }
    }
    return null;
};