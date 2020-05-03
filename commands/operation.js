const {readdirSync} = require('fs');
const { join } = require("path");
const {postchannel} = require("../config.js");

const filePath = join(__dirname,"..","commands");

const { MessageCollector, MessageEmbed} = require("discord.js");


//modules
const capeModule = require(`${filePath}/cape.js`);
const fightModule = require("../structures/fight.js");

//database: Key == 
const { VultrexDB, SQLiteProvider } = require("vultrex.db");
const teamsDB = new VultrexDB({
    provider: 'sqlite',
    table: 'usertable',
    fileName: 'teamdatabase'
});
const questsDB = new VultrexDB({
    provider: "sqlite",
    table: 'questtable',
    fileName: 'questdatabase'
})


function statCheck(cape, dc, stat){
    var measure = cape[stat]+dc;
    if (Math.floor(Math.random()*measure+1) <= cape[stat]){
        return true;
    }

    return false;
}

/* Ops
    name
    capereq - how many capes are needed to patrol
    repreq - how much reputation they need before they can complete, negative reps measure by less than
    pvp - if action is respondable
    time - how long it takes, results displayed at end. Measured in SECONDS
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
        console.log("Patroling cape: "+cape.name);
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

        for (var i = 0; i < Math.ceil(Math.random()*2); i++){
            var enc = encounters[Math.floor(Math.random()*encounters.length)];
            var info = enc.prompt;
            if (statCheck(cape,enc.contest,enc.stat)){
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

        const enc = encounters[Math.floor(Math.random()*encounters.length)];
        var info = cape.name+" spotted a victim and tried to rob them. "+enc.reaction;

        const winCon = statCheck(cape,enc.contest,enc.stat);
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
        return (true);
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
    repreq: -50,
    pvp: true,
    time: .1,
    prize: {
        funds: 150,
        reputation: -20,
    },
    penalty: {
        funds: -50,
        reputation: 0,
    },
    stopprize: {
        funds: 75,
        reputation: -10,
    },
    stoppenalty:{
        funds: -50,
        reputation:0
    },

    shops: [
        "the Chicken Soup Burgers fastfood restaurant",
        "a jewlry shop",
        "an E-Mart",
        "a pharmacy",
        "a car rental",
        "a mall",
        "a fancy restaurant",
    ],



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

        const enc = encounters[Math.floor(Math.random()*encounters.length)];
        var info = cape.name+" spotted a victim and tried to rob them. "+enc.reaction;

        const winCon = statCheck(cape,enc.contest,enc.stat);
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
        const shop = shops[Math.random(shops.length)];

        display.addField("Encounter", 
        `${teamData.name} robbed ${shop} but ${teamData.name} came to the rescue!`
        )

        display.addField("**"+teamData.name+"**"+" vs "+"**"+enemyTeamData.name+"**", 
        cape.name+" and "+teamCapes[1].name + " vs " + enemyCape.name + " and "+enemyCapes[1].name
        );

        const data = fightModule.multiFight(teamCapes, EnemyCapes);
        const userWin = data[0];
        const fightInfo = data[1];
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


const operations = [
    arena,
    patrol,
    mugging,
    robbery,
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

async function completeOperation(client,op,questObj){
    console.log("Resolving "+op.name+".");
    var display = new MessageEmbed();
    
    //getting update Dataset
    var teamData = await teamsDB.get(`${questObj.userid}`,0);
    const userchannel = await client.channels.cache.get(questObj.userchannel);
    
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
    var result
    if (questObj.enemyid == "null"){
        result = op.run(teamData, updatedCapes,display);

        if (result){
            display.setColor("GREEN");
            display.setAuthor("SUCCESS! | "+ op.name + " Completed");
            display.addField("Reputation", teamData.reputation+" -> "+(teamData.reputation+op.prize.reputation));
            display.addField("Funds", "$"+teamData.funds+" -> "+("$"+(teamData.funds+op.prize.funds)));

            teamData.reputation = teamData.reputation + op.prize.reputation;
            teamData.funds = teamData.funds + op.prize.funds;
        }else{
            display.setColor("RED");
            display.setAuthor("FALURE! | "+ op.name + " Ended");
            display.addField("Reputation", teamData.reputation+" -> "+(teamData.reputation-op.penalty.reputation));
            display.addField("Funds", "$"+teamData.funds+" -> "+("$"+(teamData.funds+op.penalty.funds)));

            teamData.reputation = teamData.reputation - op.penalty.reputation;
            teamData.funds = teamData.funds - op.penalty.funds;
        }

    }else{
        console.log("Resolving pvp based operation");
        //getting update dataset of enemy
        enemyTeamData = await teamsDB.get(`${questObj.enemyid}`,0);

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
            "**Reputation:** "+ enemyTeamData.reputation+" -> "+(enemyTeamData.reputation-op.stoppenalty.reputation)+"\n"+
            "**Funds: **"+ "$"+enemyTeamData.funds+" -> "+"$"+(enemyTeamData.funds-op.stoppenalty.funds)
            );

            teamData.reputation = teamData.reputation + op.prize.reputation;
            teamData.funds = teamData.funds + op.prize.funds;
            
            enemyTeamData.reputation = enemyTeamData.reputation - op.stoppenalty.reputation;
            enemyTeamData.funds = enemyTeamData.funds - op.stoppenalty.funds;
            
        }else{
            display.setColor("RED");
            display.setAuthor("MISSION FALED! | "+ enemyTeamData.name + " interrupted "+teamData.name+"'s "+op.name);

            display.addField("**"+teamData.name+" Results**",
            "**Reputation:** "+ teamData.reputation+" -> "+(teamData.reputation+op.penalty.reputation)+"\n"+
            "**Funds: **"+ "$"+teamData.funds+" -> "+"$"+(teamData.funds+op.penalty.funds)
            );
            display.addField("**"+enemyTeamData.name+" Results**",
            "**Reputation:** "+ enemyTeamData.reputation+" -> "+(enemyTeamData.reputation-op.stopprize.reputation)+"\n"+
            "**Funds: **"+ "$"+enemyTeamData.funds+" -> "+"$"+(enemyTeamData.funds-op.stopprize.funds)
            );

            teamData.reputation = teamData.reputation - op.penalty.reputation;
            teamData.funds = teamData.funds - op.penalty.funds;
            
            enemyTeamData.reputation = enemyTeamData.reputation + op.stopprize.reputation;
            enemyTeamData.funds = enemyTeamData.funds + op.stopprize.funds;
        }
        

        await teamsDB.set(`${questObj.enemyid}`,enemyTeamData);
    }
    
    // giving results
    if (questObj.enemyid != "null" && questObj.userchannel != questObj.enemychannel){
        console.log("posting on other chat")
        const enemychannel = await client.channels.cache.get(questObj.enemychannel);
        enemychannel.send("<@"+questObj.enemyid+"> <@"+questObj.userid+">"+op.name+ " is finished.");
        enemychannel.send(display);

        userchannel.send(display);
    }else{
        userchannel.send("<@"+questObj.userid+"> "+op.name+ " is finished.");
        userchannel.send(display);
    }

    // removing quest from respondable ops
    if (op.pvp){
        for (var i = 0; i < respondableOps.length; i++){
            if (respondableOps[i].questid == questObj.questid){
                respondableOps.splice(i,1);
            }
        }
        await questsDB.set("CurrentQuests", respondableOps);
    }

    // saving data
    await teamsDB.set(`${questObj.userid}`,teamData);

}

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
                //console.log(args[i])
                if (args[i] != undefined && tCape.name.toLowerCase() === args[i].toLowerCase() || (args[i+1] && tCape.name.toLowerCase() === (args[i]+" "+args[i+1]).toLowerCase() )){
                    capes.push(tCape);
                    i++;
                    found = true;
                }
                
            }
            if (!found){
                message.reply(args[i]+" is an invalid cape id");
                return;
            }
        }
    }

    if (capes.length < op.capereq){
        message.reply("You need to send more capes!");
        return;
    }
    capes.splice(op.capereq);

    // checking if capes were already active
    for (cape of capes){
        if (cape.activity != 'none'){
            message.reply(cape.name+" is already on a mission. You can not send them until they finish.");
            return;
        }
    }

    var info = ""
    for (var i = 0; i < capes.length; i++){
        if (capes.length-1 == i && capes.length != 1){
            info+= ("and "+capes[i].name);
        }else if (capes.length != 1 && i !=0){
            info+= (capes[i].name+", ");
        }else{
            info = capes[i].name;
        }
    }

    // Add cape to active list here
    var activeIDs = [];
    for (activeCape of capes){
        activeIDs.push(activeCape.id);
    }
    for (activeCape of capes){
        cape.activity = op.name;
    }
    if (!response)
        message.channel.send("Sent "+ info + " on "+ op.name.toLowerCase()+ " operation.");
    else
        message.channel.send("Responded to "+op.name.toLowerCase()+" with "+info+".");

    //Saving cape to active list
    await teamsDB.set(`${message.author.id}`,teamData);

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
        await questsDB.set("CurrentQuests", respondableOps);

        return;
    }


    var questObj = new Object();
    //op data
    questObj["name"] = op.name;
    questObj["userchannel"] = message.channel.id;
    questObj['time'] = op.time;
    //userdata
    questObj['userid'] = teamData.userid;
    questObj['capeids'] = activeIDs;
    questObj['capereq'] = questObj.capeids.length;
    questObj['teamname'] = teamData.name;
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
        await questsDB.set("CurrentQuests", respondableOps);
    }

    //running final result here
    setTimeout(async function(){
        completeOperation(client,op, questObj);    
    }, op.time*1000*60);
    
}

function responseOps(client, message,teamData){
    var display =  new MessageEmbed()
    .setColor("RED")
    .setAuthor("Open Operations");
    for (quest of respondableOps){
        if (quest.questid > 0){
            display.addField(quest.questid + " - "+ quest.name + " - "+quest.teamname, "Ends in "+quest.time+" minutes. Requires "+quest.capereq+" cape(s).");
        }
    }
    if (respondableOps.length < 1){
        display.addField("No Current Operations", "Come back later or initiate your own.")
    }
    display.addField("Help","Use command `,respond [op id] [cape ids]` to respond to an ongoing operation.")

    message.reply(display);
}

module.exports.run = async (client, message, args) =>{
    var teamData = await teamsDB.get(`${message.author.id}`, 0);
    if (teamData == 0 ) {
        message.reply("You have no data. Use `start` command to begin!");
        return
    }
    
    if (args[0] || message.content.substring(1,8) == "respond" ){
        if (message.content.substring(1,8) == "respond"){
            
            if (!args[0]){
                responseOps(client,message,teamData);
            }
            else{
                startOp(client, teamData, message, args, true);
            }
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

    
        capeInfo += `${count}) ${cape.name} ${spaceChar.repeat(20-cape.name.length)} | ${cape.class} | S-${cape.strength} | V-${cape.vitality} | U-${cape.utility} | C-${cape.control} | T-${cape.technique}\n`;
    }
    if (readyCapes.length == 0)
        capeInfo = "No Avalable Capes"
    
    display.addField("Avalable Capes", capeInfo, false);
    
    capeInfo = "";

    for (capeNode of activeCapes){
        var cape = capeNode[0];
        var count = capeNode[1];
        capeInfo += `${count}) ${cape.name} ${spaceChar.repeat(20-cape.name.length)}  (${cape.activity}) | ${cape.class} | S-${cape.strength} | V-${cape.vitality} | U-${cape.utility} | C-${cape.control} | T-${cape.technique}\n`;
    }
    if (activeCapes.length == 0)
        capeInfo = "No Active Capes"
    display.addField("Active Capes", capeInfo, false);
    count = 0;
    for (op of operations){
        count++;
        var reqlock = "LOCKED ("+op.repreq+" Rep)";
        if (teamData.reputation >= op.repreq){
            reqlock = "";
        }
        display.addField("**"+count+"** - **"+op.name+"**", 
        "Capes Required: " +op.capereq + " "+ reqlock + " | Time: "+(op.time)+" Minutes\n*"+op.info+"*"
        )

    }




    display.addField("Next","type `,op [op number/name] [cape id]` to send a cape on that op.");
    
    message.reply(display);


}

module.exports.setup = async(client) =>{
    await teamsDB.connect();
    await questsDB.connect();
    respondableOps = await questsDB.get("CurrentQuests", []);
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
    description: "",
}

module.exports.requirements = {
    clientPerms: ["EMBED_LINKS"],
    userPerms: [],
    ownerOnly: false
}