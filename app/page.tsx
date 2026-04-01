export const dynamic = "force-static";
"use client";

import { motion } from "framer-motion";
import { fade, AI_ENGINES } from "./components/shared";
import Hero from "./components/Hero";
// import FixIt from "./components/FixIt";
import { Pricing, FAQ, WhyAgents, UseCases, GEOIndex } from "./components/Sections";
import Waitlist from "./components/Waitlist";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is GEO?", acceptedAnswer: { "@type": "Answer", text: "Generative Engine Optimization (GEO) is the practice of optimizing content to be cited and recommended by AI search engines like ChatGPT, Gemini, Perplexity, Grok, DeepSeek, Claude, and Meta AI. Unlike SEO which targets Google rankings, GEO targets how AI engines describe and recommend your brand." } },
    { "@type": "Question", name: "What brands and industries can XanLens audit?", acceptedAnswer: { "@type": "Answer", text: "Any brand with a website. XanLens works across all industries — SaaS, e-commerce, finance, healthcare, local businesses, agencies." } },
    { "@type": "Question", name: "What does XanLens audit?", acceptedAnswer: { "@type": "Answer", text: "XanLens audits your brand's presence across 7 AI engines: Gemini, ChatGPT, Perplexity, Grok, DeepSeek, Claude, and Meta AI. It runs 100+ queries per audit covering branded searches, category discovery queries, and competitor comparison queries." } },
    { "@type": "Question", name: "How does the API work?", acceptedAnswer: { "@type": "Answer", text: "REST API at xanlens.com/api/v1. Your agent sends a URL, runs the full audit, and gets structured JSON with scores and content fixes. Supports MCP for agent-to-agent communication, and ships as an OpenClaw skill on ClawHub." } },
    { "@type": "Question", name: "What are the pricing tiers?", acceptedAnswer: { "@type": "Answer", text: "Pro Audit + Content Fixes ($0.99 USDC, 80% launch discount): All engines + competitor ranking + AI-generated content fixes with on-page rewrites, schema markup, seed citations, and more. Pay with USDC, card, or coupon." } },
    { "@type": "Question", name: "Who built XanLens?", acceptedAnswer: { "@type": "Answer", text: "Built by Fey (5+ years blockchain/DeFi) and Xan (AI agent partner). Based on GEO research from Princeton and Georgia Tech." } },
    { "@type": "Question", name: "How does x402 payment work?", acceptedAnswer: { "@type": "Answer", text: "Send a request, get a 402 response with a USDC payment address on Base. Your agent pays, retries with the tx hash, gets the data." } },
    { "@type": "Question", name: "What is a GEO score?", acceptedAnswer: { "@type": "Answer", text: "A GEO score is a 0-100 rating of how visible your brand is across AI search engines. XanLens calculates it from three components: Knowledge (how accurately AI engines describe your brand), Discoverability (whether AI recommends you in category queries), and Citation quality (whether AI cites real sources about you)." } },
    { "@type": "Question", name: "How is XanLens different from SEO tools?", acceptedAnswer: { "@type": "Answer", text: "XanLens measures AI engine visibility, not Google rankings. A brand can rank #1 on Google and score 0 in AI search — because AI engines use different signals: training data, entity clarity, structured content, and third-party citations rather than backlinks and keyword density." } },
    { "@type": "Question", name: "Can humans use this too?", acceptedAnswer: { "@type": "Answer", text: "Yes. Sign in on the dashboard, pay $0.99 or use a coupon. Agents pay per query via x402 or USDC." } },
  ],
};

function EngineLogos() {
  return (
    <section className="py-16 md:py-20 px-6 border-t border-[#1a1a1a]">
      <motion.div className="max-w-[1100px] mx-auto text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
        <p className="text-[11px] tracking-[0.3em] uppercase text-[#555] mb-10">Tested across 7 AI engines</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
          {AI_ENGINES.map((engine) => (
            <div key={engine.name} className="flex flex-col items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
              <img src={engine.logo} alt={engine.name} className="h-8 w-8 md:h-10 md:w-10" />
              <span className="text-[11px] text-[#666] tracking-wide">{engine.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Hero />
      <EngineLogos />
      <WhyAgents />
      <UseCases />
      {/* FixIt section removed — all CTAs go to /dashboard */}
      <Pricing />
      <FAQ />
      <GEOIndex />

      {/* Waitlist */}
      <section id="waitlist" className="py-16 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="heading-md mb-3">Stay in the loop.</h2>
          <p className="text-[15px] text-[#666] mb-8">Get notified when new features drop. No spam, just signal.</p>
          <Waitlist source="homepage" />
        </div>
      </section>
    </>
  );
}
