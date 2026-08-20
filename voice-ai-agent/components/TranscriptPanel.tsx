"use client";

import type { Message } from "@/types";

export function TranscriptPanel({ messages }: { messages: Message[] }) {
  if (messages.length === 0) {
    return (
      <div className="mt-2 text-center text-sm text-slate-500">
        Your live transcript will appear here.
      </div>
    );
  }

  return (
    <div className="mt-2 flex w-full flex-col gap-3">
      {messages.map((m) => {
        const isUser = m.role === "user";
        return (
          <div
            key={m.id}
            className={`flex animate-fade-up ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                isUser
                  ? "rounded-br-md bg-cyan-500/15 text-cyan-100 ring-1 ring-cyan-400/20"
                  : "rounded-bl-md bg-purple-500/15 text-purple-100 ring-1 ring-purple-400/20"
              }`}
            >
              <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide opacity-60">
                {isUser ? "You" : "AI"}
              </div>
              {m.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
