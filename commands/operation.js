const {readdirSync} = require('fs');
const { join } = require("path");
const {postchannel} = require("../config.js");

const filePath = join(__dirname,"..","commands");

const { MessageCollector, MessageEmbed} = require("discord.js");


//modules
const capeModule = require(`${filePath}/cape.js`);
const fightModule = require("../structures/fight.js");
const armoryModule = require('../structures/armory')
const levelModule = require('../structures/level')

const alignmentShortcuts = {
    ["h"]: "hero",
    ["heroic"]: "hero",
    ["good"]: "hero",
    ["hero"]: "hero",

    ["v"]: "villain",
    ['villain']:'villain',
    ['villainous']:'villain',
    ['evil']: 'villain',
    ['bad']: 'villain',

    ['r']: "rogue",
    ['n']: 'rogue',
    ['rogue']: 'rogue',
    ['neutral']: 'rogue'

}

function returnReadableTime(miliseconds){
    var minutes = Math.floor(miliseconds/1000/60);
    var hours = Math.floor(minutes/60);
    minutes = minutes%60;
    var text = `${minutes}m`;
    if (hours > 0){
        text = `${hours}h`+text;
    }
    return text;
}

function statCheck(cape, dc, stat){
    const statTotal = cape[stat]+Math.floor(cape.utility/2)
    var measure = statTotal+dc;
    if (Math.floor(Math.random()*measure+1) <= statTotal){
        return true;
    }
    return false;
}

const statList = [
    "strength",
    "vitality",
    "utility",
    "technique",
    "control"
]
function getBattleStats(cape){
    battlestats = {
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
                battlestats[stat] = set[stat]
            }
        }
        for (stat of statList){
            if (alter[stat]){
                battlestats[stat] = battlestats[stat]+alter[stat]
                if (battlestats[stat] < 1){
                    battlestats[stat] = 1
                }
            }
        }
    }
    return battlestats;
}

/* Ops
    name
    capereq - how many capes are needed to patrol
    repreq - how much reputation they need before they can complete, negative reps measure by less than
    pvp - if action is respondable
    time - how long it takes, results displayed at end. Measured in SECONDS
    prize - what user gets if mission succeeds
    penalty - what happens if user fails
    stopprize - prize for the person to stop the user
    stoppenalty - penalty for person who failed to stop user
*/

const patrol = {
    name: "Patrol",
    info: "Send your cape to patrol the streets and look for danger.",

    capereq: 1,
    repreq: 0,
    pvp: true,
    time: 60,
    prize: {
        funds: 50,
        reputation: 10,
    },
    penalty: {
        funds: -25,
        reputation: 0,
    },
    stopprize: {
        funds: 25,
        reputation: -10,
    },
    stoppenalty:{
        funds: -25,
        reputation:0
    },

    ["run"]: (teamData, capes, display) =>{
        var cape = capes[0];
        //console.log("Patroling cape: "+cape.name);
        const encounters = [
            {
                prompt: `${cape.name} encountered a mugging in progress!`,
                stat: 'strength',
                contest: 1,
                success: `They successfully beat the mugger, saving the victim.`,
                failure: `But the mugger got away.`,
            },
            {
                prompt: `A criminal gang jumped ${cape.name}!`,
                stat: 'vitality',
                contest: 1,
                success: `But they were successfully fought off and arrested.`,
                failure: `${cape.name} was injured`,
            },
            {
                prompt: `A criminal gang jumped ${cape.name}!`,
                stat: 'vitality',
                contest: 1,
                success: `But they were successfully fought off and arrested.`,
                failure: `${cape.name} was injured`,
            },
            {
                prompt: `${cape.name} saw an accident occur!`,
                stat: 'utility',
                contest: 1,
                success: `They were able to assist the injured civilians and get medical help.`,
                failure: `However they were not of any help.`,
            },
        ]

        var successes = 0;

        display.addField("Operator", cape.name);
        var bStats = getBattleStats(cape)
        for (var i = 0; i < Math.ceil(Math.random()*2); i++){
            var enc = encounters[Math.floor(Math.random()*encounters.length)];
            var info = enc.prompt;
            if (statCheck(bStats,enc.contest,enc.stat)){
                successes++;
                info+="\n"+enc.success;
            }
            else{
                info+="\n"+enc.failure;
            }
            display.addField("Encounter "+(i+1), info);
        }

        if (successes > 0){
            return true;
        }else{
            return false;
        }

    },
    ['runpvp']: (teamData, teamCapes, enemyTeamData, enemyCapes, display) => {
        var cape = teamCapes[0];
        var enemyCape = enemyCapes[0];
        display.addField("Encounter", `${enemyCape.name} attacked ${cape.name} while they were patroling!`)
        display.addField("Fight", "**"+cape.name+"**"+" vs "+"**"+enemyCape.name+"**");
        const data = fightModule.singleFight(cape, enemyCape);
        const userWin = data[0];
        var fightInfo = data[1];
        if (userWin){
            fightInfo += "\n"+cape.name+" fended off the assault.";
        }
        else{
            fightInfo += "\n"+enemyCape.name+"'s attack cut the patrol short.";
        }
        display.addField("Details", fightInfo);
        return (userWin);
    },

}

