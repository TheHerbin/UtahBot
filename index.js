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
    let shouldBeTriggered = false;
    //old theisle related triggerwords
    //const triggerWords = ["no", "is", "has", "do", "omni", "raptor", "herrera", "rex", "diablo", "deino", "pounce", "croc", "carno", "stego", "hypsi", "organs", "ptera", "tenon", "troodon", "cera", "carnivore", "herbivore", "beipi", "dryo", "galli"]
    
    //new generalist trigger words for english : most used words
    let triggerWords = ["the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
    "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
    "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
    "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
    "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
    "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
    "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
    "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"]
    

    //putting spaces on each word so It only triggers when the word is full
    triggerWords = triggerWords.map(str => ` ${str} `);

    //Checks if there is any occurences.
    triggerWords.forEach(function (element) {
        if (message.content.toLowerCase().replace(/\./g, ' ').includes(element)) {
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
