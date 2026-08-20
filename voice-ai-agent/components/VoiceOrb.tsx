"use client";

import { STATUS_META, type VoiceStatus } from "@/types";

/** A little animated equalizer shown while listening/speaking. */
function Waveform({ color }: { color: string }) {
  const bars = [0, 1, 2, 3, 4];
  return (
    <div className="flex items-end gap-1.5" aria-hidden>
      {bars.map((i) => (
        <span
          key={i}
          className="w-1.5 rounded-full animate-bar-bounce"
          style={{
            height: 28,
            backgroundColor: color,
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
}

function MicIcon({ color }: { color: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Z"
        fill={color}
      />
      <path
        d="M19 12a7 7 0 0 1-14 0M12 19v3"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Spinner({ color }: { color: string }) {
  return (
    <svg
      className="animate-spin"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke={`${color}33`} strokeWidth="3" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function VoiceOrb({
  status,
  onTap,
}: {
  status: VoiceStatus;
  onTap: () => void;
}) {
  const meta = STATUS_META[status];
  const color = meta.color;

  const showRings = status === "listening" || status === "speaking";
  const breathing = status === "idle";

  return (
    <div className="relative flex items-center justify-center">
      {/* Expanding pulse rings while active */}
      {showRings && (
        <>
          <span
            className="absolute h-44 w-44 rounded-full animate-pulse-ring"
            style={{ backgroundColor: `${color}22`, border: `2px solid ${color}55` }}
          />
          <span
            className="absolute h-44 w-44 rounded-full animate-pulse-ring"
            style={{
              backgroundColor: `${color}22`,
              border: `2px solid ${color}55`,
              animationDelay: "1s",
            }}
          />
        </>
      )}

      <button
        type="button"
        onClick={onTap}
        aria-label={meta.hint}
        className={`relative z-10 flex h-44 w-44 items-center justify-center rounded-full transition-transform duration-200 active:scale-95 ${
          breathing ? "animate-breathe" : ""
        }`}
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}, ${color}99 60%, ${color}55)`,
          boxShadow: `0 0 60px ${color}66, inset 0 0 30px ${color}55`,
        }}
      >
        <span className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-950/40 backdrop-blur-sm ring-1 ring-white/10">
          {status === "processing" || status === "connecting" ? (
            <Spinner color={color} />
          ) : status === "listening" || status === "speaking" ? (
            <Waveform color={color} />
          ) : (
            <MicIcon color={color} />
          )}
        </span>
      </button>
    </div>
  );
}
