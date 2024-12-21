//
//This file purpose is to store the functions that might or not be used in the functionment of this bot.
//

//-------------------------------------------Functions--------------------------------------------

module.exports = {
  translater: async function (inputText, targetLangage, inputLanguage) {
    if (inputText) {
      var splittedInput = inputText.split(/[.!?]/);
      var translatedText = "";

      for (const sentence of splittedInput) {
        translatedText +=
          (await module.exports.translate(
            sentence,
            targetLangage,
            inputLanguage
          )) + "\n";
      }
      console.log(translatedText);
      return translatedText;
    } else {
      console.error("Input text is undefined.");
    }
  },

  translate: async function (inputText, targetLangage, inputLanguage) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${targetLangage}&dt=t&q=${encodeURI(
      inputText
    )}`;

    try {
      const response = await fetch(url);
      const json = await response.json();
      var translatedText = "";
      //This commented code below was dirty, I had to find another way
      //const translatedText = JSON.parse(JSON.stringify(json[0]))[0][0];
      if (json && Array.isArray(json) && json.length > 0) {
        if (
          Array.isArray(json[0]) &&
          json[0].length > 0 &&
          Array.isArray(json[0][0])
        ) {
          translatedText = json[0][0][0];
          return translatedText;
        }
      }
      return translatedText;
    } catch (error) {
      console.error(error);
      throw new Error("Translation failed");
    }
  },

  persist: async function (fs, elementToSave, filename) {
    var stringified = JSON.stringify(elementToSave);
    fs.appendFile(filename, stringified + "\n", function (err, result) {
      if (err) console.log("error", err);
    });
  },

  unpersistFirst: async function (fs, filename) {
    fs.readFile(filename, "utf8", function (err, data) {
      if (err) console.log("error", err);
      var linesExceptFirst = data.split("\n").slice(1).join("\n");
      fs.writeFile(filename, linesExceptFirst, function (err, data) {
        if (err) console.log("error", err);
      });
    });
  },

  readFile: async function (fs, fileToRead) {
    fs.readFile(fileToRead, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  },
};
