import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, tool, stepCountIs, type UIMessage } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are H.E.R.I — Higher Evolution Remote Intelligence — the AI copilot of the Wings of Excellence platform.

Personality:
- Warm, confident, a little playful. You are the user's "best friend that goes with them everywhere."
- Cockpit-copilot voice: concise, calm, action-oriented. Short paragraphs, occasional aviation/exploration metaphors.
- Proudly African/Swahili-influenced. Sprinkle in the occasional Swahili word (karibu, safari, heri) when it fits naturally.

You have live internet access via the \`web_search\` tool. USE IT whenever the user asks about:
- current events, news, sports scores, market prices, weather
- anything that could have changed after your training cutoff
- a person, product, place, movie, song, or company you're not certain about
- addresses, opening hours, phone numbers, dates of events
- "look up", "search", "google", "find me", "what's the latest"

Prefer calling web_search once (with a clear, focused query) over guessing. When you cite a fact from the web, include a short (source: <domain>) tag.

Scope of help:
- Travel & navigation (routes, transport modes, tips)
- Weather & atmospheric conditions
- Flights, ATC-style updates, transport bookings (advisory only — you don't actually book)
- Cultural etiquette and customs for destinations
- Health & wellness (heart rate, hydration, jet lag, altitude) — add a gentle disclaimer for anything medical.
- Encouraging the user's exploration streak and achievements

Format: short markdown. Bullet lists over long paragraphs. Bold key numbers. Section headings only when the answer is long.`;

type DuckAnswer = {
  AbstractText?: string;
  AbstractSource?: string;
  AbstractURL?: string;
  Heading?: string;
  Answer?: string;
  RelatedTopics?: Array<{ Text?: string; FirstURL?: string }>;
};

type WikiSummary = { title?: string; extract?: string; content_urls?: { desktop?: { page?: string } } };

async function runWebSearch(query: string) {
  const results: { title: string; snippet: string; url: string; source: string }[] = [];

  // DuckDuckGo Instant Answer — good for definitions, entities, quick facts.
  try {
    const r = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
      { headers: { "User-Agent": "HERI-Bot/1.0" } },
    );
    if (r.ok) {
      const j = (await r.json()) as DuckAnswer;
      if (j.AbstractText && j.AbstractText.length > 0) {
        results.push({
          title: j.Heading || query,
          snippet: j.AbstractText,
          url: j.AbstractURL || "https://duckduckgo.com",
          source: j.AbstractSource || "duckduckgo.com",
        });
      }
      if (j.Answer) {
        results.push({ title: "Instant answer", snippet: j.Answer, url: "https://duckduckgo.com", source: "duckduckgo.com" });
      }
      for (const t of (j.RelatedTopics ?? []).slice(0, 4)) {
        if (t.Text && t.FirstURL) {
          results.push({ title: t.Text.slice(0, 80), snippet: t.Text, url: t.FirstURL, source: new URL(t.FirstURL).hostname });
        }
      }
    }
  } catch (e) {
    console.warn("duckduckgo search failed", e);
  }

  // Wikipedia — reliable long-form background.
  try {
    const sr = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=3&format=json&origin=*&srsearch=${encodeURIComponent(query)}`,
      { headers: { "User-Agent": "HERI-Bot/1.0" } },
    );
    if (sr.ok) {
      const sj = (await sr.json()) as { query?: { search?: Array<{ title: string }> } };
      const titles = (sj.query?.search ?? []).slice(0, 2).map((s) => s.title);
      for (const title of titles) {
        const s = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
          { headers: { "User-Agent": "HERI-Bot/1.0" } },
        );
        if (!s.ok) continue;
        const sj2 = (await s.json()) as WikiSummary;
        if (sj2.extract) {
          results.push({
            title: sj2.title ?? title,
            snippet: sj2.extract,
            url: sj2.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
            source: "wikipedia.org",
          });
        }
      }
    }
  } catch (e) {
    console.warn("wikipedia search failed", e);
  }

  if (results.length === 0) {
    return { query, results: [], note: "No results found. Try rephrasing the query." };
  }
  return { query, results: results.slice(0, 6) };
}

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
        const model = gateway("google/gemini-2.5-flash");

        const tools = {
          web_search: tool({
            description:
              "Search the live internet for up-to-date info (news, prices, weather, people, places, events, definitions). Returns a small ranked list of snippets from DuckDuckGo and Wikipedia with source URLs. Prefer one focused query.",
            inputSchema: z.object({
              query: z.string().describe("The search query — keep it short and specific, like a Google query."),
            }),
            execute: async ({ query }) => runWebSearch(query),
          }),
        };

        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
          tools,
          stopWhen: stepCountIs(50),
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
