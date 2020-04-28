/*

Defenses:



Wound Severity:
    negligible 
    direct
    Severe!



*/

const defenses = [
    ["tanks",
        "Brute",
        "Changer",
        "Shaker",
        "Breaker",
    ],
    ["avoids",
        "Mover",
        "Stranger",
        "Thinker",
        "Master",
    ],
    ["dodges",
        "Tinker",
        "Blaster",
        "Striker",
        "Trump",

    ]

]


module.exports.getDefense = (className)=>{
    for (flavor of defenses){
        for (c of flavor){
            if (c == className){
                return(flavor[0]);
            }
        }
    }
    return("dodges");
}