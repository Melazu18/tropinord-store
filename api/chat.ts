/**
 * Vercel Serverless Function: /api/chat
 *
 * Simple customer service chatbot endpoint.
 *
 * Setup:
 * - Add OPENAI_API_KEY in Vercel project env vars.
 * - Optional: set OPENAI_MODEL (defaults to gpt-4o-mini).
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    return;
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const body = (req.body || {}) as { messages?: ChatMessage[] };
  const messages = Array.isArray(body.messages) ? body.messages : [];

  const system: ChatMessage = {
    role: "system",
    content:
      "You are TropiNord customer support. Be friendly, concise, and helpful. " +
      "If you are unsure about order status, suggest contacting admin@tropinord.com. " +
      "Do not invent policies. Ask a clarifying question if needed.",
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [system, ...messages],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      res.status(500).json({ error: "OpenAI request failed", details: text });
      return;
    }

    const data = (await response.json()) as any;
    const content = data?.choices?.[0]?.message?.content ?? "";

    res.status(200).json({ content });
  } catch (err) {
    res.status(500).json({
      error: "Unexpected server error",
      details: err instanceof Error ? err.message : String(err),
    });
  }
}
