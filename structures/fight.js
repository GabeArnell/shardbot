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

    if (statContest(capeA, capeB, 'control')){
        first = capeA;
        second = capeB;  
    }
    else{
        second = capeA;
        first = capeB;
    }
    
    // first attack
    if (first.strength/second.vitality > .7){
        woundLevel = "severe";}
    else if (first.strength/second.vitality < .3){
            woundLevel = "negligible";}
    else{
        woundLevel = "direct";
    }
    info += first.name + " attacks "+second.name+" with their "+flavor[first.name+"-atk"];
    if (statContest(first, second, 'technique')){
        info += ` landing a ${woundLevel} blow!\n`;
        second.vitality = second.vitality - first.strength;
    }
    else{
        info += ` but ${second.name} ${flavor[second.name+"-def"]} the attack.\n`;
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
        info += second.name + " attacks "+first.name+" with their "+flavor[second.name+"-atk"];
        if (statContest(second, first, 'technique')){
            info += ` landing a ${woundLevel} blow!\n`;
            first.vitality = first.vitality - second.strength;
        }
        else{
            info += ` but ${first.name} ${flavor[first.name+"-def"]} the attack.\n`;
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
       [capeA.name+"-atk"]: capeA.power.shape,
        [capeB.name+"-atk"]: capeB.power.shape,
        [capeA.name+"-def"]: flavorModule.getDefense(capeA.class),
        [capeB.name+"-def"]: flavorModule.getDefense(capeB.class),
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


function findMostPowerful(team,stat){
    var strongest = team[0];
    for (var i = 0; i < team.length; i++){
        if (strongest == null && team[i]["vitality"] > 0){
            strongest = team[i]
        }else if (team[i][stat] > strongest[stat]){
            strongest = team[i];
        }
    }
    return strongest
}
function findLeastPowerful(team,stat){
    var weakest = null;
    for (var i = 0; i < team.length; i++){
        if (weakest == null && team[i]["vitality"] > 0){
            weakest = team[i]
        }else if (team[i][stat] < weakest[stat]){
            weakest = team[i];
        }
    }
    return weakest
}

function runTwoVsTwo(team1, team2,utilityGoal){
    var team1Vit = [];
    var team2Vit = [];
    var flavor = {};
    var rounds = 0;
    var text = "";

    var goal = utilityGoal;

    { // saving vitality stats and flavor
        for (cape of team1){
            team1Vit.push(cape.vitality);
            flavor[cape.name+"-atk"] = cape.power.shape;
            flavor[cape.name+"-def"] = flavorModule.getDefense(cape.class)
        }
        for (cape of team2){
            team2Vit.push(cape.vitality);
            flavor[cape.name+"-atk"] = cape.power.shape;
            flavor[cape.name+"-def"] = flavorModule.getDefense(cape.class)
        }
    }

    do{
        rounds++
        var info = " - Round "+rounds+" - \n";

        var capeA = findMostPowerful(team1, "control");
        var capeB = findMostPowerful(team2, "control")
        info+=runRound(capeA,capeB,flavor);
        capeA = findLeastPowerful(team1, "control");
        capeB = findLeastPowerful(team2, "control")
        if (capeA != null && capeB != null){
            info+=runRound(capeA,capeB,flavor);
        }
        
        if(utilityGoal){
            if (findMostPowerful(team1, "utility")){
                
            }
        }


        text +=info;
    }
    while(team1Vit[0]+team1Vit[1] > 1 && team2Vit[0]+team2Vit[1] > 1);
}


module.exports.singleFight = (capeA,capeB) =>{
    return(runFightText(capeA,capeB));
}
module.exports.multiFight = (capeA,capeB,utilGoal) =>{
    return(runTwoVsTwo(capeA,capeB,utilGoal));
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