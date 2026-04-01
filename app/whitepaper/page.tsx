export const dynamic = "force-static";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Whitepaper — XanLens",
  description: "XanLens whitepaper: AI visibility auditing and content generation for the generative search era.",
};

const docs = [
  { title: "Why XanLens Exists", href: "/whitepaper/why" },
  { title: "What XanLens Does", href: "/whitepaper/what" },
  { title: "How It Works", href: "/whitepaper/how" },
  { title: "Audit Engine", href: "/whitepaper/audit-engine" },
  { title: "Content Generation", href: "/whitepaper/content-generation" },
  { title: "Scoring Methodology", href: "/whitepaper/scoring" },
  { title: "Service Tiers", href: "/whitepaper/tiers" },
  { title: "Payments via x402", href: "/whitepaper/payments" },
  { title: "Built for Humans & Agents", href: "/whitepaper/humans-and-agents" },
  { title: "Architecture", href: "/whitepaper/architecture" },
  { title: "Roadmap", href: "/whitepaper/roadmap" },
  { title: "Get Started", href: "/whitepaper/get-started" },
];

export default function WhitepaperHome() {
  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://xanlens.com/" },
            { "@type": "ListItem", position: 2, name: "Whitepaper", item: "https://xanlens.com/whitepaper" },
          ],
        }),
      }}
    />
    <div>
      <h1 className="text-[2rem] font-medium tracking-tight mb-4">XanLens</h1>
      <p className="text-[17px] font-medium text-white mb-3">
        Make your brand visible to AI engines.
      </p>
      <p className="text-[15px] text-[#999] leading-relaxed mb-4">
        AI visibility auditing and content generation that measures your brand across Gemini, Grok, DeepSeek, and more — then generates the content to fix it. In seconds.
      </p>
      <Link href="https://xanlens.com" className="text-[14px] text-white underline underline-offset-4 hover:opacity-80">
        Start Scanning →
      </Link>

      <hr className="border-[#191919] my-10" />

      <h2 className="text-[1.25rem] font-medium mb-6">Docs</h2>
      <ul className="space-y-2">
        {docs.map((d) => (
          <li key={d.href}>
            <Link href={d.href} className="text-[14px] text-blue-400 hover:text-blue-300 transition-colors">
              {d.title}
            </Link>
          </li>
        ))}
      </ul>

      <hr className="border-[#191919] my-10" />

      <h2 className="text-[1.25rem] font-medium mb-6">Whitepaper</h2>
      <p className="text-[14px] text-[#999] mb-3">
        Full technical whitepaper covering the GEO problem, XanLens architecture, scoring methodology, and roadmap.
      </p>
      <p className="text-[12px] text-[#444]">v1.0 · February 2026</p>
    </div>
    </>
  );
}
