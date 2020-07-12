//Protects self through (element) (shape) (effect).

const effects = [
    { name: "and absorbing attacks to power up",
        pro: ["vitality"],
        con: ["control"],
    },
    { name: "that responds reactively to incoming threats",
        pro: ["technique"],
        con: [],
    },
    { name: "that effectively grants them super strength",
        pro: ["strength", "strength"],
        con: ["technique"],
    },
    { name: "while being immune to pain",
        pro: ["vitality"],
        con: [],
    },
    { name: "and enhanced speed",
        pro: ["control","utility"],
        con: [],
    },
    { name: "and altering their size",
        pro: ["strength","control","utility"],
        con: ["technique"],
    },
    { name: "while their power offloads mental interferences",
        pro: ["control","utility"],
        con: [],
    },
    { name: "and rendering some bodily functions redundant",
        pro: ["vitality","utility"],
        con: ["technique"],
    },
    { name: "and not requiring sustanance",
        pro: ["utility"],
        con: [],
    },
    { name: "that is always active",
        pro: ["control"],
        con: [],
    },
    { name: "that must be manually triggered",
        pro: ["technique"],
        con: ["control"],
    },
    { name: "that increases their mass",
        pro: ["strength"],
        con: [],
    },
    { name: "while entering a rage state.",
        pro: ["strength","strength"],
        con: ["technique"],
    },
    { name: "while they are under stress",
        pro: ["technique"],
        con: ["control"],
    },
    { name: "and incentivizes enemies to target them instead of allies",
        pro: ["control","control"],
        con: ["utility"],
    },
    { name: "and causes a lot of collateral damage",
        pro: ["strength"],
        con: ["utility"],
    },
    { name: "and enhances their reactions",
        pro: ["technique"],
        con: [],
    },
    { name: "which sometimes misfires",
        pro: ["strength"],
        con: ["utility","technique"],
    },
]

const armor = {
    name: "armor",
    descriptions: [
       , 'dermal'
       , 'metal'
       , 'stone'
       , 'dirt'
       , 'muscley'
       , 'bone'
       , 'scaley'
       , 'flame'
       , 'spiked'
       , 'sludge'
       , 'ice'
       , 'meat'
       , 'plate'
       , 'chain'
       , 'leather'
       , 'water'
       , 'ivory'
       , 'plant'
       , 'space distorting'
    ]
}
const shields = {
    name: "shields",
    descriptions: [
        'mganetic'
       , 'hardlight'
       , 'gravel'
       , 'energy'
       , 'ice'
       , 'kinetic'
       , 'bone'
       , 'magma'
       , 'goo'
       , 'projectile' 
       , 'reflection'
       , 'detonating'
       , 'vibrating'
       , 'repulsing'
       , 'flashing'
       , 'steel'
       , 'asphalt'
       , 'feathery'
       , 'space-warping'
       , 'attracting'
       , 'gas'
       , 'mental redirection'
       , 'plasma'
    ]
}
const regen = {
    name: "regeneration",
    descriptions: [
        'bursts of'
      ,  'slow but consistent'
      ,  'focused'
      ,  'vampiric'
      ,  'self improving'
      ,  'evolutionary'
      ,  'delayed'
      ,  'inconsistent'
      ,  'rapid'
      ,  'cannibalizing'
      ,  'mechanical'
      ,  'self-organizing'
      ,  'fractal'
      ,  'bloody'
      ,  'ossificating'
      ,  'fast but weak'
    ]
}

const invuln = {
    name: "invulnerability",
    descriptions: [
        'conditional'
      ,  'timed'
      ,  'transferable'
      ,  'limb specific'
      ,  'limited use'
      ,  'low levels of' 
      ,  'adaptive'
      ,  'random'
      ,  'direction-based'
      ,  'painful'
      ,  'ablative'
      ,  'explosive'
      ,  'kinetic'
      ,  'speed-limiting'
    ]
}

const resist = {
    name: "resistance",
    descriptions: [
      ,  'inertial'
      ,  'heat'
      ,  'kinetic'
      ,  'pressure'
      ,  'electricity'
      ,  'parahuman ability'
      ,  'mental'
      ,  'thermal extreme'
    ]
}

const transformation = {
    name: "transformations",
    descriptions: [
        'metal skin'
      ,  'sponge tissue'
      ,  'razorwire nerves'
      ,  'insect-hive flesh'
      ,  'chitin skin'
      ,  'needle hair'
      ,  'granite bone'
      ,  'water arms'
      ,  'spinal spikes'
      ,  'bone sheathe'
      ,  'translucent skin'
      ,  'limb addition'
      ,  'redundant organs'
      ,  'weight manipulating'
      ,  'reactive elemental'
    ]
}


const shapes = [armor,shields,regen,invuln,resist,transformation];

const classPros = ['vitality','vitality','strength'];


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
    //Protects self through (desc) (shape) (effect).
    info["power"] = "Protects self through "+description+" " + shape+" " +effect.name+".";
    info["bonus"] = [[...effect.pro, ...classPros], effect.con];
    info["shape"] = "fists";
    info["description"] = description;

    return info;
}
