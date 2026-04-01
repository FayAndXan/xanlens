export const dynamic = "force-static";
export default function Page() {
  return (
    <div className="prose-custom">
      <h1 className="text-[1.75rem] font-medium tracking-tight mb-6">Audit Engine</h1>
      <p className="text-[15px] text-[#999] leading-relaxed mb-6">
        The audit engine queries multiple AI providers with ~132 prompts including category, discovery, and competitor queries.
      </p>

      <h3 className="text-[16px] font-medium mb-3">Live Engines</h3>
      <ul className="list-disc pl-5 space-y-2 text-[15px] text-[#999] leading-relaxed mb-6">
        <li><strong className="text-white">Gemini</strong> (Google) — knowledge queries via Gemini API</li>
        <li><strong className="text-white">Grok</strong> (xAI) — knowledge queries via Grok API</li>
        <li><strong className="text-white">DeepSeek</strong> — knowledge queries via DeepSeek API</li>
        <li><strong className="text-white">Gemini Grounded</strong> — discoverability analysis with Google Search grounding</li>
      </ul>

      <h3 className="text-[16px] font-medium mb-3">Coming Online</h3>
      <ul className="list-disc pl-5 space-y-2 text-[15px] text-[#999] leading-relaxed mb-6">
        <li><strong className="text-[#666]">ChatGPT</strong> (OpenAI) — via GPT API</li>
        <li><strong className="text-[#666]">Claude</strong> (Anthropic) — via Claude API</li>
        <li><strong className="text-[#666]">Perplexity</strong> — via Perplexity API</li>
        <li><strong className="text-[#666]">Meta AI</strong> (Llama) — via NVIDIA NIM</li>
      </ul>

      <p className="text-[15px] text-[#999] leading-relaxed mb-6">
        All queries run at low temperature for reproducible results. Each engine receives multiple prompt types: branded, discovery, and comparative. An LLM judge (Gemini) validates every response to detect hallucinations and verify the response is about the correct brand.
      </p>

      <h3 className="text-[16px] font-medium mb-3">Prompt Design</h3>
      <p className="text-[15px] text-[#999] leading-relaxed mb-4">
        Branded prompts ask engines directly about the target brand. Discovery prompts ask for recommendations without mentioning the brand. Comparative prompts test head-to-head against competitors. The combination reveals:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-[15px] text-[#999] leading-relaxed mb-6">
        <li>Whether engines know the brand exists</li>
        <li>Whether engines recommend the brand organically</li>
        <li>How the brand is described (sentiment, accuracy)</li>
        <li>Which competitors appear instead</li>
        <li>What sources engines cite</li>
        <li>How visibility varies across query types</li>
      </ul>

      <h3 className="text-[16px] font-medium mb-3">Additional Analysis</h3>
      <p className="text-[15px] text-[#999] leading-relaxed mb-4">
        Beyond AI engine queries, each audit includes parallel technical checks:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-[15px] text-[#999] leading-relaxed">
        <li><strong className="text-white">SEO vs GEO comparison</strong> — Tavily web search as SEO proxy vs AI engine score</li>
        <li><strong className="text-white">AI crawler access</strong> — robots.txt analysis for 13 AI crawlers + llms.txt check</li>
        <li><strong className="text-white">Technical health</strong> — PageSpeed Insights (performance, SEO, accessibility)</li>
        <li><strong className="text-white">Authority sources</strong> — Wikipedia, Crunchbase, GitHub, LinkedIn presence</li>
        <li><strong className="text-white">Search demand</strong> — Google Autocomplete suggestions + People Also Ask</li>
        <li><strong className="text-white">Content AI-friendliness</strong> — On-page analysis for headings, FAQ, schema, entities</li>
      </ul>
    </div>
  );
}
