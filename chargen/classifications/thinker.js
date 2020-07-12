// template Has increased access to (Information) through (vector), but (limitation).
const information = [
    'any kind of information'
  ,  'visual information'
  ,  'unusual combat abilities'
  ,  'qualitative information'
  ,  'quantitative information'
  ,  'danger sense'
  ,  'written information'
  ,  'hidden information'
  ,  'social abilities'
  ,  'general knowledge of a target'
  ,  'logical processing'
  ,  'operational planning'
  ,  'peak human fighting abilities'
  ,  'weapon usage capabilities'
  ,  'environmental observation'
  ,  'medical knowledge'
  ,  'impersonation capabilities'
  ,  'distraction capabilities'
  ,  'emotional awareness'
  ,  'trajectory calculation'
  ,  'pain infliction'
  ,  'wound infiction'
  ,  'weakness detection'
  ,  'secret detection'
  ,  'vehicle knowledge'
  ,  'combat knowledge'
  ,  'hand-to-hand techniques'
  ,  'architectural knowledge'
  ,  'structural weaknesses'
  ,  'weak point analysis'
  ,  'demolitions knowledge'
  ,  'weapon skills'
  ,  'problem solving ability'
  ,  'survival skills'
  ,  'human emotions'
  ,  'behavioural analysis'
  ,  'dream interpretation'
  ,  'PRT Trooper tactics'
  ,  'close-quarter tactics'
  ,  'strategy'
  ,  'tactics'
  ,  'logistical planning'
  ,  'traps and tricks'

];

const limitations = [
    'information can be completely wrong'
   , 'they suffer severe headaches for overuse'
   , 'their power only works in short bursts'
   , 'their power goes haywire when combined with other thinker abilities'
   , 'they do not have consious control over their ability'
   , 'they can only focus on a limited area'
   , 'their power only works on enemies'
   , 'the power only works in-combat'
   , 'their power requires time to observe before use'
   , 'they can only remember one piece of power-sourced information at a time'
   , 'they have to lose other mental faculties to access their power'
   , 'their power cannot be deactivated'
   , 'the power only works on nearby targets'
   , 'the information can only be taken from any given source once'
   , 'information quickly loses value and is only useful for a limited time'
   , 'the information may be incorrectly applied'
   , 'the information has to be known by nearby people'
   , 'their power causes stress and paranoia to others nearby'
   , 'they suffer severe withdrawl when not using their power'
]

const vectors = [
    { name: "power-assisted guessing",
        pro: ["vitality","vitality"],
        con: ["technique"],
    },
    { name: "touch based postcognition",
        pro: ["strength"],
        con: [],
    },
    { name: "super enhanced senses",
        pro: ["utility","control"],
        con: [],
    },
    { name: "precognitive visions",
        pro: ["technique"],
        con: ["control"],
    },
    { name: "warped perception",
        pro: ["strength"],
        con: ["technique"],
    },
    { name: "speeding up their thought proccess.",
        pro: ["technique","technique"],
        con: ["strength"],
    },
    { name: "a perfect memory",
        pro: ["utility","utility"],
        con: ["vitality"],
    },
    { name: "inhuman learning speed",
        pro: ["utility"],
        con: [],
    },
    { name: "local precognition",
        pro: ["technique","vitality"],
        con: ["control"],
    },
    { name: "local postcognition",
        pro: ["strength"],
        con: ["control"],
    },
    { name: "power-controlled actions",
        pro: ["strength","technique"],
        con: ["control","vitality"],
    },
    { name: "hijacking the senses of others",
        pro: ["strength"],
        con: [],
    },
    { name: "power-inherited experience",
        pro: ["technique"],
        con: ["control"],
    },
    { name: "skill transference",
        pro: ["vitality"],
        con: [],
    },
    { name: "skill copying",
        pro: ["control"],
        con: [],
    },
    { name: "skill theft",
        pro: ["strength","technique"],
        con: ["vitality"],
    },
    { name: "parallel reality awareness",
        pro: ["control","utility"],
        con: [],
    },
    { name: "cause/effect awareness",
        pro: ["strength"],
        con: [],
    },
    
]

const classPros = ['technique','technique','utility'];

exports.genInfo = () => {
    var info = new Object();
    var extraInfo = information[Math.floor(Math.random()*information.length)];
    var vector = vectors[Math.floor(Math.random()*vectors.length)];
    var limit = limitations[Math.floor(Math.random()*limitations.length)];

    // template Has increased access to (Information) through (vector), but (limitation).
    info["power"] = "Has increased access to "+extraInfo+" through " + vector.name + ", but "+limit + ".";
    info["bonus"] = [[...vector.pro, ...classPros], vector.con];
    info["shape"] = "fists";
    info["description"] = vector.name;

    return info;
}

