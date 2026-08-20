"use client";

import { STATUS_META, type VoiceStatus } from "@/types";

const CONNECTION = {
  label: "Connected",
  // Phase 1 is offline/mock; this is a static indicator for now.
  color: "#22c55e",
};

export function StatusBadge({ status }: { status: VoiceStatus }) {
  const meta = STATUS_META[status];
  const pulsing =
    status === "listening" || status === "processing" || status === "speaking";

  return (
    <div className="flex items-center justify-center gap-4 text-xs">
      {/* Live agent status */}
      <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 font-medium ring-1 ring-white/10">
        <span
          className={`h-2 w-2 rounded-full ${pulsing ? "animate-pulse" : ""}`}
          style={{ backgroundColor: meta.color, boxShadow: `0 0 8px ${meta.color}` }}
        />
        <span style={{ color: meta.color }}>{meta.label}</span>
      </span>

      {/* Connection status */}
      <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 font-medium text-slate-300 ring-1 ring-white/10">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: CONNECTION.color }}
        />
        {CONNECTION.label}
      </span>
    </div>
  );
}
