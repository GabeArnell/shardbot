// Template: Changes (transformation) into a (description)(form) form with (bonus)

const effects = [
    { name: "enhanced perception",
        pro: ["utility"],
        con: [],
    },
    { name: "fast regeneration",
        pro: ["vitality"],
        con: [],
    },

    { name: "an alien mind",
        pro: ["technique"],
        con: ["control","utility"],
    },

    { name: "flight capability",
        pro: ["control","utility"],
        con: [],
    },

    { name: "adaptive mutations",
        pro: ["vitality"],
        con: ["control"],
    },

    { name: "environmental adaptations",
        pro: ["control"],
        con: ["strength"],
    },

    { name: "blaster capabilities",
        pro: ["strength","control"],
        con: ["technique"],
    },

    { name: "super strength",
        pro: ["strength", "strength"],
        con: ["technique"],
    },

    { name: "camouflage",
        pro: ["vitality","technique"],
        con: ["control","control"],
    },

    { name: "destructive striker properties",
        pro: ["strength"],
        con: ["utility"],
    },
    { name: "enhanced speed",
        pro: ["control"],
        con: [],
    },
    { name: "natural weaponry",
        pro: ["technique"],
        con: [],
    },
    { name: "a deadly bite",
        pro: ["strength"],
        con: [],
    },
    { name: "stretchable appendages",
        pro: ["utility","technique"],
        con: ["strength"],
    },

];

const desc = [
    "giant",
    "multi-limbed",
    "tentacled",
    "thick furred",
    "diminutive",
    "spiked",
    "armored",
    "bulky",
    "segmented",
    "massive",
    "multitude of",
    "elongated",
    "permanent"
]

const forms = [
    "humanoid",
    "demonoid",
    "insectoid",
    "carnivorous",
    "animalistic",
    "goblinoid",
    "mechanical",
    "angelic",
    "reptilian",
    "draconic",
    "sludgelike",
    "chimeric",
    "avian",
    "beastial",
    "amphibious",
]

const transformations = [
    "slowly",
    "individual body parts",
    "as they fight",
    "as they move",
    "as they are hurt",
    "as their emotions heighten",
    "in face of danger",
    "quickly",
    "methodically",
    "as they interact with the environment",
    "all at once",
    "suddenly",
    "by mimicing those around them",
    "sporadically",
    "by absorbing matter"
]

const classPros = ['vitality','vitality','technique'];

exports.genInfo = () => {
    var info = new Object();
    var effect = effects[Math.floor(Math.random()*effects.length)];
    var transform = transformations[Math.floor(Math.random()*transformations.length)];
    var form = forms[Math.floor(Math.random()*forms.length)];
    var description = desc[Math.floor(Math.random()*desc.length)];
    //Changes (transformation) into a (description)(form) form with (bonus)
    info["power"] = "Changes "+transform+" into a " + description + " " + form + " form with " + effect.name + ".";
    info["bonus"] = [[...effect.pro, ...classPros], effect.con];
    info["shape"] = form+" form";
    info["description"] = description;

    return info;
}

