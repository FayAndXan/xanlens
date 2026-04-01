export const dynamic = "force-static";
"use client";

import { motion } from "framer-motion";

const fade = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const assets = [
  { name: "Logo Icon (SVG)", file: "/brand/logo.svg", desc: "Vector logo mark" },
  { name: "Logo + Text (SVG)", file: "/brand/logo-text.svg", desc: "Vector logo with wordmark" },
  { name: "Logo Icon — Dark", file: "/brand/logo-icon-black.png", desc: "400×400 PNG on black" },
  { name: "Logo Icon — Light", file: "/brand/logo-icon-white.png", desc: "400×400 PNG on white" },
  { name: "Logo + Text — Dark", file: "/brand/logo-text-black.png", desc: "800×200 PNG on black" },
  { name: "Logo + Text — Light", file: "/brand/logo-text-white.png", desc: "800×200 PNG on white" },
  { name: "X Profile Picture", file: "/brand/x-profile-pic.png", desc: "400×400 circle-crop ready" },
  { name: "X Banner", file: "/brand/x-banner-1500x500.png", desc: "1500×500 Twitter/X header" },
  { name: "OG Image", file: "/brand/og-image.png", desc: "1200×630 social sharing" },
];

export default function BrandPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-[900px] mx-auto px-6 py-24">
        <motion.div initial="hidden" animate="visible" variants={fade}>
          <h1 className="text-[36px] md:text-[48px] font-bold tracking-tight mb-4">Brand Kit</h1>
          <p className="text-[#888] text-[16px] mb-16 max-w-[500px]">
            Logos, assets, and guidelines for press, partners, and integrations.
          </p>
        </motion.div>

        {/* Colors */}
        <motion.section className="mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
          <h2 className="text-[20px] font-semibold mb-6">Colors</h2>
          <div className="flex gap-4 flex-wrap">
            {[
              { name: "Black", hex: "#000000", bg: "bg-black border border-[#333]", text: "text-white" },
              { name: "White", hex: "#FFFFFF", bg: "bg-white", text: "text-black" },
              { name: "Gray", hex: "#888888", bg: "bg-[#888]", text: "text-black" },
            ].map(c => (
              <div key={c.hex} className="flex flex-col items-center gap-2">
                <div className={`w-16 h-16 rounded-lg ${c.bg}`} />
                <span className="text-[12px] text-[#888]">{c.name}</span>
                <span className="text-[11px] text-[#555] font-mono">{c.hex}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Typography */}
        <motion.section className="mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
          <h2 className="text-[20px] font-semibold mb-6">Typography</h2>
          <p className="text-[14px] text-[#888] mb-2">Font: <span className="text-white font-medium">Inter</span></p>
          <p className="text-[14px] text-[#888] mb-2">Headings: <span className="text-white font-bold">700 Bold</span></p>
          <p className="text-[14px] text-[#888]">Body: <span className="text-white font-normal">400 Regular</span></p>
        </motion.section>

        {/* Assets */}
        <motion.section className="mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
          <h2 className="text-[20px] font-semibold mb-6">Download Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assets.map(a => (
              <a
                key={a.file}
                href={a.file}
                download
                className="flex items-center gap-4 p-4 rounded-lg border border-[#1a1a1a] hover:border-[#333] transition-colors group"
              >
                <div className="w-12 h-12 rounded-md bg-[#111] border border-[#222] flex items-center justify-center overflow-hidden">
                  <img src={a.file} alt={a.name} className="w-8 h-8 object-contain" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-medium group-hover:text-white transition-colors">{a.name}</p>
                  <p className="text-[12px] text-[#666]">{a.desc}</p>
                </div>
                <svg className="w-4 h-4 text-[#555] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
                </svg>
              </a>
            ))}
          </div>
        </motion.section>

        {/* Guidelines */}
        <motion.section className="mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
          <h2 className="text-[20px] font-semibold mb-6">Guidelines</h2>
          <div className="space-y-3 text-[14px] text-[#888]">
            <p>Do not modify the logo proportions or colors.</p>
            <p>Maintain clear space around the logo equal to the height of the center dot.</p>
            <p>Use the dark variant on light backgrounds and vice versa.</p>
            <p>Do not add gradients, shadows, or effects to the logo.</p>
            <p>Black and white only. No color variants.</p>
          </div>
        </motion.section>

        {/* Back */}
        <a href="/" className="text-[13px] text-[#555] hover:text-white transition-colors">← Back to XanLens</a>
      </div>
    </div>
  );
}
