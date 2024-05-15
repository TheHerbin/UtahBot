const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Liste des commandes disponibles"),
        execute: async ({client, interaction}) => {
            console.log("executing command : help ")

            var text = "Salut ! Voici la liste des commandes disponibles pour le moment : \n - /translate `Texte à traduire`   \n\n - Traduction automatique, je peux traduire automatiquement du un message si vous y réagissez avec un emoji : :flag_fr:";
            console.log(text)
            await interaction.reply({
                content: text
            });

        }

}

