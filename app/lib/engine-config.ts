/**
 * AI engine configuration — single source of truth.
 *
 * Consumer-facing AIs (Gemini, ChatGPT, Claude, Grok, DeepSeek)
 * + open-source foundations (Llama, Qwen) that power thousands of AI products.
 *
 * Stack: 7 engines. Cost: ~$0.10 per audit.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface EngineConfig {
  url: string;
  makeHeaders: () => Record<string, string>;
  makeBody: (prompt: string) => object;
  parseResponse: (data: any) => string;
  unavailable?: boolean;
}

const NVIDIA_KEY = process.env.NVIDIA_API_KEY || "";

function nvidiaConfig(model: string, label: string): EngineConfig {
  return {
    url: "https://integrate.api.nvidia.com/v1/chat/completions",
    makeHeaders: () => ({ Authorization: `Bearer ${NVIDIA_KEY}` }),
    makeBody: (prompt) => ({ model, messages: [{ role: "user", content: prompt }], max_tokens: 1024, temperature: 0.7 }),
    parseResponse: (d) => {
      if (d?.error) { console.error(`[${label}] ${d.error.message || JSON.stringify(d.error)}`); return ""; }
      return d?.choices?.[0]?.message?.content || "";
    },
  };
}

export const ENGINES: Record<string, EngineConfig> = {
  gemini_grounded: {
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY || ""}`,
    makeHeaders: () => ({}),
    makeBody: (prompt) => ({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0 },
      tools: [{ google_search: {} }],
    }),
    parseResponse: (d) => {
      const text = d?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const gm = d?.candidates?.[0]?.groundingMetadata;
      const sources: Array<{ title: string; url: string; content: string }> = [];
      if (gm?.groundingChunks) {
        for (const chunk of gm.groundingChunks) {
          if (chunk.web) sources.push({ title: chunk.web.title || "", url: chunk.web.uri || "", content: "" });
        }
      }
      if (gm?.groundingSupports) {
        for (const support of gm.groundingSupports) {
          if (support.segment?.text && support.groundingChunkIndices?.length > 0) {
            const idx = support.groundingChunkIndices[0];
            if (sources[idx] && !sources[idx].content) sources[idx].content = support.segment.text;
          }
        }
      }
      // Encode sources in response so worker can store them — delimited with |||SOURCES|||
      return sources.length > 0 ? `${text}|||SOURCES|||${JSON.stringify(sources)}` : text;
    },
  },
  gemini: {
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY || ""}`,
    makeHeaders: () => ({}),
    makeBody: (prompt) => ({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0 } }),
    parseResponse: (d) => d?.candidates?.[0]?.content?.parts?.[0]?.text || "",
  },
  gpt4o: {
    url: "https://api.openai.com/v1/chat/completions",
    makeHeaders: () => ({ Authorization: `Bearer ${process.env.OPENAI_API_KEY || ""}` }),
    makeBody: (prompt) => ({ model: "gpt-5.2", messages: [{ role: "user", content: prompt }], max_completion_tokens: 1024, temperature: 0.7 }),
    parseResponse: (d) => d?.choices?.[0]?.message?.content || "",
    unavailable: true, // Paused — too slow for MVP
  },
  claude: {
    url: "https://api.anthropic.com/v1/messages",
    makeHeaders: () => ({ "x-api-key": process.env.ANTHROPIC_API_KEY || "", "anthropic-version": "2023-06-01" }),
    makeBody: (prompt) => ({ model: "claude-3-5-haiku-20241022", max_tokens: 1024, messages: [{ role: "user", content: prompt }] }),
    parseResponse: (d) => d?.content?.[0]?.text || "",
    unavailable: true, // Paused — $5 tier rate limits too aggressive
  },
  grok: {
    url: "https://api.x.ai/v1/chat/completions",
    makeHeaders: () => ({ Authorization: `Bearer ${process.env.XAI_API_KEY || ""}` }),
    makeBody: (prompt) => ({ model: "grok-4-1-fast-non-reasoning", messages: [{ role: "user", content: prompt }], max_tokens: 1024, temperature: 0.7 }),
    parseResponse: (d) => d?.choices?.[0]?.message?.content || "",
  },
  deepseek: {
    url: "https://api.deepseek.com/chat/completions",
    makeHeaders: () => ({ Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY || ""}` }),
    makeBody: (prompt) => ({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], max_tokens: 1024 }),
    parseResponse: (d) => d?.choices?.[0]?.message?.content || "",
  },
  llama: { ...nvidiaConfig("meta/llama-4-maverick-17b-128e-instruct", "Llama"), unavailable: true }, // Paused — conserving NVIDIA credits
  qwen: { ...nvidiaConfig("qwen/qwen3-next-80b-a3b-instruct", "Qwen"), unavailable: true }, // Paused — conserving NVIDIA credits
  mistral: {
    url: "https://api.mistral.ai/v1/chat/completions",
    makeHeaders: () => ({ Authorization: `Bearer ${process.env.MISTRAL_API_KEY || ""}` }),
    makeBody: (prompt) => ({ model: "mistral-large-latest", messages: [{ role: "user", content: prompt }], max_tokens: 1024, temperature: 0.7 }),
    parseResponse: (d) => d?.choices?.[0]?.message?.content || "",
  },
  perplexity: {
    url: "https://api.perplexity.ai/chat/completions",
    makeHeaders: () => ({ Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY || ""}` }),
    makeBody: (prompt) => ({ model: "sonar-pro", messages: [{ role: "user", content: prompt }], max_tokens: 1024 }),
    parseResponse: (d) => d?.choices?.[0]?.message?.content || "",
    unavailable: true, // Paused — waiting for API key
  },
};

/** Query a single engine with a prompt. Returns empty string on failure. */
export async function queryEngine(engine: string, prompt: string, timeoutMs = 20000): Promise<string> {
  const eng = ENGINES[engine];
  if (!eng) return "";
  if (eng.unavailable) return "__UNAVAILABLE__";

  try {
    const res = await fetch(eng.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...eng.makeHeaders() },
      body: JSON.stringify(eng.makeBody(prompt)),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return "";
    const data = await res.json();
    if (data.error) return "";
    return eng.parseResponse(data);
  } catch {
    return "";
  }
}
