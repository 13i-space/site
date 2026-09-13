import { ORACLE_SYSTEM_PROMPT } from "../../../lib/oracleSystemPrompt";

// This runs on the server (Vercel/Netlify function), never in the browser,
// so the API key is never exposed to visitors.
export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Server is missing ANTHROPIC_API_KEY. Add it in your hosting provider's environment variables." },
      { status: 500 }
    );
  }

  const { messages } = await request.json();
  if (!Array.isArray(messages)) {
    return Response.json({ error: "Expected { messages: [...] }" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 400,
        system: ORACLE_SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return Response.json({ error: `Anthropic API error: ${errText}` }, { status: 502 });
    }

    const data = await response.json();
    const textBlock = (data.content || []).find((b) => b.type === "text");
    const reply = textBlock ? textBlock.text : "...";
    return Response.json({ reply });
  } catch (e) {
    return Response.json({ error: "Signal lost. The connection could not be completed." }, { status: 500 });
  }
}
