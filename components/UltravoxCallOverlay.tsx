 "use client";

import { useEffect, useRef, useState } from "react";
import { UltravoxSession } from "ultravox-client";

interface UltravoxCallOverlayProps {
  joinUrl: string;
  onClose: () => void;
}

type CallStatus =
  | "disconnected"
  | "disconnecting"
  | "connecting"
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "connected"
  | "no-mic"
  | "error";

/**
 * Ultravox in-page call overlay using the official UltravoxSession SDK.
 *
 * The SDK handles:
 * - WebSocket connection to Ultravox
 * - Microphone capture
 * - Audio encoding/decoding
 * - Agent playback
 *
 * We just join the call using the provided `joinUrl` and reflect status in the UI.
 *
 * SDK repo: https://github.com/fixie-ai/ultravox-client-sdk-js
 */
export function UltravoxCallOverlay({ joinUrl, onClose }: UltravoxCallOverlayProps) {
  const [status, setStatus] = useState<CallStatus>("connecting");
  const [error, setError] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<
    { text: string; isFinal: boolean; speaker: "user" | "agent"; medium: "voice" | "text" }[]
  >([]);

  const sessionRef = useRef<UltravoxSession | null>(null);

  useEffect(() => {
    const session = new UltravoxSession();
    sessionRef.current = session;

    setStatus("connecting");
    setError(null);

    // Reflect status changes in our UI
    const onStatus = () => {
      setStatus(session.status as CallStatus);
    };

    const onTranscripts = () => {
      setTranscripts(
        // Shallow copy so React notices changes
        [...session.transcripts] as {
          text: string;
          isFinal: boolean;
          speaker: "user" | "agent";
          medium: "voice" | "text";
        }[],
      );
    };

    session.addEventListener("status", onStatus);
    session.addEventListener("transcripts", onTranscripts);

    // Join the call using the join URL from your API route.
    // `joinCall` in the Ultravox SDK is synchronous (returns void), so we use try/catch
    // instead of Promise chaining.
    try {
      session.joinCall(joinUrl);
    } catch (err: unknown) {
      console.error("Failed to join Ultravox call", err);
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't start the call. Please check your configuration.",
      );
      setStatus("disconnected");
    }

    return () => {
      try {
        session.leaveCall();
      } catch {
        // ignore
      }
      session.removeEventListener("status", onStatus);
      session.removeEventListener("transcripts", onTranscripts);
      sessionRef.current = null;
    };
  }, [joinUrl]);

  const handleEndCall = () => {
    try {
      sessionRef.current?.leaveCall();
    } catch {
      // ignore
    }
    onClose();
  };

  const statusLabel: string = (() => {
    switch (status) {
      case "connecting":
        return "Connecting to voice agent...";
      case "connected":
        return "You’re connected. You can start speaking.";
      case "no-mic":
        return "Microphone access is required to place this call.";
      case "error":
        return "There was a problem with the call.";
      case "disconnected":
      default:
        return "The call has ended.";
    }
  })();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">Speak with our voice agent</h2>

        <p className="mb-2 text-sm text-gray-700">{statusLabel}</p>

        {error && (
          <p className="mb-3 rounded bg-red-50 p-2 text-xs text-red-600">
            {error}
          </p>
        )}

        <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-gray-500">
          Session state: <span className="font-semibold text-gray-900">{status}</span>
        </p>

        <div className="mb-3 max-h-28 overflow-y-auto rounded border border-gray-100 bg-gray-50 p-2 text-[11px] text-gray-700">
          {transcripts.length === 0 ? (
            <p className="italic text-gray-400">Transcripts will appear here as you speak.</p>
          ) : (
            transcripts.map((t, idx) => (
              <p key={idx}>
                <span className="font-semibold">
                  {t.speaker === "agent" ? "Agent" : "You"}:
                </span>{" "}
                <span className={t.isFinal ? "" : "opacity-70"}>{t.text}</span>
              </p>
            ))
          )}
        </div>

        <div className="flex flex-col gap-2">
          {/* Optional: quick fallback to open hosted Ultravox UI if joinUrl is https:// */}
          {joinUrl.startsWith("http") && (
            <button
              type="button"
              onClick={() => window.open(joinUrl, "_blank", "noopener,noreferrer")}
              className="w-full rounded-md bg-gray-800 px-4 py-2 text-xs font-medium text-white hover:bg-gray-700"
            >
              Open full call UI in new tab
            </button>
          )}

          <button
            type="button"
            onClick={handleEndCall}
            className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            End Call
          </button>
        </div>
      </div>
    </div>
  );
}

