// Template: Generates (description) (shape) that (after effect)


const effects = [
    { name: "blind on contact",
        pro: ['control'],
        con: [],
    },

    {name: "restrict targets",
        pro: ['technique'],
        con: []
    },

    {name: "reactivly protects themself",
        pro: ['vitality',],
        con: [],
    },

    {name: "linger in the air",
        pro: ['strength'],
        con: []
    },

    {name: "draw people in",
        pro: ['utility'],
        con: []
    },

    {name: "does not affect themselves",
        pro: ['technique'],
        con: ['utility'],
    },

    {name: "spawn from the environment",
        pro: ['control','strength'],
        con: ['technique'],
    },

    {
        name: "overwrite the environment",
        pro: ['strength','technique'],
        con: ['utility']
    },

    {name: "increase in size when they are injured",
        pro: ['strength'],
        con: ['control']
    },

    {name: "ignores allies",
        pro: ['utility','control'],
        con: ['strength']
    },

    {name: "can be directed after creation",
        pro: ['technique', 'technique'],
        con: ['vitality']
    },

    {name: "grants perception of the covered area",
        pro: ['utility'],
        con: []
    },

    {name: "causes energy fluctuations",
        pro: ['strength'],
        con: ['control']
    },

    {name: "leaks out when under stress",
        pro: ['vitality'],
        con: ['control'],
    },

    {name: "can be absorbed for sustenance",
        pro: ['vitality','vitality'],
        con: ['strength']
    },

    {name: "trap people inside",
        pro: ['control','control'],
        con: ['strength']
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
        "static"
    ]
}
const fissures = {
    name: "fissures",
    descriptions: [
        "magma",
        "ground",
        "watery",
        "reality",
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
        "frozen",
        "entropy",
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
    ]
}


const shapes = [clouds,fissures,fields,explosions,walls,ripples];

const classPros = ['control','control','strength'];

exports.genInfo = () => {
    var info = new Object();
    var effect = effects[Math.floor(Math.random()*effects.length)];
    var shape = shapes[Math.floor(Math.random()*shapes.length)];

    var description = shape.descriptions[Math.floor(Math.random()*shape.descriptions.length)];

    info["power"] = "Generates " + description + " " + shape.name + " that " + effect.name + ".";
    info["bonus"] = [[...effect.pro, ...classPros], effect.con];
    info["shape"] = shape.name;
    info["description"] = description;

    return info;
}

