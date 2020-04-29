// Template: (Summon)) (description) (shape) that (after effect).


const effects = [
    { name: "are difficult to control",
        pro: ['strength'],
        con: ['control'],
    },

    {name: "explode upon death",
        pro: ['strength'],
        con: ['vitality']
    },

    {name: "regenerate",
        pro: ['vitality'],
        con: []
    },

    {name: "share perception with the master",
        pro: ['control','utility'],
        con: []
    },

    {name: "attack anything in sight",
        pro: ['strength','vitality'],
        con: ['control']
    },

    {name: "adapt against different opponents",
        pro: ['technique','technique'],
        con: ['control'],
    },

    {name: "duplicate while fighting",
        pro: ['control','control'],
        con: ['strength'],
    },

    {
        name: "have super strength",
        pro: ['strength','strength'],
        con: ['technique']
    },

    {name: "resist parahuman attacks",
        pro: ['vitality'],
        con: []
    },

    {name: "create a hazardous environment",
        pro: ['control'],
        con: []
    },

    {name: "combine to create a better minion",
        pro: ['technique'],
        con: ['vitality']
    },

    {name: "latch onto targets",
        pro: ['strength'],
        con: []
    },

    {name: "have strategic ability",
        pro: ['technique','control','utility'],
        con: ['strength']
    },

    {name: "swap places with the master",
        pro: ['control','technique'],
        con: ['vitality'],
    },

    {name: "instinctively protect the master",
        pro: ['vitality'],
        con: []
    },

    {name: "can transport people",
        pro: ['utility',],
        con: []
    },
    {name: "manipulate their own size",
        pro: ['strength'],
        con: []
    },
    {name: "do not register pain",
        pro: ['vitality', 'vitality'],
        con: ['technique']
    },
    {name: "absorb the master's wounds",
        pro: ['vitality'],
        con: []
    },
];

const desc = [

    "giant",
    "sentient",
    "short-lived",
    "small",
    "rampaging",
    "phantasmal",
    "shining",
    "swarm of",
    "customizable",
    "flaming",
    "frozen",
    "dark",
    "mutated",
    "translucent",
]

const minions = [
    "humans",
    "dinosaurs",
    "goblins",
    "insects",
    "spirits",
    "elementals",
    "cronenberg monsters",
    "undead",
    "animals",
    "statues",
    "plants",
    "clones",
    "golems",
    "demons",
    "mites",
    "puppets",
    "projections",
    "robots",
    "birds of prey",
    "carnivores",
    "angels",
    "reptiles",
    "oozes"
]

const summons = [
"Grows",
"Controls",
"Summons",
"Births",
"Directs",
"Builds",
"Orders",
"Materializes",
]

const classPros = ['control','control','utility'];

exports.genInfo = () => {
    var info = new Object();
    var effect = effects[Math.floor(Math.random()*effects.length)];
    var minion = minions[Math.floor(Math.random()*minions.length)];
    var summon = summons[Math.floor(Math.random()*summons.length)];
    var description = desc[Math.floor(Math.random()*desc.length)];

    info["power"] = summon+" " + description + " " + minion + " that " + effect.name + ".";
    info["bonus"] = [[...effect.pro, ...classPros], effect.con];
    info["shape"] = minion;
    info["description"] = description;

    return info;
}

