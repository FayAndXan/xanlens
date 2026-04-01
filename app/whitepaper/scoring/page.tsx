export const dynamic = "force-static";
export default function Page() {
  const grades = [
    { range: "80–100", grade: "A", label: "Highly visible — AI engines actively recommend you" },
    { range: "60–79", grade: "B", label: "Visible — mentioned with some gaps" },
    { range: "40–59", grade: "C", label: "Partially visible — inconsistent mentions" },
    { range: "20–39", grade: "D", label: "Low visibility — rarely mentioned" },
    { range: "0–19", grade: "F", label: "Invisible — AI engines don't know you exist" },
  ];

  return (
    <div className="prose-custom">
      <h1 className="text-[1.75rem] font-medium tracking-tight mb-6">Scoring Methodology</h1>
      <p className="text-[15px] text-[#999] leading-relaxed mb-6">
        XanLens produces a GEO Score from 0 to 100, calculated per engine and aggregated into an overall score.
      </p>

      <h3 className="text-[16px] font-medium mb-4">Grade Scale</h3>
      <div className="space-y-2 mb-8">
        {grades.map((g) => (
          <div key={g.grade} className="flex items-center gap-4 p-3 rounded-lg bg-[#0c0c0c] border border-[#191919]">
            <span className="text-[13px] text-[#666] font-mono w-14">{g.range}</span>
            <span className="w-8 h-8 rounded-lg bg-[#111] border border-[#222] flex items-center justify-center font-medium text-white text-[14px]">{g.grade}</span>
            <span className="text-[13px] text-[#999]">{g.label}</span>
          </div>
        ))}
      </div>

      <h3 className="text-[16px] font-medium mb-3">Score Components</h3>
      <p className="text-[15px] text-[#999] leading-relaxed mb-4">
        The GEO Score is derived from a proprietary multi-factor algorithm that evaluates three core dimensions:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-[15px] text-[#999] leading-relaxed">
        <li><strong className="text-white">Knowledge</strong> — Does the AI engine know your brand? Can it accurately describe what you do?</li>
        <li><strong className="text-white">Discoverability</strong> — When users ask open-ended questions in your category, does your brand appear?</li>
        <li><strong className="text-white">Citations</strong> — Does the AI link to your site? Are the citations accurate and well-placed?</li>
      </ul>
      <p className="text-[15px] text-[#999] leading-relaxed mt-4">
        Each dimension is weighted based on its predictive value for real-world AI visibility. Multi-engine validation ensures consistency across different AI platforms. An LLM judge evaluates response accuracy and detects hallucinations.
      </p>
    </div>
  );
}
