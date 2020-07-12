const maxLevel = 5;
//test 2

/*
        Level Up
    Upgrading primary stat: 45%
    Upgrading secondary stat: 30%
    Upgrading random stat: 25%

*/
const classList = {
    ['Blaster']: ['strength','control'],
    ['Breaker']: ['strength','utility'],
    ['Brute']: ['vitality','strength'],
    ['Changer']: ['vitality','technique'],
    ['Master']: ['control','utility'],
    ['Mover']: ['control','technique'],
    ['Shaker']: ['control','strength'],
    ['Stranger']: ['technique','vitality'],
    ['Striker']: ['strength','technique'],
    ['Thinker']: ['technique','utility'],
    ['Tinker']: ['utility','control'],
}
const statList = [
    "strength",
    "vitality",
    "utility",
    "technique",
    "control"
]


function calcMaxXp(level){
    return (level*10)
}

function setUp(cape){
    if(!cape.level){
        cape["level"] = 1;
        cape["xp"] = 0;
    }
}
function levelUp(cape){
    var stat;
    const lucky = Math.floor(Math.random()*100+1);
    if (lucky <=45){
        stat = classList[cape.class][0]
    }
    else if (lucky <= 45+30){
        stat = classList[cape.class][1]
    }
    else{
        stat = statList[Math.floor(Math.random()*statList.length)]
    }
    cape[stat]+= 1;
    var text = `${cape.name} leveled up to lv${cape.level}! They gained a point of ${stat}.`
    return text;
}

module.exports.giveXP = (cape,amnt)=>{
    setUp(cape);
    if(cape.level < maxLevel){
        cape.xp+=amnt;
    }
    if(cape.xp >= calcMaxXp(cape.level)){
        cape.xp = cape.xp-calcMaxXp(cape.level);
        cape.level = cape.level+1

        return(levelUp(cape));
    }
    return(false)
}

module.exports.returnLevel = (cape)=>{ // returns a random item of given rarity
    setUp(cape);
    // [level, percentage, howmany ticks on a 20 progressbar]
    var data = [cape.level,Math.floor(cape.xp/calcMaxXp(cape.level)*100),Math.floor(cape.xp/calcMaxXp(cape.level)*100/5)]

    return data;
}
