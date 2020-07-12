// Template: Enters a (description) (form) state granting them (bonus) and (bonus) but (restriction).

const effects = [
    { name: "natural weaponry",
        pro: ["strength"],
        con: [],
    },
    { name: "natural armour",
        pro: ["vitality"],
        con: ["technique"],
    },
    { name: "enhanced strength",
        pro: ["strength"],
        con: [],
    },
    { name: "enhanced speed",
        pro: ["control"],
        con: [],
    },
    { name: "enhanced endurance",
        pro: ["vitality"],
        con: [],
    },
    { name: "armor-penetration",
        pro: ["strength"],
        con: [],
    },
    { name: "materialized armor",
        pro: ["vitality"],
        con: [],
    },
    { name: "a protective shell",
        pro: ["vitality"],
        con: ["strength"],
    },
    { name: "an element-infused arena",
        pro: ["control"],
        con: [],
    },
    { name: "command of lesser minions",
        pro: ["control"],
        con: ["technique"],
    },
    { name: "a morale boost",
        pro: ["technique"],
        con: [],
    },
    { name: "a fear aura",
        pro: ["technique"],
        con: [],
    },
    { name: "command over light and shadow",
        pro: ["strength"],
        con: [],
    },
    { name: "a power boost",
        pro: ["strength"],
        con: [],
    },
    { name: "enhanced senses",
        pro: ["utility"],
        con: [],
    },
    { name: "limited invulnerability",
        pro: ["vitality"],
        con: [],
    },
    { name: "flight",
        pro: ["control"],
        con: ["strength"],
    },
    { name: "enhanced reflexes",
        pro: ["technique"],
        con: [],
    },
    { name: "elemental control",
        pro: ["strength"],
        con: ["control"],
    },
    { name: "duplication abilities",
        pro: ["control"],
        con: ["technique"],
    },
    { name: "size manipulation",
        pro: ["strength","vitality"],
        con: ["technique","control"],
    },
    { name: "phasing abilities",
        pro: ["vitality"],
        con: ["strength"],
    },
    { name: "environmental control",
        pro: ["control"],
        con: [],
    },
    { name: "intangibility",
        pro: ["vitality"],
        con: [],
    },
    { name: "natural projectiles",
        pro: ["control"],
        con: [""],
    },
    { name: "elemental projectiles",
        pro: ["strength"],
        con: [""],
    },

];

const desc = [
    'Shining'
   , 'Flaming'
   , 'water'
   , 'Frozen'
   , 'plasma'
   , 'electric'
   , 'Translucent'
   , 'Ashen'
   , 'ghostly'
   , 'flickering'
   , 'flying'
   , 'partial'
   , 'polished'
   , 'silver'
   , 'metallic'
   , 'light-sapping'
   , 'terrifying'
   , 'natural'
   , 'nimble'
   , 'lumbering'
   , 'layered'
   , 'fractal'
   , 'hard'
   , 'space-warping'
   , 'holographic'
   , 'obsidian'
   , 'hollow'
]

const states = [
    'Elemental'
   , 'Statue'
   , 'Ghost'
   , 'Golem'
   , 'Shadow'
   , 'Lattice'
   , 'Monolith'
   , 'Corona'
   , 'Dragon'
   , 'Wyrm'
   , 'Leviathan'
   , 'Fractal'
   , 'Star'
   , 'Statue'
   , 'Tower'
   , 'Sword'
   , 'Mirror'
   , 'light'
   , 'stone'
   , 'steel'
   , 'reality tear'  
]

const restrictions = [
    'they suffer continous damage while in the breaker form'
   , 'the breaker form wanes in strength over time'
   , 'the breaker form takes time to grow stronger'
   , 'all damage they take is amplified'
   , 'all damage they deal is temporary'
   , 'they cannot distinguish between friend and foe'
   , 'they deal a lot of collateral damage'
   , 'they need to absorb a steady supply of material'
   , 'they lose the will to fight'
   , 'their normal form accumulates mutations'
   , 'their movement is impaired'
   , 'their mental ability is impaired'
   , 'the form has a strict time limit'
   , 'the form can only be accessed in short bursts'
]

const classPros = ['strength','strength','utility'];

exports.genInfo = () => {
    var info = new Object();
    var effect = effects[Math.floor(Math.random()*effects.length)];
    var effect2 = effects[Math.floor(Math.random()*effects.length)];
    while (effect.name == effect2.name){
        effect2 = effects[Math.floor(Math.random()*effects.length)];
    }

    var restriction = restrictions[Math.floor(Math.random()*restrictions.length)];
    var state = states[Math.floor(Math.random()*states.length)];
    var description = desc[Math.floor(Math.random()*desc.length)];
    // Enters a (description) (state) state granting them (effect) and (effect2) but (restriction).
    info["power"] = "Enters "+description.toLowerCase()+" "+state.toLowerCase()+" state granting them " + effect.name + " and " + effect2.name + ", but " + restriction + ".";
    info["bonus"] = [[...effect.pro,...effect2.pro, ...classPros], [...effect.con,...effect2.con]];
    info["shape"] = state.toLowerCase()+" state";
    info["description"] = description;

    return info;
}

