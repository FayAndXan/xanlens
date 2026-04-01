export const dynamic = "force-static";
"use client";

import { motion } from "framer-motion";
import BreadcrumbSchema from "../components/BreadcrumbSchema";

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2596be" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  );
}

function Lock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

const tiers = [
  {
    name: "Pro Audit + Content Fixes",
    price: "$0.99",
    priceNote: "USDC",
    originalPrice: "$4.95",
    discount: "80% off",
    desc: "Full audit + downloadable skill for your AI agent · 90-day retention",
    cta: "Get Pro Audit",
    ctaHref: "/dashboard",
    ctaStyle: "btn-primary",
    highlight: true,
    features: [
      { text: "All AI engines — Gemini, Grok, DeepSeek live (ChatGPT, Claude, Perplexity, Meta AI coming online)", included: true },
      { text: "AI visibility score + grade", included: true },
      { text: "AIO on-page analysis", included: true },
      { text: "Technical health + AI crawler check", included: true },
      { text: "Content AI-friendliness score", included: true },
      { text: "Competitor ranking + share of voice", included: true },
      { text: "Full citation analysis + citation gap", included: true },
      { text: "Enhanced blind spots (severity + type)", included: true },
      { text: "Trend tracking (vs previous audits)", included: true },
      { text: "Category gap analysis", included: true },
      { text: "Actionable recommendations", included: true },
      { text: "AI-generated content fixes (approve/reject/edit from dashboard)", included: true },
      { text: "On-page rewrites (titles, metas, headings) + schema + JSON-LD + llms.txt", included: true },
      { text: "20+ seed citations + citation strategy", included: true },
      { text: "Statistics injection + expert quotes (+40%)", included: true },
      { text: "FAQ page + about page + blog post", included: true },
      { text: "RAG-ready chunks", included: true },
      { text: "Share your score on X → free re-audit coupon", included: true },
    ],
  },
];

export default function Pricing() {
  return (
    <>
    <BreadcrumbSchema name="Pricing" path="/pricing" />
    <div className="pt-48 pb-28 px-6">
      <div className="max-w-[900px] mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-[12px] text-[#555] tracking-[0.2em] uppercase mb-5 font-mono">[ Pricing ]</p>
          <h1 className="heading-xl mb-4">Simple pricing</h1>
          <p className="body-lg">One audit. Everything included. No subscriptions.</p>
        </motion.div>

        <div className="flex justify-center gap-6 mb-20">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              className={`card p-8 flex flex-col w-full max-w-[420px] ${tier.highlight ? "border-white/20 ring-1 ring-white/10" : ""}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] uppercase tracking-wider text-[#666] font-medium">{tier.name}</span>
                {tier.discount && <span className="text-[10px] bg-[#2596be]/10 text-[#2596be] px-2 py-0.5 rounded-full font-medium">{tier.discount}</span>}
              </div>
              <div className="flex items-baseline gap-2 mt-1 mb-1">
                {tier.originalPrice && <span className="text-[1rem] text-[#555] line-through">{tier.originalPrice}</span>}
                <span className="text-[2.5rem] font-medium tracking-tight">{tier.price}</span>
                {tier.priceNote && <span className="text-[#666] text-[14px]">{tier.priceNote}</span>}
              </div>
              <p className="text-[13px] text-[#666] mb-8">{tier.desc}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f.text} className={`flex items-center gap-3 text-[13px] ${f.included ? "text-[#999]" : "text-[#444]"}`}>
                    <span className="shrink-0">{f.included ? <Check /> : <Lock />}</span>
                    {f.text}
                  </li>
                ))}
              </ul>
              <a href={tier.ctaHref} className={`${tier.ctaStyle} text-center`}>{tier.cta}</a>
            </motion.div>
          ))}
        </div>

        {/* x402 */}
        <motion.div
          className="card p-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="tag mb-6 inline-block">For AI Agents</span>
          <h2 className="heading-lg mb-3">Pay per call via x402</h2>
          <p className="body-sm mb-8 max-w-[500px] mx-auto">
            USDC on Base per call. No API keys, no accounts, no subscriptions. Send a request, pay inline, get results.
          </p>
          <a href="/api-docs" className="btn-primary">API & Agent Docs</a>
        </motion.div>
      </div>
    </div>
    </>
  );
}
