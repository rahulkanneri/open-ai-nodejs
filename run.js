require('dotenv').config()

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPEN_API_KEY,
});
const openai = new OpenAIApi(configuration);

const args = process.argv;  
if (args.length !== 3) {
    console.error("Please pass the query to as ChatGPT");
    return;
}

const completion = openai.createCompletion({
    model: "text-davinci-003",
    max_tokens: 1000,
    prompt: args[2],
    stream: true,
});
completion.then((res) => {
    let result = '';
    const lines = res.data.toString().split('\n').filter(line => line.trim() !== '');
    for (const line of lines) {
        const message = line.replace(/^data: /, '');
        if (message === '[DONE]') { // Stream finished
            console.log(result.trim());
            return;
        }
        try {
            const parsed = JSON.parse(message);
            result += parsed.choices[0].text;
        } catch(error) {
            console.error(error);
        }
    }
});