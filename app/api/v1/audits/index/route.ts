import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const revalidate = 86400; // cache 24h

const KV_URL = process.env.KV_REST_API_URL || "";
const KV_TOKEN = process.env.KV_REST_API_TOKEN || "";

async function kvGet(key: string) {
  const res = await fetch(`${KV_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.result ? JSON.parse(data.result) : null;
}

async function kvKeys(pattern: string): Promise<string[]> {
  const res = await fetch(`${KV_URL}/keys/${pattern}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.result || [];
}

export async function GET(req: NextRequest) {
  try {
    // Only show published audits
    const publishedRes = await fetch(`${KV_URL}/smembers/geo-index:published`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
    });
    const publishedData = publishedRes.ok ? await publishedRes.json() : { result: [] };
    const publishedIds: string[] = publishedData.result || [];

    if (!publishedIds.length) {
      return NextResponse.json({ audits: [], total: 0 });
    }

    const keys = publishedIds.map(id => `audit:result:${id}`);

    // Fetch all results in parallel (batches of 20)
    const audits: any[] = [];
    for (let i = 0; i < keys.length; i += 20) {
      const batch = keys.slice(i, i + 20);
      const results = await Promise.all(
        batch.map(async (key) => {
          const jobId = key.replace("audit:result:", "");
          const data = await kvGet(key);
          if (!data || !data.brand || !data.overall_score) return null;
          return {
            jobId,
            brand: data.brand,
            industry: data.industry || "Unknown",
            website: data.website || null,
            overall_score: data.overall_score ?? 0,
            knowledge_score: data.knowledge_score ?? 0,
            discoverability_score: data.discoverability_score ?? 0,
            citation_score: data.citation_score ?? 0,
            grade: data.grade || "?",
            engines: Object.keys(data.engines || {}).length,
            prompts: data.total || data.done || 0,
            timestamp: data.timestamp || null,
            report_url: `/report/${jobId}`,
            card_url: `/api/v1/report/card?jobId=${jobId}`,
          };
        })
      );
      audits.push(...results.filter(Boolean));
    }

    // Sort by score descending
    audits.sort((a, b) => b.overall_score - a.overall_score);

    // Extract unique industries
    const industries = [...new Set(audits.map((a) => a.industry))].sort();

    // Industry leaderboards (top 5 per industry)
    const leaderboards: Record<string, any[]> = {};
    for (const ind of industries) {
      leaderboards[ind] = audits
        .filter((a) => a.industry === ind)
        .slice(0, 5);
    }

    return NextResponse.json({
      audits,
      total: audits.length,
      industries,
      leaderboards,
      updated: new Date().toISOString(),
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=172800",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
