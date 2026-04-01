export const dynamic = "force-static";
export default function Page() {
  return (
    <div className="prose-custom">
      <h1 className="text-[1.75rem] font-medium tracking-tight mb-6">Service Tiers</h1>
      <p className="text-[15px] text-[#999] leading-relaxed mb-6">
        One tier. Everything included. No subscriptions. Pay per audit.
      </p>
      <div className="space-y-4">
        <div className="p-6 rounded-xl bg-[#0c0c0c] border border-[#191919]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-[16px] font-medium">Pro Audit + Content Fixes</h3>
              <span className="text-[10px] bg-[#2596be]/10 text-[#2596be] px-2 py-0.5 rounded-full font-medium">80% off</span>
            </div>
            <div className="text-right">
              <span className="text-[#555] line-through text-[14px] mr-2">$4.95</span>
              <span className="text-[1.25rem] font-medium">$0.99 USDC</span>
            </div>
          </div>
          <ul className="space-y-2">
            {[
              "All active AI engines — Gemini, Grok, DeepSeek (ChatGPT, Claude, Perplexity, Meta AI coming online)",
              "Gemini with Google Search grounding for discoverability",
              "~132 prompts across category, discovery, and competitor queries",
              "AI visibility score + grade",
              "LLM judge validation on every response",
              "Content AI-friendliness score",
              "Competitor ranking + share of voice",
              "Full citation analysis + citation gap",
              "Enhanced blind spots (severity + type)",
              "Engine-by-engine breakdown with snippets",
              "Trend tracking (vs previous audits)",
              "Technical health (AI crawler check + Lighthouse)",
              "Authority source mapping",
              "Search demand signals",
              "AI-generated content fixes (on-page rewrites, schema, JSON-LD, FAQ, blog post, llms.txt, seed citations)",
              "Approve / reject / edit fixes from dashboard",
              "Agent API: push and manage fixes programmatically",
              "Share your score on X → free re-audit coupon",
            ].map((f) => (
              <li key={f} className="flex gap-2 text-[14px] text-[#999]">
                <span className="text-white shrink-0">✓</span> {f}
              </li>
            ))}
          </ul>
          <p className="text-[12px] text-[#555] mt-4">Pay with USDC on Base (gasless with Smart Wallet), card via Onramper/Coinbase, coupon, or x402 for agents.</p>
        </div>
      </div>
    </div>
  );
}
