import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are Hexa AI, a helpful, professional, direct personal AI agent. Give clear practical answers and suggest the next useful action when appropriate."
          },
          ...messages
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data.error?.message || "AI request failed." }, { status: response.status });

    return NextResponse.json({ message: data.choices?.[0]?.message?.content || "I could not generate a response." });
  } catch {
    return NextResponse.json({ error: "Unable to contact Hexa AI right now." }, { status: 500 });
  }
}
