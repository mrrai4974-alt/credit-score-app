/**
 * API client for the Doorstep backend.
 * Base URL from EXPO_PUBLIC_API_URL. On a physical device, set it to your
 * machine's LAN IP (e.g. http://192.168.1.5:4000/api); localhost works on web
 * and simulators.
 */
const BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000/api';

let token: string | null = null;
export const setToken = (t: string | null) => {
  token = t;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
