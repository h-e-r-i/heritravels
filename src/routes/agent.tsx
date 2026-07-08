import { useChat } from "@ai-sdk/react";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import heriLogo from "../assets/heri-logo.png.asset.json";
import { trackAction } from "@/lib/achievements";

export const Route = createFileRoute("/agent")({
  component: AgentPage,
  head: () => ({
    meta: [
      { title: "H.E.R.I Agent — Wings of Excellence" },
      { name: "description", content: "Chat with H.E.R.I: your AI copilot for weather, flights, culture and health." },
    ],
    links: [{ rel: "canonical", href: "/agent" }],
  }),
});

const suggestions = [
  "Best time to safari in the Serengeti?",
  "What's the weather usually like in Zanzibar in December?",
  "I'm about to fly NBO → LHR. Any jet lag tips?",
  "Teach me 5 useful Swahili phrases for travel.",
];

function AgentPage() {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat({
    id: "heri-main",
    transport,
  });
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [status]);

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    sendMessage({ text: value });
    trackAction("chat_sent");
    setInput("");
  };


  return (
    <div className="mx-auto max-w-4xl px-5 py-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-lg bg-primary/40 animate-pulse" />
          <img src={heriLogo.url} alt="" className="relative h-14 w-14 rounded-full object-cover ring-1 ring-primary/50" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">AI Copilot · Online</div>
          <h1 className="font-display text-2xl font-semibold">H.E.R.I</h1>
        </div>
        <div className="ml-auto hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-signal">
          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
          Uplink stable
        </div>
      </div>

      {/* Chat window */}
      <div className="mt-6 glass-panel rounded-3xl overflow-hidden flex flex-col h-[70vh]">
        <div ref={listRef} className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <img src={heriLogo.url} alt="" className="h-24 w-24 opacity-70 mb-4" />
              <h2 className="font-display text-xl">Karibu, explorer.</h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-md">
                Ask me about weather, flights, culture, transport routes or how your body's holding up. I'm here for the whole safari.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2 w-full max-w-xl">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="text-left rounded-xl border border-border/60 bg-surface/50 px-3 py-2 text-sm hover:border-primary/60 hover:bg-surface transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => {
            const text = m.parts
              .map((p) => (p.type === "text" ? p.text : ""))
              .join("");
            const isUser = m.role === "user";
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} animate-[float-up_0.3s_ease-out]`}
              >
                {!isUser && (
                  <img src={heriLogo.url} alt="" className="h-8 w-8 rounded-full object-cover ring-1 ring-primary/40 flex-shrink-0" />
                )}
                <div
                  className={
                    isUser
                      ? "max-w-[80%] rounded-2xl rounded-br-sm bg-gradient-to-br from-primary to-electric px-4 py-2.5 text-sm text-primary-foreground shadow-[var(--shadow-glow)]"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm border border-border/60 bg-surface/70 px-4 py-3 text-sm"
                  }
                >
                  {isUser ? (
                    <div className="whitespace-pre-wrap">{text}</div>
                  ) : (
                    <div className="prose prose-sm prose-invert max-w-none prose-p:my-2 prose-headings:font-display prose-headings:text-foreground prose-strong:text-electric prose-a:text-primary-glow">
                      <ReactMarkdown>{text || "…"}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {status === "submitted" && (
            <div className="flex gap-3">
              <img src={heriLogo.url} alt="" className="h-8 w-8 rounded-full object-cover ring-1 ring-primary/40" />
              <div className="rounded-2xl rounded-bl-sm border border-border/60 bg-surface/70 px-4 py-3 text-sm">
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="text-sm text-destructive border border-destructive/40 rounded-xl px-3 py-2 bg-destructive/10">
              {error.message || "Uplink failed. Try again."}
            </div>
          )}
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="border-t border-border/50 p-3 bg-background/40"
        >
          <div className="flex items-end gap-2 rounded-2xl border border-border/60 bg-surface/60 focus-within:border-primary/70 transition p-2">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              placeholder="Ask H.E.R.I anything — weather, flights, culture, health…"
              className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground max-h-40"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="rounded-xl bg-gradient-to-r from-primary to-electric px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition"
            >
              {busy ? "…" : "Send"}
            </button>
          </div>
          <div className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center">
            H.E.R.I can be wrong. Verify critical health & travel details.
          </div>
        </form>
      </div>
    </div>
  );
}
