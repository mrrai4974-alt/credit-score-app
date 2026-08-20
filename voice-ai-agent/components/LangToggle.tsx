"use client";

import type { Lang } from "@/hooks/useVoiceAgent";

const OPTIONS: { value: Lang; label: string }[] = [
  { value: "en-IN", label: "English / Hinglish" },
  { value: "hi-IN", label: "हिन्दी" },
];

/**
 * Language selector for speech recognition.
 *
 * The browser Web Speech API needs to be told which language to listen for
 * (it can't truly auto-detect), so we let the user pick. "English / Hinglish"
 * (en-IN) handles English and most Hinglish; हिन्दी (hi-IN) for Devanagari
 * Hindi. Automatic language detection arrives with server-side STT + Claude.
 */
export function LangToggle({
  lang,
  onChange,
  disabled,
}: {
  lang: Lang;
  onChange: (l: Lang) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`inline-flex rounded-full bg-white/5 p-0.5 ring-1 ring-white/10 ${
        disabled ? "opacity-50" : ""
      }`}
    >
      {OPTIONS.map((opt) => {
        const active = opt.value === lang;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              active
                ? "bg-indigo-500 text-white"
                : "text-slate-300 hover:text-white"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
