require("dotenv").config();

const { Client, Events, GatewayIntentBits } = require('discord.js');


const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ] 
});

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('messageCreate',(message) => {
    if(message.author.bot){
        return
    }
    /*if(message.content === "test"){

        message.reply("Voici un test bien réussi !")
    }*/
});

client.login(process.env.TOKEN);