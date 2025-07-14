import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export async function getChatResponse(messages) {
  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages
  });
  return res.choices[0].message.content;
}