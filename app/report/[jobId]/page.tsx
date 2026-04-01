import { Metadata } from "next";
import { notFound } from "next/navigation";
import ReportClient from "./ReportClient";

/* ─── Fetch audit result via internal API (avoids 1.2MB+ KV reads) ─── */
async function getAuditResult(jobId: string) {
  try {
    // Use the status API which computes/caches results efficiently
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || "https://xanlens.com";
    const res = await fetch(`${baseUrl}/api/v1/audit/status?jobId=${jobId}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status === "complete" || data.status === "processing") return data;
    return null;
  } catch {
    return null;
  }
}

/* ─── Dynamic OG metadata ─── */
type PageProps = { params: Promise<{ jobId: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { jobId } = await params;
  const result = await getAuditResult(jobId);
  if (!result) return { title: "Report Not Found — XanLens" };

  const brand = result.brand || "Unknown Brand";
  const score = result.overall_score ?? result.score ?? 0;
  const grade = result.grade || "?";

  return {
    title: `${brand} — ${score}/100 (${grade}) | XanLens GEO Audit`,
    description: `${brand} scored ${score}/100 (Grade ${grade}) on AI visibility. See how ChatGPT, Gemini, Perplexity and other AI engines reference this brand.`,
    openGraph: {
      title: `${brand} — AI Visibility Score: ${score}/100 (${grade})`,
      description: `GEO audit by XanLens. ${brand} scored ${score}/100 on AI search visibility across 4+ engines.`,
      siteName: "XanLens",
      url: `https://xanlens.com/report/${jobId}`,
      type: "website",
      images: [`https://xanlens.com/api/v1/report/card?jobId=${jobId}`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${brand} — ${score}/100 (${grade}) | XanLens`,
      description: `AI visibility audit: ${brand} scored ${score}/100. How visible is YOUR brand to AI?`,
      creator: "@xanlens_",
    },
  };
}

/* ─── Page — redirect to dashboard, keep OG metadata for crawlers ─── */
export default async function ReportPage({ params }: PageProps) {
  const { jobId } = await params;
  const result = await getAuditResult(jobId);
  if (!result) notFound();

  // Redirect humans to dashboard — crawlers already got the metadata above
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <meta httpEquiv="refresh" content={`0;url=/dashboard?jobId=${jobId}`} />
      <p className="text-[#666] text-sm">Redirecting to dashboard...</p>
      <a href={`/dashboard?jobId=${jobId}`} className="text-white underline ml-2 text-sm">Click here</a>
    </div>
  );
}
