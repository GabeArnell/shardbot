const {genInfo} = require('./classifications/blaster');


const classes = [
    "Blaster",
    "Shaker",
    "Master",
    "Mover",
    
]



exports.genInfo = ()=> {
    
    var classification = classes[Math.floor(Math.random()*classes.length)];

    const {genInfo} = require(`./classifications/${classification.toLowerCase()}`);

    var power = genInfo();
    power["class"] = classification;

    return power;
}