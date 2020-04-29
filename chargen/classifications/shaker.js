// Template: Generates (description) (shape) that (after effect)


const effects = [
    { name: "blind on contact",
    plural: "blinds on contact",
        pro: ['control'],
        con: [],
    },

    {name: "restrict targets",
    plural: "restricts targets",
        pro: ['technique'],
        con: []
    },

    {name: "reactivly protects themself",
        pro: ['vitality',],
        con: [],
    },

    {name: "linger in the air",
    plural: "lingers in the air",
        pro: ['strength'],
        con: []
    },

    {name: "draw people in",
    plural: "draws people in",
        pro: ['utility'],
        con: []
    },

    {name: "does not affect themselves",
        pro: ['technique'],
        con: ['utility'],
    },

    {name: "spawn from the environment",
    plural: "spawns from the environment",
        pro: ['control','strength'],
        con: ['technique'],
    },

    {
        name: "overwrite the environment",
        
        plural: "overwrites the environment",
        pro: ['strength','technique'],
        con: ['utility']
    },

    {name: "increase in size when they are injured",
    plural: "increases in size when they are injured",
        pro: ['strength'],
        con: ['control']
    },

    {name: "ignore allies",
    plural: "ignores allies",
        pro: ['utility','control'],
        con: ['strength']
    },

    {name: "can be directed after creation",
        pro: ['technique', 'technique'],
        con: ['vitality']
    },

    {name: "grant perception of the covered area",
    plural: "grants perception of covered areas",
        pro: ['utility'],
        con: []
    },

    {name: "cause energy fluctuations",
        pro: ['strength'],
        con: ['control']
    },

    {name: "leak out when under stress",
    plural: "leaks out when under stress",
        pro: ['vitality'],
        con: ['control'],
    },

    {name: "can be absorbed for sustenance",
        pro: ['vitality','vitality'],
        con: ['strength']
    },

    {name: "trap people inside",
    plural: "traps people inside",
        pro: ['control','control'],
        con: ['strength']
    },
    
    {name: "follow them around",
    
    plural: "follows them around",
        pro: ['vitality',],
        con: ['utility']
    },
    {name: "cover an immense area",
    
        plural: "covers an immense area",
        pro: ['control','control'],
        con: ['technique']
    },
    {name: "grow smaller but more intense",
    
        plural: "grows smaller but more intense",
        pro: ['strength'],
        con: ['technique']
    },
    {name: "connect to each other",
        
        plural: "connects to each other",
        pro: ['utility'],
        con: []
    },
    {name: "expand over time",
        plural: "expands over time",
        pro: ['strength'],
        con: ['control']
    },
];

const clouds = {
    name: "clouds",
    descriptions: [
        "darkness",
        "fire",
        "toxic",
        "mist",
        "ash",
        "clear",
        "static",
        "acidic",
        "explosive"
    ]
}
const fissures = {
    name: "fissures",
    descriptions: [
        "magma",
        "ground",
        "watery",
        "reality",
        "crackling",
        "explosive",
    ]
}
const fields = {
    name: "fields",
    descriptions: [
        "bladed",
        "sound",
        "light",
        "gale",
        "gale",
        "gravity",
        "fire",
        "swamp",
        "ice",
        "entropic",
        "friction",
        "explosive"
    ]
}
const explosions = {
    name: "explosions",
    descriptions: [
        "light",
        "heat",
        "warped space",
        "sound",
        "time",
        "electric",
        "concussive",
        "rubble",
        "water",
        "ice",
        "SUPER EXPLOSIVE"
    ]
}
const walls = {
    name: "walls",
    descriptions: [
        "crystal",
        "ice",
        "metal",
        "glass",
        "flesh",
        "lightning",
        "fire",
        "sandstone",
        "earth",
        "hardlight",
        "compressed air",
    ]
}
const ripples = {
    name: "ripples",
    descriptions: [
        "gravity",
        "heat",
        "force",
        "light",
        "darkness",
        "cold",
        "earthquake",
        "exploding"
    ]
}
const portals = {
    name: "portals",
    descriptions: [
        "black hole",
        "light",
        "time",
    ]
}
const controlOver = {
    name: "control",
    descriptions: [
        "metal",
        "water",
        "stone",
        "fire",
        "air",
        "space",
        "electricity",
        "explosions",
    ]
}




const shapes = [clouds,fissures,fields,explosions,walls,ripples,portals,controlOver];

const classPros = ['control','control','strength'];


var totalCombinations = []
for (shape of shapes){
    for (desc of shape.descriptions){
        totalCombinations.push([shape.name,desc])
    }
}


exports.genInfo = () => {
    var info = new Object();
    var effect = effects[Math.floor(Math.random()*effects.length)];

    var combo = totalCombinations[Math.floor(Math.random()*totalCombinations.length)];

    var shape = combo[0];

    var description = combo[1];
    if (shape != "control"){
        info["power"] = "Generates " + description + " " + shape + " that " + effect.plural + ".";
        info["shape"] = shape;
    }
    else{
        info["power"] = "Has " + description+ " control that " + (effect.plural || effect.name) + ".";
        info["shape"] = description;
    }
    info["bonus"] = [[...effect.pro, ...classPros], effect.con];
    info["description"] = description;

    return info;
}

