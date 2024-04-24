const { SlashCommandBuilder } = require("@discordjs/builders");
var functions = require('../functions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("translate")
        .setDescription("Traduis en Français")
        .addStringOption(option => 
            option
                .setName("text")
                .setDescription("To french")
                .setRequired(true)
        ),
        execute: async ({client, interaction}) => {
            console.log("executing command : Translate ")

            translatedText = await functions.translater(interaction.options.getString("text"))
            console.log(translatedText)
            await interaction.reply({
                content: translatedText
            });

        }

}