"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Message, VoiceStatus } from "@/types";
import { getSTTService, type STTSession } from "@/services/stt";
import { ensureMicPermission } from "@/lib/mic";

/**
 * useVoiceAgent — the single hook the UI talks to.
 *
 * PHASE 2: real microphone + speech recognition (browser Web Speech API,
 * behind the STT service abstraction). Tapping the orb requests mic access and
 * starts listening; your words stream in as a live transcript. Tap again to
 * stop, and your final transcript is committed to the conversation.
 *
 * The AI reply is still a placeholder — Claude connects in Phase 3. The hook's
 * shape (status, messages, toggle) stays stable so the UI won't need changes.
 */

export type Lang = "en-IN" | "hi-IN";

let idCounter = 0;
const nextId = () => `m${Date.now()}_${idCounter++}`;

export function useVoiceAgent() {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [interim, setInterim] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [supported, setSupported] = useState(true);
  const [lang, setLang] = useState<Lang>("en-IN");

  const sttRef = useRef(getSTTService());
  const sessionRef = useRef<STTSession | null>(null);
  const finalBufferRef = useRef("");
  const interimRef = useRef("");
  const hadErrorRef = useRef(false);
  const langRef = useRef<Lang>(lang);
  langRef.current = lang;

  // Web Speech API support can only be checked in the browser.
  useEffect(() => {
    setSupported(sttRef.current.isSupported());
  }, []);

  const addMessage = useCallback((role: Message["role"], content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role, content, createdAt: new Date().toISOString() },
    ]);
  }, []);

  const commitTurn = useCallback(() => {
    const text = (finalBufferRef.current + interimRef.current).trim();
    finalBufferRef.current = "";
    setInterim("");
    interimRef.current = "";

    if (!text) {
      setStatus("idle");
      return;
    }

    addMessage("user", text);
    setStatus("processing");
    // Placeholder until Claude is wired up in Phase 3.
    window.setTimeout(() => {
      addMessage(
        "assistant",
        "Heard you clearly! 🎧 Real AI replies connect in Phase 3.",
      );
      setStatus("idle");
    }, 600);
  }, [addMessage]);

  const startListening = useCallback(async () => {
    setErrorMessage("");
    hadErrorRef.current = false;
    finalBufferRef.current = "";
    setInterim("");
    interimRef.current = "";

    if (!sttRef.current.isSupported()) {
      setSupported(false);
      setErrorMessage(
        "Your browser doesn't support speech recognition. Try Chrome, Edge or Safari.",
      );
      setStatus("error");
      return;
    }

    setStatus("connecting");
    const perm = await ensureMicPermission();
    if (!perm.ok) {
      setErrorMessage(perm.message);
      setStatus("error");
      return;
    }

    const session = sttRef.current.createSession(langRef.current);
    sessionRef.current = session;

    session.onResult((r) => {
      if (r.isFinal) {
        finalBufferRef.current += r.transcript + " ";
        setInterim("");
        interimRef.current = "";
      } else {
        setInterim(r.transcript);
        interimRef.current = r.transcript;
      }
    });

    session.onError((message) => {
      if (!message) return; // e.g. user-initiated abort — not a real error
      hadErrorRef.current = true;
      setErrorMessage(message);
      setStatus("error");
    });

    session.onEnd(() => {
      sessionRef.current = null;
      if (hadErrorRef.current) return; // error handler already set state
      commitTurn();
    });

    session.start();
    setStatus("listening");
  }, [commitTurn]);

  const stopListening = useCallback(() => {
    sessionRef.current?.stop();
  }, []);

  /** Tap handler for the mic orb. */
  const toggle = useCallback(() => {
    if (status === "listening") {
      stopListening();
      return;
    }
    if (status === "idle" || status === "error") {
      void startListening();
    }
  }, [status, startListening, stopListening]);

  const reset = useCallback(() => {
    sessionRef.current?.stop();
    setMessages([]);
    setInterim("");
    interimRef.current = "";
    setErrorMessage("");
    setStatus("idle");
  }, []);

  // Clean up any active recognition on unmount.
  useEffect(() => {
    return () => sessionRef.current?.stop();
  }, []);

  return {
    status,
    messages,
    interim,
    errorMessage,
    supported,
    lang,
    setLang,
    toggle,
    reset,
  };
}
