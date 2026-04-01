export const dynamic = "force-static";
"use client";

import { motion } from "framer-motion";

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const useCases = [
  {
    title: "SaaS Companies",
    problem: [
      "Users ask AI 'best project management tools' and your product is not in the response.",
      "Competitors appear in AI recommendations while you are invisible.",
      "You have strong SEO but zero AI engine presence.",
    ],
    solution: "XanLens audits with ~132 prompts across Gemini, Grok, DeepSeek, and more to show exactly where AI engines mention you — and where they don't. Category and discovery prompts reveal whether AI recommends your product when users ask for tools in your space.",
    examplePrompt: '"What are the best SaaS project management tools for remote teams?"',
  },
  {
    title: "E-commerce Brands",
    problem: [
      "Shoppers ask AI for product recommendations instead of searching Google.",
      "AI engines recommend competitors or generic alternatives.",
      "Your product pages are optimized for search engines, not AI engines.",
    ],
    solution: "XanLens tests shopping-intent queries across AI engines. The comparison prompts check if AI positions your products fairly against competitors. Content fixes include schema markup, FAQ pages, and on-page rewrites that help AI engines understand your product catalog.",
    examplePrompt: '"Compare [your brand] vs [competitor] for sustainable running shoes"',
  },
  {
    title: "AI Agents",
    problem: [
      "Your agent needs to monitor client brand visibility programmatically.",
      "Manual audits don't scale across dozens of client brands.",
      "You need structured data, not screenshots.",
    ],
    solution: "XanLens exposes a REST API that returns structured JSON. Agents call /api/v1/audit/run with a URL — auto-detection handles brand, industry, and competitors. Payment is handled via x402 (USDC on Base) — no API keys, no accounts. Automate weekly audits, trigger alerts on score drops, push content fixes via the API.",
    examplePrompt: 'POST /api/v1/audit {"brand":"ClientCo","industry":"fintech","competitors":["Stripe","Square"]}',
  },
  {
    title: "Marketing Agencies",
    problem: [
      "Clients ask about their AI visibility and you have no data to show them.",
      "Running manual checks across ChatGPT, Gemini, and Claude is time-consuming.",
      "You need audit reports that justify GEO services.",
    ],
    solution: "XanLens generates complete audit reports with GEO scores, prompt-by-prompt breakdowns, competitor benchmarking, and content gap analysis. Content fixes are generated automatically — on-page rewrites, blog posts, FAQ schema, seed citations, and more for each client. Structured JSON output works with any reporting tool.",
    examplePrompt: '"Best digital marketing agencies for B2B SaaS companies"',
  },
  {
    title: "Personal Brands / Creators",
    problem: [
      "Someone asks AI 'who is the best expert in [your field]' and you are not mentioned.",
      "Your authority and expertise are not reflected in AI responses.",
      "You have a strong following but AI engines don't know you exist.",
    ],
    solution: "XanLens tests direct and conversational prompts that mirror how people ask AI for expert recommendations. The audit reveals whether AI engines associate you with your area of expertise. Content fixes include optimized about page copy, llms.txt, and seed citations designed to build AI-visible authority.",
    examplePrompt: '"Who are the top experts in generative AI for marketing?"',
  },
  {
    title: "Local Businesses",
    problem: [
      "Customers ask AI 'best pizza in Brooklyn' and your restaurant is not in the answer.",
      "AI engines rely on structured data you may not have.",
      "Local SEO strategies don't translate to AI visibility.",
    ],
    solution: "XanLens adapts its prompt system to include location-specific queries. The audit shows whether AI engines mention your business for local intent queries. Content fixes include schema markup with location data, FAQ pages addressing local queries, and seed citations that reinforce geographic relevance.",
    examplePrompt: '"What is the best Italian restaurant in downtown Austin?"',
  },
];

export default function UseCases() {
  return (
    <div className="pt-48 pb-28 px-6">
      <div className="max-w-[900px] mx-auto">
        <motion.div className="text-center mb-16" initial="hidden" animate="visible" variants={fade}>
          <h1 className="heading-xl mb-4">Use Cases</h1>
          <p className="body-lg max-w-[560px] mx-auto">
            XanLens works for anyone who needs to know — and improve — how AI engines talk about their brand.
          </p>
        </motion.div>

        <div className="space-y-6">
          {useCases.map((uc, i) => (
            <motion.div
              key={uc.title}
              className="card p-7"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <h2 className="text-[18px] font-medium mb-4">{uc.title}</h2>

              <div className="mb-4">
                <p className="text-[11px] uppercase tracking-wider text-[#666] font-medium mb-2">The problem</p>
                <ul className="space-y-1.5">
                  {uc.problem.map((p, j) => (
                    <li key={j} className="text-[13px] text-[#999] flex gap-2">
                      <span className="text-[#666] shrink-0">—</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <p className="text-[11px] uppercase tracking-wider text-[#666] font-medium mb-2">How XanLens helps</p>
                <p className="text-[13px] text-[#999] leading-relaxed">{uc.solution}</p>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#666] font-medium mb-2">Example prompt tested</p>
                <div className="bg-black rounded-lg p-3 font-mono text-[12px] text-cyan-400">
                  {uc.examplePrompt}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a href="/dashboard" className="btn-primary">Audit your brand →</a>
          <span className="mx-4 text-[#666]">or</span>
          <a href="/api-docs" className="btn-secondary">Use the API</a>
        </motion.div>
      </div>
    </div>
  );
}