const mugging = {
    name: "Mugging",
    info: "Send a cape to mug someone off the street for cash.",
    capereq: 1,
    repreq: 0,
    pvp: true,
    time: 60,
    prize: {
        funds: 50,
        reputation: -10,
    },
    penalty: {
        funds: -25,
        reputation: 0,
    },
    stopprize: {
        funds: 25,
        reputation: 10,
    },
    stoppenalty:{
        funds: -25,
        reputation:0
    },
    ["run"]: (teamData, capes, display) =>{
        var cape = capes[0];

        var encounters = [
            {
                reaction: "The civilian ran away ",
                stat: "technique",
                contest: 1,
                success: "but they could not escape "+cape.name+".",
                failure: "and "+cape.name+" could not catch them.",
            },
            {
                reaction: "The civilian fought back ",
                stat: "strength",
                contest: 1,
                success: "but "+cape.name+" overpowered them.",
                failure: "successfully, disabling "+cape.name+".",
            },
            {
                reaction: "The victim would not follow orders ",
                stat: "control",
                contest: 1,
                success: "initially but "+cape.name+" intimidated them into giving up.",
                failure: " and stalled enough time for the cops to come",
            },

        ]

        display.addField("Operator", cape.name);
        var bStats = getBattleStats(cape)
        const enc = encounters[Math.floor(Math.random()*encounters.length)];
        var info = cape.name+" spotted a victim and tried to rob them. "+enc.reaction;

        const winCon = statCheck(bStats,enc.contest,enc.stat);
        if (winCon){
            info += enc.success;
        }
        else{
            info += enc.failure;
        }

        display.addField("Encounter", info);
        return (winCon);
    },
    ['runpvp']: (teamData, teamCapes, enemyTeamData, enemyCapes, display) => {
        var cape = teamCapes[0];
        var enemyCape = enemyCapes[0];
        display.addField("Encounter", `${enemyCape.name} interupted `+cape.name+"'s theft.")
        display.addField("Fighters", "**"+cape.name+"**"+" vs "+"**"+enemyCape.name+"**");
        const data = fightModule.singleFight(cape, enemyCape);
        const userWin = data[0];
        var fightInfo = data[1];
        if (userWin){
            fightInfo += "\n"+cape.name+" made off with stolen cash.";
        }
        else{
            fightInfo += "\n"+enemyCape.name+" prevented the robbery.";
        }
        display.addField("Details", fightInfo);
        return (userWin);
    },
}

const arena = {
    name: "Arena",
    info: "Send your capes to fight without consequence, but also without prizes.",

    capereq: 1,
    repreq: 0,
    pvp: true,
    time: 60,
    
    prize: {
        funds: 0,
        reputation: 0,
    },
    penalty: {
        funds: 0,
        reputation: 0,
    },
    stoppenalty: {
        funds: 0,
        reputation: 0,
    },
    stopprize: {
        funds: 0,
        reputation: 0,
    },
    ["run"]: (teamData, capes, display) =>{
        var cape = capes[0];

        display.addField("Fighter", cape.name);

        display.addField("Results", "No one responded to your fight request.");
        return (false);
    },
    ['runpvp']: (teamData, teamCapes, enemyTeamData, enemyCapes, display) => {
        var cape = teamCapes[0];
        var enemyCape = enemyCapes[0];
        display.addField("Fighters", cape.name+" vs "+enemyCape.name);
        const data = fightModule.singleFight(cape, enemyCape);
        const userWin = data[0];
        var fightInfo = data[1];
        display.addField("Details", fightInfo);
        return (userWin);
    },
}

const robbery = {
    name: "Robbery",
    info: "Send a pair of capes to rob a local business.",
    capereq: 2,
    repreq: -300,
    pvp: true,
    time: 240,
    prize: {
        funds: 150,
        reputation: -70,
    },
    penalty: {
        funds: -50,
        reputation: 0,
    },
    stopprize: {
        funds: 75,
        reputation: 100,
    },
    stoppenalty:{
        funds: -50,
        reputation:0
    },

    ["run"]: (teamData, capes, display) =>{
        var cape = capes[0];
        const shops = [
            "the Chicken Soup Burgers fastfood restaurant",
            "a jewlry shop",
            "an E-Mart",
            "a pharmacy",
            "a car rental",
            "a mall",
            "a fancy restaurant",
        ];
        var encounters = [
            {
                reaction: "the police showed up!",
                stat: "strength",
                contest: 3,
                success: teamData.name+" were able to fight them off.",
                failure: "The police forced  "+teamData.name+" to flee.",
            },
            {
                reaction: "the workers fought back!",
                stat: "technique",
                contest: 2,
                success: teamData.name+" quickly restrained the civilians before making off with cash.",
                failure: "They civilians forced "+teamData.name+" to go elsewhere.",
            },
            {
                reaction: "they triggered the silent alarm!",
                stat: "control",
                contest: 3,
                success: teamData.name+" were able to grab the cash and run before security showed up.",
                failure: teamData.name+" could not get to the money in time."
            },

        ]

        display.addField("Operators", capes[0].name + " & "+capes[1].name);

        const enc = encounters[Math.floor(Math.random()*encounters.length)];
        const shop = shops[Math.floor(Math.random()*shops.length)]
        var info = `${teamData.name} robbed ${shop} but ${enc.reaction}\n`;
        var bStats = getBattleStats(capes[Math.ceil(Math.random(capes.length))])

        const winCon = statCheck(bStats,enc.contest,enc.stat);
        if (winCon){
            info += enc.success;
        }
        else{
            info += enc.failure;
        }

        display.addField("Encounter", info);
        return (winCon);
    },
    ['runpvp']: (teamData, teamCapes, enemyTeamData, enemyCapes, display) => {
        var cape = teamCapes[0];
        var enemyCape = enemyCapes[0];
        const shops = [
            "the Chicken Soup Burgers fastfood restaurant",
            "a jewlry shop",
            "an E-Mart",
            "a pharmacy",
            "a car rental",
            "a mall",
            "a fancy restaurant",
        ]
        const shop = shops[Math.floor(Math.random()*shops.length)]

        display.addField("Encounter", 
        `${teamData.name} robbed ${shop} but ${enemyTeamData.name} came to the rescue!`
        )

        display.addField("**"+teamData.name+"**"+" vs "+"**"+enemyTeamData.name+"**", 
        cape.name+" and "+teamCapes[1].name + " vs " + enemyCape.name + " and "+enemyCapes[1].name
        );

        const data = fightModule.multiFight(teamCapes, enemyCapes,teamData.name,enemyTeamData.name);
        const userWin = data[0];
        var fightInfo = data[1];
        if (userWin){
            fightInfo += "\n"+teamData.name+" made off with stolen cash.";
        }
        else{
            fightInfo += "\n"+enemyTeamData.name+" prevented the robbery.";
        }
        display.addField("Details", fightInfo);
        return (userWin);
    },
}

