export const dynamic = "force-static";
"use client";

import { motion } from "framer-motion";
import BreadcrumbSchema from "../components/BreadcrumbSchema";

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const grades = [
  { grade: "A", range: "80–100", meaning: "Strong AI visibility. Consistently mentioned and recommended across query types." },
  { grade: "B", range: "60–79", meaning: "Good visibility with gaps. Known to AI but missing from some query categories." },
  { grade: "C", range: "40–59", meaning: "Moderate. AI has some awareness but rarely recommends. Competitors dominate." },
  { grade: "D", range: "20–39", meaning: "Weak. Limited or outdated knowledge. Mentioned only in direct queries, if at all." },
  { grade: "F", range: "0–19", meaning: "Invisible. AI engines don't know the brand or actively recommend competitors instead." },
];

export default function Methodology() {
  return (
    <>
    <BreadcrumbSchema name="Methodology" path="/methodology" />
    <div className="pt-48 pb-28 px-6">
      <div className="max-w-[800px] mx-auto">
        <motion.div className="text-center mb-16" initial="hidden" animate="visible" variants={fade}>
          <p className="text-[12px] text-[#555] tracking-[0.2em] uppercase mb-5 font-mono">[ Methodology ]</p>
          <h1 className="heading-xl mb-4">How XanLens works</h1>
          <p className="body-lg max-w-[560px] mx-auto">
            GEO is probabilistic, not deterministic. Ask AI the same question 10 times, get 10 different answers. We measure how AI engines see your brand — not how Google ranks your website. Different problem, different methodology.
          </p>
        </motion.div>

        {/* What we measure */}
        <motion.section className="mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
          <h2 className="heading-lg mb-3">What we measure</h2>
          <p className="body-sm mb-8">
            When someone asks Gemini, Grok, ChatGPT, or any AI engine for a recommendation in your space, does your brand come up? That&apos;s what we test.
          </p>
          <div className="space-y-3">
            <div className="card p-5">
              <h3 className="text-[15px] font-medium mb-2">Brand recognition</h3>
              <p className="text-[13px] text-[#999]">Does the AI know your brand exists? Can it describe what you do accurately, or does it hallucinate features you don&apos;t have?</p>
            </div>
            <div className="card p-5">
              <h3 className="text-[15px] font-medium mb-2">Category visibility</h3>
              <p className="text-[13px] text-[#999]">When users ask for &quot;the best tools&quot; in your industry, does your brand make the list? Or do only your competitors show up?</p>
            </div>
            <div className="card p-5">
              <h3 className="text-[15px] font-medium mb-2">Recommendation strength</h3>
              <p className="text-[13px] text-[#999]">Being mentioned is one thing. Being recommended with positive sentiment and accurate details is another. We measure both.</p>
            </div>
            <div className="card p-5">
              <h3 className="text-[15px] font-medium mb-2">Competitive positioning</h3>
              <p className="text-[13px] text-[#999]">How does your brand stack up against competitors in AI responses? Who gets mentioned first? Who gets recommended more often?</p>
            </div>
          </div>
        </motion.section>

        {/* How we score */}
        <motion.section className="mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
          <h2 className="heading-lg mb-3">How we score</h2>
          <p className="body-sm mb-8">
            The GEO score (0–100) reflects your real visibility across AI engines using our proprietary multi-factor scoring algorithm. We combine brand knowledge, discoverability, and citation analysis across multiple query types.
          </p>
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="text-[15px] font-medium mb-2">Multi-engine validation</h3>
              <p className="text-[13px] text-[#999]">
                Each audit queries multiple AI engines with ~132 prompts across different intent types. Our LLM judge (Gemini) validates every response for accuracy, relevance, and recommendation strength to build a complete visibility picture.
              </p>
            </div>
            <div className="card p-5">
              <h3 className="text-[15px] font-medium mb-2">Knowledge + discoverability + citations</h3>
              <p className="text-[13px] text-[#999]">
                The scoring algorithm combines how well AI engines know your brand, how often they recommend it in discovery scenarios, and the quality of sources they cite. All three components contribute to your overall score.
              </p>
            </div>
            <div className="card p-5">
              <h3 className="text-[15px] font-medium mb-2">Accuracy validation</h3>
              <p className="text-[13px] text-[#999]">
                Our LLM judge detects hallucinations and factual errors in AI responses about your brand. Incorrect information is penalized in the scoring to ensure authentic visibility measurement.
              </p>
            </div>
            <div className="card p-5">
              <h3 className="text-[15px] font-medium mb-2">Trend tracking</h3>
              <p className="text-[13px] text-[#999]">
                Consistent scoring methodology enables reliable tracking of visibility changes over time. Monitor improvements after implementing GEO optimizations with confidence.
              </p>
            </div>
          </div>
        </motion.section>

        {/* GEO vs SEO */}
        <motion.section className="mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
          <h2 className="heading-lg mb-3">GEO score vs Web Presence</h2>
          <p className="body-sm mb-4">
            We separate AI visibility from web visibility because they measure different things. A brand can rank #1 on Google and still be invisible to ChatGPT.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="card p-5">
              <h3 className="text-[15px] font-medium mb-2 text-cyan-400">GEO Score</h3>
              <p className="text-[13px] text-[#999]">How AI engines respond when asked about your brand or category. Direct measurement of AI visibility.</p>
            </div>
            <div className="card p-5">
              <h3 className="text-[15px] font-medium mb-2">Web Presence</h3>
              <p className="text-[13px] text-[#999]">How discoverable your brand is on the traditional web — the source material AI engines learn from and cite.</p>
            </div>
          </div>
        </motion.section>

        {/* Grade Scale */}
        <motion.section className="mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
          <h2 className="heading-lg mb-3">Grade scale</h2>
          <p className="body-sm mb-8">
            Most brands score below 40. That is not a bug — it is the current state of AI visibility. Most businesses have not optimized for how AI engines discover and recommend products.
          </p>
          <div className="space-y-2">
            {grades.map((g) => (
              <div key={g.grade} className="card p-4 flex items-start gap-4">
                <span className="text-[1.5rem] font-medium w-8 shrink-0 text-center">{g.grade}</span>
                <div>
                  <span className="text-[13px] font-mono text-cyan-400">{g.range}</span>
                  <p className="text-[13px] text-[#999] mt-1">{g.meaning}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Engines */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
          <h2 className="heading-lg mb-3">AI engines</h2>
          <p className="body-sm mb-6">
            Each AI engine processes information differently. What Gemini knows, ChatGPT might not. Multi-engine coverage gives you the full picture.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { name: "Gemini", status: "Live" },
              { name: "Grok", status: "Live" },
              { name: "DeepSeek", status: "Live" },
              { name: "ChatGPT", status: "Coming Soon" },
              { name: "Claude", status: "Coming Soon" },
              { name: "Mistral", status: "Live" },
              { name: "Perplexity", status: "Coming Soon" },
              { name: "Meta AI", status: "Coming Soon" },
            ].map((engine) => (
              <div key={engine.name} className={`card p-4 text-center ${engine.status !== "Live" ? "opacity-50" : ""}`}>
                <p className="text-[14px] font-medium">{engine.name}</p>
                <p className={`text-[11px] mt-1 ${engine.status === "Live" ? "text-cyan-400" : "text-[#666]"}`}>{engine.status}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
    </>
  );
}
