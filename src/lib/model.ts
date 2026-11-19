export type LLMProviderId = "groq" | "gemini" | "openrouter" | "openai" | "ollama" | "custom";

export type ProviderPreset = {
  id: LLMProviderId;
  name: string;
  baseUrl: string;
  model: string;
  description: string;
  corsFriendly: boolean;
  keyUrl?: string;
};

export const PROVIDER_PRESETS: ProviderPreset[] = [
  {
    id: "groq",
    name: "Groq (Fastest & Free Tier)",
    baseUrl: "https://api.groq.com/openai/v1",
    model: "llama-3.3-70b-versatile",
    description: "Ultra-fast inference with browser CORS support and generous free tier.",
    corsFriendly: true,
    keyUrl: "https://console.groq.com/keys",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    model: "gemini-2.0-flash",
    description: "Fast Google multimodal model via OpenAI-compatible endpoint.",
    corsFriendly: true,
    keyUrl: "https://aistudio.google.com/app/apikey",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    model: "meta-llama/llama-3.2-3b-instruct:free",
    description: "Universal model gateway with free tiers and browser CORS support.",
    corsFriendly: true,
    keyUrl: "https://openrouter.ai/keys",
  },
  {
    id: "openai",
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4o-mini",
    description: "Industry standard endpoint for gpt-4o-mini and gpt-4o.",
    corsFriendly: false,
    keyUrl: "https://platform.openai.com/api-keys",
  },
  {
    id: "ollama",
    name: "Local Ollama",
    baseUrl: "http://localhost:11434/v1",
    model: "llama3.2",
    description: "100% private on your machine. Start Ollama with OLLAMA_ORIGINS=\"*\"",
    corsFriendly: true,
  },
  {
    id: "custom",
    name: "Custom Endpoint",
    baseUrl: "",
    model: "",
    description: "Any OpenAI-compatible or local LLM server.",
    corsFriendly: true,
  },
];

export type ModelSettings = {
  useModel: boolean;
  provider: LLMProviderId;
  baseUrl: string;
  model: string;
  apiKey: string;
};

export const MODEL_KEY = "reptrackers.model.v2";

export const defaultModelSettings = (): ModelSettings => ({
  useModel: false,
  provider: "groq",
  baseUrl: "https://api.groq.com/openai/v1",
  model: "llama-3.3-70b-versatile",
  apiKey: "",
});

export function sanitizeModelSettings(value: unknown): ModelSettings {
  const base = defaultModelSettings();
  if (!value || typeof value !== "object") return base;
  const record = value as Partial<ModelSettings>;
  const provider =
    typeof record.provider === "string" && PROVIDER_PRESETS.some((p) => p.id === record.provider)
      ? (record.provider as LLMProviderId)
      : base.provider;

  return {
    useModel: Boolean(record.useModel),
    provider,
    baseUrl: typeof record.baseUrl === "string" && record.baseUrl.trim() ? record.baseUrl.trim() : base.baseUrl,
    model: typeof record.model === "string" && record.model.trim() ? record.model.trim() : base.model,
    apiKey: typeof record.apiKey === "string" ? record.apiKey.trim() : "",
  };
}

export function loadModelSettings(): ModelSettings {
  try {
    const raw = localStorage.getItem(MODEL_KEY) || localStorage.getItem("reptrackers.model.v1");
    if (!raw) return defaultModelSettings();
    return sanitizeModelSettings(JSON.parse(raw));
  } catch {
    return defaultModelSettings();
  }
}

export function saveModelSettings(settings: ModelSettings) {
  try {
    localStorage.setItem(MODEL_KEY, JSON.stringify(settings));
  } catch {
    // quota exceeded or private mode
  }
}

export const INSTRUCTIONS = `You are the Rep Trackers mindful companion inside a static wellbeing web application.
You are a warm, supportive wellness coach, but NOT a doctor, dietitian, or emergency crisis service.
Core boundaries you MUST follow:
1. Never diagnose conditions, prescribe medications, suggest pharmaceutical doses, or recommend extreme/fad diets.
2. If the user mentions self-harm, severe distress, or emergency, immediately urge them to contact emergency services (e.g. 988 in US, 9152987821 / AASRA in India) and do not counsel them alone.
3. Ground your answers in sustainable, humane, non-judgmental habits: consistent gentle movement, balanced meals, proper hydration, quality sleep, and positive self-talk.
4. Keep replies concise (under 140 words), warm, encouraging, and free of body-shaming or rigid rules.
5. End with a thoughtful, open question or a tiny actionable step.
6. Remember this application is 100% static and client-side; never claim data is saved to a central server.`;

