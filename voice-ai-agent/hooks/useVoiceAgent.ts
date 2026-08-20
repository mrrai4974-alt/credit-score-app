"use client";

import { useCallback, useRef, useState } from "react";
import type { Message, VoiceStatus } from "@/types";

/**
 * useVoiceAgent — the single hook the UI talks to.
 *
 * PHASE 1: this is a *mock* state machine. Tapping the orb runs a scripted
 * demo (connecting → listening → processing → speaking → idle) and appends a
 * couple of sample transcript lines, so we can see every visual state and the
 * animations without any real microphone or API yet.
 *
 * In later phases the internals get replaced with the real STT → Claude → TTS
 * pipeline, but this hook's shape (status, messages, toggle) stays the same —
 * the UI won't need to change.
 */

const DEMO_USER_LINE = "Hello, kya haal hai?";
const DEMO_AI_LINE =
  "Hello! Main bilkul theek hoon. Batao, aaj kya karna hai?";

let idCounter = 0;
const nextId = () => `m${Date.now()}_${idCounter++}`;

export function useVoiceAgent() {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const addMessage = useCallback((role: Message["role"], content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role, content, createdAt: new Date().toISOString() },
    ]);
  }, []);

  const runDemo = useCallback(() => {
    clearTimers();
    setStatus("connecting");
    const t = (fn: () => void, ms: number) =>
      timers.current.push(setTimeout(fn, ms));

    t(() => setStatus("listening"), 700);
    t(() => addMessage("user", DEMO_USER_LINE), 1600);
    t(() => setStatus("processing"), 1800);
    t(() => {
      setStatus("speaking");
      addMessage("assistant", DEMO_AI_LINE);
    }, 3000);
    t(() => setStatus("idle"), 6000);
  }, [addMessage, clearTimers]);

  /** Tap handler for the mic orb. */
  const toggle = useCallback(() => {
    if (status === "speaking") {
      // Barge-in preview: interrupt the AI and go back to idle.
      clearTimers();
      setStatus("idle");
      return;
    }
    if (status === "idle" || status === "error") {
      runDemo();
    }
  }, [status, runDemo, clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setMessages([]);
    setStatus("idle");
  }, [clearTimers]);

  return { status, messages, toggle, reset };
}
