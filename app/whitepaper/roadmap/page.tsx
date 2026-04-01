export const dynamic = "force-static";
export default function Page() {
  const phases = [
    {
      name: "Live Now",
      items: [
        "Multi-engine audit (Gemini, Grok, DeepSeek + Gemini Grounded for discoverability)",
        "~132 prompts across category, discovery, and competitor queries",
        "AI-generated content fixes with approve/reject/edit workflow",
        "Content types: on-page rewrites, schema, JSON-LD, FAQ, blog post, llms.txt, seed citations",
        "x402 payments (USDC on Base) — gasless via Coinbase Smart Wallet",
        "Card payments via Onramper + Coinbase Onramp",
        "MCP server + OpenClaw skill on ClawHub",
        "Share-for-coupon (tweet your score, get a free re-audit)",
        "Trend tracking across audits",
      ],
    },
    {
      name: "Coming Next",
      items: [
        "Additional engines: ChatGPT, Claude, Perplexity, Meta AI",
        "Automated recurring audits with score change alerts",
        "Competitor comparison reports",
        "Bulk/batch API for agencies",
        "Webhook notifications on score drops",
      ],
    },
    {
      name: "On the Horizon",
      items: [
        "Auto-publish pipeline (generate → review → publish)",
        "Brand knowledge graph building",
        "Industry benchmarks and public leaderboards (GEO Index)",
        "Enterprise tier with SLA",
        "White-label API for agencies",
      ],
    },
  ];

  return (
    <div className="prose-custom">
      <h1 className="text-[1.75rem] font-medium tracking-tight mb-6">Roadmap</h1>
      <p className="text-[15px] text-[#999] leading-relaxed mb-6">
        XanLens is actively developed. Here&apos;s where we are and where we&apos;re going.
      </p>
      <div className="space-y-4">
        {phases.map((p) => (
          <div key={p.name} className="p-6 rounded-xl bg-[#0c0c0c] border border-[#191919]">
            <p className="text-[11px] uppercase tracking-wider text-[#666] mb-3">{p.name}</p>
            <ul className="space-y-2">
              {p.items.map((item) => (
                <li key={item} className="text-[14px] text-[#999] flex gap-2">
                  <span className="text-[#444]">→</span> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
