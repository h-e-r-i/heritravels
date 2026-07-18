import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const Input = z.object({
  name: z.string().min(1),
  country: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
});

export type DossierResult = {
  weather: string;
  languages: string;
  bestTimeAdvice: string;
  feedback: string[];
  tips: string[];
  safety: string;
  currency: string;
};

export const fetchDestinationDossier = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }): Promise<DossierResult> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-2.5-flash");

    const prompt = `Give a compact traveler dossier for ${data.name}, ${data.country} (lat ${data.lat.toFixed(2)}, lng ${data.lng.toFixed(2)}).
Return STRICT JSON only, no prose, no code fences. Shape:
{
  "weather": "one sentence about the current typical weather this month with approx temp range",
  "languages": "primary spoken languages, comma separated",
  "bestTimeAdvice": "one short sentence on when to go and why",
  "feedback": ["3 realistic short quotes traveler feedback style, 1 sentence each"],
  "tips": ["4 concise practical traveler tips, 1 sentence each"],
  "safety": "one sentence with a candid safety note",
  "currency": "local currency name (code)"
}`;

    try {
      const { text } = await generateText({ model, prompt });
      const cleaned = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
      const parsed = JSON.parse(cleaned) as DossierResult;
      return {
        weather: String(parsed.weather ?? ""),
        languages: String(parsed.languages ?? ""),
        bestTimeAdvice: String(parsed.bestTimeAdvice ?? ""),
        feedback: Array.isArray(parsed.feedback) ? parsed.feedback.slice(0, 5).map(String) : [],
        tips: Array.isArray(parsed.tips) ? parsed.tips.slice(0, 6).map(String) : [],
        safety: String(parsed.safety ?? ""),
        currency: String(parsed.currency ?? ""),
      };
    } catch (e) {
      console.error("dossier failed", e);
      return {
        weather: "Live weather unavailable right now.",
        languages: "",
        bestTimeAdvice: "",
        feedback: [],
        tips: [],
        safety: "",
        currency: "",
      };
    }
  });
