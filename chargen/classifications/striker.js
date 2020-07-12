// Template: Attacks with (description) (vector) that (effect) 

const effects = [
    { name: "slow the enemy",
        pro: ["control"],
        con: [],
    },
    { name: "can be charged up for more damage",
        pro: ["strength","strength"],
        con: ["vitality","control"],
    },
    { name: "teleport targets a short distance",
        pro: ["control"],
        con: [],
    },
    { name: "burst on contact",
        pro: ["strength"],
        con: [],
    },
    { name: "confuse and befuddle",
        pro: ["technique"],
        con: [],
    },
    { name: "inflict ongoing damage to target",
        pro: ["strength"],
        con: [],
    },
    { name: "mark target for future hits",
        pro: ["technique"],
        con: [],
    },
    { name: "alter the targets perception of time",
        pro: ["utility"],
        con: [],
    },
    { name: "explode after a brief period",
        pro: ["control"],
        con: [],
    },
    { name: "shred non-organic matter",
        pro: ["utility"],
        con: [],
    },
    { name: "create a parasitic effect in the target",
        pro: ["vitality"],
        con: [],
    },
    { name: "swap them with their target",
        pro: ["control"],
        con: [],
    },
    { name: "accelrate the targets velocity rapidly",
        pro: ["control"],
        con: [],
    },
    { name: "seem initially harmless but has severe long term effects",
        pro: ["vitality"],
        con: [],
    },
    { name: "blind the targets senses",
        pro: ["control","control"],
        con: ["strength"],
    },
    { name: "hamper the targets movement",
        pro: ["technique"],
        con: [],
    },
    { name: "accelerate the target's natural proccesses",
        pro: ["utility"],
        con: [],
    },
    { name: "implant diseases",
        pro: ["control"],
        con: [],
    },
    { name: "magnetize the target",
        pro: ["control"],
        con: [],
    },
    { name: "give the user knowledge of the targets emotional state",
        pro: ["control","technique"],
        con: ["strength"],
    },
    { name: "destroy the targets flesh",
        pro: ["strength"],
        con: [],
    },
    { name: "flicker the target through alternate versions of themselves",
        pro: ["utility"],
        con: [],
    },
    { name: "melt inorganic matter",
        pro: ["strength"],
        con: ["utility"],
    },
    { name: "melt organic matter",
        pro: ["control"],
        con: [],
    },
    { name: "push the target in a given direction",
        pro: ["control","utility"],
        con: [],
    },
    { name: "heal the user as they inflict damage",
        pro: ["vitality","vitality"],
        con: ["control","strength"],
    },
    { name: "increase in strength when they are outnumbered",
        pro: ["strength"],
        con: ["control"],
    },
    { name: "deal a surprising amount of damage",
        pro: ["strength"],
        con: ["vitality"],
    },
    { name: "steal items from the target",
        pro: ["utility","utility"],
        con: [],
    },
    { name: "track the target's location",
        pro: ["control","control"],
        con: ["technique"],
    },
    { name: "track the target's health",
        pro: ["control"],
        con: [],
    },
    { name: "freeze the target for a few seconds",
        pro: ["utility","vitality"],
        con: ["strength"],
    },
    { name: "grant allies enhanced speed",
        pro: ["utility","control"],
        con: [],
    },
    { name: "grant allies enhanced durability",
        pro: ["vitality"],
        con: [],
    },
    { name: "aim themselves",
        pro: ["technique"],
        con: ["strength"],
    },
    { name: "cauterize flesh",
        pro: ["vitality"],
        con: [],
    },
    { name: "corrode metal",
        pro: ["strength"],
        con: ["utility"],
    },
    { name: "asynchronously affects the target's bodyparts",
        pro: ["technique"],
        con: ["control"],
    },
    { name: "make things malleable",
        pro: ["utility"],
        con: [],
    },
    { name: "transmutes materials",
        pro: ["utility"],
        con: [],
    },
    { name: "change the target's mass",
        pro: ["control"],
        con: [],
    },
    { name: "temporarily removes the target from the battlefield",
        pro: ["control","vitality"],
        con: ["strength"],
    },
    { name: "mutates the target",
        pro: ["strength","technique"],
        con: ["vitality","control"],
    },

];

const vectors = [
     'Weapons'
   , 'Blades'
   , 'Punches'
   , 'Strikes'
   , 'Kicks'
   , 'imbued objects'
   , 'tags'
   , 'tentacles'
   , 'claws'
   , 'taps'
   , 'whips'
   , 'controlled objects'
   , 'caltrops'
   , 'Tackles'
   , 'Bodychecks'
   , 'Martial Arts'
   , 'Munitions'
   , 'Ribbons'
   , 'Feathers'
   , 'Papers'
   , 'Strings'
   , 'YoYos'
   , 'Ropes'
   , 'Limbs'
   , 'Nunchucks'
   , 'Staves'
   , 'Knives'
   , 'Spears'
   , 'Fingernails'
   , 'Touches'
]

const desc = [
    ""
   , 'Flaming'
   , 'Enchanted'
   , 'Telekinetic'
   , 'Electrified'
   , 'Space-warping'
   , 'stretching'
   , 'magnetic'
   , 'glowing'
   , 'burning'
   , 'invisible'
   , 'silent'
   , 'freezing'
   , 'icey'
   , 'explosive'
   , 'fleshy'
   , 'necrotic'
   , 'imploding'
   , 'folding'
   , 'transmuting'
   , 'quick'
   , 'heavy'
   , 'lava'
   , 'water'
   , 'rock'
   , 'grassy'
   , 'wind'
   , 'eldritch'
   , 'gravity'
   , 'hardlight'
   , 'steel'
   , 'razor'
   , 'cloth'
   , 'muscle'
   , 'bone'
   , 'metalic'
   , 'vaccuum'
   , 'void'
   , 'radioactive'
]

const classPros = ['strength','strength','technique'];

exports.genInfo = () => {
    var info = new Object();
    var effect = effects[Math.floor(Math.random()*effects.length)];
    var vector = vectors[Math.floor(Math.random()*vectors.length)].toLowerCase();
    var description = desc[Math.floor(Math.random()*desc.length)].toLowerCase();
    //Attacks with (description) (vector) that (effect) 
    info["power"] = "Attacks with "+description+" "+vector+" that " + effect.name.toLowerCase() + ".";
    info["bonus"] = [[...effect.pro, ...classPros], effect.con];
    info["shape"] = description+" "+vector;
    info["description"] = description;

    return info;
}

