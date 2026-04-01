export const dynamic = "force-static";
"use client";

import { motion } from "framer-motion";
import BreadcrumbSchema from "../components/BreadcrumbSchema";

function Code({ title, code }: { title: string; code: string }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-2.5 border-b border-[#191919] text-[12px] text-[#666] font-medium">{title}</div>
      <pre className="p-4 overflow-x-auto text-[13px] text-[#999] leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function ApiDocs() {
  return (
    <>
    <BreadcrumbSchema name="API Docs" path="/api-docs" />
    <div className="pt-48 pb-28 px-6">
      <div className="max-w-[800px] mx-auto">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-[12px] text-[#555] tracking-[0.2em] uppercase mb-5 font-mono">[ API ]</p>
          <h1 className="heading-xl mb-4">API & Agent Integration</h1>
          <p className="body-lg">
            GEO audits for your apps, tools, and AI agents. REST API + MCP server.
          </p>
        </motion.div>

        <section className="mb-14">
          <h2 className="heading-md mb-4">Overview</h2>
          <div className="card p-6 space-y-3 text-[14px] text-[#999]">
            <p><span className="text-white">Base URL</span> — <code className="text-[#999]">https://xanlens.com/api/v1</code></p>
            <p><span className="text-white">Authentication</span> — None required. Payment via x402.</p>
            <p><span className="text-white">Payment</span> — Pro Audit + Content Fixes $0.99 USDC (80% launch discount, Base network via x402)</p>
            <p><span className="text-white">Format</span> — JSON in, JSON out</p>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="heading-md mb-4">Audit Flow (4 Steps)</h2>
          <p className="body-sm mb-6">Always start with detect — it returns keywords, features, and suggested prompts that generate 50+ extra queries. Skipping it means a weaker audit.</p>

          <div className="space-y-6">
            <div>
              <h3 className="text-[15px] font-semibold text-white/90 mb-3">Step 1: Auto-Detect Brand (required — ~50s)</h3>
              <Code
                title="POST /audit/detect — always call first"
                code={`curl -X POST https://xanlens.com/api/v1/audit/detect \\
  -H "Content-Type: application/json" \\
  -d '{"website": "stripe.com"}'

// Response (pass ALL fields to Step 2):
{
  "brand": "Stripe",
  "industry": "payment processing",
  "competitors": ["PayPal", "Square", "Adyen"],
  "keywords": ["online payments", "payment gateway", ...],
  "features": ["Developer-first API", "Global coverage", ...],
  "suggestedPrompts": ["best payment API for startups", ...]
}`}
              />
            </div>

            <div>
              <h3 className="text-[15px] font-semibold text-white/90 mb-3">Step 2: Submit Audit (pass all detect fields)</h3>
              <Code
                title="POST /audit — include all fields from detect"
                code={`curl -X POST https://xanlens.com/api/v1/audit \\
  -H "Content-Type: application/json" \\
  -d '{
    "website": "https://stripe.com",
    "brand": "Stripe",
    "industry": "payment processing",
    "competitors": ["PayPal", "Square"],
    "keywords": ["online payments", "payment gateway"],
    "features": ["Developer-first API"],
    "suggestedPrompts": ["best payment API for startups"],
    "coupon": "GEO-XXXX-XXXX"
  }'

// Response:
{
  "status": "ready",
  "job_id": "abc-123",
  "detect_quality": "full",
  "total": 132,
  "execute_url": "/api/v1/audit/execute",
  "poll_url": "/api/v1/audit/status?jobId=abc-123"
}
// If detect_quality is "partial" or "failed" — call detect separately first`}
              />
              <p className="text-[12px] text-[#555] mt-2">~132 prompts when detect data is complete. Fewer if keywords/features are missing.</p>
            </div>

            <div>
              <h3 className="text-[15px] font-semibold text-white/90 mb-3">Step 3: Execute + Poll</h3>
              <Code
                title="POST /audit/execute — fires all prompts server-side"
                code={`curl -X POST https://xanlens.com/api/v1/audit/execute \\
  -H "Content-Type: application/json" \\
  -d '{"jobId": "abc-123"}'

// Response:
{"ok": true, "total": 132, "dispatched": 132}

// After all prompts fired:
curl "https://xanlens.com/api/v1/audit/status?jobId=abc-123"

// Returns full audit report with scores, engines, blind spots, citations, etc.`}
              />
            </div>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="heading-md mb-4">Additional Endpoints</h2>
          <div className="space-y-6">
            <Code
              title="GET /audit/status — Get Audit Results"
              code={`curl "https://xanlens.com/api/v1/audit/status?jobId=abc-123"

// Returns: Complete audit report with scores, engines breakdown,
// blind spots, citations, competitor analysis, and recommendations`}
            />

            <Code
              title="POST /audit/share-verify — Share Score for Discount"
              code={`curl -X POST "https://xanlens.com/api/v1/audit/share-verify" \\
  -H "Content-Type: application/json" \\
  -d '{"jobId": "abc-123", "tweetUrl": "https://x.com/user/status/123"}'

// Returns: Verification status and discount code for next audit`}
            />

            <Code
              title="GET /audit/fixes — Get Generated Content (Pro)"
              code={`curl "https://xanlens.com/api/v1/audit/fixes?jobId=abc-123"

// Returns: Generated GEO content including blog posts, FAQ schema,
// JSON-LD markup, llms.txt, and seed citations for improvement`}
            />

            <Code
              title="POST /audit/detect — Auto-detect Brand Info"
              code={`curl -X POST https://xanlens.com/api/v1/audit/detect \\
  -H "Content-Type: application/json" \\
  -d '{"website": "stripe.com"}'

// Returns: Detected brand name, industry, and competitor list
// for use in audit requests`}
            />
          </div>
        </section>

        <section className="mb-14">
          <h2 className="heading-md mb-4">Pro Audit + Content Fixes — $0.99</h2>
          <div className="card p-6">
            <ul className="text-[13px] text-[#999] space-y-2">
              {[
                "All active AI engines (Gemini, Grok, DeepSeek — more coming online)",
                "~132 prompts across category, discovery, and competitor queries",
                "SEO vs GEO comparison",
                "Technical health (Lighthouse + AI crawler check)",
                "Authority source mapping",
                "Search demand signals",
                "Persona analysis + content AI-friendliness",
                "Competitor ranking",
                "Trend tracking",
                "AI-generated content fixes (approve/reject/edit from dashboard)",
                "Generated content + seed citations",
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-2"><span className="text-white">✓</span> {f}</li>
              ))}
            </ul>
            <p className="text-[12px] text-[#555] mt-4">Pay with USDC on Base (x402), card at xanlens.com/dashboard, or coupon code.</p>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="heading-md mb-4">Quick Start</h2>
          <div className="space-y-6">
            <Code
              title="Python — Full Audit"
              code={`import requests, time

BASE = "https://xanlens.com/api/v1"

# Step 1: Detect brand (required — ~50s)
detected = requests.post(f"{BASE}/audit/detect", json={"website": "acme.com"}).json()

# Step 2: Submit audit with all detect fields + coupon
audit = requests.post(f"{BASE}/audit", json={**detected, "coupon": "GEO-XXXX-XXXX"}).json()
job_id = audit["job_id"]

# Step 3: Execute (fires all prompts server-side)
requests.post(f"{BASE}/audit/execute", json={"jobId": job_id})

# Step 4: Poll for results
while True:
    result = requests.get(f"{BASE}/audit/status?jobId={job_id}").json()
    if result["status"] == "complete":
        break
    print(f"Progress: {result['done']}/{result['total']}")
    time.sleep(15)

print(f"GEO Score: {result['overall_score']}/100 ({result['grade']})")`}
            />

            <Code
              title="JavaScript"
              code={`const BASE = "https://xanlens.com/api/v1";
const delay = ms => new Promise(r => setTimeout(r, ms));

// Step 1: Detect
const detected = await fetch(\`\${BASE}/audit/detect\`, {
  method: "POST", headers: {"Content-Type": "application/json"},
  body: JSON.stringify({website: "acme.com"})
}).then(r => r.json());

// Step 2: Submit with all detect fields
const audit = await fetch(\`\${BASE}/audit\`, {
  method: "POST", headers: {"Content-Type": "application/json"},
  body: JSON.stringify({...detected, coupon: "GEO-XXXX-XXXX"})
}).then(r => r.json());

// Step 3: Execute
await fetch(\`\${BASE}/audit/execute\`, {
  method: "POST", headers: {"Content-Type": "application/json"},
  body: JSON.stringify({jobId: audit.job_id})
});

// Step 4: Poll
let result;
do {
  await delay(15000);
  result = await fetch(\`\${BASE}/audit/status?jobId=\${audit.job_id}\`).then(r => r.json());
} while (result.status !== "complete");

console.log(\`GEO Score: \${result.overall_score}/100 (\${result.grade})\`);`}
            />
          </div>
        </section>

        <section id="x402" className="mb-14">
          <h2 className="heading-md mb-4">x402 Payment Protocol</h2>
          <div className="card p-6 space-y-4 text-[14px] text-[#999] leading-relaxed">
            <p>
              XanLens uses <span className="text-white">x402</span> for machine-native payments.
              No API keys. No accounts. Pro Audit + Content Fixes $0.99 USDC on Base (80% launch discount).
            </p>
            <div className="space-y-2">
              <p className="text-white text-[13px]">Flow:</p>
              <p>1. Send request without <code>X-Source: website</code> header (triggers paid tier)</p>
              <p>2. Server returns 402 with payment details</p>
              <p>3. Agent sends USDC on Base network</p>
              <p>4. Retry with transaction hash — server verifies and returns data</p>
            </div>
            <div className="space-y-2">
              <p className="text-white text-[13px]">Wallet:</p>
              <p><code className="text-[12px]">0xB33FF8b810670dFe8117E5936a1d5581A05f350D</code> (Base · USDC)</p>
            </div>
          </div>
        </section>

        <section id="mcp" className="mb-14">
          <h2 className="heading-md mb-4">MCP Server (AI Agents)</h2>
          <div className="card p-6 space-y-4 text-[14px] text-[#999] leading-relaxed">
            <p>
              For AI agents using <span className="text-white">Model Context Protocol</span>,
              XanLens is available as a native tool. Your agent can call GEO audits
              without leaving its workflow.
            </p>
            <p className="text-white text-[13px]">Install:</p>
            <div className="card p-3 overflow-x-auto">
              <code className="text-[13px] text-[#999] font-mono">openclaw skills install xanlens-geo</code>
            </div>
            <p>
              Compatible with OpenClaw, Claude Desktop, Cursor, and any MCP-compatible framework.
              The skill gives your agent the full GEO audit playbook — run audits, interpret results, draft fixes, and push content.
            </p>
            <a href="https://clawhub.ai/FeyDeFi/geo-audit-optimizer" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[13px] border border-[#333] rounded-full px-5 py-2.5 hover:border-white hover:text-white transition-all font-mono tracking-wide mt-3">
              VIEW ON CLAWHUB <span className="text-[10px]">↗</span>
            </a>
          </div>
        </section>

        <div className="card p-10 text-center">
          <h2 className="heading-md mb-3">Ready to integrate?</h2>
          <p className="body-sm mb-6">Start auditing. No API keys needed.</p>
          <a href="/dashboard" className="btn-primary">Audit your brand →</a>
        </div>
      </div>
    </div>
    </>
  );
}
