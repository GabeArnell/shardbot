const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");

//modules
const capeModule = require(`${filePath}/cape.js`)
const flavorModule = require("../chargen/flavor.js")
const armoryModule = require('../structures/armory')


const statList = [
    "strength",
    "vitality",
    "utility",
    "technique",
    "control"
]

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
    if (first.battlestats.strength/second.battlestats.vitality > .7){
        woundLevel = "severe";}
    else if (first.battlestats.strength/second.battlestats.vitality < .3){
            woundLevel = "negligible";}
    else{
        woundLevel = "direct";
    }
    info += first.name + " attacks "+second.name+" with their "+flavor[first.name+"-atk"];
    if (statContest(first, second, 'technique')){
        info += ` landing a ${woundLevel} blow!\n`;
        second.battlestats.vitality = second.battlestats.vitality - first.battlestats.strength;
    }
    else{
        info += ` but ${second.name} ${flavor[second.name+"-def"]} the attack.\n`;
    }

    // second attack

    if (second.battlestats.vitality > 0){
        if (second.battlestats.strength/first.battlestats.vitality > .7){
            woundLevel = "severe";}
        else if (second.battlestats.strength/first.battlestats.vitality < .3){
                woundLevel = "negligible";}
        else{
            woundLevel = "direct";
        }
        info += second.name + " attacks "+first.name+" with their "+flavor[second.name+"-atk"];
        if (statContest(second, first, 'technique')){
            info += ` landing a ${woundLevel} blow!\n`;
            first.battlestats.vitality = first.battlestats.vitality - second.battlestats.strength;
            if (first.battlestats.vitality < 1){
                info+=first.name+" is defeated!\n"
                first.battlestats.vitality = 0;
            }
        }
        else{
            info += ` but ${first.name} ${flavor[first.name+"-def"]} the attack.\n`;
        }
        
    }else{
        info+=second.name+" is defeated!\n"
        second.battlestats.vitality = 0
    }
    
    return info;
}

function runFightText(capeA, capeB, channel){
    //channel.send("Fighting: "+capeA.name+" vs "+ capeB.name);

    var rounds = 0
    var text = ""

    capeA['battlestats'] = {
        ["strength"]: capeA.strength,
        ["vitality"]: capeA.vitality,
        ["utility"]: capeA.utility,
        ["control"]: capeA.control,
        ["technique"]: capeA.technique,
    }
    capeB['battlestats'] = {
        ["strength"]: capeB.strength,
        ["vitality"]: capeB.vitality,
        ["utility"]: capeB.utility,
        ["control"]: capeB.control,
        ["technique"]: capeB.technique,
    }

    if (capeA.item){
        var itemData = armoryModule.getData(capeA.item.name)
        var set = itemData.bonus.set;
        var alter = itemData.bonus.alter;
        for (stat of statList){
            if (set[stat]){
                capeA['battlestats'][stat] = set[stat]
            }
        }
        for (stat of statList){
            if (alter[stat]){
                capeA['battlestats'][stat] = capeA['battlestats'][stat]+alter[stat]
                if (capeA['battlestats'][stat] < 1){
                    capeA['battlestats'][stat] = 1
                }
            }
        }
    }
    if (capeB.item){
        var itemData = armoryModule.getData(capeB.item.name)
        var set = itemData.bonus.set;
        var alter = itemData.bonus.alter;
        for (stat of statList){
            if (set[stat]){
                capeB['battlestats'][stat] = set[stat]
            }
        }
        for (stat of statList){
            if (alter[stat]){
                capeB['battlestats'][stat] = capeB['battlestats'][stat]+alter[stat]
                if (capeB['battlestats'][stat] < 1){
                    capeB['battlestats'][stat] = 1
                }
            }
        }
    }


    

    var flavor = {
       [capeA.name+"-atk"]: capeA.weapon || capeA.power.shape,
        [capeB.name+"-atk"]: capeB.weapon || capeB.power.shape,
        [capeA.name+"-def"]: flavorModule.getDefense(capeA.class),
        [capeB.name+"-def"]: flavorModule.getDefense(capeB.class),
    }

    do{
        rounds++
        var info = " **- Round "+rounds+" -** \n";

        info+=runRound(capeA,capeB,flavor);

        text +=info;
    }
    while(capeA.battlestats.vitality > 0 && capeB.battlestats.vitality > 0);

    if (capeA.battlestats.vitality > 1){
        text +=(capeA.name + " wins!");

        for (fighter of [capeA,capeB]){
            fighter.battlestats = null;
            if (fighter.item && fighter.item.durability > 0){
                fighter.item.durability--;
                if (fighter.item.durability == 0){
                    text+=`\n${fighter.name}'s ${item.name} broke.`;
                    fighter.item = null;
                    if(fighter.weapon){
                        fighter.weapon = null;
                    }
                }
            }
        }

        return([true, text]);
    }
    else{
        text +=(capeB.name + " wins!");

        for (fighter of [capeA,capeB]){
            fighter.battlestats = null;
            if (fighter.item && fighter.item.durability > 0){
                fighter.item.durability--;
                if (fighter.item.durability == 0){
                    text+=`\n${fighter.name}'s ${item.name} broke.`;
                    fighter.item = null;
                    if(fighter.weapon){
                        fighter.weapon = null;
                    }
                }
            }
        }
        return([false, text]);
    }
    
}

