"use client";

import { useState } from "react";
import { UltravoxCallOverlay } from "./UltravoxCallOverlay";

export default function SpeakToAgentButton() {
  const [joinUrl, setJoinUrl] = useState<string | null>(null);

  const handleSpeakToAgent = async () => {
    try {
      const response = await fetch("/api/ultravox/get-call", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create Ultravox outbound call");
      }

      const data = (await response.json()) as { joinUrl?: string };

      if (!data.joinUrl) {
        throw new Error("Ultravox did not return a join URL");
      }

      setJoinUrl(data.joinUrl);
    } catch (error) {
      console.error("Error triggering Ultravox outbound call:", error);
      alert("Sorry, we couldn't start the call. Please try again in a moment.");
    }
  };

  return (
    <>
      <button
        onClick={handleSpeakToAgent}
        className="w-full px-6 py-4 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors shadow-sm"
      >
        Speak to an Agent
      </button>

      {joinUrl && (
        <UltravoxCallOverlay
          joinUrl={joinUrl}
          onClose={() => setJoinUrl(null)}
        />
      )}
    </>
  );
}
