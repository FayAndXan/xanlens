export const dynamic = "force-static";
import { Metadata } from "next";
import fs from "fs";
import path from "path";
import AuditsListClient from "./AuditsListClient";

export const metadata: Metadata = {
  title: "AI Visibility Audits — XanLens",
  description: "Browse GEO audit results for 100+ AI tools. See how brands score for AI visibility across Gemini, Grok, DeepSeek, ChatGPT, Claude, and more.",
  openGraph: {
    title: "AI Visibility Audits — XanLens",
    description: "Browse GEO audit results for 100+ AI tools and brands.",
    url: "https://xanlens.com/audits",
    siteName: "XanLens",
    type: "website",
  },
};

interface ManifestEntry {
  slug: string;
  brand: string;
  industry: string;
  website: string | null;
  overall_score: number;
  grade: string;
  timestamp: string;
}

function loadManifest(): ManifestEntry[] {
  const manifestPath = path.join(process.cwd(), "public", "data", "audits", "index.json");
  if (!fs.existsSync(manifestPath)) return [];
  const data = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  return data.audits || [];
}

export default function AuditsPage() {
  const audits = loadManifest();
  const industries = [...new Set(audits.map((a) => a.industry))].sort();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Visibility Audits",
    description: "GEO audit results for AI tools and brands.",
    url: "https://xanlens.com/audits",
    publisher: { "@type": "Organization", name: "XanLens", url: "https://xanlens.com" },
    numberOfItems: audits.length,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="pt-20 pb-24 px-4 sm:px-6">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-[2rem] sm:text-[2.5rem] font-semibold tracking-tight mb-3">AI Visibility Audits</h1>
            <p className="text-[15px] text-[#999] max-w-[500px] mx-auto">
              {audits.length} brands audited across AI engines. Search, filter, and explore GEO scores.
            </p>
          </div>
          <AuditsListClient audits={audits} industries={industries} />
        </div>
      </div>
    </>
  );
}