function findMostPowerful(team,stat){
    var strongest = null
    for (var i = 0; i < team.length; i++){
        if (strongest == null && team[i]['battlestats']["vitality"] > 0){
            strongest = team[i]
        }else if (strongest != null && team[i]['battlestats'][stat] > strongest['battlestats'][stat]&& team[i]['battlestats']["vitality"] > 0){
            strongest = team[i];
        }
    }
    return strongest
}
function findLeastPowerful(team,stat){
    var weakest = null;
    for (var i = 0; i < team.length; i++){
        if (weakest == null && team[i]['battlestats']["vitality"] > 0){
            //console.log("Found weakest to be "+team[i].name+" with "+team[i]["vitality"]+" hp");
            weakest = team[i];
        }else if (weakest != null && team[i]['battlestats'][stat] < weakest['battlestats'][stat]&& team[i]['battlestats']["vitality"] > 0){
            //console.log("changing weakest from "+weakest.name+"-"+weakest[stat]+" to "+team[i].name+"-"+team[i][stat])
            weakest = team[i];
        }
    }
    return weakest
}

function runTwoVsTwo(team1, team2,team1Name,team2Name,utilityGoal){
    var flavor = {};
    var rounds = 0;
    var text = "";

    var goal = utilityGoal;

    { // preping data for battle
        for (cape of team1){
            flavor[cape.name+"-atk"] = cape.weapon || cape.power.shape;
            flavor[cape.name+"-def"] = flavorModule.getDefense(cape.class)

            cape['battlestats'] = {
                ["strength"]: cape.strength,
                ["vitality"]: cape.vitality,
                ["utility"]: cape.utility,
                ["control"]: cape.control,
                ["technique"]: cape.technique,
            }
            if (cape.item){
                const itemData = armoryModule.getData(cape.item.name)
                const set = itemData.bonus.set;
                const alter = itemData.bonus.alter;
                for (stat of statList){
                    if (set[stat]){
                        cape['battlestats'][stat] = set[stat]
                    }
                }
                for (stat of statList){
                    if (alter[stat]){
                        cape['battlestats'][stat] = cape['battlestats'][stat]+alter[stat]
                        if (cape['battlestats'][stat] < 1){
                            cape['battlestats'][stat] = 1
                        }
                    }
                }
            }

        }
        for (cape of team2){
            flavor[cape.name+"-atk"] = cape.weapon || cape.power.shape;
            flavor[cape.name+"-def"] = flavorModule.getDefense(cape.class)
            cape['battlestats'] = {
                ["strength"]: cape.strength,
                ["vitality"]: cape.vitality,
                ["utility"]: cape.utility,
                ["control"]: cape.control,
                ["technique"]: cape.technique,
            }
            if (cape.item){
                const itemData = armoryModule.getData(cape.item.name)
                const set = itemData.bonus.set;
                const alter = itemData.bonus.alter;
                for (stat of statList){
                    if (set[stat]){
                        cape['battlestats'][stat] = set[stat]
                    }
                }
                for (stat of statList){
                    if (alter[stat]){
                        cape['battlestats'][stat] = cape['battlestats'][stat]+alter[stat]
                        if (cape['battlestats'][stat] < 1){
                            cape['battlestats'][stat]= 1
                        }
                    }
                }
            }
        }
    }
    do{
        rounds++;
        var info = " **- Round "+rounds+" -** \n";

        var capeA = findMostPowerful(team1, "control");
        var capeB = findMostPowerful(team2, "control")
        if (capeA != null && capeB != null){
            info+=runRound(capeA,capeB,flavor);
        }
        capeA = findLeastPowerful(team1, "control");
        capeB = findLeastPowerful(team2, "control")
        if (capeA != null && capeB != null){
            info+=runRound(capeA,capeB,flavor);
        }
        
        if(utilityGoal){
            if (findMostPowerful(team1, "utility")){
                
            }
        }
       // console.log(info);
        text +=info;
    }
    while((team1[0].battlestats.vitality+team1[1].battlestats.vitality) > 0 && (team2[0].battlestats.vitality+team2[1].battlestats.vitality) > 0);

    if (team1[0].battlestats.vitality+team1[1].battlestats.vitality > 1){
        text +=(team1Name + " wins!");

        for (fighter of [...team1, ...team2]){
            fighter.battlestats = null;
            if (fighter.item && fighter.item.durability > 0){
                fighter.item.durability--;
                if (fighter.item.durability == 0){
                    text+=`\n${fighter.name}'s ${item.name} broke.`;
                    fighter.item = null;
                    if(fighter.weapon){
                        fighter.weapon = null;
                    }
                }
            }
        }

        return([true, text]);
    }
    else{

        text +=(team2Name + " wins!");
        for (fighter of [...team1, ...team2]){
            fighter.battlestats = null;
            if (fighter.item && fighter.item.durability > 0){
                fighter.item.durability--;
                if (fighter.item.durability == 0){
                    text+=`\n${fighter.name}'s ${item.name} broke.`;
                    fighter.item = null;
                    if(fighter.weapon){
                        fighter.weapon = null;
                    }
                }
            }
        }
        
        return([false, text]);
    }

}


module.exports.singleFight = (capeA,capeB) =>{
    return(runFightText(capeA,capeB));
}
module.exports.multiFight = (capeA,capeB,team1Name,team2Name,utilGoal) =>{
    return(runTwoVsTwo(capeA,capeB,team1Name,team2Name,utilGoal));
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