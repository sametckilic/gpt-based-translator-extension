const express = require("express");
const dotenv = require("dotenv");
const app = express();
const OpenAI = require("openai");
const countries = require("./countries.json");
const cors = require("cors");

dotenv.config();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/translate", async (req, res) => {
  try {
    var country_code = req.body.language;
    var language = countries[country_code];
    console.log(language);
    var prompt = req.body.text;
    var data = { prompt, language };
    var resData = await translateText(data);
    resData = JSON.parse(resData.message.content);
    return res.status(200).json({
      message: resData.prompt,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/translate", (req, res) => {
  res.status(200).json({ success: true, message: "server works fine!" });
});

const translateText = async (data) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "system",
        content: `I want you to be a language translator. You will be given a json data and I want you to translate the 'prompt' value in json into language with 'translateTo' value.
     For example, 
     {"prompt" : "Today we will visit the Eiffel Tower in Italy",
      "translateTo": "Turkish",
      "translatedPromt": "Bugün, İtalyada Eyfel Kulesini ziyaret edeceğiz."}.
      You will not change the json structure, you will only do the translatation.
      These are the data given you prompt: ${data.text} translate it to language ${data.language}`,
      },
      { role: "user", content: JSON.stringify(data) },
    ],
  });

  return completion.choices[0];
};

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
