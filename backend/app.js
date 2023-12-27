const express = require("express");
const dotenv = require("dotenv");
const app = express();
const OpenAI = require("openai");

dotenv.config();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/translate", (req, res) => {
  try {
    return res.status(200).json({ message: translateText() });
  } catch (err) {
    console.log(err);
  }
});

const translateText = async () => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo",
  });

  return completion;
};

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
