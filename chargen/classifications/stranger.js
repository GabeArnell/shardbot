// template By (effect), is able to avoid (type of interaction)(target).
const targets = [
    'a single person'
   , 'anyone near them'
   , 'electronic devices'
   , 'crowds of people'
   , 'anyone they think of'
   , 'anyone within a specified location'
   , 'parahuman abilities'
   , 'living things'
   ,'sapient life-forms'
   , 'non sapient life-forms'
   , 'close range observation'
   , 'long range observation'
   , 'those who have negative opinions of them'
   , 'those who wish to hurt them'
   , 'everyone'
   , 'enemies'
   , 'a narrowly defined group of people'
   , 'cameras'
   , 'guards'
   , 'their victims'
   , 'their teammates'
];

const interactions = [
   , 'attention from'
   , 'auditory detection by'
   , 'visual detection by'
   , 'focus from'
   , 'being seen by'
   , 'being thought of by '
   , 'any sort of interaction from'
   , 'harmful intentions from'
   , 'being tracked by'
   , 'being understood by'
   , 'tactile detection by'
   , 'being hurt by'
   , 'having to deal with'
   , 'developing feelings for'
   , 'being described by'
   , 'being memorized by'
   , 'whatever they want from'
]

const effects = [
    { name: "altering short term memories",
        pro: ["technique"],
        con: [],
    },
    { name: "cloaking themselves in their power",
        pro: ["vitality"],
        con: [],
    },
    { name: "emitting dark clouds",
        pro: ["control",],
        con: [],
    },
    { name: "forcibly redirecting a sense",
        pro: ["technique"],
        con: [],
    },
    { name: "modifying how light works",
        pro: ["utility"],
        con: [],
    },
    { name: "merging with the area",
        pro: ["vitality"],
        con: [],
    },
    { name: "spatial distortions",
        pro: ["strength"],
        con: [],
    },
    { name: "superhuman agility",
        pro: ["control","control"],
        con: [],
    },
    { name: "visual illusions",
        pro: ["technique"],
        con: [],
    },
    { name: "subtle shapeshifting",
        pro: ["strength"],
        con: [],
    },
    { name: "creating perception screens",
        pro: ["utility"],
        con: [],
    },
    { name: "manipulating emotions",
        pro: ["strength"],
        con: [],
    },
    { name: "emitting psychotropic fog",
        pro: ["control","vitality"],
        con: ["strength"],
    },
    { name: "creating clones of themselves",
        pro: ["control"],
        con: [],
    },
    { name: "creating clones of others",
        pro: ["vitality"],
        con: ["control"],
    },
    { name: "jamming electromagnetic waves",
        pro: ["utility","utility"],
        con: [],
    },
    { name: "using a special sense",
        pro: ["utility","technique"],
        con: [],
    },
    { name: "blending into the background",
        pro: [],
        con: [],
    },
    { name: "changing the illumination",
        pro: ["control","utility"],
        con: [],
    },
    { name: "creating distractions",
        pro: ["coontrol","strength"],
        con: ["vitality"],
    },
    { name: "supercharging a sense",
        pro: ["utility","technique"],
        con: [],
    },
    { name: "chaotically disrupting a sense",
        pro: ["strength","strength"],
        con: ["control"],
    },
]

const classPros = ['technique','technique','vitality'];

exports.genInfo = () => {
    var info = new Object();
    var effect = effects[Math.floor(Math.random()*effects.length)];
    var target = targets[Math.floor(Math.random()*targets.length)];
    var interaction = interactions[Math.floor(Math.random()*interactions.length)];

    // template By (effect), is able to avoid (type of interaction)(target).
    info["power"] = "By "+effect.name+", is able to avoid " + interaction + " "+target + ".";
    info["bonus"] = [[...effect.pro, ...classPros], effect.con];
    info["shape"] = "fists";
    info["description"] = effect;

    return info;
}

