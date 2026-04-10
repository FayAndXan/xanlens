"use client";

import React from "react";
import { motion } from "framer-motion";
import { fade, TierIcon } from "./shared";

/* ─── Products (x.ai style) ─── */
export function WhyAgents() {
  const products = [
    {
      title: "GEO Audit",
      desc: "Query real AI engines — Gemini, Grok, DeepSeek, ChatGPT, Claude and more — with discovery prompts. See which engines mention your brand and which recommend competitors instead.",
      cta: "Run Audit",
      href: "#pricing",
    },
    {
      title: "Content Fixes",
      desc: "AI-generated content fixes based on your audit results. On-page rewrites, schema markup, FAQ pages, blog posts, seed citations — approve, reject, or edit each fix from your dashboard.",
      cta: "Learn More",
      href: "/geoskill",
    },
    {
      title: "API & Agents",
      desc: "REST API with x402 payments. Your AI agent sends a URL, runs the full audit, and gets back structured JSON with scores and content fixes. No API keys. No accounts. Pay per query with USDC on Base.",
      cta: "View Docs",
      href: "/api-docs",
    },
  ];

  const stats = [
    { value: "1B+", label: "Daily AI queries" },
    { value: "60%", label: "Zero-click searches" },
    { value: "$7.3B", label: "GEO market by 2031" },
    { value: "7", label: "AI engines supported" },
  ];

  return (
    <section className="py-28 md:py-36 px-6 border-t border-[#1a1a1a]">
      <div className="max-w-[1100px] mx-auto">
        <motion.div className="mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
          <p className="text-[12px] text-[#555] tracking-[0.2em] uppercase mb-5 font-mono">[ Products ]</p>
          <h2 className="heading-lg">
            Make your brand visible<br className="hidden md:block" /> to AI engines
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {products.map((p, i) => (
            <motion.div
              key={p.title}
              className="card p-8 flex flex-col"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <h3 className="text-[17px] font-medium mb-3 tracking-tight">{p.title}</h3>
              <p className="text-[14px] text-[#888] leading-relaxed flex-1 mb-8">{p.desc}</p>
              <a
                href={p.href}
                className="inline-flex items-center gap-2 text-[13px] border border-[#333] rounded-full px-5 py-2.5 hover:border-white hover:text-white transition-all w-fit font-mono tracking-wide"
              >
                {p.cta.toUpperCase()} <span className="text-[10px]">↗</span>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mt-20 pt-16 border-t border-[#1a1a1a]">
          {stats.map((s) => (
            <motion.div key={s.label} className="text-center" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="stat-value">{s.value}</p>
              <p className="text-[13px] text-[#666] mt-2 tracking-wide">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Use Cases (x.ai style) ─── */
const USE_CASES = [
  { title: "Verify before recommending", desc: "Agent checks if a brand is actually visible to AI engines before recommending it to users. No more blind suggestions." },
  { title: "Competitive intelligence", desc: "Compare brand A vs brand B across ChatGPT, Gemini, Perplexity. Which one AI actually recommends? Data-driven decisions." },
  { title: "Optimize autonomously", desc: "Agent runs weekly GEO audits, detects drops, applies fixes. Fully autonomous brand visibility management.", comingSoon: true },
  { title: "Sales prospecting", desc: "Scan potential clients' GEO scores. Low score = they need your GEO services. Automated lead qualification.", comingSoon: true },
  { title: "Portfolio monitoring", desc: "Agency managing 50 brands? Agent runs all audits weekly, alerts on drops, generates reports. Zero manual work.", comingSoon: true },
  { title: "Market research", desc: "Map entire industries by AI visibility. Which verticals are underserved? Where's the opportunity? Agent finds it.", comingSoon: true },
];

export function UseCases() {
  return (
    <section className="py-28 px-6 border-t border-[#1a1a1a]">
      <div className="max-w-[1100px] mx-auto">
        <motion.div className="mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
          <p className="text-[12px] text-[#555] tracking-[0.2em] uppercase mb-5 font-mono">[ Use Cases ]</p>
          <h2 className="heading-lg">What agents do with GEO data</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-5">
          {USE_CASES.map((uc, i) => (
            <motion.div
              key={uc.title}
              className="border-t border-[#1a1a1a] pt-6 pb-2"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-[15px] font-medium tracking-tight">{uc.title}</h3>
                {uc.comingSoon && <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#333] text-[#555] uppercase tracking-wider">Soon</span>}
              </div>
              <p className="text-[13px] text-[#777] leading-relaxed">{uc.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ─── */
const PRICING_TIERS = [
  {
    name: "Pro Audit + Content Fixes", price: "$0.99", priceUnit: " USDC", originalPrice: "$4.95", discount: "80% off", href: "/dashboard", btnClass: "btn-primary", cardClass: "border-white/20",
    features: [
      { icon: "M3 3v18h18|M7 16l4-8 4 4 6-6", text: "Gemini, Grok, DeepSeek + more coming · Competitor ranking" },
      { icon: "circle:11,11,8|m21 21-4.3-4.3", text: "Content AI-friendliness + share of voice" },
      { icon: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7|M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z", text: "AI-generated content fixes · Approve/reject from dashboard" },
      { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", text: "Schema + JSON-LD + llms.txt + blog post + seed citations" },
      { icon: "rect:3,11,18,10,2|circle:12,5,2|M12 7v4", text: "On-page rewrites · FAQ pages · About page copy" },
      { icon: "rect:8,2,8,4,1|M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2", text: "Trend tracking + recommendations + more" },
    ],
    label: "Get Pro Audit",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-28 px-6 border-t border-[#1a1a1a]">
      <div className="max-w-[1100px] mx-auto">
        <motion.div className="mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
          <p className="text-[12px] text-[#555] tracking-[0.2em] uppercase mb-5 font-mono">[ Pricing ]</p>
          <h2 className="heading-lg mb-3">Simple pricing</h2>
          <p className="text-[15px] text-[#666]">One audit. Everything included. No subscriptions.</p>
        </motion.div>
        <div className="flex justify-center max-w-[800px] mx-auto">
          {PRICING_TIERS.map((t, i) => (
            <motion.div key={t.name} className={`card p-8 flex flex-col w-full max-w-[420px] ${t.cardClass}`} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[15px] font-medium">{t.name}</h3>
                {t.discount && <span className="text-[10px] bg-[#2596be]/10 text-[#2596be] px-2 py-0.5 rounded-full font-medium">{t.discount}</span>}
              </div>
              <p className="text-[2rem] font-medium tracking-tight mb-3">
                {t.originalPrice && <span className="text-[1rem] text-[#555] line-through mr-2">{t.originalPrice}</span>}
                {t.price}{t.priceUnit && <span className="text-[14px] text-[#666]">{t.priceUnit}</span>}
              </p>
              <ul className="text-[13px] text-[#999] leading-relaxed mb-6 flex-1 space-y-3">
                {t.features.map((f) => (
                  <li key={f.text} className="flex items-center gap-3"><TierIcon paths={f.icon} /> {f.text}</li>
                ))}
              </ul>
              <a href={t.href} className={`${t.btnClass} w-full text-center block`}>{t.label}</a>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-6">
          <a href="/pricing" className="text-[14px] text-[#2596be] hover:text-white transition inline-flex items-center gap-1.5 font-medium">
            See full comparison <span className="text-[11px]">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── GEO Index (x.ai Latest News style) ─── */
export function GEOIndex() {
  const entries = [
    { date: "Coming soon", title: "GEO Index", desc: "Public database of AI visibility audits across industries. See how major brands score across ChatGPT, Gemini, Perplexity, and more." },
  ];

  return (
    <section className="py-28 px-6 border-t border-[#1a1a1a]">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-start justify-between mb-14">
          <div>
            <p className="text-[12px] text-[#555] tracking-[0.2em] uppercase mb-5 font-mono">[ GEO Index ]</p>
            <h2 className="text-[2.5rem] md:text-[3.2rem] font-light tracking-tight leading-[1.1]">Latest audits</h2>
          </div>
          <a
            href="/geo-index"
            className="hidden md:inline-flex items-center gap-2 text-[13px] border border-[#333] rounded-full px-5 py-2.5 hover:border-white hover:text-white transition-all font-mono tracking-wide mt-8"
          >
            EXPLORE MORE <span className="text-[10px]">↗</span>
          </a>
        </div>

        {entries.map((e) => (
          <div key={e.title} className="border-t border-[#1a1a1a] py-10 flex flex-col md:flex-row md:items-start gap-6">
            <p className="text-[12px] text-[#555] font-mono tracking-wide shrink-0 md:w-40 md:pt-1">{e.date.toUpperCase()}</p>
            <div className="flex-1">
              <h3 className="text-[20px] font-medium mb-2 tracking-tight">{e.title}</h3>
              <p className="text-[14px] text-[#777] leading-relaxed max-w-[600px]">{e.desc}</p>
            </div>
          </div>
        ))}

        <a
          href="/geo-index"
          className="md:hidden inline-flex items-center gap-2 text-[13px] border border-[#333] rounded-full px-5 py-2.5 hover:border-white hover:text-white transition-all font-mono tracking-wide mt-4"
        >
          EXPLORE MORE <span className="text-[10px]">↗</span>
        </a>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
export function AuditCTA() {
  return (
    <section className="py-24 px-6 border-t border-[#1a1a1a]">
      <motion.div className="max-w-[650px] mx-auto text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
        <h2 className="heading-lg mb-3">Ready to check your AI visibility?</h2>
        <p className="body-sm mb-6">Enter your website. We query real AI engines. See what they say about you.</p>
        <a href="/dashboard" className="btn-primary inline-block text-center px-8">Audit your brand →</a>
      </motion.div>
    </section>
  );
}

/* ─── FAQ (Accordion) ─── */
const FAQS = [
  { q: "What is GEO?", a: "Generative Engine Optimization. Making brands visible in AI search responses — ChatGPT, Perplexity, Gemini, Claude. The new SEO." },
  { q: "What brands and industries can XanLens audit?", a: "Any brand with a website. XanLens works across all industries — SaaS, e-commerce, finance, healthcare, local businesses, agencies. From startups to enterprises. If AI engines should be recommending you, XanLens can check if they are." },
  { q: "What data sources does XanLens use?", a: "XanLens queries real AI engines (Gemini, Grok, DeepSeek — with more coming online) with multiple prompts — both branded and discovery queries. It also uses Gemini with Google Search grounding for discoverability, Tavily for web citation analysis, and performs live site analysis (meta tags, schema markup, headings, content structure). No synthetic data." },
  { q: "How does the API and integration work?", a: "REST API at xanlens.com/api/v1. Send a POST with brand, website, and industry — get back a full JSON report. Supports MCP for agent-to-agent communication, and ships as an OpenClaw skill on ClawHub. Full API docs at xanlens.com/api-docs." },
  { q: "What are Content Fixes?", a: "After your audit, XanLens generates AI-powered content fixes tailored to your results — on-page rewrites (titles, metas, headings), schema markup, JSON-LD, FAQ pages, blog posts, llms.txt, and 20+ seed citations. You review and approve each fix from your dashboard. Included with every Pro Audit ($0.99 USDC — 80% launch discount)." },
  { q: "Who built XanLens?", a: "XanLens is built by Fey (5+ years in blockchain/DeFi, former VC accelerator work) and Xan (AI agent and digital partner). We built XanLens because we saw the gap — brands are invisible to AI engines and nobody had a fast, cheap tool to fix it. Based on real GEO research from Princeton and Georgia Tech." },
  { q: "How does x402 payment work?", a: "Send a request, get a 402 response with a USDC payment address on Base. Your agent pays, retries with the tx hash, gets the data. No API keys, no accounts." },
  { q: "What are example use cases?", a: "A SaaS startup checking if ChatGPT recommends them for their category. A marketing agency auditing client visibility across AI engines. An e-commerce brand discovering competitors get recommended while they don't. An AI agent verifying brand data before making recommendations to users." },
  { q: "How accurate are the audits?", a: "XanLens queries live AI engines in real-time — no cached or simulated data. Audits test across all 8 engines with category, discovery, and competitor queries. Discovery queries are weighted higher than branded ones to prevent inflated scores." },
  { q: "Can humans use this too?", a: "Yes. Sign in on the dashboard to run an audit. Agents pay per query via x402 or USDC. Humans can use a coupon or pay $0.99." },
  { q: "Works with Virtuals Protocol?", a: "Yes. Compatible with Agent Commerce Protocol (ACP). On-chain escrow, verifiable transactions, x402 settlement." },
];

function FAQItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-b border-[#1a1a1a]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left hover:text-white transition-colors group"
      >
        <h3 className="text-[14px] font-medium tracking-tight pr-4">{faq.q}</h3>
        <span className="text-[18px] text-[#555] group-hover:text-white transition-colors shrink-0">
          {open ? "−" : "+"}
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "300px" : "0", opacity: open ? 1 : 0 }}
      >
        <p className="text-[13px] text-[#888] leading-relaxed pb-5">{faq.a}</p>
      </div>
    </div>
  );
}

export function FAQ() {
  return (
    <section className="py-28 px-6 border-t border-[#1a1a1a]">
      <div className="max-w-[800px] mx-auto">
        <motion.div className="mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
          <p className="text-[12px] text-[#555] tracking-[0.2em] uppercase mb-5 font-mono">[ FAQ ]</p>
          <h2 className="heading-lg">Questions</h2>
        </motion.div>
        {FAQS.map((faq) => (
          <FAQItem key={faq.q} faq={faq} />
        ))}
      </div>
    </section>
  );
}
