
const { MessageEmbed } = require("discord.js");
const { capeicon } = require('../config');

const capeModule = require("../commands/cape.js");


// Customs, specialized data for people that helped me on the project - also for testing specific classes

const customCapes = {
    // Mandy - Forge
    ["307362180909498371"]: {
        name: "Forge",
        class: "Striker",
        age: 23,
        alias: "uhh....Sarah?",
        
        strength: 6,
        vitality: 7,
        utility: 4,
        control: 2,
        technique: 5,

        power: {
            ["power"]: 'Enchants items with powers and fights with a halo of golden weapons.',
            ["bonus"]: ['strength', 'strength', 'technique'],
            ['shape']: 'golden weapons',
            ['description']: 'halo',
        }
    },
    // Quantum - Arsenal
    ["153249576957116417"]:{
        name: "Arsenal",
        class: "Tinker",
        age: 23,
        alias: "Tess Layfield",

        strength: 5,
        vitality: 3,
        utility: 7,
        control: 2,
        technique: 4,

        power: {
            ['power']: 'Tinkers with lightning powered scrap weapons.',
            ['bonus']: ['utility', 'strength'],
            ['shape']: 'scrap weapons',
            ['description']: 'lightning powered',

        }

    },
    // Oberon - Angler Danger
    ["131977273623576576"]:{
        name: "Angler Danger",
        class: "Changer",
        age: 17,
        alias: "Trent Dunbar",

        strength: 3,
        vitality: 8,
        utility: 2,
        control: 4,
        technique: 3,

        power: {
            ['power']: 'Changes bodyparts, granting various sea monster features.',
            ['bonus']: ['vitality','vitality', 'strength'],
            ['shape']: 'fins',
            ['description']: 'sea monster body',

        }
    },
    // Grenade - Bod
    ["321238339699081216"]:{
        name: "Bodhisattva",
        class: "Breaker",
        age: 20,
        alias: "Scott",

        strength: 4,
        vitality: 4,
        utility: 4,
        control: 6,
        technique: 5,

        power: {
            ['power']: "Shifts into a golden buddha statue to control order and chaos.",
            ['bonus']: ["Vitality", "Utility"],
            ['shape']: "order waves",
            ['description']: "golden energy"
        }

    },
    // ATW - Reign
    ["511907087903752195"]:{
        name: "Reign",
        class: "Shaker",
        age: 34,
        alias: "Alexander-Theodore Williams",
        
        strength: 6,
        vitality: 4,
        utility: 3,
        control: 9,
        technique: 3,
        
        power: {
            ['power']: "Creates fields of fractured reality that overwrite areas of existance with his own.",
            ['bonus']: ["Control", "Control"],
            ['shape']: "laboratory hazards",
            ['description']: "fracture fields"
        }
    },
    // Hyper - Athena
    ["138340069311381505"]:{
        name: "Athena",
        class: "Thinker",
        age: 17,
        alias: "Kirsten B. Griffin",

        strength: 3,
        vitality: 4,
        utility: 4,
        control: 6,
        technique: 6,
        
        power: {
            ['power']: "Nothing to see here.",
            ['bonus']: ["Technique", "Utility"],
            ['shape']: "spear",
            ['description']: "skills"
        }
    },
   // Sass - Forte
   ["202456005429297153"]:{
        name: "The Sword Sage",
        class: "Thinker",
        age: 17,
        alias: "Chet Willingham",

        strength: 5,
        vitality: 3,
        utility: 1,
        control: 4,
        technique: 6,
        
        power: {
            ['power']: "Godlike mastery over sword-like objects.",
            ['bonus']: ["Technique", "Strength"],
            ['shape']: "sword",
            ['description']: "sword techniques"
        },
    },
    // Unis - DJ 
   ["195951867254145024"]:{
    name: "DJ Hip Hop",
    class: "Tinker",
    age: 1,
    alias: "DJ Hip Hop",

    strength: 3,
    vitality: 3,
    utility: 6,
    control: 5,
    technique: 4,
    
    power: {
        ['power']: "Builds reality warping musical devices.",
        ['bonus']: ["Utility", "Strength"],
        ['shape']: "vynl slicers",
        ['description']: "music waves"
    },
},
    
}





function getCapeData(data){
    var cape = capeModule.genCape();

    cape["name"] = data.name;
    cape["class"] = data.class;
    cape["age"] = data.age;
    cape["alias"] = data.alias;

    // randomizing stats from baseline
    cape["strength"] = data.strength ;
    cape["vitality"] = data.vitality;
    cape["utility"] = data.utility;
    cape["control"] = data.control;
    cape["technique"] = data.technique;
    
    cape["power"].info = data.power.power;
    cape.power.shape = data.power.shape;
    cape["id"] = 0;

    return cape;
}


module.exports.run = (teamData,authorId)=> {
    
    if (customCapes[authorId]){
        var cape = getCapeData(customCapes[authorId]);
        cape.id = teamData.nextid;
        teamData.capes.push(cape);
        teamData.nextid++;
    }

    return teamData;
}
