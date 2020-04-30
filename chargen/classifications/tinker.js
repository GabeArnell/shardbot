// Template: Tinkers with (theme) (tech) through (method), but (complication).

const complications = [
    { name: "they have to sacrifice parts of their body",
        pro: ["strength",],
        con: ["vitality"],
    },
    { name: "they cannot focus on one project",
        pro: ["control","utility"],
        con: ["technique"],
    },
    { name: "what they make is random",
        pro: ["technique","strength"],
        con: ["utility","control"],
    },
    { name: "their tech has glaring weak points",
        pro: ["utility","strength"],
        con: ["vitality"],
    },
    { name: "creations are sentient and don't like the tinker",
        pro: ["strength","technique"],
        con: ["control"],
    },
    { name: "their tech occasionally falls apart",
        pro: ["control"],
        con: ["utility"],
    },
    { name: "their tech requires an unstable energy source",
        pro: ["strength","strength"],
        con: ["technique"],
    },
    { name: "all their tech needs to be huge in scale",
        pro: ["control","vitality"],
        con: ["utility","technique"],
    },
    { name: "they can only focus on one project at a time",
        pro: ["technique","strength"],
        con: ["vitality"],
    },
    { name: "they need a rare material in all projects",
        pro: ["vitality"],
        con: [],
    },
    { name: "their technology is parasitic in nature",
        pro: ["vitality"],
        con: ["strength"],
    },
    { name: "they must steal material from other capes",
        pro: ["control"],
        con: [],
    },
    { name: "their tech switches states uncontrollably",
        pro: ["strength"],
        con: ["control"],
    },
    { name: "their tech requires constant recharging",
        pro: ["technique"],
        con: ["vitality"],
    },
    { name: "their technology interferes with other parahuman powers",
        pro: ["technique","vitality"],
        con: ["control"],
    },
    { name: "their gear requires time to set up",
        pro: ["strength","technique"],
        con: ["control"],
    },
];

const technologies = [
    'guns'
,    'swords'
,    'mechas'
,    'powered armor'
,    'visors'
,    'drones'
,    'generators'
,    'databases'
,    'vehicles'
,    'force fields'
,    'projectors'
,    "tanks"
,    "flying machines"
,    "cannons"
,    'body enhancements'
,    'explosives'
,    'halberds'
,    'gadgets'
,    'weapons'
,    'shields'
,    'engines'
,    'bodysuits'
,    'gauntlets'
,    'dispensers'
,    'software'
,    'missiles'
,    'androids'
,    "traps"
,    "animals"
,    "turrets"
   
]

const themes  = [
"pyrotechnic"
,"space warping"
,"cryotechnic"
,"electricity"
,"combining"
,"stealth"
,"speed"
,"defensive"
,"laser"
,"scrap"
,"nanobot"
,"holographic"
,"duplication"
,"gas"
,"time-manipulation"
,"esoteric state" 
,"biological"
,"weather"
,"steampunk"
,"atomic"
,"nuclear"
,"drone creating"
,"modular"
,"terrain manipulating"
,"emotion"
,"mental"
,"dimensional"
,"predictive"
,"plastic" 
,'surveillance'
,'multifunctional'
,'crystaline'
,'flesh'
,'alien metal'
,'magnetic'
,'self repairing'
,'toxic'
,'replicating'
,'glass'
]

const methods = [
    "working on others",
    "relentless field-testing",
    "refining one focus",
    "getting inspiration from other capes",
    "crossovers with a different field",
    "in-combat inspiration",
    "upgrading mundane objects",
    "receiving inspiration in a dream",
    "studying a particular mundane thing",
    "gathering various esoteric resources",
    "growing bioorganisms in vats",
    "mutating preexisting biology",
    "self experimentation",
]

const classPros = ['utility','utility','control'];

exports.genInfo = () => {
    var info = new Object();
    var comp = complications[Math.floor(Math.random()*complications.length)];
    var method = methods[Math.floor(Math.random()*methods.length)];
    var theme = themes[Math.floor(Math.random()*themes.length)];
    var tech = technologies[Math.floor(Math.random()*technologies.length)];

// Tinkers with (theme) (tech) through (method), but (complication).
    info["power"] = "Tinkers with  "+theme+" "+tech+" through "+ method +", but "+comp.name+".";
    info["bonus"] = [[...comp.pro, ...classPros], comp.con];
    info["shape"] = theme + " weapon";
    info["description"] = tech;

    return info;
}

