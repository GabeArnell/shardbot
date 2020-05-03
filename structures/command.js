const {readdirSync} = require('fs');
const { join } = require("path");
const filePath = join(__dirname,"..","commands");

module.exports.run = (client) => {
    for (const cmd of readdirSync(filePath).filter(cmd => cmd.endsWith(".js"))){
        const prop = require(`${filePath}/${cmd}`);
        console.log(`Loaded ${cmd}`);
        
        client.commands.set(prop.help.name, prop);
        if (prop.setup){
            prop.setup(client);
            console.log(prop.help.name+" logged into database.");
        }
    }

    console.log(`Loaded ${client.commands.size} commands!`);
}

