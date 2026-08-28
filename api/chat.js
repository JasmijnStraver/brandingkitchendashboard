import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Alleen POST wordt ondersteund." });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      error: "ANTHROPIC_API_KEY ontbreekt. Zet 'm in je Vercel project-instellingen (of .env.local voor vercel dev).",
    });
  }

  const { systemPrompt, messages } = req.body ?? {};

  if (!systemPrompt || typeof systemPrompt !== "string") {
    return res.status(400).json({ error: "Deze skill heeft nog geen system prompt (nog niet aangesloten)." });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Geen berichten ontvangen." });
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const reply = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Anthropic API error:", err);
    return res.status(502).json({ error: "De AI kon niet worden bereikt. Probeer het zo nog eens." });
  }
}
