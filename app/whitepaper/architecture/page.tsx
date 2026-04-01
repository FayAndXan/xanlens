export const dynamic = "force-static";
export default function Page() {
  return (
    <div className="prose-custom">
      <h1 className="text-[1.75rem] font-medium tracking-tight mb-6">Architecture</h1>
      <p className="text-[15px] text-[#999] leading-relaxed mb-6">
        XanLens is built for speed and reliability. Stateless API routes handle audit orchestration, while Redis provides job state and caching.
      </p>

      <h3 className="text-[16px] font-medium mb-3">Stack</h3>
      <ul className="list-disc pl-5 space-y-2 text-[15px] text-[#999] leading-relaxed mb-8">
        <li><strong className="text-white">Next.js 16</strong> on Vercel — frontend and API routes</li>
        <li><strong className="text-white">Upstash Redis</strong> — job state, audit data, caching</li>
        <li><strong className="text-white">Gemini API</strong> — primary AI engine + LLM judge + content generation</li>
        <li><strong className="text-white">Grok API</strong> (xAI) — knowledge engine</li>
        <li><strong className="text-white">DeepSeek API</strong> — knowledge engine</li>
        <li><strong className="text-white">Gemini with Google Search</strong> — grounded discoverability analysis</li>
        <li><strong className="text-white">Tavily API</strong> — AI-native search with real-time web data</li>
        <li><strong className="text-white">x402 protocol</strong> — HTTP-native USDC payments on Base</li>
        <li><strong className="text-white">Coinbase Smart Wallet</strong> — gasless payments via CDP Paymaster</li>
      </ul>

      <h3 className="text-[16px] font-medium mb-3">Request Flow</h3>
      <div className="p-4 rounded-xl bg-[#0c0c0c] border border-[#191919] font-mono text-[13px] text-[#999] leading-relaxed">
        <p>User/Agent → Auto-Detect (brand, industry, competitors)</p>
        <p className="mt-1">→ Submit Audit → Payment (USDC / coupon / x402)</p>
        <p className="mt-1">→ Execute → [Gemini, Grok, DeepSeek, Gemini Grounded] (parallel)</p>
        <p className="mt-1">→ LLM Judge validates each response</p>
        <p className="mt-1">→ Score + Findings → Content Fixes Generation</p>
        <p className="mt-1">→ Dashboard (approve / reject / edit fixes)</p>
      </div>

      <h3 className="text-[16px] font-medium mt-8 mb-3">Engines</h3>
      <p className="text-[15px] text-[#999] leading-relaxed mb-4">
        Currently live: <strong className="text-white">Gemini</strong> (knowledge), <strong className="text-white">Grok</strong> (knowledge), <strong className="text-white">DeepSeek</strong> (knowledge), and <strong className="text-white">Gemini Grounded</strong> (discoverability via Google Search). ChatGPT, Claude, Perplexity, and Meta AI are supported but currently paused — coming online as API capacity scales.
      </p>

      <h3 className="text-[16px] font-medium mt-8 mb-3">Design Principles</h3>
      <ul className="list-disc pl-5 space-y-2 text-[15px] text-[#999] leading-relaxed">
        <li><strong className="text-white">Fast</strong> — parallel engine queries, edge-deployed</li>
        <li><strong className="text-white">Portable</strong> — works from any HTTP client, curl to Claude</li>
        <li><strong className="text-white">Transparent</strong> — scores show exactly what each engine said</li>
        <li><strong className="text-white">Agent-first</strong> — REST API, MCP server, OpenClaw skill</li>
      </ul>
    </div>
  );
}
