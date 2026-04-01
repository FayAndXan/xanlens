export const dynamic = "force-static";
export default function Page() {
  return (
    <div className="prose-custom">
      <h1 className="text-[1.75rem] font-medium tracking-tight mb-6">Get Started</h1>

      <div className="space-y-4 mb-8">
        <div className="p-6 rounded-xl bg-[#0c0c0c] border border-[#191919]">
          <h3 className="text-[15px] font-medium mb-2">Humans</h3>
          <p className="text-[14px] text-[#999] mb-3">Sign in on the dashboard, pay $0.99 or use a coupon.</p>
          <a href="https://xanlens.com/dashboard" className="text-[14px] text-white underline underline-offset-4">
            xanlens.com →
          </a>
        </div>

        <div className="p-6 rounded-xl bg-[#0c0c0c] border border-[#191919]">
          <h3 className="text-[15px] font-medium mb-2">Agents (Prompt)</h3>
          <p className="text-[14px] text-[#999] mb-3">Copy this to any agent that can read URLs and make HTTP requests:</p>
          <div className="p-3 rounded-lg bg-black border border-[#191919]">
            <code className="text-[13px] text-[#ccc]">Read https://xanlens.com/api/skill.md and follow the instructions to audit a brand.</code>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[#0c0c0c] border border-[#191919]">
          <h3 className="text-[15px] font-medium mb-2">Agents (API)</h3>
          <p className="text-[14px] text-[#999] mb-3">POST to the REST API — pay via x402 or USDC:</p>
          <div className="p-3 rounded-lg bg-black border border-[#191919]">
            <pre className="text-[13px] text-[#ccc] whitespace-pre-wrap">{`curl -X POST https://xanlens.com/api/v1/audit \\
  -H "Content-Type: application/json" \\
  -d '{"brand":"Your Brand","industry":"SaaS"}'`}</pre>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[#0c0c0c] border border-[#191919]">
          <h3 className="text-[15px] font-medium mb-2">MCP Server</h3>
          <p className="text-[14px] text-[#999] mb-3">Add to Claude, Cursor, or any MCP client:</p>
          <div className="p-3 rounded-lg bg-black border border-[#191919]">
            <pre className="text-[13px] text-[#ccc] whitespace-pre-wrap">{`{
  "mcpServers": {
    "xanlens": { "url": "https://xanlens.com/mcp" }
  }
}`}</pre>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[#0c0c0c] border border-[#191919]">
          <h3 className="text-[15px] font-medium mb-2">OpenClaw Skill</h3>
          <p className="text-[14px] text-[#999] mb-3">One-line install:</p>
          <div className="p-3 rounded-lg bg-black border border-[#191919]">
            <code className="text-[13px] text-[#ccc]">openclaw skills install xanlens-geo</code>
          </div>
          <p className="text-[13px] text-[#666] mt-2">
            <a href="https://clawhub.ai/FeyDeFi/geo-audit-optimizer" className="text-white underline underline-offset-4">View on ClawHub →</a>
          </p>
        </div>
      </div>

      <p className="text-[14px] text-[#999]">
        Questions? <a href="mailto:hello@xanlens.com" className="text-white underline underline-offset-4">hello@xanlens.com</a>
      </p>
    </div>
  );
}
