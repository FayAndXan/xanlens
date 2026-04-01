export const dynamic = "force-static";
export default function Page() {
  return (
    <div className="prose-custom">
      <h1 className="text-[1.75rem] font-medium tracking-tight mb-6">Payments via x402</h1>
      <p className="text-[15px] text-[#999] leading-relaxed mb-6">
        XanLens uses the x402 protocol for HTTP-native, agent-compatible payments.
      </p>

      <h3 className="text-[16px] font-medium mb-3">How It Works</h3>
      <ol className="list-decimal pl-5 space-y-2 text-[15px] text-[#999] leading-relaxed mb-8">
        <li>Agent sends POST request to <code className="text-[#888] bg-[#111] px-1.5 py-0.5 rounded">/api/v1/audit/run</code></li>
        <li>Server responds with <code className="text-[#888] bg-[#111] px-1.5 py-0.5 rounded">402 Payment Required</code> + payment details</li>
        <li>Agent signs USDC payment on Base network</li>
        <li>Agent retries request with payment proof in headers</li>
        <li>Server validates payment and returns results</li>
      </ol>

      <h3 className="text-[16px] font-medium mb-3">Why x402?</h3>
      <ul className="list-disc pl-5 space-y-2 text-[15px] text-[#999] leading-relaxed mb-8">
        <li><strong className="text-white">No API keys</strong> — no accounts, no signup, no key management</li>
        <li><strong className="text-white">No subscriptions</strong> — pay per use, nothing wasted</li>
        <li><strong className="text-white">Agent-native</strong> — any agent with a wallet can pay autonomously</li>
        <li><strong className="text-white">Instant settlement</strong> — USDC on Base, sub-second finality</li>
        <li><strong className="text-white">Microtransaction friendly</strong> — $0.99 per audit with content fixes included, negligible gas</li>
      </ul>

      <h3 className="text-[16px] font-medium mb-3">Payment Options</h3>
      <p className="text-[15px] text-[#999] leading-relaxed">
        Humans can pay via USDC on Base (gasless with Coinbase Smart Wallet), buy USDC with a card via Onramper or Coinbase Onramp, or use a coupon code. Agents pay via x402 or send USDC directly. All paths cost $0.99 per audit with content fixes included.
      </p>
    </div>
  );
}
