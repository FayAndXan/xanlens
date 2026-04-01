import { notFound } from "next/navigation";
import { redisGet } from "@/app/lib/redis";
import FixesClient from "./FixesClient";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ jobId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { jobId } = await params;
  const metaRaw = await redisGet(`audit:${jobId}:meta`);
  if (!metaRaw) return { title: "Fixes Not Found" };
  const meta = JSON.parse(metaRaw);
  return {
    title: `Suggested Fixes — ${meta.brand || "GEO Audit"} | XanLens`,
    description: `GEO optimization fixes for ${meta.brand || "your brand"} based on AI visibility audit.`,
  };
}

export default async function FixesPage({ params }: PageProps) {
  const { jobId } = await params;

  const metaRaw = await redisGet(`audit:${jobId}:meta`);
  if (!metaRaw) notFound();
  const meta = JSON.parse(metaRaw);

  const fixesRaw = await redisGet(`audit:${jobId}:fixes`);
  const fixes = fixesRaw ? JSON.parse(fixesRaw) : [];

  return <FixesClient fixes={fixes} brand={meta.brand} jobId={jobId} />;
}
