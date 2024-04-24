require("dotenv").config();
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const { Client, Events, GatewayIntentBits, Collection, userMention, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const fs = require("node:fs");
const path = require("node:path");
require("./commands/translate.js")
var functions = require('./functions');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
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

client.on('messageCreate', async (message) => {
    if (message.author.bot) {
        return
    }
    const triggerWords = ["Fixed", "issue", "The Isle", "TheIsle", "Omni", "Raptor", "Herrera", "Rex", "Diablo", "Deino", "Pounce", "Croc", "Carno", "Stego", "Hypsi", "organs", "Ptera", "Tenon", "Troodon", "Cera", "Carnivore", "Herbivore", "Beipi"]
    /*if(message.content === "test"){

        message.reply("Voici un test bien réussi !")
    }*/
    let shouldBeTriggered = false;

    triggerWords.forEach(function (element) {
        if (message.content.includes(element)) {
            shouldBeTriggered = true;
        }
    });

    if (shouldBeTriggered == true) {
        const channel = message.channelId
        saidMessage = message
        const reply = await message.reply({
            content: `Veux-tu que je traduise ce texte ?`,
            components: [
                new ActionRowBuilder().setComponents(
                    new ButtonBuilder()
                        .setCustomId('confirm')
                        .setLabel('Traduis stp')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('cancel')
                        .setLabel('Ne pas traduire')
                        .setStyle(ButtonStyle.Secondary)
                )

            ]
        });
        // Store the message containing the buttons in messageReplyMap
        messageReplyMap.set(reply.id, reply);
    }

})

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
            const translatedText = await functions.translater(saidMessage.content);

            // Remove the buttons from the original message's reply
            await messageReply.edit({
                content: translatedText,
                components: []
            });
            saidMessage = "";
        } else if (customId === 'cancel') {
            await messageReply.delete();
            saidMessage = "";
        }
    }


})

client.login(process.env.TOKEN);
