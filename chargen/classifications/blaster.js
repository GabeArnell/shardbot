// Template: Shoots (description) (shape) from (source) that (after effect)
// test mark

// sources
const sources = [
    "their eyes",
    "their mouth",
    "their hands",
    "their kicks",
    "their hair",
    "touched objects",
    "floating globes",
    "a weapon",
    "random points nearby",
    "their glowing aura",
    "their chest",
    "a halo",
    "anywhere within sight",
    "a mobile source",
    "an emplacement turret",


];

const effects = [
    { name: "are heat seaking",
        pro: ['technique'],
        con: [],
    },

    {name: "return after being shot",
        pro: ['strength'],
        con: []
    },

    {name: "can be charged up for more powerful effects",
        pro: ['strength','strength'],
        con: ['technique'],
    },

    {name: "teleport targets a short distance",
        pro: ['utility'],
        con: []
    },

    {name: "burst on contact",
        pro: ['control'],
        con: []
    },

    {name: "create a tether to targets",
        pro: ['utility','utility'],
        con: ['strength'],
    },

    {name: "stick to targets",
        pro: ['strength','strength'],
        con: ['vitality'],
    },

    {
        name: "knock targets back",
        pro: ['strength','control'],
        con: ['utility']
    },

    {name: "confuse and befuddle",
        pro: ['control', 'control'],
        con: ['strength']
    },

    {name: "alter the composition of targets",
        pro: ['utility'],
        con: []
    },

    {name: "pass through inorganic matter",
        pro: ['technique'],
        con: []
    },

    {name: "alter physical laws",
        pro: ['utility','utility'],
        con: ['technique']
    },

    {name: "duplicate soon after use",
        pro: ['control', 'strength'],
        con: ['technique']
    },

    {name: "inflict ongoing damage targets",
        pro: ['strength'],
        con: [],
    },

    {name: "slow the target",
        pro: ['control','technique'],
        con: ['vitality']
    },

    {name: "mark targets for future hits",
        pro: ['technique'],
        con: []
    },

    {name: "mess with target's size",
        pro: ['utility'],
        con: []
    },
    {name: "alter emotion",
        pro: ['vitality'],
        con: []
    },
    {name: "create hazard areas upon hit",
        pro: ['control','strength'],
        con: ['technique']
    },
    {name: "create a temporary clone of the target",
        pro: ['control'],
        con: ['technique']
    },
];

const globes = {
    name: "globes",
    descriptions: [
        "lightning",
        "fire",
        "ice",
        "steel",
        "napalm",
        "smoke",
        "writhing flesh",
        "acid",
        "water",
        "darkness",
        "black hole",
        "adhessive slime",
        "compressed air",
        "molten metal",
        "blood",
        "bone",
        "fragile crystal",
        "frozen time",
        "gas",
        "metal",
    ]
}

const particles = {
    name: "particles",
    descriptions: [
        "sand",
        "dust",
        "ash",
        "glass",
        "radioactive",
        "glowing",
        "soil",
        "razor",
        "darkness",
        "disintegration",
        "crystal",
        "spore",
        "corrosive",
        "pain",
        "electrical static",
        "dirt",
    ]
}

const slivers = {
    name: "slivers",
    descriptions: [
        "steel",
        "light",
        "force",
        "glass",
        "bone",
        "darkness",
        "ice",
        "wood",
        "void",
        "fabric",
        "wire",

    ]
}

const beams = {
    name: "beams",
    descriptions: [
        "light",
        "concussive",
        "force",
        "cold",
        "disintegration",
        "refracted space",
        "darkness",
        "emotion",
        "radiation",
        "heat",
        "vacuum"
    ]
}

const blasts = {
    name: "blasts",
    descriptions: [
        "concussive",
        "force",
        "electric",
        "fire",
        "entropy",
        "darkness",
        "sonic",
        "toxic gas",
        "gravity",
        "space distortion",
        "time distortion",
        "flesh",
        "blood",
        "meteorite",
        "junk",
        "laser",
        "gas",
        "metal",
        "stasis",
    ]
}


const waves = {
    name: "waves",
    descriptions: [
        'water',
        'sand',
        'heat',
        'concussive force',
        'light',
        'darkness',
        'burning fog',
        'fear',
        'earth',
        'pain',
        'noise',
        'meat',
        'EMP',
        'crystal shard',
        'skin',
        'trash',
        'gas',
    ]
}

const arcs = {
    name: "arcs",
    descriptions: [
        'plasma',
        'lightning',
        'flashing light',
        'primsatic lights',
        'warped time'
    ]
}

const streams = {
    name: "streams",
    descriptions: [
        'plasma',
        'wind',
        'fire',
        'napalm',
        'electricity',
        'blood',
        'webbing',
        'gas',
    ]
}

const uniques = {
    name: "",
    descriptions: [
        "chunks of ground",
        "archaic runes",
        "chaotic energy",
        "tentacles",
        "random elements",
        'flechette storms',
        'parasitic critters',
    ]
}

const shapes = [globes,particles,slivers,beams,blasts,waves,arcs,streams,uniques];

const classPros = ['strength','strength','control'];


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

    var shape = combo[0]

    var description = combo[1]
    var source = sources[Math.floor(Math.random()*sources.length)]

    info["power"] = "Fires " + description + " " + shape + " from " + source + " that " + effect.name + ".";
    info["bonus"] = [[...effect.pro, ...classPros], effect.con];
    info["shape"] = shape;
    if (shape == ""){
        info.shape = description
    }
    info["description"] = description;

    return info;
}

