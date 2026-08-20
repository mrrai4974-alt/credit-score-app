# Voice AI Agent 🎙️

A real-time voice AI assistant you can **talk to** — in **Hindi, Hinglish and
English**. Press the mic, speak naturally, and the assistant replies with voice,
like a real phone call.

Built with **Next.js + React + Tailwind CSS + TypeScript**, using the **Claude
API** as the reasoning model, with pluggable Speech-to-Text and Text-to-Speech
services.

> **Status:** Building in phases. **Phase 1 (this commit) = project architecture
> + the mobile-first voice UI** with an animated microphone orb. Voice, AI, and
> the rest arrive in later phases.

---

## Quick start

```bash
cd voice-ai-agent
npm install
npm run dev
```

Open **http://localhost:3000** on your phone or desktop.

**Try it:** tap the big glowing orb and **allow microphone access**. It starts
listening and your words stream in as a live transcript. Tap again to stop, and
your speech is committed to the conversation. Pick your language with the toggle
(English/Hinglish or हिन्दी). The AI reply is a placeholder for now — Claude
connects in Phase 3.

> Note: speech recognition needs **HTTPS or localhost** and a Chromium/Safari
> browser (Firefox doesn't support the Web Speech API).

---

## Architecture (why the folders look like this)

Everything is split so each piece can be **replaced independently** later:

```
voice-ai-agent/
├── app/            # Next.js pages + (later) API routes
├── components/     # UI: VoiceOrb, StatusBadge, TranscriptPanel
├── hooks/          # useVoiceAgent — the single hook the UI talks to
├── services/
│   ├── ai/         # AIService interface (Claude behind it) — Phase 3
│   ├── stt/        # STTService interface (browser/Whisper/Google/Deepgram)
│   └── tts/        # TTSService interface (browser/ElevenLabs/OpenAI/Google)
├── agents/         # personality.ts — the configurable system prompt
├── tools/          # agent tools (calculator, web search, …) — Phase 7
├── database/       # PostgreSQL + Prisma models — Phase 8
├── lib/            # small shared helpers
└── types/          # shared TypeScript types (Message, VoiceStatus, …)
```

The UI depends only on the `useVoiceAgent` hook and the service **interfaces**,
never on a concrete provider — so we can swap Claude, or a TTS vendor, without
rewriting the app.

## Security

Secret keys (Claude, STT, TTS, database) are **only ever read server-side** from
environment variables. Nothing secret is prefixed with `NEXT_PUBLIC_`. Copy
`.env.example` to `.env.local` and fill values in when we reach those phases.

## Roadmap

1. ✅ **Phase 1** — Project + mobile-first UI
2. ✅ **Phase 2** — Microphone + speech recognition (browser Web Speech API)
3. Phase 3 — Connect Claude API
4. Phase 4 — Text-to-speech
5. Phase 5 — Real-time conversation (barge-in / interrupt)
6. Phase 6 — Conversation memory
7. Phase 7 — Tool calling
8. Phase 8 — Auth + database
9. Phase 9 — Mobile optimization
10. Phase 10 — Deploy (Vercel)
