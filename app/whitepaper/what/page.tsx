export const dynamic = "force-static";
export default function Page() {
  return (
    <div className="prose-custom">
      <h1 className="text-[1.75rem] font-medium tracking-tight mb-6">What XanLens Does</h1>
      <p className="text-[15px] text-[#999] leading-relaxed mb-4">
        XanLens is an AI visibility auditing and content generation platform. It answers two questions:
      </p>
      <ol className="list-decimal pl-5 space-y-3 text-[15px] text-[#999] leading-relaxed mb-6">
        <li><strong className="text-white">Are AI engines recommending your brand?</strong> — We query multiple AI engines with real user prompts and analyze whether, how, and in what context your brand appears.</li>
        <li><strong className="text-white">What can you do about it?</strong> — We generate ready-to-publish content specifically designed to increase your visibility in AI-generated responses.</li>
      </ol>
      <p className="text-[15px] text-[#999] leading-relaxed mb-6">
        Content types include: blog posts, FAQ pages with JSON-LD schema, organization and product schema markup, social posts for 20+ platforms, about page copy, llms.txt, and robots.txt AI crawler audits.
      </p>
      <p className="text-[15px] text-[#999] leading-relaxed">
        XanLens is designed for both humans (via website UI) and autonomous AI agents (via REST API, MCP server, and OpenClaw skill).
      </p>
    </div>
  );
}
