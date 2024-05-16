const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Liste des commandes disponibles"),
        execute: async ({client, interaction}) => {
            console.log("executing command : help ")

            var text = " - :flag_fr: : Salut ! Voici la liste des commandes disponibles pour le moment : \n"+
            " - /translate to-french `Texte à traduire en français` \n"+
            " - /translate to-english `Texte à traduire en anglais` \n"+
            " - Traduction automatique, je peux traduire automatiquement du un message en français ou en anglais si vous y réagissez avec un emoji : :flag_fr: ou :flag_gb: \n\n"+
            " - :flag_gb: : Hey ! Here is a list of the currently available commands : \n"+
            " - /translate to-french `Text to translate to french` \n"+
            " - /translate to-english `Text to translate to english` \n"+
            " - Automatic translation, I can automatically translate any discord message to french or english if you react to it with either : :flag_fr: or :flag_gb:";
            
            await interaction.reply({
                content: text
            });

        }

}