const pr_event = {
    name: "PR",
    info: "Have a cape perform for the public to gain trust.",

    capereq: 1,
    repreq: 30,
    pvp: true,
    time: 120,
    prize: {
        funds: 50,
        reputation: 50,
    },
    penalty: {
        funds: -25,
        reputation: -25,
    },
    stopprize: {
        funds: 0,
        reputation: -75,
    },
    stoppenalty:{
        funds: -50,
        reputation: 0
    },

    ["run"]: (teamData, capes, display) =>{
        var cape = capes[0];
        //console.log("Performing Cape: "+cape.name);
        const encounters = [
            {
                prompt: `${cape.name} hosted an autograph signing.`,
                stat: 'control',
                contest: 2,
                success: `Resulting in a large participant turnout.`,
                failure: `But not that many people showed up.`,
            },
            {
                prompt: `${cape.name} showed off their power with some public stunts!`,
                stat: 'technique',
                contest: 2,
                success: `Their performance awed the crowd.`,
                failure: `But their stunts did not go over well with the audience.`,
            },
            {
                prompt: `${cape.name} did a school presentation.`,
                stat: 'vitality',
                contest: 1,
                success: `Their event inspired many young minds.`,
                failure: `But the kids were too exhausting to properly deal with.`,
            },
            {
                prompt: `${cape.name} gave a community speech.`,
                stat: 'utility',
                contest: 1,
                success: `Impressing many people and gathering a large crowd.`,
                failure: `But they did not seem that knowledgeable on the subject.`,
            },
        ]

        var successes = 0;

        display.addField("Operator", cape.name);
        var bStats = getBattleStats(cape)
        var enc = encounters[Math.floor(Math.random()*encounters.length)];
        var info = enc.prompt;
        if (statCheck(bStats,enc.contest,enc.stat)){
            successes++;
            info+="\n"+enc.success;
        }
        else{
            info+="\n"+enc.failure;
        }
        display.addField("Encounter", info);

        if (successes > 0){
            return true;
        }else{
            return false;
        }

    },
    ['runpvp']: (teamData, teamCapes, enemyTeamData, enemyCapes, display) => {
        var cape = teamCapes[0];
        var enemyCape = enemyCapes[0];

        const encounters = [
            {
                prompt: `hosting an autograph signing.`,
                success: `The fight resulted in ${cape.name} garnering even more attention.`,
                failure: `${enemyCape.name}'s disruption caused the event to close early.`,
            },
            {
                prompt: `doing a public stunt.`,

                success: `The battle only ADDED to the audience appeal.`,
                failure: `The display ended in disaster.`,
            },
            {
                prompt: `giving a school presentation.`,
                success: `But they were successfully fought off and arrested.`,
                failure: `${cape.name} received criticism for endangering young lives.`,
            },
            {
                prompt: `giving a community speech.`,
                success: `Impressing many people and gathering a large crowd.`,
                failure: `But they did not seem that knowledgeable on the subject.`,
            },
        ]

        var enc = encounters[Math.floor(Math.random()*encounters.length)];
        display.addField("Encounter", `${enemyCape.name} attacked ${cape.name} while they were ${enc.prompt}!`)
        display.addField("Fighters", "**"+cape.name+"**"+" vs "+"**"+enemyCape.name+"**");
        const data = fightModule.singleFight(cape, enemyCape);
        const userWin = data[0];
        var fightInfo = data[1];

        if (userWin){
            fightInfo += "\n"+enc.success;
        }
        else{
            fightInfo += "\n"+enc.failure;
        }

        display.addField("Details", fightInfo);
        return (userWin);
    },

}

const drugbust = {
    name: "Raid",
    info: "Bust a drug den",
    capereq: 2,
    repreq: 300,
    pvp: true,
    time: 240,
    prize: {
        funds: 100,
        reputation: 80,
    },
    penalty: {
        funds: -50,
        reputation: 0,
    },
    stopprize: {
        funds: 100,
        reputation: -30,
    },
    stoppenalty:{
        funds: -60,
        reputation:0
    },

    ["run"]: (teamData, capes, display) =>{
        var encounters = [
            {
                reaction: "But the area was under heavy guard.",
                stat: "strength",
                contest: 3,
                success: teamData.name+" were able to defeat the goons.",
                failure: teamData.name+" had to flee for their lives.",
            },
            {
                reaction: "They found incriminating financial records",
                stat: "technique",
                contest: 2,
                success: teamData.name+" were able to quickly record and escape with the documents.",
                failure: "But when they did not have enough time to obtain the evidence before reinforcements arrived.",
            },
            {
                reaction: "They triggered the silent alarm!",
                stat: "control",
                contest: 3,
                success: teamData.name+" were able to grab the cash and run before more goons showed up.",
                failure: teamData.name+" could not get to the money in time."
            },
        ]

        display.addField("Operators", capes[0].name + " & "+capes[1].name);

        const enc = encounters[Math.floor(Math.random()*encounters.length)];
        var info = `${teamData.name} busted into a drug den. ${enc.reaction}\n`;
        var bStats = getBattleStats(capes[Math.ceil(Math.random(capes.length))])

        const winCon = statCheck(bStats,enc.contest,enc.stat);
        if (winCon){
            info += enc.success;
        }
        else{
            info += enc.failure;
        }

        display.addField("Encounter", info);
        return (winCon);
    },
    ['runpvp']: (teamData, teamCapes, enemyTeamData, enemyCapes, display) => {
        var cape = teamCapes[0];
        var enemyCape = enemyCapes[0];

        display.addField("Encounter", 
        `${teamData.name} raided a drug den under ${enemyTeamData}'s protection.`
        )

        display.addField("**"+teamData.name+"**"+" vs "+"**"+enemyTeamData.name+"**", 
        cape.name+" and "+teamCapes[1].name + " vs " + enemyCape.name + " and "+enemyCapes[1].name
        );

        const data = fightModule.multiFight(teamCapes, enemyCapes,teamData.name,enemyTeamData.name);
        const userWin = data[0];
        var fightInfo = data[1];
        if (userWin){
            fightInfo += "\n"+teamData.name+" chased"+enemyTeamData.name+" off and ruined their drug operations.";
        }
        else{
            fightInfo += "\n"+enemyTeamData.name+" protected their den, further securing their status.";
        }
        display.addField("Details", fightInfo);
        return (userWin);
    },
}

