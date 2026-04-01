export const dynamic = "force-static";
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSwitchChain, useSendCalls, useCapabilities, useCallsStatus } from 'wagmi';
import { base } from 'wagmi/chains';
import ConnectModal from '@/app/components/ConnectModal';
import OnrampButton from '@/app/components/OnrampButton';
// PROP CHECKLIST: Every <AuditReport> must pass ALL these props from auditDetail/auditResult:
// result, tier, aio, technical, contentOptimizer, seoScore, websiteHealth, onReset
// If you add a new prop to AuditReport, grep this file and update ALL instances.
import AuditReport from '@/app/components/AuditReport';
import FixesClient from '@/app/report/[jobId]/fixes/FixesClient';
import { useAudit } from '@/app/hooks/useAudit';

interface AuditRecord {
  jobId: string;
  brand: string;
  industry: string;
  website?: string;
  tier: string;
  createdAt: number;
  status: string;
  score?: number;
}

interface UserData {
  wallet: string;
  email?: string;
  totalAudits: number;
  createdAt: number;
}

type View = 'overview' | 'new-audit' | 'audit-detail';

/* Score color: blue/orange/red — NO GREEN */
function scoreColor(score: number): string {
  if (score >= 70) return '#2596be';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const [user, setUser] = useState<UserData | null>(null);
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConnect, setShowConnect] = useState(false);
  const [view, setView] = useState<View>('overview');
  const [selectedAudit, setSelectedAudit] = useState<AuditRecord | null>(null);
  const [auditDetail, setAuditDetail] = useState<Record<string, unknown> | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const [activeTab, setActiveTab] = useState<'report' | 'content'>('report');
  const [fixes, setFixes] = useState<any[]>([]);
  const [fixesLoading, setFixesLoading] = useState(false);

  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [directJobId, setDirectJobId] = useState<string | null>(null);

  // Check for session token or jobId in URL or localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);

    // Direct jobId access — read-only view without auth (for coupon users / agents)
    const jid = params.get('jobId');
    if (jid) {
      setDirectJobId(jid);
    }

    const token = params.get('token');
    if (token) {
      localStorage.setItem('xanlens_session_token', token);
      setSessionToken(token);
      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      window.history.replaceState({}, '', url.toString());
    } else {
      const stored = localStorage.getItem('xanlens_session_token');
      if (stored) setSessionToken(stored);
    }
  }, []);

  const wallet = address || (typeof window !== 'undefined' ? localStorage.getItem('xanlens_wallet') : null);

  // USDC balance on Base
  const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const;
  const { data: usdcBalance } = useReadContract({
    address: USDC_ADDRESS,
    abi: [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] }] as const,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: { enabled: !!address },
  });
  const { data: ethBalance } = useBalance({ address: address, chainId: base.id });
  const usdcFormatted = usdcBalance ? (Number(usdcBalance) / 1e6).toFixed(2) : '0.00';
  const ethFormatted = ethBalance ? (Number(ethBalance.value) / 1e18).toFixed(4) : '0.0000';

  // New audit state
  const [url, setUrl] = useState('');
  const [currentAuditBrand, setCurrentAuditBrand] = useState('');
  const [trendBrand, setTrendBrand] = useState<string>('all');
  const { loading: auditLoading, result: auditResult, error: auditError, progress, runAudit, reset: resetAudit } = useAudit(true, wallet);

  useEffect(() => {
    if (address) localStorage.setItem('xanlens_wallet', address);
  }, [address]);

  const fetchData = useCallback(async () => {
    // Direct jobId access — load single audit without auth
    if (directJobId && !wallet && !sessionToken) {
      try {
        const res = await fetch(`/api/v1/audit/status?jobId=${directJobId}&source=pro`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'complete' || data.status === 'processing') {
            const record: AuditRecord = {
              jobId: directJobId,
              brand: data.brand || 'Unknown',
              industry: data.industry || '',
              website: data.website || '',
              tier: data.tier || 'pro',
              createdAt: Date.now(),
              status: data.status,
              score: data.overall_score,
            };
            setAudits([record]);
            setSelectedAudit(record);
            setAuditDetail(data);
            setView('audit-detail');
          }
        }
      } catch { /* */ } finally { setLoading(false); }
      return;
    }
    if (!wallet && !sessionToken) { setLoading(false); return; }
    try {
      const query = wallet ? `wallet=${wallet}` : `token=${sessionToken}`;
      const res = await fetch(`/api/v1/account?${query}`);
      if (res.status === 404 && wallet) {
        const createRes = await fetch('/api/v1/account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wallet }),
        });
        const data = await createRes.json();
        setUser(data.user);
        setAudits(data.audits || []);
        // Store session token if returned
        if (data.sessionToken) {
          localStorage.setItem('xanlens_session_token', data.sessionToken);
          setSessionToken(data.sessionToken);
        }
        return;
      }
      if (!res.ok) return;
      const data = await res.json();
      setUser(data.user);
      setAudits(data.audits || []);
      // Store session token if returned
      if (data.sessionToken) {
        localStorage.setItem('xanlens_session_token', data.sessionToken);
        setSessionToken(data.sessionToken);
      }
    } catch { /* */ } finally {
      setLoading(false);
    }
  }, [wallet, sessionToken, directJobId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Promo banner + nav hidden via LayoutChrome (pathname-aware)

  useEffect(() => {
    const stale = audits.filter(a => a.status === 'processing');
    if (stale.length === 0) return;
    stale.forEach(async (audit) => {
      try {
        const res = await fetch(`/api/v1/audit/status?jobId=${audit.jobId}&source=pro`);
        const data = await res.json().catch(() => null);
        if (data?.status === 'complete') fetchData();
      } catch { /* ignore */ }
    });
  }, [audits.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if ((auditResult || auditError) && !auditLoading) {
      fetchData();
    }
  }, [auditResult, auditError, auditLoading, fetchData]);

  const loadFixes = async (jobId: string) => {
    setFixesLoading(true);
    try {
      const res = await fetch(`/api/v1/audit/fixes?jobId=${jobId}`);
      const data = await res.json().catch(() => null);
      setFixes(data?.fixes || []);
    } catch { setFixes([]); } finally { setFixesLoading(false); }
  };

  const loadAuditDetail = async (audit: AuditRecord) => {
    setSelectedAudit(audit);
    setView('audit-detail');
    setActiveTab('report');
    setFixes([]);
    setDetailLoading(true);
    setAuditDetail(null);
    try {
      const res = await fetch(`/api/v1/audit/status?jobId=${audit.jobId}&source=pro`);
      const data = await res.json().catch(() => ({ error: `Status check failed (${res.status})` }));
      setAuditDetail(data);
      if (data?.status === 'complete' && audit.status === 'processing') {
        fetchData();
      }
    } catch { setAuditDetail({ error: 'Network error' }); } finally {
      setDetailLoading(false);
    }
  };

  const deleteAudit = async (audit: AuditRecord) => {
    setAudits(prev => prev.filter(a => a.jobId !== audit.jobId));
    if (selectedAudit?.jobId === audit.jobId) {
      setView('overview');
      setSelectedAudit(null);
      setAuditDetail(null);
    }
    if (wallet) {
      try {
        await fetch(`/api/v1/account/audit?wallet=${wallet}&jobId=${audit.jobId}`, { method: 'DELETE' });
      } catch { /* best effort */ }
    }
  };

  const startNewAudit = () => {
    if (auditLoading) { setView('new-audit'); return; }
    setView('new-audit');
    setUrl('');
    setCurrentAuditBrand('');
    resetAudit();
  };

  // ── Coupon gate state ──
  const [couponCode, setCouponCode] = useState('');
  const [couponValid, setCouponValid] = useState(false);
  const [couponChecking, setCouponChecking] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponApplied, setCouponApplied] = useState(''); // the validated code

  // ── USDC Purchase state ──
  const XANLENS_WALLET = '0xB33FF8b810670dFe8117E5936a1d5581A05f350D' as `0x${string}`;
  const USDC_ABI = [
    { name: 'transfer', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }] },
  ] as const;
  const { switchChainAsync } = useSwitchChain();

  // Gasless (EIP-5792 sendCalls + paymaster) for Smart Wallets
  const { data: capabilities } = useCapabilities();
  const paymasterSupported = !!capabilities?.[base.id]?.paymasterService?.supported;
  const { sendCalls, data: sendCallsId, isPending: isSendCallsPending, error: sendCallsError, reset: resetSendCalls } = useSendCalls();
  const { data: callsStatus } = useCallsStatus({
    id: sendCallsId?.id ?? '',
    query: { enabled: !!sendCallsId?.id, refetchInterval: (data) => data.state.data?.status === 'success' ? false : 1000 },
  });

  // Legacy (writeContract) fallback for wallets without EIP-5792
  const { writeContract, data: purchaseTxHash, isPending: isWritePending, error: writeError, reset: resetWrite } = useWriteContract();
  const { isLoading: isConfirmingLegacy, isSuccess: isConfirmedLegacy } = useWaitForTransactionReceipt({ hash: purchaseTxHash });

  const isPurchasing = isSendCallsPending || isWritePending;
  const purchaseError = sendCallsError || writeError;
  const resetPurchase = () => { resetSendCalls(); resetWrite(); };

  const [purchaseVerifying, setPurchaseVerifying] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchaseErrorMsg, setPurchaseErrorMsg] = useState('');
  // Encode ERC-20 transfer calldata
  const encodeTxData = () => {
    const transferSelector = '0xa9059cbb'; // transfer(address,uint256)
    const toAddr = XANLENS_WALLET.slice(2).padStart(64, '0');
    const amount = (990000).toString(16).padStart(64, '0'); // $0.99 USDC (6 decimals)
    return `${transferSelector}${toAddr}${amount}` as `0x${string}`;
  };

  const handlePurchase = async () => {
    if (!address) return;
    setPurchaseErrorMsg('');
    try {
      if (switchChainAsync) {
        await switchChainAsync({ chainId: base.id }).catch(() => {});
      }
    } catch { /* ignore switch errors */ }

    try {
      if (paymasterSupported) {
        // Gasless via EIP-5792 sendCalls + paymaster
        sendCalls({
          calls: [{ to: USDC_ADDRESS, data: encodeTxData() }],
          capabilities: {
            paymasterService: { url: `${window.location.origin}/api/v1/paymaster` },
          },
        });
      } else {
        // Legacy writeContract (user pays gas)
        writeContract({
          address: USDC_ADDRESS,
          abi: USDC_ABI,
          functionName: 'transfer',
          args: [XANLENS_WALLET, BigInt(990000)],
          chainId: base.id,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transaction failed';
      setPurchaseErrorMsg(msg.includes('rejected') ? 'Transaction rejected' : msg);
    }
  };

  // Resolve tx hash from either path
  const resolvedTxHash: `0x${string}` | undefined =
    purchaseTxHash || // legacy path
    (callsStatus?.status === 'success' ? callsStatus?.receipts?.[0]?.transactionHash as `0x${string}` | undefined : undefined);
  const isConfirmed = isConfirmedLegacy || callsStatus?.status === 'success';
  const isConfirming = isConfirmingLegacy || (!!sendCallsId?.id && callsStatus?.status !== 'success');

  // After tx confirms (either path), verify on server and get coupon
  useEffect(() => {
    if (!isConfirmed || !resolvedTxHash || purchaseVerifying || purchaseSuccess) return;
    setPurchaseVerifying(true);
    (async () => {
      await new Promise(r => setTimeout(r, 4000));
      try {
        const res = await fetch('/api/v1/coupons/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ txHash: resolvedTxHash, wallet: address }),
        });
        const data = await res.json();
        if (data.ok && data.code) {
          setCouponCode(data.code);
          setCouponApplied(data.code);
          setCouponValid(true);
          setPurchaseSuccess(true);
        } else {
          setPurchaseErrorMsg(data.error || 'Verification failed');
        }
      } catch {
        setPurchaseErrorMsg('Failed to verify payment. Contact support.');
      } finally {
        setPurchaseVerifying(false);
      }
    })();
  }, [isConfirmed, resolvedTxHash]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleValidateCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setCouponChecking(true);
    setCouponError('');
    try {
      const res = await fetch(`/api/v1/coupons/validate?code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (data.valid) {
        setCouponValid(true);
        setCouponApplied(code);
        setCouponError('');
      } else {
        setCouponValid(false);
        setCouponApplied('');
        setCouponError(data.reason || 'Invalid coupon code');
      }
    } catch {
      setCouponError('Failed to validate coupon. Try again.');
    } finally {
      setCouponChecking(false);
    }
  };

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponValid || !url.trim()) return;
    try {
      const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, '');
      setCurrentAuditBrand(hostname.split('.')[0]);
    } catch { setCurrentAuditBrand(url.trim()); }
    // Mark coupon as used
    if (couponApplied) {
      fetch('/api/v1/coupons/use', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponApplied }),
      }).catch(() => {}); // fire and forget
    }
    runAudit(url);
  };

  // Job ID lookup state
  const [jobIdInput, setJobIdInput] = useState('');
  const [jobIdError, setJobIdError] = useState('');
  const [jobIdLoading, setJobIdLoading] = useState(false);

  const handleJobIdLookup = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const id = jobIdInput.trim();
    if (!id) return;
    setJobIdError('');
    setJobIdLoading(true);
    try {
      // Try as dashboard token first (gives full history)
      const tokenRes = await fetch(`/api/v1/account?token=${id}`);
      if (tokenRes.ok) {
        const tokenData = await tokenRes.json().catch(() => null);
        if (tokenData?.user) {
          // Valid dashboard token — store and load full dashboard
          localStorage.setItem('xanlens_session_token', id);
          setSessionToken(id);
          setUser(tokenData.user);
          setAudits(tokenData.audits || []);
          setView('overview');
          return;
        }
      }

      // Fall back to single audit ID lookup
      const res = await fetch(`/api/v1/audit/status?jobId=${id}&source=pro`);
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || data.error) {
        setJobIdError(data?.error || 'Not found. Check your Dashboard Token or Audit ID.');
        return;
      }
      localStorage.setItem('xanlens_job_id', id);
      const brand = data.brand || 'Unknown';
      setSelectedAudit({ jobId: id, brand, industry: data.industry || '', tier: data.tier || 'pro', createdAt: Date.now(), status: data.status || 'complete', score: data.overall_score });
      setAuditDetail(data);
      setView('audit-detail');
    } catch {
      setJobIdError('Network error. Please try again.');
    } finally {
      setJobIdLoading(false);
    }
  };

  // Check URL for job ID param
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const jid = params.get('jobId') || params.get('job');
    if (jid && !wallet) {
      setJobIdInput(jid);
      // Auto-lookup
      (async () => {
        setJobIdLoading(true);
        try {
          const res = await fetch(`/api/v1/audit/status?jobId=${jid}&source=pro`);
          const data = await res.json().catch(() => null);
          if (res.ok && data && !data.error) {
            localStorage.setItem('xanlens_job_id', jid);
            setSelectedAudit({ jobId: jid, brand: data.brand || 'Unknown', industry: data.industry || '', tier: data.tier || 'pro', createdAt: Date.now(), status: data.status || 'complete', score: data.overall_score });
            setAuditDetail(data);
            setView('audit-detail');
          }
        } catch {} finally { setJobIdLoading(false); }
      })();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-switch to new audit view when entering via coupon without wallet
  useEffect(() => {
    if (couponValid && !wallet && !sessionToken) {
      setView('new-audit');
      setLoading(false);
    }
  }, [couponValid, wallet, sessionToken]);

  // Auto-clear zombie state: localStorage wallet exists but no active wagmi connection
  useEffect(() => {
    if (!loading && !isConnected && !address) {
      const storedWallet = typeof window !== 'undefined' ? localStorage.getItem('xanlens_wallet') : null;
      if (storedWallet && !sessionToken && !directJobId) {
        // Stale wallet in localStorage with no active connection — clear everything
        localStorage.removeItem('xanlens_wallet');
        localStorage.removeItem('xanlens_session_token');
        Object.keys(localStorage).filter(k => k.startsWith('wagmi')).forEach(k => localStorage.removeItem(k));
        window.location.reload();
      }
    }
  }, [loading, isConnected, address, sessionToken, directJobId]);

  // ── Not connected (no wallet AND no session token AND no valid coupon) ──
  if (!loading && !wallet && !sessionToken && !couponValid) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        {/* If viewing audit via job ID without wallet */}
        {view === 'audit-detail' && auditDetail && selectedAudit ? (
          <div className="w-full max-w-6xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button onClick={() => { setView('overview'); setSelectedAudit(null); setAuditDetail(null); }} className="text-[12px] text-[#555] hover:text-white transition cursor-pointer">← Back</button>
                <h2 className="text-[15px] font-semibold text-[#999]">{selectedAudit.brand}</h2>
              </div>
            </div>
            {/* Sign in CTA — prominent */}
            <div className="mb-6 p-5 rounded-xl border border-[#222] bg-[#0a0a0a] text-center">
              <p className="text-[14px] text-[#999] mb-3">Sign in to save this audit, track changes over time, and manage your brand</p>
              <button
                onClick={() => { const c = connectors[0]; if (c) connectAsync({ connector: c }).catch((e: unknown) => { console.error('Sign in failed:', e); }); }}
                className="px-8 py-3 text-[14px] font-medium text-black bg-white rounded-lg hover:bg-white/90 transition cursor-pointer"
              >
                {isConnecting ? 'Signing in...' : 'Sign in to save your audit'}
              </button>
            </div>
            {/* Tab navigation */}
            <div className="flex items-center gap-1 mb-6 border-b border-[#191919]">
              <button
                onClick={() => setActiveTab('report')}
                className={`px-4 py-2.5 text-[13px] font-medium transition-colors relative cursor-pointer ${
                  activeTab === 'report' ? 'text-white' : 'text-[#555] hover:text-[#999]'
                }`}
              >
                Report
                {activeTab === 'report' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full" />}
              </button>
              <button
                onClick={() => { setActiveTab('content'); if (fixes.length === 0 && !fixesLoading) loadFixes(selectedAudit.jobId); }}
                className={`px-4 py-2.5 text-[13px] font-medium transition-colors relative cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'content' ? 'text-white' : 'text-[#555] hover:text-[#999]'
                }`}
              >
                Content
                {fixes.length > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#2596be]/10 text-[#2596be]">{fixes.length}</span>}
                {activeTab === 'content' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full" />}
              </button>
            </div>

            {activeTab === 'report' && (
              <AuditReport
                result={auditDetail}
                tier={selectedAudit.tier as 'free' | 'pro'}
                aio={(auditDetail as any)?.aio}
                technical={(auditDetail as any)?.technical}
                contentOptimizer={(auditDetail as any)?.content_optimizer}
                seoScore={(auditDetail as any)?.seo_score}
                websiteHealth={(auditDetail as any)?.website_health}
                onReset={() => { setView('overview'); setSelectedAudit(null); setAuditDetail(null); }}
              />
            )}
            {activeTab === 'content' && (
              <div>
                {fixesLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <span className="w-4 h-4 border-2 border-[#333] border-t-white rounded-full animate-spin" />
                  </div>
                ) : fixes.length > 0 ? (
                  <FixesClient fixes={fixes} brand={selectedAudit.brand} jobId={selectedAudit.jobId} />
                ) : (
                  <div className="text-center py-16">
                    <h3 className="text-[15px] font-semibold tracking-tight mb-1.5">No content yet</h3>
                    <p className="text-[#555] text-[12px] max-w-xs mx-auto">
                      Your AI agent hasn&apos;t drafted any GEO fixes for this audit yet.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-md w-full text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-[#0c0c0c] border border-[#191919] flex items-center justify-center mb-6 mx-auto">
              <img src="/logo.svg" alt="" width={32} height={32} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight mb-2">XanLens Dashboard</h1>
            <p className="text-[#666] text-[13px] mb-8 leading-relaxed">
              Sign in to run audits, track your AI visibility, and manage your brand.
            </p>

            {/* Sign in with Email (Coinbase Smart Wallet — email-based) */}
            <button
              onClick={() => { const c = connectors[0]; if (c) connectAsync({ connector: c }).catch((e) => { console.error('Sign in failed:', e); }); }}
              disabled={isConnecting}
              className="w-full px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition cursor-pointer text-[14px] mb-3 flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              {isConnecting ? 'Signing in...' : 'Sign in with Email'}
            </button>

            {/* Connect existing wallet */}
            <button
              onClick={() => { const c = connectors[1] || connectors[0]; if (c) connectAsync({ connector: c }).catch(() => {}); }}
              disabled={isConnecting}
              className="w-full px-6 py-3 bg-[#0c0c0c] text-white font-medium rounded-xl border border-[#222] hover:border-[#444] transition cursor-pointer text-[14px] mb-6 flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M22 10H17a2 2 0 000 4h5"/></svg>
              Connect Wallet
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-[#191919]" />
              <span className="text-[11px] text-[#444] uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-[#191919]" />
            </div>

            {/* Audit ID / Dashboard token lookup */}
            <div className="bg-[#0a0a0a] border border-[#191919] rounded-2xl p-5 mb-5">
              <form onSubmit={handleJobIdLookup} className="text-left">
                <label className="text-[14px] text-white mb-1.5 block font-semibold">🔑 Have an audit ID?</label>
                <p className="text-[13px] text-[#888] mb-4">Paste your Dashboard Token or Audit ID to view results.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={jobIdInput}
                    onChange={(e) => { setJobIdInput(e.target.value); setJobIdError(''); }}
                    placeholder="Paste audit ID or dashboard token..."
                    className="flex-1 px-4 py-3 rounded-xl bg-[#0c0c0c] border border-[#222] text-white placeholder-[#555] focus:border-[#2596be] focus:outline-none text-[14px]"
                  />
                  <button
                    type="submit"
                    disabled={jobIdLoading || !jobIdInput.trim()}
                    className="px-5 py-3 rounded-xl bg-[#2596be] text-white text-[13px] font-semibold hover:bg-[#2596be]/80 transition cursor-pointer disabled:opacity-40 shrink-0"
                  >
                    {jobIdLoading ? '...' : 'View'}
                  </button>
                </div>
                {jobIdError && <p className="text-[12px] text-[#EF4444] mt-2">{jobIdError}</p>}
              </form>
            </div>

            <ConnectModal isOpen={showConnect} onClose={() => setShowConnect(false)} />
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <span className="w-4 h-4 border-2 border-[#333] border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const truncWallet = wallet ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}` : '';

  return (
    <div className="min-h-screen bg-black text-white flex text-[14px]">
      {/* ── Sidebar (narrower) ── */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-0'} shrink-0 border-r border-[#191919] bg-[#060606] flex flex-col transition-all overflow-hidden sticky top-0 h-screen`}>
        <div className="p-3 border-b border-[#191919] space-y-1.5">
          <a href="/" className="w-full px-3 py-1.5 rounded-lg text-[13px] font-medium transition flex items-center gap-2 text-[#888] hover:bg-[#111] hover:text-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Home
          </a>
          <button
            onClick={() => { setView('overview'); setSelectedAudit(null); setAuditDetail(null); }}
            className={`w-full px-3 py-1.5 rounded-lg text-[13px] font-medium transition cursor-pointer flex items-center gap-2 ${
              view === 'overview' ? 'bg-[#151515] text-white' : 'text-[#888] hover:bg-[#111] hover:text-white'
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </button>
          <button
            onClick={startNewAudit}
            className="w-full px-3 py-2 bg-white text-black font-semibold rounded-lg text-[13px] hover:bg-gray-200 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Audit
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-2 py-2">
            <p className="text-[12px] text-[#555] uppercase tracking-widest font-medium px-2 mb-1.5">History</p>

            {auditLoading && currentAuditBrand && (
              <button
                onClick={() => setView('new-audit')}
                className={`w-full text-left px-2.5 py-2 rounded-lg text-[13px] transition cursor-pointer mb-0.5 ${
                  view === 'new-audit' ? 'bg-[#151515] text-white' : 'text-[#888] hover:bg-[#111] hover:text-white'
                }`}
              >
                <div className="font-medium truncate flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 border-2 border-[#2596be]/30 border-t-[#2596be] rounded-full animate-spin shrink-0" />
                  {currentAuditBrand}
                </div>
                <span className="text-[12px] text-[#555]">Running...</span>
              </button>
            )}

            {audits.length === 0 && !auditLoading ? (
              <p className="text-[12px] text-[#444] px-2 py-3">No audits yet</p>
            ) : (
              <div className="space-y-0.5">
                {audits.map((audit) => (
                  <div key={audit.jobId} className="group relative">
                    <button
                      onClick={() => loadAuditDetail(audit)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-[13px] transition cursor-pointer ${
                        selectedAudit?.jobId === audit.jobId ? 'bg-[#151515] text-white' : 'text-[#888] hover:bg-[#111] hover:text-white'
                      }`}
                    >
                      <div className="font-medium truncate flex items-center gap-1.5">
                        {audit.brand}
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${
                          audit.tier === 'pro' ? 'bg-[#2596be]/10 text-[#2596be]' : 'bg-[#333]/50 text-[#666]'
                        }`}>
                          {audit.tier === 'pro' ? 'PRO' : 'FREE'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[12px] text-[#555]">
                          {new Date(audit.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        {audit.score !== undefined && (
                          <span className="text-[12px] font-medium" style={{ color: scoreColor(audit.score) }}>
                            {audit.score}%
                          </span>
                        )}
                        <span className={`text-[10px] px-1 py-0.5 rounded ${
                          audit.status === 'complete' ? 'bg-[#2596be]/10 text-[#2596be]' :
                          audit.status === 'processing' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' :
                          'bg-[#ef4444]/10 text-[#ef4444]'
                        }`}>
                          {audit.status}
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteAudit(audit); }}
                      className="absolute top-1.5 right-1.5 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-[#ef4444]/20 text-[#555] hover:text-[#ef4444] transition cursor-pointer"
                      title="Delete audit"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-3 border-t border-[#191919]">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2596be]" />
            <p className="text-[12px] text-[#666]">{truncWallet}</p>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-[40px] z-10 bg-black/80 backdrop-blur-xl border-b border-[#191919] px-4 sm:px-6 min-h-[48px] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded hover:bg-[#151515] transition cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <h2 className="text-[13px] sm:text-[15px] font-semibold tracking-tight text-[#999] truncate max-w-[100px] sm:max-w-none">
              {view === 'overview' && 'Dashboard'}
              {view === 'new-audit' && (auditLoading ? `Auditing...` : 'New Audit')}
              {view === 'audit-detail' && (selectedAudit?.brand || 'Audit')}
            </h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
            {/* Balance + Buy USDC */}
            {address && (
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div className="hidden sm:flex items-center gap-2.5 bg-[#0a0a0a] border border-[#191919] rounded-lg px-3 py-1.5">
                  <span className="text-[12px] text-[#555] font-medium">Balance</span>
                  <span className="text-[13px] font-semibold text-white">${usdcFormatted}</span>
                  <span className="text-[11px] text-[#555]">USDC</span>
                </div>
                <div className="flex sm:hidden items-center gap-1.5 bg-[#0a0a0a] border border-[#191919] rounded-lg px-2 py-1">
                  <span className="text-[11px] font-semibold text-white">${usdcFormatted}</span>
                </div>
                <OnrampButton
                  amount={5}
                  label="Buy USDC"
                  className="px-2 sm:px-3 py-1.5 bg-[#2596be] text-white rounded-lg text-[11px] sm:text-[12px] font-semibold hover:bg-[#2596be]/80 transition cursor-pointer shrink-0"
                />
              </div>
            )}
            {view !== 'overview' && (
              <button onClick={() => { setView('overview'); setSelectedAudit(null); setAuditDetail(null); }} className="text-[11px] text-[#555] hover:text-white transition cursor-pointer">
                ← Dashboard
              </button>
            )}
            {/* Account */}
            {(address || wallet) ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#0a0a0a] border border-[#191919] rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${address ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className="text-[11px] text-[#888] font-mono">{(address || wallet || '').slice(0, 6)}...{(address || wallet || '').slice(-4)}</span>
                </div>
                <button
                  onClick={() => {
                    disconnect();
                    localStorage.removeItem('xanlens_session_token');
                    localStorage.removeItem('xanlens_wallet');
                    // Clear wagmi persisted state to prevent auto-reconnect
                    Object.keys(localStorage).filter(k => k.startsWith('wagmi')).forEach(k => localStorage.removeItem(k));
                    // Force reload to fully reset all connection state
                    window.location.reload();
                  }}
                  className="text-[11px] text-[#555] hover:text-[#ef4444] transition cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { const c = connectors[0]; if (c) connectAsync({ connector: c }).catch((e) => { console.error('Sign in failed:', e); }); }}
                className="text-[11px] text-[#555] hover:text-white transition cursor-pointer"
              >
                Sign in
              </button>
            )}
            <a href="/" className="text-[11px] text-[#555] hover:text-white transition flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Home
            </a>
          </div>
        </div>

        <div className="p-6 max-w-6xl mx-auto">
          {/* ── Overview ── */}
          {view === 'overview' && (
            <div>
              {/* Quick actions bar — download skill */}
              {audits.some(a => a.status === 'complete' && a.tier === 'pro') && (
                <div className="flex flex-wrap items-center gap-3 mb-4 p-4 rounded-xl bg-[#0a0a0a] border border-[#191919]">
                  <button
                    onClick={() => {
                      const proAudit = audits.find(a => a.status === 'complete' && a.tier === 'pro');
                      if (!proAudit) return;
                      fetch("/api/v1/skill", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ jobId: proAudit.jobId, wallet: address }),
                      }).then(r => r.blob()).then(blob => {
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `geo-skill-${proAudit.brand.toLowerCase().replace(/\s+/g, "-")}.zip`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }).catch(() => {});
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2596be]/10 border border-[#2596be]/20 text-[12px] text-[#2596be] hover:bg-[#2596be]/20 transition cursor-pointer font-medium"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download Audit Data
                  </button>
                  <span className="text-[11px] text-[#444]">Share your audit results for 30% off next audit</span>
                </div>
              )}

              {/* Stat cards — 2 columns on md, 4 on lg for density */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#0c0c0c] border border-[#191919] rounded-xl p-6 hover:border-[#2596be]/20 transition-colors">
                  <p className="text-[12px] text-[#666] uppercase tracking-wider mb-2 font-medium">Total Audits</p>
                  <p className="text-3xl font-semibold tracking-tight">{user?.totalAudits || 0}</p>
                </div>
                <div className="bg-[#0c0c0c] border border-[#191919] rounded-xl p-6 hover:border-[#2596be]/20 transition-colors">
                  <p className="text-[12px] text-[#666] uppercase tracking-wider mb-2 font-medium">Brands Tracked</p>
                  <p className="text-3xl font-semibold tracking-tight">{new Set(audits.map(a => a.brand.toLowerCase())).size}</p>
                </div>
                <div className="bg-[#0c0c0c] border border-[#191919] rounded-xl p-6 hover:border-[#2596be]/20 transition-colors">
                  <p className="text-[12px] text-[#666] uppercase tracking-wider mb-2 font-medium">Member Since</p>
                  <p className="text-3xl font-semibold tracking-tight">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
                  </p>
                </div>
                <div className="bg-[#0c0c0c] border border-[#191919] rounded-xl p-6 hover:border-[#2596be]/20 transition-colors flex items-center justify-between">
                  <div>
                    <p className="text-[12px] text-[#666] uppercase tracking-wider mb-2 font-medium">Next Audit</p>
                    <p className="text-[15px] text-[#999]">
                      {audits.some(a => a.status === 'complete')
                        ? new Date(Math.max(...audits.filter(a => a.status === 'complete').map(a => a.createdAt)) + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : '—'}
                    </p>
                  </div>
                  <button onClick={startNewAudit} className="px-3 py-1 rounded-lg bg-[#111] border border-[#222] text-[11px] text-[#999] hover:text-white hover:border-[#333] transition">Run</button>
                </div>
              </div>

              {/* Score Trend + Recent side by side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {/* Score Trend Chart */}
                {(() => {
                  const allCompleted = audits.filter(a => a.status === 'complete' && a.score !== undefined);
                  const uniqueBrands = [...new Set(allCompleted.map(a => a.brand))];
                  const completed = (trendBrand === 'all' ? allCompleted : allCompleted.filter(a => a.brand === trendBrand)).sort((a, b) => a.createdAt - b.createdAt);
                  if (completed.length < 2) return null;
                  const scores = completed.map(a => a.score!);
                  const dataMin = Math.min(...scores);
                  const dataMax = Math.max(...scores);
                  // Nice round tick boundaries
                  const niceStep = Math.max(1, Math.ceil((dataMax - dataMin + 4) / 4));
                  const minScore = Math.max(0, Math.floor(dataMin / niceStep) * niceStep - niceStep);
                  const maxScore = Math.min(100, Math.ceil(dataMax / niceStep) * niceStep + niceStep);
                  const range = maxScore - minScore || 10;
                  const ticks: number[] = [];
                  for (let v = minScore; v <= maxScore; v += niceStep) ticks.push(v);
                  const w = 500;
                  const h = 180;
                  const pad = { top: 20, right: 20, bottom: 30, left: 40 };
                  const plotW = w - pad.left - pad.right;
                  const plotH = h - pad.top - pad.bottom;
                  const points = completed.map((a, i) => ({
                    x: pad.left + (plotW * i) / (completed.length - 1),
                    y: pad.top + plotH - ((a.score! - minScore) / range) * plotH,
                    score: a.score!,
                    date: new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  }));
                  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
                  const areaPath = linePath + ` L${points[points.length - 1].x},${pad.top + plotH} L${points[0].x},${pad.top + plotH} Z`;
                  return (
                    <div className="bg-[#0c0c0c] border border-[#191919] rounded-xl p-6 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[12px] text-[#666] uppercase tracking-wider font-medium">Score Trend</p>
                        {uniqueBrands.length > 1 && (
                          <select
                            value={trendBrand}
                            onChange={(e) => setTrendBrand(e.target.value)}
                            className="text-[11px] bg-[#111] border border-[#222] text-[#999] rounded-lg px-2 py-1 outline-none focus:border-[#2596be] cursor-pointer"
                          >
                            <option value="all">All brands</option>
                            {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                        )}
                      </div>
                      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                        {ticks.map(v => {
                          const y = pad.top + plotH - ((v - minScore) / range) * plotH;
                          return <g key={v}><line x1={pad.left} y1={y} x2={w - pad.right} y2={y} stroke="#191919" strokeWidth="1" /><text x={pad.left - 8} y={y + 4} fill="#666" fontSize="11" textAnchor="end">{v}</text></g>;
                        })}
                        <path d={areaPath} fill="url(#trendGrad)" opacity="0.3" />
                        <defs><linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2596be" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs>
                        <path d={linePath} fill="none" stroke="#2596be" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        {points.map((p, i) => (
                          <g key={i}>
                            <circle cx={p.x} cy={p.y} r="4" fill="#2596be" />
                            <text x={p.x} y={p.y - 10} fill="#999" fontSize="11" textAnchor="middle" fontWeight="600">{p.score}</text>
                            <text x={p.x} y={pad.top + plotH + 18} fill="#666" fontSize="10" textAnchor="middle">{p.date}</text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  );
                })()}

                {/* Quick recent list (compact, right column) */}
                {audits.length > 0 && (
                  <div className="bg-[#0c0c0c] border border-[#191919] rounded-xl p-6">
                    <p className="text-[12px] text-[#666] uppercase tracking-wider mb-3 font-medium">Recent</p>
                    <div className="space-y-1">
                      {audits.slice(0, 5).map((audit) => {
                        const radius = 12;
                        const circumference = 2 * Math.PI * radius;
                        const strokeDashoffset = audit.score !== undefined ? circumference * (1 - audit.score / 100) : circumference;
                        const color = audit.score !== undefined ? scoreColor(audit.score) : '#333';
                        return (
                          <button
                            key={audit.jobId}
                            onClick={() => loadAuditDetail(audit)}
                            className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#111] transition cursor-pointer text-left"
                          >
                            <div className="relative w-7 h-7 shrink-0">
                              <svg width="28" height="28" viewBox="0 0 28 28" className="transform -rotate-90">
                                <circle cx="14" cy="14" r={radius} fill="none" stroke="#191919" strokeWidth="2" />
                                {audit.score !== undefined && (
                                  <circle cx="14" cy="14" r={radius} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} />
                                )}
                              </svg>
                              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-semibold" style={{ color }}>
                                {audit.score ?? '—'}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] font-medium text-[#ccc] truncate">{audit.brand}</p>
                              <p className="text-[12px] text-[#555]">{new Date(audit.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Full audit list */}
              {audits.length === 0 ? (
                <div className="bg-[#0c0c0c] border border-[#191919] rounded-xl p-12 text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#111] border border-[#191919] flex items-center justify-center mx-auto mb-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  </div>
                  <h3 className="text-[15px] font-semibold tracking-tight mb-1.5">No audits yet</h3>
                  <p className="text-[#555] text-[12px] mb-4 max-w-xs mx-auto">
                    Run your first audit to see how your brand appears across AI engines.
                  </p>
                  <button onClick={startNewAudit} className="px-5 py-2 bg-white text-black font-semibold rounded-lg text-[12px] hover:bg-gray-200 transition cursor-pointer">
                    Run Your First Audit
                  </button>
                </div>
              ) : (
                <div>
                  {/* Update nudge: when a brand's score changed significantly */}
                  {(() => {
                    const completed = audits.filter(a => a.status === 'complete' && a.score !== undefined);
                    const brandLatest: Record<string, { score: number; brand: string; date: number }[]> = {};
                    for (const a of completed) {
                      if (!brandLatest[a.brand]) brandLatest[a.brand] = [];
                      brandLatest[a.brand].push({ score: a.score!, brand: a.brand, date: a.createdAt });
                    }
                    const nudges: { brand: string; delta: number; latest: number; previous: number }[] = [];
                    for (const [brand, entries] of Object.entries(brandLatest)) {
                      if (entries.length < 2) continue;
                      const sorted = entries.sort((a, b) => b.date - a.date);
                      const delta = sorted[0].score - sorted[1].score;
                      if (Math.abs(delta) >= 15) nudges.push({ brand, delta, latest: sorted[0].score, previous: sorted[1].score });
                    }
                    if (nudges.length === 0) return null;
                    return (
                      <div className="mb-4 space-y-2">
                        {nudges.map(n => (
                          <div key={n.brand} className="flex items-center justify-between p-3 rounded-xl bg-[#F59E0B]/[0.05] border border-[#F59E0B]/20">
                            <p className="text-[13px] text-[#F59E0B]">
                              <span className="font-semibold">{n.brand}</span> score changed by {n.delta > 0 ? '+' : ''}{n.delta} ({n.previous} → {n.latest}). Time to re-audit and refresh your content fixes.
                            </p>
                            <button onClick={startNewAudit} className="text-[11px] px-3 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20 transition cursor-pointer font-medium shrink-0 ml-3">
                              Re-audit
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                  <p className="text-[12px] text-[#666] uppercase tracking-wider font-medium mb-3">All Audits</p>
                  {/* 2-column grid for audit cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {audits.slice(0, 10).map((audit) => {
                      const color = audit.score !== undefined ? scoreColor(audit.score) : '#333';
                      const radius = 18;
                      const circumference = 2 * Math.PI * radius;
                      const strokeDashoffset = audit.score !== undefined ? circumference * (1 - audit.score / 100) : circumference;
                      return (
                        <button
                          key={audit.jobId}
                          onClick={() => loadAuditDetail(audit)}
                          className="w-full bg-[#0c0c0c] border border-[#191919] rounded-xl p-4 flex items-center justify-between hover:border-[#2596be]/20 transition cursor-pointer text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative w-11 h-11 shrink-0">
                              <svg width="44" height="44" viewBox="0 0 44 44" className="transform -rotate-90">
                                <circle cx="22" cy="22" r={radius} fill="none" stroke="#191919" strokeWidth="2.5" />
                                {audit.score !== undefined && (
                                  <circle cx="22" cy="22" r={radius} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} />
                                )}
                              </svg>
                              <span className="absolute inset-0 flex items-center justify-center text-[13px] font-bold" style={{ color }}>
                                {audit.score ?? '—'}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-[15px] text-[#999] group-hover:text-white transition tracking-tight">{audit.brand}</p>
                              <p className="text-[13px] text-[#555]">
                                {audit.website || audit.industry} · {new Date(audit.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {audit.status === 'complete' && audit.tier === 'pro' && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2596be]/10 text-[#2596be] font-medium">Skill ✓</span>
                            )}
                            <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                              audit.tier === 'pro' ? 'bg-[#2596be]/10 text-[#2596be]' :
                              audit.tier === 'free' ? 'bg-[#555]/10 text-[#888]' :
                              audit.status === 'processing' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' :
                              'bg-[#ef4444]/10 text-[#ef4444]'
                            }`}>
                              {audit.tier === 'pro' ? 'Pro' : audit.tier === 'free' ? 'Free' : audit.status}
                            </span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" className="group-hover:stroke-white transition"><polyline points="9 18 15 12 9 6"/></svg>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── New Audit ── */}
          {view === 'new-audit' && (
            <div>
              {auditResult ? (
                <div>
                  <AuditReport
                    result={auditResult}
                    tier="pro"
                    aio={auditResult.aio}
                    technical={auditResult.technical}
                    contentOptimizer={auditResult.content_optimizer}
                    seoScore={auditResult.seo_score}
                    websiteHealth={auditResult.website_health}
                    onReset={() => { resetAudit(); setUrl(''); setCurrentAuditBrand(''); }}
                  />
                </div>
              ) : (
                <div className="max-w-lg mx-auto pt-12">
                  <h2 className="text-lg font-semibold tracking-tight mb-1.5 text-center">Run a Pro Audit</h2>
                  <p className="text-[#666] text-[12px] text-center mb-6">
                    Enter a coupon code to unlock your audit.
                  </p>

                  {/* ── Step 1: Coupon gate ── */}
                  {!couponValid ? (
                    <div className="space-y-4">
                      {/* Option A: Pay with USDC (primary — gasless for Smart Wallet) */}
                      {address ? (
                        <>
                          <button
                            onClick={handlePurchase}
                            disabled={isPurchasing || isConfirming || purchaseVerifying}
                            className="w-full px-3.5 py-3 bg-white text-black font-semibold rounded-xl text-[14px] hover:bg-gray-200 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {isPurchasing ? 'Confirm in wallet...' :
                             isConfirming ? 'Confirming transaction...' :
                             purchaseVerifying ? 'Verifying payment...' :
                             paymasterSupported ? 'Pay $0.99 USDC (no gas fees)' : 'Pay $0.99 USDC'}
                          </button>
                          <p className="text-[11px] text-[#444] text-center">
                            {paymasterSupported ? 'Gasless · powered by Coinbase Paymaster' : 'USDC on Base network'}
                          </p>

                          {/* Need USDC? Buy with card via Onramper */}
                          <div className="text-center">
                            <OnrampButton
                              amount={5}
                              label="Need USDC? Buy with card →"
                              className="text-[13px] text-[#2596be] hover:underline cursor-pointer bg-transparent border-none"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Not connected — prompt to sign in first */}
                          <button
                            onClick={() => { const c = connectors[0]; if (c) connectAsync({ connector: c }).catch(() => {}); }}
                            disabled={isConnecting}
                            className="w-full px-3.5 py-3 bg-white text-black font-semibold rounded-xl text-[14px] hover:bg-gray-200 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            {isConnecting ? 'Signing in...' : 'Sign in to purchase — $0.99'}
                          </button>
                          <p className="text-[11px] text-[#444] text-center">Pay with USDC on Base · card top-up available</p>
                        </>
                      )}

                      {(purchaseError || purchaseErrorMsg) && (
                        <p className="text-[#ef4444] text-[12px] text-center">
                          {purchaseErrorMsg || (purchaseError as any)?.shortMessage || 'Transaction failed'}
                          {purchaseError && <button onClick={() => resetPurchase()} className="ml-2 text-white underline">Try again</button>}
                        </p>
                      )}

                      {/* Divider */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-[#191919]" />
                        <span className="text-[11px] text-[#444] uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-[#191919]" />
                      </div>

                      {/* Option B: Coupon */}
                      <div>
                        <p className="text-[13px] text-[#888] mb-2 text-center">Have a coupon code?</p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                            placeholder="GEO-XXXX-XXXX"
                            disabled={couponChecking}
                            onKeyDown={(e) => e.key === 'Enter' && handleValidateCoupon()}
                            className="flex-1 px-3.5 py-3 rounded-xl bg-[#0c0c0c] border border-[#191919] text-white placeholder-[#444] focus:border-[#333] focus:outline-none text-[14px] disabled:opacity-50 uppercase tracking-wider"
                          />
                          <button
                            type="button"
                            onClick={handleValidateCoupon}
                            disabled={couponChecking || !couponCode.trim()}
                            className="px-5 py-3 bg-[#222] text-white font-semibold rounded-xl text-[13px] hover:bg-[#333] transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                          >
                            {couponChecking ? (
                              <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin inline-block" />
                            ) : 'Apply'}
                          </button>
                        </div>
                        {couponError && (
                          <p className="text-[#ef4444] text-[12px] text-center mt-2">{couponError}</p>
                        )}
                        <p className="text-[13px] text-[#666] text-center mt-3">
                          Find free coupons on <a href="https://x.com/xanlens_" target="_blank" rel="noopener" className="text-[#2596be] hover:underline font-medium">𝕏 @xanlens_</a>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                    {/* ── Step 2: URL input (unlocked) ── */}
                    <div className="mb-4 flex items-center justify-center gap-2 text-[12px]">
                      <span className="text-green-400">✓</span>
                      <span className="text-[#888]">Coupon <span className="text-white font-mono">{couponApplied}</span> applied</span>
                    </div>
                    <form onSubmit={handleRunAudit} className="space-y-3">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter website URL (e.g. acme.com)"
                        required
                        autoFocus
                        disabled={auditLoading}
                        className="w-full px-3.5 py-3 rounded-xl bg-[#0c0c0c] border border-[#191919] text-white placeholder-[#444] focus:border-[#333] focus:outline-none text-[14px] disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={auditLoading || !url.trim()}
                        className="w-full px-3.5 py-3 bg-white text-black font-semibold rounded-xl text-[13px] hover:bg-gray-200 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {auditLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            {progress.phase || 'Processing...'}
                          </span>
                        ) : 'Run Pro Audit'}
                      </button>
                    </form>
                    </>
                  )}
                  {auditLoading && progress.total > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[11px] text-[#555] mb-1.5">
                        <span>{progress.phase}</span>
                        <span>{progress.done}/{progress.total}</span>
                      </div>
                      <div className="w-full bg-[#111] rounded-full h-1 overflow-hidden">
                        <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${Math.max((progress.done / progress.total) * 100, 2)}%` }} />
                      </div>
                    </div>
                  )}
                  {auditError && (
                    <div className="mt-3 p-3 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg">
                      <p className="text-[#ef4444] text-[12px] mb-1.5">{auditError}</p>
                      <button onClick={() => { resetAudit(); }} className="text-[11px] text-white underline cursor-pointer">Try again</button>
                    </div>
                  )}
                  {!auditLoading && !auditError && (
                    <p className="text-[11px] text-[#444] text-center mt-3">Pro audit · 7 AI engines · ~3-5 minutes</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Audit Detail ── */}
          {view === 'audit-detail' && selectedAudit && (
            <div>
              {detailLoading ? (
                <div className="flex items-center justify-center py-16">
                  <span className="w-4 h-4 border-2 border-[#333] border-t-white rounded-full animate-spin" />
                </div>
              ) : auditDetail && (auditDetail as any)?.status === 'processing' ? (
                <div className="text-center py-16">
                  <span className="w-6 h-6 border-2 border-[#333] border-t-[#2596be] rounded-full animate-spin inline-block mb-3" />
                  <p className="text-white font-semibold text-[14px] mb-1">Audit still processing</p>
                  <p className="text-[#555] text-[12px] mb-2">
                    {(auditDetail as any)?.done || 0} / {(auditDetail as any)?.total || '?'} prompts ({(auditDetail as any)?.progress || 0}%)
                  </p>
                  <div className="w-40 mx-auto bg-[#111] rounded-full h-1 overflow-hidden mt-2 mb-4">
                    <div className="h-full bg-[#2596be] rounded-full transition-all" style={{ width: `${(auditDetail as any)?.progress || 0}%` }} />
                  </div>
                  <button onClick={() => loadAuditDetail(selectedAudit)} className="text-[12px] text-[#888] hover:text-white transition cursor-pointer">Refresh</button>
                </div>
              ) : auditDetail && (auditDetail as any)?.status !== 'processing' && !(auditDetail as any)?.error ? (
                <>
                  {/* Tab navigation — Chrome-style tabs */}
                  <div className="flex items-center gap-1 mb-6 mt-2 bg-[#0a0a0a] rounded-xl p-1 w-fit">
                    <button
                      onClick={() => setActiveTab('report')}
                      className={`px-5 py-2 text-[13px] font-semibold transition-all cursor-pointer rounded-lg ${
                        activeTab === 'report'
                          ? 'bg-[#1a1a1a] text-white shadow-sm'
                          : 'text-[#777] hover:text-white hover:bg-[#141414]'
                      }`}
                    >
                      Report
                    </button>
                    <button
                      onClick={() => { setActiveTab('content'); if (fixes.length === 0 && !fixesLoading) loadFixes(selectedAudit.jobId); }}
                      className={`px-5 py-2 text-[13px] font-semibold transition-all cursor-pointer rounded-lg flex items-center gap-1.5 ${
                        activeTab === 'content'
                          ? 'bg-[#1a1a1a] text-white shadow-sm'
                          : 'text-[#777] hover:text-white hover:bg-[#141414]'
                      }`}
                    >
                      Content
                      {fixes.length > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#2596be]/10 text-[#2596be]">{fixes.length}</span>
                      )}
                    </button>
                  </div>

                  {/* Report tab */}
                  {activeTab === 'report' && (
                    <AuditReport
                      result={auditDetail}
                      tier={selectedAudit.tier as 'free' | 'pro'}
                      aio={(auditDetail as any)?.aio}
                      technical={(auditDetail as any)?.technical}
                      contentOptimizer={(auditDetail as any)?.content_optimizer}
                      seoScore={(auditDetail as any)?.seo_score}
                      websiteHealth={(auditDetail as any)?.website_health}
                      onReset={() => { setView('overview'); setSelectedAudit(null); setAuditDetail(null); }}
                    />
                  )}

                  {/* Content tab */}
                  {activeTab === 'content' && (
                    <div>
                      {fixesLoading ? (
                        <div className="flex items-center justify-center py-16">
                          <span className="w-4 h-4 border-2 border-[#333] border-t-white rounded-full animate-spin" />
                        </div>
                      ) : fixes.length > 0 ? (
                        <FixesClient
                          fixes={fixes}
                          brand={selectedAudit.brand}
                          jobId={selectedAudit.jobId}
                        />
                      ) : (
                        <div className="text-center py-16">
                          <div className="w-12 h-12 rounded-xl bg-[#111] border border-[#191919] flex items-center justify-center mx-auto mb-4">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>
                            </svg>
                          </div>
                          <h3 className="text-[15px] font-semibold tracking-tight mb-1.5">No content yet</h3>
                          <p className="text-[#555] text-[12px] max-w-xs mx-auto">
                            Your AI agent hasn&apos;t drafted any GEO fixes for this audit yet. Ask your agent to generate content based on the audit results.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <p className="text-[#555] text-[13px] mb-1.5">
                    {(auditDetail as any)?.error === 'Job not found' ? 'This audit has expired or was not found.' : 'Audit failed to complete.'}
                  </p>
                  <p className="text-[#444] text-[12px] mb-3">{(auditDetail as any)?.error || 'Unknown error'}</p>
                  <button onClick={() => deleteAudit(selectedAudit)} className="text-[12px] text-[#ef4444] hover:text-[#ef4444]/80 transition cursor-pointer">Delete this audit</button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
