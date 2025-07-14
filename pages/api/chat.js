import { getChatResponse } from "../../lib/openai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { messages } = req.body;
  if (!messages) return res.status(400).json({ error: "messages required" });
  try {
    const reply = await getChatResponse(messages);
    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI request failed" });
  }
}