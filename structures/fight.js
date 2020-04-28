const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");

//modules
const capeModule = require(`${filePath}/cape.js`)
const flavorModule = require("../chargen/flavor.js")


function statContest(challenge, target, stat){
    var measure = challenge[stat]+target[stat];
    if (Math.floor(Math.random()*measure+1) <= challenge[stat]){
        return true;
    }

    return false;
}



function runRound(capeA, capeB, flavor){
    var info = ""

    var first, second;
    var woundLevel = "direct";
    var firstDef, secDef, firstAtk, secAtk

    if (statContest(capeA, capeB, 'control')){
        first = capeA;
        second = capeB;
        firstDef = flavor.defA;
        firstAtk = flavor.atkA;
        secDef = flavor.defB;
        secAtk = flavor.atkB;
    }
    else{
        second = capeA;
        first = capeB;
        firstDef = flavor.defB;
        firstAtk = flavor.atkB;
        secDef = flavor.defA;
        secAtk = flavor.atkA;
    }
    
    // first attack
    if (first.strength/second.vitality > .7){
        woundLevel = "severe";}
    else if (first.strength/second.vitality < .3){
            woundLevel = "negligible";}
    else{
        woundLevel = "direct";
    }
    info += first.name + " attacks "+second.name+" with their "+flavor.atkA;
    if (statContest(first, second, 'technique')){
        info += ` landing a ${woundLevel} blow!\n`;
        second.vitality = second.vitality - first.strength;
    }
    else{
        info += ` but ${second.name} ${flavor.defB} the attack.\n`;
    }
    // second attack

    if (second.vitality > 0){
        if (second.strength/first.vitality > .7){
            woundLevel = "severe";}
        else if (second.strength/first.vitality < .3){
                woundLevel = "negligible";}
        else{
            woundLevel = "direct";
        }
        info += second.name + " attacks "+first.name+" with their "+flavor.atkB;
        if (statContest(second, first, 'technique')){
            info += ` landing a ${woundLevel} blow!\n`;
            first.vitality = first.vitality - second.strength;
        }
        else{
            info += ` but ${first.name} ${flavor.defA} the attack.\n`;
        }
    }

    return info;
}

function runFightText(capeA, capeB, channel){
    //channel.send("Fighting: "+capeA.name+" vs "+ capeB.name);

    var rounds = 0
    var text = ""

    var vitalityA = capeA.vitality;
    var vitalityB = capeB.vitality;

    var flavor = {
        ["atkA"]: capeA.power.shape,
        ["atkB"]: capeB.power.shape,
        ['defA']: flavorModule.getDefense(capeA.class),
        ['defB']: flavorModule.getDefense(capeB.class),
    }

    do{
        rounds++
        var info = " - Round "+rounds+" - \n";

        info+=runRound(capeA,capeB,flavor);


        text +=info;
    }
    while(capeA.vitality > 1 && capeB.vitality > 1);

    if (capeA.vitality > 1){
        text +=(capeA.name + " wins!");

        capeA.vitality = vitalityA;
        capeB.vitality = vitalityB;

        return([true, text]);
    }
    else{
        text +=(capeB.name + " wins!");

        capeA.vitality = vitalityA;
        capeB.vitality = vitalityB;
        return([false, text]);
    }
    
}


module.exports.singleFight = (capeA,capeB) =>{
    return(runFightText(capeA,capeB));
}
module.exports.multiFight = (capeA,capeB) =>{
    return(runFightText(capeA,capeB));
}

module.exports.run = async (client, message, args) =>{
    // getting other member
    const opponent = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || 0
    if (opponent == 0) {
        message.reply("Error. Tag who you want to fight in the command.");
        return
    }

    // getting cape data
    const userCape = await capeDB.get(`${message.guild.id}-${message.author.id}`, 0);
    if (userCape == 0) {
        message.reply("You have no cape.");
        return
    }

    const enemyCape = await capeDB.get(`${message.guild.id}-${opponent.id}`, 0);
    if (enemyCape == 0) {
        message.reply("Opponent has no cape.");
        return
    }

    runFight(userCape, enemyCape, message.channel);

}

module.exports.help = {
    name: "fight",
    description: "The users cape fights the other",
}

module.exports.requirements = {
    clientPerms: [],
    userPerms: [],
    ownerOnly: false
}