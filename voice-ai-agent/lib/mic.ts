/**
 * Microphone permission helper.
 *
 * The Web Speech API will prompt for the mic on its own, but asking via
 * getUserMedia first lets us surface clear, human-readable errors (permission
 * denied vs. no microphone) before we start recognition.
 */
export type MicCheck =
  | { ok: true }
  | { ok: false; message: string };

export async function ensureMicPermission(): Promise<MicCheck> {
  if (
    typeof navigator === "undefined" ||
    !navigator.mediaDevices?.getUserMedia
  ) {
    return {
      ok: false,
      message: "This browser can't access the microphone.",
    };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // We only needed the permission; release the tracks immediately.
    stream.getTracks().forEach((t) => t.stop());
    return { ok: true };
  } catch (err) {
    const name = (err as { name?: string })?.name;
    if (name === "NotAllowedError" || name === "SecurityError") {
      return {
        ok: false,
        message:
          "Microphone access is blocked. Please allow it in your browser and try again.",
      };
    }
    if (name === "NotFoundError" || name === "DevicesNotFoundError") {
      return {
        ok: false,
        message: "No microphone was found on this device.",
      };
    }
    return {
      ok: false,
      message: "Couldn't access the microphone. Please check your settings.",
    };
  }
}
