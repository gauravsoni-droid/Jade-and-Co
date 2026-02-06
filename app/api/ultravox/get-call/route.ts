import { NextRequest, NextResponse } from "next/server";

const ULTRAVOX_BASE_URL =
  process.env.ULTRAVOX_BASE_URL ?? "https://api.ultravox.ai/api";

type ListingContext = { listingId?: string; listingName?: string };

async function createUltravoxCall(agentId: string, listing?: ListingContext) {
  const apiKey = process.env.ULTRAVOX_API_KEY;

  if (!apiKey) {
    throw new Error("ULTRAVOX_API_KEY is not configured");
  }

  if (!agentId) {
    throw new Error("Ultravox agent ID is not configured");
  }

  const hasListing =
    listing &&
    (listing.listingId?.trim() ?? "") !== "" &&
    (listing.listingName?.trim() ?? "") !== "";

  const userMessage = hasListing
    ? `The user requested a call about a specific listing. Listing ID: ${listing!.listingId}. Listing name: ${listing!.listingName}. Please use this context in the conversation.`
    : "Hello from Jade & Co website (outbound call)";

  const response = await fetch(`${ULTRAVOX_BASE_URL}/agents/${agentId}/calls`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      templateContext: hasListing ? { listingId: listing!.listingId, listingName: listing!.listingName } : {},
      initialMessages: [
        {
          role: "MESSAGE_ROLE_USER",
          text: userMessage,
        },
      ],
      metadata: hasListing ? { listingId: listing!.listingId, listingName: listing!.listingName } : {},
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

export async function POST(req: NextRequest) {
  try {
    let listing: ListingContext | undefined;
    try {
      const body = await req.json();
      if (body && (body.listingId != null || body.listingName != null)) {
        listing = {
          listingId: typeof body.listingId === "string" ? body.listingId : undefined,
          listingName: typeof body.listingName === "string" ? body.listingName : undefined,
        };
      }
    } catch {
      // No body or invalid JSON: proceed without listing context
    }

    const agentId = process.env.ULTRAVOX_OUTBOUND_AGENT_ID;
    const joinUrl = await createUltravoxCall(agentId || "", listing);

    return NextResponse.json({ joinUrl });
  } catch (error) {
    console.error("Error creating Ultravox outbound call:", error);
    return NextResponse.json(
      { error: "Failed to create Ultravox outbound call" },
      { status: 500 },
    );
  }
}