const disrupt = {
    name: "Disrupt",
    info: "Crash a public event to flaunt your teams strengths.",

    capereq: 1,
    repreq: -30,
    pvp: true,
    time:  120,
    prize: {
        funds: 50,
        reputation: -40,
    },
    penalty: {
        funds: -25,
        reputation: 25,
    },
    stopprize: {
        funds: 0,
        reputation: 75,
    },
    stoppenalty:{
        funds: -50,
        reputation: 0
    },

    ["run"]: (teamData, capes, display) =>{
        var cape = capes[0];
        const encounters = [
            {
                prompt: `${cape.name} crashed a local fundraiser!`,
                stat: 'control',
                contest: 2,
                success: `They successfully intimidated the crowd into dispersing.`,
                failure: `But the participants quickly evacuated and regrouped later.`,
            },
            {
                prompt: `${cape.name} crashed a  mall event!`,
                stat: 'strength',
                contest: 2,
                success: `They made a spectacle of themselves as they trashed the shops.`,
                failure: `But security called reinforcements before they could do enough damage.`,
            },
            {
                prompt: `${cape.name} crashed an community convention.`,
                stat: 'utility',
                contest: 2,
                success: `Creating enoough of a ruckus to delay the event until the next year.`,
                failure: `But they were oddly on theme for the convention, making people excited but not scared.`,
            },
        ]

        var successes = 0;

        display.addField("Party Crasher", cape.name);
        var bStats = getBattleStats(cape)
        var enc = encounters[Math.floor(Math.random()*encounters.length)];
        var info = enc.prompt;
        if (statCheck(bStats,enc.contest,enc.stat)){
            successes++;
            info+="\n"+enc.success;
        }
        else{
            info+="\n"+enc.failure;
        }
        display.addField("Encounter", info);

        if (successes > 0){
            return true;
        }else{
            return false;
        }

    },
    ['runpvp']: (teamData, teamCapes, enemyTeamData, enemyCapes, display) => {
        var cape = teamCapes[0];
        var enemyCape = enemyCapes[0];

        const encounters = [
            {
                prompt: `${cape.name} crashed a local fundraiser`,
                success: `They successfully intimidated the crowd into dispersing.`,
                failure: `But the participants quickly evacuated and regrouped later.`,
            },
            {
                prompt: `${cape.name} crashed a  mall event`,
                success: `They made a spectacle of themselves as they trashed the shops.`,
                failure: `But security called reinforcements before they could do enough damage.`,
            },
            {
                prompt: `${cape.name} crashed an community convention`,
                success: `Creating enoough of a ruckus to delay the event until the next year.`,
                failure: `But they were oddly on theme for the convention, making people excited but not scared.`,
            },
        ]


        var enc = encounters[Math.floor(Math.random()*encounters.length)];
        display.addField("Encounter", enc.prompt+` but ${enemyCape.name} was there to stop them!`)
        display.addField("Fighters", "**"+cape.name+"**"+" vs "+"**"+enemyCape.name+"**");
        const data = fightModule.singleFight(cape, enemyCape);
        const userWin = data[0];
        var fightInfo = data[1];

        if (userWin){
            fightInfo += `\n ${cape.name} trampled past ${enemyCape.name}'s public defense.`;
        }
        else{
            fightInfo += `\n ${enemyCape.name} stopped ${cape.name} in their tracks!`;
        }

        display.addField("Details", fightInfo);
        return (userWin);
    },

}

const operations = [
    //rogue
    arena,

    //heroic
    patrol,
    pr_event,
    drugbust,

    //villainous
    mugging,
    robbery,
    disrupt,
];


// Respondable Ops
/*
op name:
op id:
userid:
capeids:
time limit:
capereq:

enemyid:
enemycapeIds:
enemyteamname:

questMessage:

message should display a status: Open / Responded, finished ops get deleted from the post

*/



var respondableOps = [];
var cleanedUsers = {};//dictionary of users who have already had their players checked

