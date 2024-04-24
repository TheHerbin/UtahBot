module.exports = {
    translater: async function (inputText) {
        const inputLanguage = "en";
        const outputLanguage = "fr";
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURI(inputText)}`;
    
        try {
            const response = await fetch(url);
            const json = await response.json();
            const translatedText = JSON.parse(JSON.stringify(json[0]))[0][0];
            
            return translatedText;
        } catch (error) {
            console.error(error);
            throw new Error('Translation failed');
        }
    }
    
  };