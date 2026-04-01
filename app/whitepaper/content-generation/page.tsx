export const dynamic = "force-static";
export default function Page() {
  const types = [
    { name: "Blog Post", desc: "Long-form, GEO-optimized article with natural keyword integration, FAQ sections, and citation-worthy structure that AI engines prefer to reference." },
    { name: "FAQ + Schema", desc: "Question-answer pairs with JSON-LD FAQPage markup. AI engines heavily weight structured Q&A content when generating answers." },
    { name: "Schema Markup", desc: "Organization and Product JSON-LD structured data. Helps AI engines understand entity relationships and attributes." },
    { name: "Social Posts", desc: "20+ platform-native posts for X, LinkedIn, Reddit, and other channels. Creates the external mentions and citations that build AI visibility." },
    { name: "About Page", desc: "Optimized about page copy with entity-rich descriptions that AI engines use for brand knowledge graphs." },
    { name: "llms.txt", desc: "Machine-readable file that tells AI crawlers what your brand does, similar to robots.txt but for LLMs." },
    { name: "Robots Audit", desc: "Analysis of current robots.txt for AI crawler access. Many sites accidentally block AI crawlers without knowing." },
  ];

  return (
    <div className="prose-custom">
      <h1 className="text-[1.75rem] font-medium tracking-tight mb-6">Content Generation</h1>
      <p className="text-[15px] text-[#999] leading-relaxed mb-6">
        Every Pro Audit ($0.99 USDC, 80% launch discount) generates 7 types of content fixes, each targeting different GEO signals. All content is grounded in real audit data — not generic templates. You review and approve each fix from your dashboard.
      </p>
      <div className="space-y-4">
        {types.map((t) => (
          <div key={t.name} className="p-4 rounded-xl bg-[#0c0c0c] border border-[#191919]">
            <p className="text-[14px] font-medium text-white mb-1">{t.name}</p>
            <p className="text-[13px] text-[#999] leading-relaxed">{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