async function completeOperation(client,op,questObj){
    if (questObj.aborted){
        return;
    }
    //console.log("Resolving "+op.name+".");
    var display = new MessageEmbed();
    
    //getting update Dataset
    var teamData = await client.teamsDB.get(`${questObj.userid}`,0);
    const userchannel = client.channels.cache.get(questObj.userchannel);
    //matching new array of capes to their id in case name changes or something
    var updatedCapes = [];
    for (id of questObj.capeids){
        for (c of teamData.capes){
            if (c.id == id){
                c.activity = "none";
                updatedCapes.push(c);
            }
        }
    }
    var result;
    if (questObj.enemyid == "null"){
        result = op.run(teamData, updatedCapes,display);

        if (result){
            display.setColor("GREEN");
            display.setAuthor("SUCCESS! | "+ op.name + " Completed");
            display.addField("Reputation", teamData.reputation+" -> "+(teamData.reputation+op.prize.reputation));
            display.addField("Funds", "$"+teamData.funds+" -> "+("$"+(teamData.funds+op.prize.funds)));

            teamData.reputation = teamData.reputation + op.prize.reputation;
            teamData.funds = teamData.funds + op.prize.funds;

            var levelInfo = ""
            for (cape of updatedCapes){
                var levelUp = levelModule.giveXP(cape,(op.prize.xp || 1));
                levelInfo += `${cape.name} gained ${op.prize.xp || 1} XP.\n`
                if (levelUp != false){
                    levelInfo+=levelUp+"\n"
                }
            }
            display.addField("Training",levelInfo);

        }else{
            display.setColor("RED");
            display.setAuthor("FALURE! | "+ op.name + " Ended");
            display.addField("Reputation", teamData.reputation+" -> "+(teamData.reputation+op.penalty.reputation));
            display.addField("Funds", "$"+teamData.funds+" -> "+("$"+(teamData.funds+op.penalty.funds)));

            teamData.reputation = teamData.reputation + op.penalty.reputation;
            teamData.funds = teamData.funds + op.penalty.funds;
        }
        for (fighter of updatedCapes){
            if (fighter.item && fighter.item.durability > 0 && op.name.toLowerCase() != "arena"){
                fighter.item.durability--;
               // console.log("dropped durability by 1 to "+fighter.item.durability)
                if (fighter.item.durability == 0){
                    display.addField("Loss",`\n${fighter.name}'s ${item.name} broke.`,false);
                    fighter.item = null;
                    if(fighter.weapon){
                        fighter.weapon = null;
                    }
                }
            }
        }

    }else{
        //console.log("Resolving pvp based operation");
        //getting update dataset of enemy
        enemyTeamData = await client.teamsDB.get(`${questObj.enemyid}`,0);

        //matching new array of capes to their id in case name changes or something
        var updatedEnemyCapes = [];
        for (id of questObj.enemycapeids){
            for (c of enemyTeamData.capes){
                if (c.id == id){
                    c.activity = "none";
                    updatedEnemyCapes.push(c);
                }
            }
        }
        result = op.runpvp(teamData, updatedCapes,enemyTeamData,updatedEnemyCapes, display);
        

        if (result){
            display.setColor("GREEN");
            display.setAuthor("MISSION SUCCESS! | "+ teamData.name + " complete the "+op.name);

            display.addField("**"+teamData.name+" Results**",
            "**Reputation:** "+ teamData.reputation+" -> "+(teamData.reputation+op.prize.reputation)+"\n"+
            "**Funds: **"+ "$"+teamData.funds+" -> "+"$"+(teamData.funds+op.prize.funds)
            );
            display.addField("**"+enemyTeamData.name+" Results**",
            "**Reputation:** "+ enemyTeamData.reputation+" -> "+(enemyTeamData.reputation+op.stoppenalty.reputation)+"\n"+
            "**Funds: **"+ "$"+enemyTeamData.funds+" -> "+"$"+(enemyTeamData.funds+op.stoppenalty.funds)
            );

            teamData.reputation = teamData.reputation + op.prize.reputation;
            teamData.funds = teamData.funds + op.prize.funds;
            
            enemyTeamData.reputation = enemyTeamData.reputation + op.stoppenalty.reputation;
            enemyTeamData.funds = enemyTeamData.funds + op.stoppenalty.funds;

            var levelInfo = ""
            for (cape of updatedCapes){
                var levelUp = levelModule.giveXP(cape,(op.prize.xp || 1));
                levelInfo += `${cape.name} gained ${op.prize.xp || 1} XP.\n`
                if (levelUp != false){
                    levelInfo+=levelUp+"\n"
                }
            }
            display.addField("Training",levelInfo);
            
        }else{
            display.setColor("RED");
            display.setAuthor("MISSION FALED! | "+ enemyTeamData.name + " interrupted "+teamData.name+"'s "+op.name);

            display.addField("**"+teamData.name+" Results**",
            "**Reputation:** "+ teamData.reputation+" -> "+(teamData.reputation+op.penalty.reputation)+"\n"+
            "**Funds: **"+ "$"+teamData.funds+" -> "+"$"+(teamData.funds+op.penalty.funds)
            );
            display.addField("**"+enemyTeamData.name+" Results**",
            "**Reputation:** "+ enemyTeamData.reputation+" -> "+(enemyTeamData.reputation+op.stopprize.reputation)+"\n"+
            "**Funds: **"+ "$"+enemyTeamData.funds+" -> "+"$"+(enemyTeamData.funds+op.stopprize.funds)
            );

            teamData.reputation = teamData.reputation + op.penalty.reputation;
            teamData.funds = teamData.funds + op.penalty.funds;
            
            enemyTeamData.reputation = enemyTeamData.reputation + op.stopprize.reputation;
            enemyTeamData.funds = enemyTeamData.funds + op.stopprize.funds;

            var levelInfo = ""
            for (cape of updatedEnemyCapes){
                var levelUp = levelModule.giveXP(cape,(op.prize.xp || 1));
                levelInfo += `${cape.name} gained ${op.prize.xp || 1} XP.\n`
                if (levelUp != false){
                    levelInfo+=levelUp+"\n"
                }
            }
            display.addField("Training",levelInfo);
        }
        for (fighter of [...updatedCapes,...updatedEnemyCapes]){
            if (fighter.item && fighter.item.durability > 0 && op.name.toLowerCase() != "arena"){
                fighter.item.durability--;
                if (fighter.item.durability == 0){
                    display.addField("Loss",`\n${fighter.name}'s ${item.name} broke.`,false);
                    fighter.item = null;
                    if(fighter.weapon){
                        fighter.weapon = null;
                    }
                }
            }
        }
        

        await client.teamsDB.set(`${questObj.enemyid}`,enemyTeamData);
    }
    
    // giving results
    if (userchannel){
        if (questObj.enemyid != "null" && questObj.userchannel != questObj.enemychannel){
            //("posting on other chat")
            const enemychannel = client.channels.cache.get(questObj.enemychannel);
            enemychannel.send("<@"+questObj.enemyid+"> "+op.name+ " is finished.");
            enemychannel.send(display);
            userchannel.send("<@"+questObj.userid+">"+op.name+ " is finished.");
            userchannel.send(display);
        }else{
            if (questObj.enemyid != "null"){
                userchannel.send("<@"+questObj.enemyid+"> <@"+questObj.userid+">"+op.name+ " is finished.");
            }else{
                userchannel.send("<@"+questObj.userid+"> "+op.name+ " is finished.");
            }
            userchannel.send(display);
        }
    }else{
        console.log("Could not find user channel. I should PM this to someone")
    }
    

    // removing quest from respondable ops
    if (op.pvp){
        for (var i = 0; i < respondableOps.length; i++){
            if (respondableOps[i].questid == questObj.questid){
                respondableOps.splice(i,1);
            }
        }
        await client.questsDB.set("CurrentQuests", respondableOps);
    }

    // saving data
    await client.teamsDB.set(`${questObj.userid}`,teamData);

}

