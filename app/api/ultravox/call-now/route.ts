import { NextRequest, NextResponse } from "next/server";

const ULTRAVOX_BASE_URL =
  process.env.ULTRAVOX_BASE_URL ?? "https://api.ultravox.ai/api";

async function createUltravoxCall(agentId: string) {
  const apiKey = process.env.ULTRAVOX_API_KEY;

  if (!apiKey) {
    throw new Error("ULTRAVOX_API_KEY is not configured");
  }

  if (!agentId) {
    throw new Error("Ultravox agent ID is not configured");
  }

  const response = await fetch(`${ULTRAVOX_BASE_URL}/agents/${agentId}/calls`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      templateContext: {},
      initialMessages: [
        {
          role: "MESSAGE_ROLE_USER",
          text: "Hello from Jade & Co website",
        },
      ],
      metadata: {},
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Ultravox API error: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as {
    joinUrl?: string;
    join_url?: string;
    url?: string;
    [key: string]: unknown;
  };

  const joinUrl = data.joinUrl || data.join_url || data.url;

  if (!joinUrl) {
    throw new Error("Ultravox API did not return a join URL");
  }

  return joinUrl;
}

export async function POST(_req: NextRequest) {
  try {
    const agentId = process.env.ULTRAVOX_INBOUND_AGENT_ID;
    const joinUrl = await createUltravoxCall(agentId || "");

    return NextResponse.json({ joinUrl });
  } catch (error) {
    console.error("Error creating Ultravox inbound call:", error);
    return NextResponse.json(
      { error: "Failed to create Ultravox inbound call" },
      { status: 500 },
    );
  }
}

