/**
 * The lifecycle states of the voice agent. The UI reacts to these to drive
 * colors, animations and status text. Kept in one place so every layer
 * (hook, components, future real-time engine) agrees on the vocabulary.
 */
export type VoiceStatus =
  | "idle" // waiting for the user to start
  | "connecting" // setting up mic / session
  | "listening" // capturing the user's speech
  | "processing" // transcribing + thinking (Claude)
  | "speaking" // playing back the AI's voice
  | "error"; // something went wrong

export const STATUS_META: Record<
  VoiceStatus,
  { label: string; hint: string; color: string }
> = {
  idle: { label: "Idle", hint: "Tap to talk", color: "#6366f1" },
  connecting: { label: "Connecting", hint: "Getting things ready…", color: "#64748b" },
  listening: { label: "Listening", hint: "Talk to me…", color: "#22d3ee" },
  processing: { label: "Thinking", hint: "Give me a second…", color: "#f59e0b" },
  speaking: { label: "Speaking", hint: "Tap to interrupt", color: "#a855f7" },
  error: { label: "Error", hint: "Something went wrong. Tap to retry.", color: "#ef4444" },
};
