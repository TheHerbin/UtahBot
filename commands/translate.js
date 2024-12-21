const { SlashCommandBuilder } = require("@discordjs/builders");
var functions = require("../functions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Traduis un message")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("to-french")
        .setDescription("Traduis un message en francais")
        .addStringOption((option) =>
          option.setName("text").setDescription("To french").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("to-english")
        .setDescription("Traduis en message en anglais")
        .addStringOption((option) =>
          option.setName("text").setDescription("To english").setRequired(true)
        )
    ),
  execute: async ({ client, interaction }) => {
    console.log(
      "executing command : Translate " + interaction.options.getSubcommand()
    );
    let inputLanguage, targetLangage, flag;
    switch (interaction.options.getSubcommand()) {
      case "to-english":
        inputLanguage = "fr";
        targetLangage = "en";
        flag = ":flag_gb:";
        break;
      case "to-french":
        inputLanguage = "en";
        targetLangage = "fr";
        flag = ":flag_fr:";
        break;
      default:
        console.log(`Required Langage not supported.`);
        break;
    }
    translatedText = await functions.translater(
      interaction.options.getString("text"),
      targetLangage,
      inputLanguage
    );
    let textToAnswer = flag + " : " + translatedText;

    await interaction.reply({
      content: textToAnswer,
    });
  },
};
