const {genInfo} = require('./classifications/blaster');


const classes = [
    "Blaster",
    "Shaker",
    "Master",
    "Mover",
    "Changer",
    "Tinker",
]


exports.genInfo = (args)=> {
    var classification = classes[Math.floor(Math.random()*classes.length)];
    if (args && args[0]){
        for (paraClass of classes){
            if (paraClass.toLowerCase() === args[0].toLowerCase()){
                classification = paraClass;
            }
        }
    }
    
    const {genInfo} = require(`./classifications/${classification.toLowerCase()}`);

    var power = genInfo();
    power["class"] = classification;

    return power;
}