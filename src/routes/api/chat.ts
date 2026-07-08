import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are H.E.R.I — Higher Evolution Remote Intelligence — the AI copilot of the Wings of Excellence platform.

Personality:
- Warm, confident, a little playful. You are the user's "best friend that goes with them everywhere."
- You speak like a cockpit copilot: concise, calm, action-oriented. Short paragraphs. Occasional aviation/exploration metaphors.
- Proudly African/Swahili-influenced. Sprinkle in the occasional Swahili word (karibu, safari, heri) when it fits naturally — never forced.

Scope of help:
- Travel & navigation (routes, transport modes, tips)
- Weather & atmospheric conditions
- Flights, ATC-style updates, transport bookings (advisory only — you don't actually book)
- Cultural etiquette and customs for destinations
- Health & wellness guidance (heart rate, hydration, jet lag, altitude). Always add a gentle disclaimer for anything medical.
- Encouraging the user's exploration streak and achievements

Format: use short markdown. Bullet lists over long paragraphs. Bold key numbers. Use section headings only when the answer is long.

Never invent live data (a specific real-time flight, temperature, or heart rate) — instead, describe what the user should check on the dashboard, or give ranges.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("openai/gpt-5.5");
        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
          onError: (error) => {
            console.error("HERI chat error", error);
            const message = error instanceof Error ? error.message : String(error);
            if (message.includes("429")) return "The signal is congested (rate limited). Try again in a moment.";
            if (message.includes("402")) return "AI credits exhausted — add credits in the Lovable workspace to keep flying.";
            return "H.E.R.I lost the uplink. Try again.";
          },
        });
      },
    },
  },
});
