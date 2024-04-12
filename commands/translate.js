const { SlashCommandBuilder } = require("@discordjs/builders");



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
            await interaction.reply('Pong!');

        }

}