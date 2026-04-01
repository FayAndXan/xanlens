export const dynamic = "force-static";
"use client";

import { motion } from "framer-motion";

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-44 pb-24">
      <div className="max-w-[720px] mx-auto px-6">
        {/* Hero */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fade}
          className="mb-20"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#666] mb-4">About</p>
          <h1 className="text-[40px] md:text-[56px] font-semibold tracking-tight leading-[1.05] mb-6">
            Meet the team
          </h1>
          <p className="text-[17px] text-[#999] leading-relaxed max-w-[560px]">
            XanLens helps brands get seen by AI search engines. We build tools that audit, optimize,
            and monitor your visibility across Gemini, Grok, DeepSeek, and whatever comes next.
          </p>
        </motion.div>

        {/* The Story */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          variants={fade}
          className="mb-20"
        >
          <h2 className="text-[13px] uppercase tracking-[0.15em] text-[#666] mb-6">The Story</h2>
          <div className="space-y-5 text-[15px] text-[#ccc] leading-relaxed">
            <p>
              <strong className="text-white">Founded by Fay</strong>{" "}
              (<a href="https://x.com/fayandxan" className="text-white hover:text-[#999] transition-colors">@fayandxan</a>)
              — someone who spent 5 years building in blockchain and DeFi, and saw the same tectonic
              shift happening again: people stopped Googling and started asking AI.
            </p>
            <p>
              Built with <strong className="text-white">Xan</strong>, an AI partner running on OpenClaw —
              literally an AI building tools to help brands be visible to other AIs.
            </p>
            <p>
              The meta angle? We use our own tools to optimize our own visibility.
              If XanLens shows up when you ask an AI about GEO — that&apos;s the product working.
            </p>
          </div>
        </motion.div>

        {/* Scout */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={2}
          variants={fade}
          className="mb-20"
        >
          <h2 className="text-[13px] uppercase tracking-[0.15em] text-[#666] mb-6">Scout</h2>
          <div className="flex justify-center mb-8">
            <img
              src="/mascot.svg"
              alt="Scout — the XanLens mascot"
              width={200}
              height={200}
              className="w-[200px]"
            />
          </div>
          <p className="text-[15px] text-[#ccc] leading-relaxed text-center max-w-[480px] mx-auto">
            This is Scout. Our one-eyed visibility bot.
            Scout scans AI engines so you don&apos;t have to.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={3}
          variants={fade}
          className="mb-20"
        >
          <h2 className="text-[13px] uppercase tracking-[0.15em] text-[#666] mb-6">Mission</h2>
          <blockquote className="text-[24px] md:text-[32px] font-semibold tracking-tight leading-[1.2] mb-6">
            &ldquo;Every brand deserves to be seen — even by AI.&rdquo;
          </blockquote>
          <p className="text-[15px] text-[#ccc] leading-relaxed">
            We believe the future of search is conversational. GEO is the new SEO.
            The brands that show up in AI answers today will own their categories tomorrow.
          </p>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={4}
          variants={fade}
        >
          <h2 className="text-[13px] uppercase tracking-[0.15em] text-[#666] mb-6">Get in Touch</h2>
          <div className="space-y-3 text-[15px] text-[#ccc]">
            <p>
              X:{" "}
              <a href="https://x.com/fayandxan" className="text-white hover:text-[#999] transition-colors">
                @fayandxan
              </a>
            </p>
            <p>
              Web:{" "}
              <a href="https://xanlens.com" className="text-white hover:text-[#999] transition-colors">
                xanlens.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
