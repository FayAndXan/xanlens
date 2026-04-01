export const dynamic = "force-static";
export default function Page() {
  return (
    <div className="prose-custom">
      <h1 className="text-[1.75rem] font-medium tracking-tight mb-6">Built for Humans &amp; Agents</h1>
      <p className="text-[15px] text-[#999] leading-relaxed mb-6">
        XanLens serves two audiences with one product.
      </p>

      <h3 className="text-[16px] font-medium mb-3">For Humans</h3>
      <p className="text-[15px] text-[#999] leading-relaxed mb-6">
        The website at <a href="https://xanlens.com" className="text-white underline underline-offset-4">xanlens.com</a> provides a clean UI: enter your brand, get your score, see generated content in tabs, copy and publish. No technical knowledge required. No account needed.
      </p>

      <h3 className="text-[16px] font-medium mb-3">For Agents</h3>
      <p className="text-[15px] text-[#999] leading-relaxed mb-4">
        Four integration paths:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-[15px] text-[#999] leading-relaxed mb-6">
        <li><strong className="text-white">REST API</strong> with x402 payments — any HTTP client</li>
        <li><strong className="text-white">MCP Server</strong> — for Claude, Cursor, and MCP-compatible agents</li>
        <li><strong className="text-white">OpenClaw Skill</strong> — one-line install for OpenClaw agents</li>
        <li><strong className="text-white">Prompt-based</strong> — any agent that can read URLs and make HTTP requests</li>
      </ul>

      <h3 className="text-[16px] font-medium mb-3">Agent Use Cases</h3>
      <p className="text-[15px] text-[#999] leading-relaxed">
        Agents that build websites, manage brands, or run marketing campaigns can integrate XanLens as a GEO audit step — automatically checking and fixing AI visibility as part of their workflow. An agent building a SaaS landing page can run an audit, generate schema markup and llms.txt, and deploy it — all without human intervention.
      </p>
    </div>
  );
}
