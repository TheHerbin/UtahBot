require("dotenv").config();
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const { Client, Events, GatewayIntentBits, Collection, userMention, ButtonBuilder, ButtonStyle, ActionRowBuilder, Partials } = require('discord.js');
const fs = require("node:fs");
const path = require("node:path");
require("./commands/translate.js")
var functions = require('./functions');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [
        Partials.Message, 
        Partials.Channel, 
        Partials.Reaction
    ],
});

//Commands : 

const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
let saidMessage = "";

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on("ready", () => {
    const guild_ids = client.guilds.cache.map(guild => guild.id);
    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
    for (const guildId of guild_ids) {
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), {
            body: commands
        })
            .then(() => console.log(`Added commands to ${guildId}`))
            .catch(console.error);
    }

})

const messageReplyMap = new Map();


//Detecting Reactions to instantiate traductions
client.on(Events.MessageReactionAdd, async (reaction, user) => {
    
    const reactedMessageContent = reaction.message.content
    const reactedMessage = reaction.message
    //console.log(reaction.emoji)
	// When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

	// Now the message has been cached and is fully available
    //Check for the used Emoji

    if (reaction.emoji.name == "🇫🇷"){
        console.log("Flag Francais détecté")
        //If french flag detected, start the translation

        const translatedText = await functions.translater(reactedMessageContent);

        //Reply to the original message with the translation
        reactedMessage.reply(":flag_fr: : "+translatedText)
        
    }
    
});

client.on("interactionCreate", async interaction => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute({ client, interaction });
        } catch (err) {
            console.log(err);
            await interaction.reply("Une erreur est survenue lors de l'éxécution de cette commande.");
        }

    } else if (interaction.isButton()) {
        const { customId } = interaction;
        const messageReply = messageReplyMap.get(interaction.message.id);

        if (customId === 'confirm') {
            console.log("confirm button pressed")
            const translatedText = await functions.translater(saidMessage.content);

            // Remove the buttons from the original message's reply
            await messageReply.edit({
                content: translatedText,
                components: []
            });
            saidMessage = "";
        } else if (customId === 'cancel') {
            console.log("Cancelled Translation")
            await messageReply.delete();
            saidMessage = "";
        }
    }


})

client.login(process.env.TOKEN);
