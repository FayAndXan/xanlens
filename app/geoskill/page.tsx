export const dynamic = "force-static";
"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

const fade = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

function Icon({ paths }: { paths: string }) {
  const parts = paths.split("|");
  return (
    <div className="w-9 h-9 rounded-xl bg-[#111] border border-[#222] flex items-center justify-center shrink-0">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2596be" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {parts.map((p, i) => {
          if (p.startsWith("circle:")) { const [cx, cy, r] = p.slice(7).split(","); return <circle key={i} cx={cx} cy={cy} r={r} />; }
          if (p.startsWith("rect:")) { const [x, y, w, h, rx] = p.slice(5).split(","); return <rect key={i} x={x} y={y} width={w} height={h} rx={rx || "0"} />; }
          return <path key={i} d={p} />;
        })}
      </svg>
    </div>
  );
}

const SKILL_CONTENTS = [
  {
    tier: "Start Here",
    items: [
      { icon: "rect:8,2,8,4,1|M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2", label: "Prioritized Fix Queue", desc: "All fixes ranked by impact. Approve, reject, or suggest edits — right from your dashboard." },
    ],
  },
  {
    tier: "On-Page Rewrites — Highest Impact",
    items: [
      { icon: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7|M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z", label: "Title, Meta & Heading Rewrites", desc: "AI-optimized title tags, meta descriptions, H1/H2/H3 structure." },
      { icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z|M14 2v6h6", label: "Schema / JSON-LD Markup", desc: "Structured data that AI engines can parse and cite." },
      { icon: "rect:4,4,16,16,2|M9 9h.01|M15 9h.01|M9 15h6", label: "llms.txt Configuration", desc: "Machine-readable file that tells AI crawlers what your brand does." },
    ],
  },
  {
    tier: "Citation-Earning Content — +40% Visibility",
    items: [
      { icon: "M3 3v18h18|M7 16l4-8 4 4 6-6", label: "Statistics Injection (+40%)", desc: "Rewrites vague claims with real data points AI engines love to cite." },
      { icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", label: "Expert Quotes (+40%)", desc: "Quotable statements positioned for AI extraction." },
      { icon: "circle:12,12,10|M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3|M12 17h.01", label: "FAQ Headings + Full FAQ Page", desc: "Question-answer format matching how people query AI assistants." },
    ],
  },
  {
    tier: "Off-Page Presence — Multi-Platform",
    items: [
      { icon: "M12 20h9|M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z", label: "Blog Post", desc: "Long-form content optimized for AI citation." },
      { icon: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8|M16 6l-4-4-4 4|M12 2v13", label: "20+ Seed Citations", desc: "Social and platform posts to establish multi-source presence." },
      { icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", label: "About Page Copy", desc: "Entity-optimized brand description for AI comprehension." },
      { icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z", label: "Citation Strategy Map", desc: "Where to publish for maximum AI engine coverage." },
      { icon: "rect:2,2,20,20,2|M7 2v20|M17 2v20|M2 12h20", label: "RAG-Ready Chunks", desc: "Pre-formatted content blocks for retrieval-augmented generation." },
    ],
  },
  {
    tier: "Technical",
    items: [
      { icon: "circle:11,11,8|m21 21-4.3-4.3", label: "Robots & Crawler Audit", desc: "Verify AI bots can actually access your content." },
    ],
  },
];

export default function FixPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  return (
    <div className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-[800px] mx-auto">
        {/* Hero */}
        <motion.div className="text-center mb-16" initial="hidden" animate="visible" variants={fade}>
          <p className="text-[12px] text-[#555] tracking-[0.2em] uppercase mb-5 font-mono">[ Content Fixes ]</p>
          <h1 className="text-[2.5rem] md:text-[3.2rem] font-light tracking-tight leading-[1.1] mb-4">
            AI-generated fixes<br />tailored to your audit
          </h1>
          <p className="text-[15px] text-[#666] max-w-[520px] mx-auto mb-8">
            Run a Pro Audit. We analyze how AI engines see your brand. Then we generate content fixes based on your specific gaps — review, approve, or edit each one from your dashboard.
          </p>

          {/* FOMO Pricing */}
          <div className="inline-flex items-center gap-3 mb-8">
            <span className="text-[#555] line-through text-[1.2rem]">$4.95</span>
            <span className="text-[2rem] font-medium text-white">$0.99</span>
            <span className="text-[12px] text-[#999]">USDC</span>
            <span className="text-[11px] bg-[#2596be]/10 text-[#2596be] px-2.5 py-1 rounded-full font-medium">80% Launch Discount</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="btn-primary px-8"
            >
              {isConnected ? "Go to Dashboard →" : "Run Pro Audit →"}
            </button>
            <p className="text-[11px] text-[#444]">Included with every Pro Audit · No separate purchase</p>
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div className="mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
          <p className="text-[12px] text-[#555] tracking-[0.2em] uppercase mb-6 font-mono">[ How it works ]</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Run Pro Audit", desc: "We query Gemini, Grok, DeepSeek and more with ~132 real prompts about your brand and industry." },
              { step: "02", title: "Review Fixes", desc: "Based on your results, we generate content fixes. Approve, reject, or edit each one from your dashboard." },
              { step: "03", title: "Implement & Re-audit", desc: "Deploy the approved fixes. Re-audit to measure improvement and generate updated recommendations." },
            ].map((s) => (
              <div key={s.step} className="p-6 rounded-xl bg-[#0c0c0c] border border-[#191919]">
                <p className="text-[2rem] font-light text-[#222] mb-3">{s.step}</p>
                <p className="text-[14px] font-medium mb-1">{s.title}</p>
                <p className="text-[13px] text-[#666]">{s.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* What's included */}
        <motion.div className="mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
          <p className="text-[12px] text-[#555] tracking-[0.2em] uppercase mb-6 font-mono">[ What&apos;s included ]</p>
          <div className="space-y-8">
            {SKILL_CONTENTS.map((section) => (
              <div key={section.tier}>
                <p className="text-[11px] uppercase tracking-wider text-[#444] mb-4">{section.tier}</p>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl bg-[#0c0c0c] border border-[#191919]">
                      <Icon paths={item.icon} />
                      <div>
                        <p className="text-[14px] font-medium mb-0.5">{item.label}</p>
                        <p className="text-[13px] text-[#666]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Keep it updated */}
        <motion.div className="mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
          <p className="text-[12px] text-[#555] tracking-[0.2em] uppercase mb-6 font-mono">[ Keep it updated ]</p>
          <div className="p-6 rounded-xl bg-[#0c0c0c] border border-[#191919]">
            <p className="text-[15px] font-medium mb-2">Your AI visibility changes. Your fixes should too.</p>
            <p className="text-[13px] text-[#666] leading-relaxed">
              AI engines update their knowledge constantly. When your GEO score changes significantly,
              re-audit to get fresh content fixes based on your latest results. Each audit generates
              new recommendations tailored to your current gaps — content fixes are always included.
            </p>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div className="text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-[#555] line-through text-[1.2rem]">$4.95</span>
            <span className="text-[2rem] font-medium text-white">$0.99</span>
            <span className="text-[12px] text-[#999]">USDC</span>
            <span className="text-[11px] bg-[#2596be]/10 text-[#2596be] px-2.5 py-1 rounded-full font-medium">80% Launch Discount</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="btn-primary px-8"
            >
              {isConnected ? "Go to Dashboard →" : "Get Started →"}
            </button>
            <p className="text-[11px] text-[#444]">Pay with USDC on Base · No accounts · No subscriptions</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
