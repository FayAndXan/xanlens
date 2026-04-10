"use client";

import React from "react";
import { motion } from "framer-motion";
import { fade } from "./shared";

export default function FixIt() {
  return (
    <section id="fix" className="py-24 px-6 border-t border-[#1a1a1a]">
      <div className="max-w-[1200px] mx-auto">
        <motion.div className="text-center mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
          <h2 className="heading-lg mb-3">AI Visibility Audit</h2>
          <p className="body-sm max-w-[560px] mx-auto">
            Comprehensive audit across 8 AI engines — measure how visible your brand is in ChatGPT, Gemini, Perplexity, DeepSeek, Grok, and more.
          </p>
          <a href="/dashboard" className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black text-[14px] font-semibold hover:bg-white/90 transition-colors">
            Audit your brand →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