async function sendOff(client,teamData,message,args,op,capes,response){

    // Add cape to active list here

    var info = ""
    for (var i = 0; i < capes.length; i++){
        if (capes.length-1 == i && capes.length != 1){
            info+= (" and "+capes[i].name);
        }else if (capes.length != 1 && i !=0){
            info+= (capes[i].name+", ");
        }else{
            info = capes[i].name;
        }
    }
    //console.log(capes);

    var activeIDs = [];
    for (activeCape of capes){
        activeIDs.push(activeCape.id);
    }
    for (activeCape of capes){
        activeCape.activity = op.name;
    }
    if (!response)
        message.channel.send("Sent "+ info + " on "+ op.name.toLowerCase()+ " operation.");
    else
        message.channel.send("Responded to "+op.name.toLowerCase()+" with "+info+".");

    //Saving cape to active list
    await client.teamsDB.set(`${message.author.id}`,teamData);
    
    if (response){
        op.enemycapeids = activeIDs;
        op.enemyteamname = teamData.name;
        op.enemyid = message.author.id;
        op.questid = -1;
        op.enemychannel = message.channel.id;
        let firstUser = client.users.cache.get(op.userid);
        let secondUser = client.users.cache.get(op.enemyid);

        op.message.edit(op.enemyteamname+" have responded to "
        + op.teamname + "'s "+op.name.toLowerCase()+". Results will arrive in " + op.time+ " minutes."
        );
        await client.questsDB.set("CurrentQuests", respondableOps);

        return;
    }


    var questObj = new Object();
    //op data
    questObj["name"] = op.name;
    questObj["userchannel"] = message.channel.id;
    questObj["aborted"] = false;
    questObj['time'] = op.time;
    questObj['startdate'] = new Date().getTime();
    //userdata
    questObj['userid'] = teamData.userid;
    questObj['capeids'] = activeIDs;
    questObj['capereq'] = questObj.capeids.length;
    questObj['teamname'] = teamData.name;

    questObj['prize'] = {
        ['funds']: op.prize.funds,
        ['reputation']: op.prize.reputation,
    }
    questObj['stopprize'] = {
        ['funds']: op.stopprize.funds,
        ['reputation']: op.stopprize.reputation,
    }

    if (op.pvp == true){
        const channel = await client.channels.cache.get(postchannel);
        var questId = 1;
        for (actOp of respondableOps){
            if (actOp.questid == questId){
                questId++;
            }
        }

        questMsg = await channel.send(
            (message.member.nickname || message.member.user.username)
            +" has sent "+teamData.name + " on a "+ op.name+"\n"+
            "Operation requires "+activeIDs.length+" cape(s) "+ "and ends in "+op.time+" minutes.\n"+
            "Use `,respond "+questId+" [capename/id]` to respond!\n"+
            "* * * * * * * * *"
        ); 
        //enemy data
        questObj['enemyid'] = "null";
        questObj['enemycapeids'] = "null";
        questObj['enemyteamname'] = "null";
        questObj["enemychannel"] = message.channel.id;
        //metadata
        questObj['message'] = questMsg;
        questObj["questid"] = questId;
        respondableOps.push(questObj);
        await client.questsDB.set("CurrentQuests", respondableOps);
    }

    //running final result here
    setTimeout(async function(){
        completeOperation(client,op, questObj);    
    }, op.time*1000*60);

}//sendOff

async function startOp(client, teamData, message, args, response){
    var op;

    if (!response){
        op = operations[args[0]-1] || undefined;
    
        if (op == undefined){
            for (testOp of operations){
                if (args[0].toLowerCase() === testOp.name.toLowerCase()){
                    op = testOp;
                }
            }
        }
    }

    // checking if op is a response

    if (!response){
        if (op === undefined){ message.reply(args[0] + " is Invalid Operation"); return;}
        if ((op.repreq > 0 && teamData.reputation < op.repreq) || (op.repreq < 0 && teamData.reputation > op.repreq)){
            message.reply("You need more reputation before accessing that operation"); return;
        }
    }else{
        for (testOp of respondableOps){
            if (testOp.questid == args[0])
                op = testOp;
        }
        if (op == null){
            message.reply("The operation id you gave is not in use.");
            return;
        }
        if (op.enemyid != "null"){
            message.reply("That operation has already been responded to by "+op.enemyteamname);
            return;
        }
        if (op.userid == message.author.id){
            message.reply("You can not respond to your own operation!");
            return;
        }
    }

    var capes = [];

    for (var i = 1; i < args.length; i++){
        if (teamData.capes[args[i]-1]){
            capes.push(teamData.capes[args[i]-1]);
        }
        else{
            var found = false;
            for (tCape of teamData.capes){
                if ((args[i] != undefined && tCape.name.toLowerCase() === args[i].toLowerCase()) || (args[i+1] && tCape.name.toLowerCase() === (args[i]+" "+args[i+1]).toLowerCase() )){
                    capes.push(tCape);
                    found = true;
                }
            }
            if (!found){
                message.reply(args[i]+" is an invalid cape id/name");
                return;
            }
        }
    }

    

    if (capes.length < op.capereq){
        message.reply("You need to send more capes!");
        return;
    }

    // checking if capes were already active
    for (cape of capes){
        if (cape.activity != 'none'){
            message.reply(cape.name+" is already on a mission. You can not send them until they finish.");
            return;
        }
    }

    for (var i = 0; i < capes.length; i++){
        for (var j = 0; j < capes.length; j++){
            if (capes[i].id == capes[j].id && i !=j ){
                message.reply(`You can not send ${capes[i].id} in multiple cape slots.`)
                return;
            }
        }
    }

    // sending multiple capes at once
    if (capes.length > op.capereq && capes.length%op.capereq == 0 && !response){
        //console.log("Multi quest")
        for (var i = 0; i < capes.length; i+=op.capereq){
            var capePod = []
            for (var x = 0; x < op.capereq; x++){
                //console.log(i+" "+x);

                capePod.push(capes[i+x]);
            }
            //console.log("Sending: "+capePod.length);
            //console.log(capePod)
            await sendOff(client,teamData,message,args,op,capePod,response);
        }
    }
    else{
        capes.splice(op.capereq);
        sendOff(client,teamData,message,args,op,capes,response)
    }
}

