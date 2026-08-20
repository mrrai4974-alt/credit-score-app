"use client";

import { StatusBadge } from "@/components/StatusBadge";
import { TranscriptPanel } from "@/components/TranscriptPanel";
import { VoiceOrb } from "@/components/VoiceOrb";
import { useVoiceAgent } from "@/hooks/useVoiceAgent";
import { STATUS_META } from "@/types";

export default function Home() {
  const { status, messages, toggle, reset } = useVoiceAgent();
  const meta = STATUS_META[status];

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-5 pb-8 pt-6">
      {/* Header */}
      <header className="flex flex-col items-center gap-3">
        <h1 className="bg-gradient-to-r from-indigo-300 via-cyan-200 to-purple-300 bg-clip-text text-center text-2xl font-bold tracking-tight text-transparent">
          AI Assistant
        </h1>
        <StatusBadge status={status} />
      </header>

      {/* Orb + status hint */}
      <section className="flex flex-1 flex-col items-center justify-center gap-8">
        <VoiceOrb status={status} onTap={toggle} />
        <div className="text-center">
          <p className="text-lg font-semibold" style={{ color: meta.color }}>
            {meta.label}
          </p>
          <p className="mt-1 text-sm text-slate-400">&ldquo;{meta.hint}&rdquo;</p>
        </div>
      </section>

      {/* Transcript */}
      <section className="max-h-[34dvh] w-full overflow-y-auto">
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Conversation
          </h2>
          {messages.length > 0 && (
            <button
              onClick={reset}
              className="text-xs font-medium text-slate-400 transition-colors hover:text-slate-200"
            >
              New chat
            </button>
          )}
        </div>
        <TranscriptPanel messages={messages} />
      </section>

      <footer className="mt-4 text-center text-[11px] text-slate-600">
        Phase 1 · UI preview (mock). Hindi · Hinglish · English
      </footer>
    </main>
  );
}