function resolveEndpoint(baseUrl: string): { url: string; isNativeGemini: boolean } {
  const raw = baseUrl.trim().replace(/\/$/, "");
  const parsed = new URL(raw);
  const local = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" && local)) {
    throw new Error("Use an https endpoint. http is only allowed for localhost / local LLM.");
  }
  if (raw.includes("generativelanguage.googleapis.com") && raw.includes(":generateContent")) {
    return { url: raw, isNativeGemini: true };
  }
  if (raw.endsWith("/chat/completions")) {
    return { url: raw, isNativeGemini: false };
  }
  return { url: `${raw}/chat/completions`, isNativeGemini: false };
}

export async function askModel(
  settings: ModelSettings,
  turns: { role: "user" | "bot"; text: string }[],
  context: string,
): Promise<string> {
  if (!settings.apiKey.trim() && settings.provider !== "ollama") {
    throw new Error("Add an API key to communicate with the connected model.");
  }
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 25000);

  const { url, isNativeGemini } = resolveEndpoint(settings.baseUrl);

  try {
    if (isNativeGemini) {
      // Native Gemini REST API format
      const targetUrl = url.includes("key=") ? url : `${url}?key=${encodeURIComponent(settings.apiKey.trim())}`;
      const response = await fetch(targetUrl, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: turns.slice(-8).map((turn) => ({
            role: turn.role === "bot" ? "model" : "user",
            parts: [{ text: turn.text }],
          })),
          systemInstruction: {
            parts: [{ text: `${INSTRUCTIONS}\n\nContext notes:\n${context || "General wellbeing only."}` }],
          },
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 350,
          },
        }),
      });

      if (!response.ok) {
        const errorText = (await response.text()).replace(/\s+/g, " ").slice(0, 200);
        throw new Error(errorText || `Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!text) throw new Error("The model returned an empty response.");
      return text.slice(0, 2000);
    }

    // Standard OpenAI-compatible format (Groq, Gemini OpenAI, OpenRouter, OpenAI, Ollama)
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (settings.apiKey.trim()) {
      headers["Authorization"] = `Bearer ${settings.apiKey.trim()}`;
    }
    if (settings.baseUrl.includes("openrouter.ai")) {
      headers["HTTP-Referer"] = window.location.origin || "https://reptrackers.local";
      headers["X-Title"] = "Rep Trackers Wellness";
    }

    const response = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      headers,
      body: JSON.stringify({
        model: settings.model.trim(),
        temperature: 0.5,
        max_tokens: 350,
        messages: [
          {
            role: "system",
            content: `${INSTRUCTIONS}\n\nReference wellness notes from RepTrackers:\n${context || "General wellbeing only."}`,
          },
          ...turns.slice(-8).map((turn) => ({
            role: turn.role === "bot" ? "assistant" : "user",
            content: turn.text,
          })),
        ],
      }),
    });

    if (!response.ok) {
      let detail = "";
      try {
        const errJson = await response.json();
        detail = errJson?.error?.message || JSON.stringify(errJson);
      } catch {
        detail = (await response.text()).replace(/\s+/g, " ").slice(0, 200);
      }
      throw new Error(detail || `Request failed with HTTP status ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("The model returned an empty reply.");
    return text.slice(0, 2000);
  } finally {
    window.clearTimeout(timer);
  }
}

export function explainModelError(error: unknown, settings: ModelSettings): string {
  const name = error instanceof Error ? error.name : "";
  let message = error instanceof Error ? error.message : "The model request failed.";

  if (name === "AbortError") {
    return "Request timed out after 25 seconds. Check your internet connection or server status.";
  }

  if (message === "Failed to fetch" || name === "TypeError") {
    if (settings.provider === "openai") {
      return "Browser blocked direct request to OpenAI (CORS). We recommend using Groq or OpenRouter for direct client-side requests.";
    }
    if (settings.provider === "ollama") {
      return "Could not reach local Ollama on localhost:11434. Make sure Ollama is running with OLLAMA_ORIGINS=\"*\" enabled.";
    }
    return "Network error or CORS restriction blocked the browser from reaching this endpoint.";
  }

  if (settings.apiKey) {
    message = message.split(settings.apiKey).join("••••");
  }

  return message.replace(/\s+/g, " ").slice(0, 220);
}
