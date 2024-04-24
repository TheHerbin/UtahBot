//
//This file purpose is to store the functions that might or not be used in the functionment of this bot.
//

//-------------------------------------------Functions--------------------------------------------

module.exports = {

    /*translater: async function (inputText) {
        var splittedInput = inputText.split(".")
        var translatedText = "";
        
        splittedInput.forEach(async function (sentence) {
            translatedText = translatedText + module.exports.translate(sentence) + "\n";
            console.log(translatedText)
        });
        return translatedText
    },*/

    translater: async function (inputText) {
        var splittedInput = inputText.split(".");
        var translatedText = "";

        for (const sentence of splittedInput) {
            translatedText += await module.exports.translate(sentence) + "\n";
        }
        console.log(translatedText)
        return translatedText;
    },

    translate: async function(inputText){
        const inputLanguage = "en";
        const outputLanguage = "fr";
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURI(inputText)}`;
    
        try {
            const response = await fetch(url);
            const json = await response.json();
            var translatedText = "";
            //This commented code below was dirty, I had to find another way
            //const translatedText = JSON.parse(JSON.stringify(json[0]))[0][0];
            if (json && Array.isArray(json) && json.length > 0) {
                if (Array.isArray(json[0]) && json[0].length > 0 && Array.isArray(json[0][0])) {
                    translatedText = json[0][0][0];
                    return translatedText;
                }
            }
            return translatedText;
        } catch (error) {
            console.error(error);
            throw new Error('Translation failed');
        }
    }
    
  };