function responseOps(client, message,args,teamData){
    var display =  new MessageEmbed()
    .setColor("RED")
    .setAuthor("Open Operations");

    // only shows one time of open op, prioritized by time until completion
    var shownOps = new Map();
    const currentDate = new Date().getTime();

    for (quest of respondableOps){
        if (quest.questid > 0 && quest.userid != teamData.userid){  
            if (shownOps.get(quest.name)){
                if(quest.startdate < shownOps.get(quest.name).startdate){
                    shownOps.set(quest.name, quest)
                }
            }
            else{
                shownOps.set(quest.name, quest)
            }
        }
    }

    var rogueText = "";
    var heroText = "";
    var villainText = "";

    for (var op of shownOps){
        var quest = op[1];
        var opText = `${quest.questid}) **${quest.name}** | ${quest.teamname}\n`;

        opText+=`Ends in ${returnReadableTime(quest.startdate-currentDate+(quest.time*60000))} | `+
       
        `Capes: ${quest.capereq}\n`+
       `Prizes: $${quest['stopprize']['funds']} Rep: ${quest['stopprize']['reputation']}\n`;
       
        if (quest['prize']['reputation'] > 0){
            heroText+=opText;
        }
        else if (quest.prize.reputation < 0){
            villainText+=opText;
        }
        else if (quest.prize.reputation == 0){
            rogueText+=opText;
        }
    }


    if (rogueText == ""){
        rogueText = "No active rogue operations."
    }
    if (heroText == ""){
        heroText = "No active hero operations."
    }
    if (villainText == ""){
        villainText = "No active villain operations."
    }

    if (args[0] && alignmentShortcuts[args[0].toLowerCase()]){
        if (alignmentShortcuts[args[0].toLowerCase()]=="hero"){
            display.addField("**Heroic Operations**",heroText);
        }
        if (alignmentShortcuts[args[0].toLowerCase()]=="villain"){
            display.addField("**Villainous Operations**",villainText);
        }
        if (alignmentShortcuts[args[0].toLowerCase()]=="rogue"){
            display.addField("**Rogue Operations**",rogueText);
        }
    }
    else{
        if (teamData.reputation <= 0){
            display.addField("**Heroic Operations**",heroText);
        }
        if (teamData.reputation >= 0 ){
            display.addField("**Villainous Operations**",villainText);
        }
        display.addField("**Rogue Operations**",rogueText);
    }


    
    display.addField("Help","`,respond [op id] [cape ids]` to respond to an ongoing operation."+
    "\n`,op [alignment]` to only see missions of that type"
    )

    message.reply(display);
}

async function abortOp(client,teamData,message,args){
    var cape = teamData.capes[args[0]-1] || null;
    if (cape == null){
        for (tCape of teamData.capes){
            if ((args[0] != undefined && tCape.name.toLowerCase() === args[0].toLowerCase()) || (args[1] && tCape.name.toLowerCase() === (args[0]+" "+args[1]).toLowerCase() )){
                cape = tCape;
            }
        }
    }

    if (cape.activity == "none"){
        message.reply(`${cape.name} is not on a mission.`);
        return;
    }
    if (cape == null){
        //console.log("Could not find cape.");
        return;
    }
    for (var i = 0; i < respondableOps.length; i++){
        var quest = respondableOps[i];
        if (quest.name == cape.activity){
            if (quest.userid == teamData.userid){
                var found = false;
                for (testId of quest.capeids){
                    if (testId == cape.id){
                        found = true;
                    }
                }
                if (found){
                    if (quest.enemyid == "null"){
                        
                        quest['aborted'] = true;
                        for (id of quest.capeids){
                            for (testCape of teamData.capes){
                                if (id == testCape.id){
                                    testCape.activity = "none";
                                }
                            }
                        }
                        respondableOps.splice(i,1);
                        
                        if (quest.message){
                            quest.message.edit(quest.teamname+" has aborted their "+quest.name+".");
                        }
                        
                        await client.teamsDB.set(`${teamData.userid}`,teamData);
                        await client.questsDB.set("CurrentQuests", respondableOps);

                        message.reply(`Aborted ${quest.name}.`);
                        return;
                    }
                    else{
                        message.reply("You can not abort a mission that has been responded to.");
                        return;
                    }
                }
            }
        }
    }
    message.reply("Could not find cape's operation.");
    return;

}


