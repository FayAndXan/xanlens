export const dynamic = "force-static";
export default function Page() {
  return (
    <div className="prose-custom">
      <h1 className="text-[1.75rem] font-medium tracking-tight mb-6">How It Works</h1>
      <p className="text-[15px] text-[#999] leading-relaxed mb-6">
        The XanLens pipeline has three stages:
      </p>

      <h3 className="text-[16px] font-medium mb-3">1. Discovery</h3>
      <p className="text-[15px] text-[#999] leading-relaxed mb-6">
        We auto-detect your brand, industry, and competitors from your URL. Then we query multiple AI engines (Gemini, Grok, DeepSeek — with ChatGPT, Claude, Perplexity, and Meta AI coming online) with ~132 branded and discovery prompts. For each engine, we capture: whether the brand is mentioned, the context and sentiment of mentions, competitor positioning, and citation sources. An LLM judge validates every response for accuracy.
      </p>

      <h3 className="text-[16px] font-medium mb-3">2. Analysis</h3>
      <p className="text-[15px] text-[#999] leading-relaxed mb-6">
        We crawl the target website and analyze: page structure, meta tags, existing schema markup, robots.txt directives for AI crawlers, content quality signals, and technical GEO readiness. Combined with engine responses, this data feeds into the GEO score and content fix generation.
      </p>

      <h3 className="text-[16px] font-medium mb-3">3. Content Fixes</h3>
      <p className="text-[15px] text-[#999] leading-relaxed">
        Using real audit data — not templates — XanLens generates tailored content fixes: on-page rewrites (titles, metas, headings), schema markup, JSON-LD, FAQ pages, blog posts, llms.txt, and 20+ seed citations. Each fix targets specific gaps found in your audit. You review and approve fixes from your dashboard, or your agent can push them via the API.
      </p>
    </div>
  );
}
