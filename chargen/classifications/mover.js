
const effects = [
    { name: "leaves an afterimage",
        pro: ["vitality"],
        con: [],
    },
    { name: "transporting others",
        pro: ['control'],
        con: [],
    },
    { name: "conserving momentum",
        pro: ['technique'],
        con: [],
    },
    { name: "harming others nearby",
        pro: ["strength"],
        con: [],
    },
    { name: "causing fiery explosions",
        pro: ["strength"],
        con: ["control"],
    },
    { name: "creating a short lived clone",
        pro: ["technique"],
        con: [],
    },
    { name: "seeming to remain in place",
        pro: ["technique"],
        con: ["control"],
    },
    { name: "gradually increasing in maximum speed",
        pro: ["strength"],
        con: ["vitality"],
    },
    { name: "twisting space as they move",
        pro: ["strength","control"],
        con: ["technique"],
    },
    { name: "riding a power created object",
        pro: ["vitality","strength"],
        con: ["control"],
    },
    { name: "dragging along everyone near them",
        pro: ["control","strength"],
        con: ["technique"],
    },
    { name: "entering a breaker state for a breif moment",
        pro: ["strength", "strength"],
        con: ["control"],
    },
    { name: "carving a path that can be more easily followed in the future",
        pro: ["control","control"],
        con: ["vitality"],
    },
    { name: "rebounding back to their starting location after a few moments",
        pro: ["technique"],
        con: ["vitality"],
    },
    { name: "shattering objects they touch",
        pro: ["strength","strength"],
        con: ["control"],
    },
    { name: "creating false clones that take other paths but converge at the same end point",
        pro: ["technique", "control"],
        con: ["strength"],
    },
]

const short = {
    name: "short distances",
    descriptions: [
        "shifting personal gravity",
        "bursts of speed",
        "magnetizing themselves",
        "blinking",
        "powerful leaps",
        "flickering in space",
        "accelerating their personal passage through time",
    ]
}
const long = {
    name: "long distances",
    descriptions: [
        "altering their velocity",
        "unaimed teleportation",
        "storing and then releasing momenteum",
        "reducing the friction of what they run across",
        "bouncing off of surfaces with exactly as much momenteum as they impacted it with",
        "creating launch zones",
    ]
}
const known = {
    name: "to known locations",
    descriptions: [
        "creating traversable portals",
        "flickering through space",
        "tags they left behind that they can teleport to",
        "swapping places with objects they have touched",
    ]
}
const air = {
    name: "in the air",
    descriptions: [
        "unaided flight",	
        "wings of energy",
        "gravity manipulation"	,
        "fleshy changer-esque wings",
        "recoil from kinetic blasts"	,
        "levitating platforms",
        "catching the flow of air currents"	,
    ]
}
const hazard = {
    name: "through hazards",
    descriptions: [
        "becoming intangible",
        "turning nearby solids into putty",
        "liquifying their body",
        "warping personal space",
        "climbing on vertical surfaces",
    ]
}




const obstacles = [short,long,known,air,hazard];

const classPros = ['control','control','technique'];

exports.genInfo = () => {
    var info = new Object();
    var effect = effects[Math.floor(Math.random()*effects.length)];
    var obstacle = obstacles[Math.floor(Math.random()*obstacles.length)];

    var description = obstacle.descriptions[Math.floor(Math.random()*obstacle.descriptions.length)];

    info["power"] = "Can move "+obstacle.name+" via  "+description+" while "+effect.name+".";
    info["bonus"] = [[...effect.pro, ...classPros], effect.con];
    info["shape"] = "weapon";
    info["description"] = description;

    return info;
}