module.exports.run = async (client, message, args) =>{
    var teamData = await client.teamsDB.get(`${message.author.id}`, 0);
    if (teamData == 0 ) {
        message.reply("You have no data. Use `start` command to begin!");
        return
    }

    // removing broken quests
    if (!cleanedUsers[message.author.id]){
        for (var cape of teamData.capes){
            var isQuesting = false;
            for (var quest of respondableOps){
                for (var testCape of quest.enemycapeids){
                    if(testCape.id == cape.id){
                        isQuesting = true;
                    }
                }
                for (var testCape of quest.capeids){
                    if(testCape.id == cape.id){
                        isQuesting = true;
                    }
                }
            }
            if (!isQuesting){
                cape.activity = "none"
            }
        }

        cleanedUsers[message.author.id] = true;
        await client.teamsDB.set(`${message.author.id}`, teamData)
    
    }
    
    // response
    if (args[1] || message.content.substring(1,8) == "respond" || message.content.substring(1,6) == "abort"){
        if (message.content.substring(1,8) == "respond"){
            if (!args[1]){
                responseOps(client,message,args,teamData);
            }
            else{
                startOp(client, teamData, message, args, true);
            }
            return;
        }
        else if(message.content.substring(1,6) == "abort"){
            abortOp(client,teamData,message,args);
            return;
        }
        else{
            startOp(client,teamData, message, args, false); return;
        }
    }

    var display =  new MessageEmbed()
    .setColor("RED")
    .setAuthor("Operation | "+teamData.name)
    .addField("Reputation:", teamData.reputation, true)
    .addField("Funds:", "$"+teamData.funds, true);

    var info = "";

    var readyCapes = [];
    var activeCapes = [];
    var count = 1
    for (cape of teamData.capes){
        //console.log(cape.activity);
        if (cape.activity != 'none'){
            activeCapes.push([cape,count]);
        }
        else{
            readyCapes.push([cape,count]);
        }
        count++;
    }

    var capeInfo = "";
    const spaceChar = '\xa0'
    for (capeNode of readyCapes){
        var cape = capeNode[0];
        var count = capeNode[1];

        var repeats = 20-cape.name.length//-cape.class.length;
        if (repeats < 1){ repeats = 1;}
        capeInfo += "`"+count+") "+cape.name+""+spaceChar.repeat(repeats)+
        //cape.class+
        " | STR-"+cape.strength+
        " | VIT-"+cape.vitality+
        " | UTL-"+cape.utility+
        " | CTR-"+cape.control+
        " | TEQ-"+cape.technique+
        " |`\n";
    }
    if (readyCapes.length == 0)
        capeInfo = "No Available Capes"
    
    display.addField("Available Capes", capeInfo, false);
    
    capeInfo = "";

    for (capeNode of activeCapes){
        var cape = capeNode[0];
        var count = capeNode[1];
        var repeats = 25-cape.name.length-cape.activity.length//-cape.class.length;
        if (repeats < 1){ repeats = 1;}
        capeInfo += "`"+count+") "+cape.name+" (" +cape.activity+")"+spaceChar.repeat(repeats)+
        
        //cape.class+
        " | STR-"+cape.strength+
        " | VIT-"+cape.vitality+
        " | UTL-"+cape.utility+
        " | CTR-"+cape.control+
        " | TEQ-"+cape.technique+
        " |`\n";}
    
    if (activeCapes.length == 0)
        capeInfo = "No Active Capes"
    display.addField("Active Capes", capeInfo, false);


    var rogueText = "";
    var heroText = "";
    var villainText = "";
    

    count = 0;
    
    for(var op of operations){
        var opText = "";
        count++;
        var reqlock = " LOCKED ("+op.repreq+" Rep)";
        opText+= `${count}) **${op.name}**`
        if ((op.repreq >= 0 && teamData.reputation >= op.repreq) || (op.repreq <= 0 && teamData.reputation <= op.repreq)){
            opText+=` | ${op.time} Min. | Capes: ${op.capereq} | `+
            `Prizes: $${op.prize.funds} Rep: ${op.prize.reputation}`;
        }
        else{
            opText += reqlock;
        }
        opText+= `\n*${op.info}*\n`  
        
        if (op.prize.reputation > 0){
            heroText+=opText;
        }
        else if (op.prize.reputation < 0){
            villainText+=opText;
        }
        else if (op.prize.reputation == 0){
            rogueText+=opText;
        }
    }


    if (args[0] && alignmentShortcuts[args[0].toLowerCase()]){
        if (alignmentShortcuts[args[0].toLowerCase()]=="hero"){
            display.addField("**Heroic Operations**",heroText);
        }
        if (alignmentShortcuts[args[0].toLowerCase()]=="villain"){
            display.addField("**Villainous Operations**",villainText);
        }
        if (alignmentShortcuts[args[0].toLowerCase()]=="rogue"){
            display.addField("**Rogue Operations**",rogueText);
        }
    }
    else{
        if (teamData.reputation >= 0){
            display.addField("**Heroic Operations**",heroText);
        }
        if (teamData.reputation <= 0){
            display.addField("**Villainous Operations**",villainText);
        }
        display.addField("**Rogue Operations**",rogueText);
    }

    display.addField(
        "Help","`,op [op number/name] [cape id]` to send a cape on that op."+
    "\n`,op [alignment]` to only see missions of that type"+
    "\n`,abort [cape id]` to stop a mission"
    );
    
    message.reply(display);
}

module.exports.setup = async(client) =>{
    respondableOps = await client.questsDB.get("CurrentQuests", []);
    // completing saved quests
    console.log(respondableOps.length+" Backlogged Quests")
    while (respondableOps.length > 0)
    {
            for (questObj of respondableOps){
                for (op of operations){
                    if (questObj.name == op.name){
                        console.log("Completing "+op.name);
                        await completeOperation(client,op,questObj);
                    }
                }
            }
    }
    respondableOps = [];
    console.log("readied quest")
}

module.exports.help = {
    name: "op",
    description: "Send your capes on a mission to gain funds and reputation with `,op [op id/name] [cape ids/names]`\n"
    +"Other teams can respond to your mission to disrupt you and gain prizes of their own with the `,respond` command",
}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}