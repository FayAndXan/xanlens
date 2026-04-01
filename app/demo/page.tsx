export const dynamic = "force-static";
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Helpers ──────────────────────────────────────────────
function useTypingText(text: string, active: boolean, speed = 30) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    if (!active) { setDisplayed(''); return; }
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [text, active, speed]);
  return displayed;
}

function AnimatedCounter({ value, duration = 1500, active }: { value: number; duration?: number; active: boolean }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!active) { setCurrent(0); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setCurrent(Math.round(p * value));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, duration, active]);
  return <>{current}</>;
}

function GradeLabel({ grade, color }: { grade: string; color: string }) {
  return (
    <span className="ml-3 px-3 py-1 rounded text-sm font-bold" style={{ background: color + '22', color }}>
      {grade}
    </span>
  );
}

// Bar chart component
function BarChart({ data, active }: { data: { label: string; value: number; color: string }[]; active: boolean }) {
  return (
    <div className="flex items-end gap-6 h-40 mt-4">
      {data.map((d, i) => (
        <div key={d.label} className="flex flex-col items-center gap-2 flex-1">
          <motion.div
            className="w-full rounded-t"
            style={{ background: d.color }}
            initial={{ height: 0 }}
            animate={active ? { height: `${d.value}%` } : { height: 0 }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
          />
          <span className="text-xs text-gray-400 font-mono">{d.label}</span>
          <span className="text-sm font-bold" style={{ color: d.color }}>
            {active ? d.value : 0}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Step configs ─────────────────────────────────────────
const STEPS = ['audit', 'fix', 'deploy', 're-audit'] as const;
type Step = typeof STEPS[number];

const auditRequest = `POST /api/v1/audit HTTP/1.1
Host: xanlens.com
Content-Type: application/json

{
  "brand": "Acme AI",
  "engines": ["gemini", "web"],
  "prompts": "auto"
}`;

const auditResponse = {
  score: 25,
  grade: 'F',
  gradeColor: '#ef4444',
  engines: [
    { label: 'Gemini', value: 18, color: '#06b6d4' },
    { label: 'Web Search', value: 32, color: '#14b8a6' },
  ],
  details: [
    { k: 'brand_mentioned', v: '1 / 8 queries' },
    { k: 'sentiment', v: 'neutral' },
    { k: 'citations', v: '0 direct links' },
    { k: 'competitor_rank', v: '#4 behind Jasper, Copy.ai, Writer' },
  ],
};

const fixRequest = `POST /api/v1/fix HTTP/1.1
Host: xanlens.com
Content-Type: application/json
X-402-Payment: USDC/Monad

{
  "brand": "Acme AI",
  "audit_id": "aud_7xK9mQ",
  "content_types": ["blog", "faq_schema", "social", "llms_txt"]
}`;

const fixContent = [
  { title: '📝 Blog Post', desc: '"Why Acme AI Is Redefining Collaborative Writing" — 1,200 words, SEO-optimized, 3 AI-engine citations', color: '#06b6d4' },
  { title: '❓ FAQ Schema', desc: '8 structured Q&As with JSON-LD markup — ready for rich snippets & AI training data', color: '#14b8a6' },
  { title: '📱 Social Posts', desc: '5 platform-native posts (X, LinkedIn, Reddit) with hooks, hashtags, and brand positioning', color: '#a78bfa' },
  { title: '🤖 llms.txt', desc: 'Machine-readable brand context file — tells AI engines who Acme AI is, what they do, key differentiators', color: '#f59e0b' },
];

const deploySteps = [
  { label: 'Schema markup injected into <head>', delay: 0 },
  { label: 'Blog post published to /blog/acme-ai-collaborative-writing', delay: 0.6 },
  { label: 'FAQ schema added to /faq with JSON-LD', delay: 1.2 },
  { label: 'llms.txt deployed to /llms.txt', delay: 1.8 },
  { label: 'robots.txt updated with AI crawler rules', delay: 2.4 },
  { label: 'Social posts scheduled across 3 platforms', delay: 3.0 },
];

const reauditResponse = {
  score: 72,
  grade: 'B',
  gradeColor: '#22c55e',
  engines: [
    { label: 'Gemini', value: 68, color: '#06b6d4' },
    { label: 'Web Search', value: 76, color: '#14b8a6' },
  ],
};

// ─── Main Page ────────────────────────────────────────────
export default function DemoPage() {
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [stepPhase, setStepPhase] = useState(0); // sub-phase within step
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const schedule = useCallback((fn: () => void, ms: number) => {
    timerRef.current = setTimeout(fn, ms);
  }, []);

  const audioRef = useRef<HTMLAudioElement[]>([]);

  const playAudio = useCallback((index: number) => {
    try {
      if (!audioRef.current[index]) {
        const srcs = ['/audio/intro.mp3', '/audio/step1.mp3', '/audio/step2.mp3', '/audio/step3.mp3', '/audio/step4.mp3'];
        audioRef.current[index] = new Audio(srcs[index]);
      }
      audioRef.current[index].play().catch(() => {});
    } catch {}
  }, []);

  const runDemo = useCallback(() => {
    setRunning(true);
    setCurrentStep(0);
    setStepPhase(0);

    // Intro narration (13s) + Step 1 audit
    playAudio(0); // intro
    schedule(() => playAudio(1), 13000); // step1 narration starts
    schedule(() => setStepPhase(1), 16000); // show audit response
    // Move to step 1 (Fix) at ~39s
    schedule(() => { setCurrentStep(1); setStepPhase(0); playAudio(2); }, 39000);
    // Fix: phase 0 = request, phase 1 = payment, phase 2 = content cards
    schedule(() => setStepPhase(1), 47000); // payment anim
    schedule(() => setStepPhase(2), 55000); // content cards
    // Move to step 2 (Deploy) at ~74s
    schedule(() => { setCurrentStep(2); setStepPhase(0); playAudio(3); }, 74000);
    // Move to step 3 (Re-audit) at ~99s
    schedule(() => { setCurrentStep(3); setStepPhase(0); playAudio(4); }, 99000);
    schedule(() => setStepPhase(1), 105000); // show results
  }, [schedule, playAudio]);

  // Cleanup
  useEffect(() => () => clearTimeout(timerRef.current!), []);

  // Reset
  const reset = () => {
    setRunning(false);
    setCurrentStep(-1);
    setStepPhase(0);
  };

  // Typing hooks
  const auditReqText = useTypingText(auditRequest, currentStep === 0 && stepPhase === 0, 18);
  const fixReqText = useTypingText(fixRequest, currentStep === 1 && stepPhase === 0, 18);

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden">
      {/* Subtle grid bg */}
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="text-cyan-400">XanLens</span> <span className="text-gray-500">Live Demo</span>
          </h1>
          <p className="text-gray-500 text-lg">Watch an AI agent audit &amp; fix brand visibility in real-time</p>
        </motion.div>

        {/* Progress bar */}
        {running && (
          <div className="flex gap-2 mb-10">
            {STEPS.map((s, i) => (
              <div key={s} className="flex-1">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 text-center">
                  {i + 1}. {s}
                </div>
                <div className="h-1 rounded-full bg-gray-800 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: i <= currentStep ? '#06b6d4' : '#1f2937' }}
                    initial={{ width: '0%' }}
                    animate={{ width: i < currentStep ? '100%' : i === currentStep ? '50%' : '0%' }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Start button */}
        {!running && (
          <motion.div className="flex justify-center mb-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <button
              onClick={runDemo}
              className="group relative px-8 py-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-lg font-bold hover:bg-cyan-500/20 hover:border-cyan-400 transition-all cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.8A1.5 1.5 0 004 4.1v11.8a1.5 1.5 0 002.3 1.3l9.2-5.9a1.5 1.5 0 000-2.6L6.3 2.8z"/></svg>
                Run Demo
              </span>
              <motion.div
                className="absolute inset-0 rounded-lg border border-cyan-400/50"
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </button>
          </motion.div>
        )}

        {/* Reset */}
        {running && currentStep === 3 && stepPhase === 1 && (
          <motion.div className="flex justify-center mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
            <button onClick={reset} className="px-6 py-2 rounded border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition cursor-pointer">
              ↺ Reset Demo
            </button>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* ─── STEP 1: AUDIT ──────────────────────── */}
          {currentStep === 0 && (
            <motion.div key="audit" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
              <StepHeader number={1} title="Audit" subtitle="Checking Acme AI's visibility across AI engines" />

              {/* Request */}
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-5 mb-6 overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#2596be] animate-pulse" />
                  <span className="text-[#2596be] text-xs">SENDING REQUEST</span>
                </div>
                <pre className="text-cyan-300 text-sm whitespace-pre-wrap leading-relaxed">{auditReqText}<span className="animate-pulse">█</span></pre>
              </div>

              {/* Response */}
              {stepPhase >= 1 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="w-2 h-2 rounded-full bg-cyan-500" />
                      <span className="text-cyan-400 text-xs">200 OK — Response</span>
                    </div>

                    {/* Big score */}
                    <div className="flex items-center justify-center mb-8">
                      <div className="text-center">
                        <div className="text-7xl md:text-8xl font-black text-red-400">
                          <AnimatedCounter value={auditResponse.score} active={stepPhase >= 1} />
                          <span className="text-3xl text-gray-600">/100</span>
                        </div>
                        <GradeLabel grade={auditResponse.grade} color={auditResponse.gradeColor} />
                      </div>
                    </div>

                    {/* Engine breakdown */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {auditResponse.engines.map((e) => (
                        <div key={e.label} className="bg-black/50 rounded-lg p-4 border border-gray-800">
                          <div className="text-xs text-gray-500 mb-2">{e.label}</div>
                          <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold" style={{ color: e.color }}>
                              <AnimatedCounter value={e.value} active={stepPhase >= 1} duration={1200} />
                            </span>
                            <span className="text-gray-600 text-sm">/100</span>
                          </div>
                          <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: e.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${e.value}%` }}
                              transition={{ duration: 1, delay: 0.3 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Details */}
                    <div className="space-y-2">
                      {auditResponse.details.map((d) => (
                        <div key={d.k} className="flex justify-between text-sm border-b border-gray-800/50 pb-2">
                          <span className="text-gray-500">{d.k}</span>
                          <span className="text-gray-300">{d.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ─── STEP 2: FIX ───────────────────────── */}
          {currentStep === 1 && (
            <motion.div key="fix" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
              <StepHeader number={2} title="Fix" subtitle="Generating optimized content to boost visibility" />

              {/* Request */}
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-5 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#2596be] animate-pulse" />
                  <span className="text-[#2596be] text-xs">SENDING REQUEST</span>
                </div>
                <pre className="text-cyan-300 text-sm whitespace-pre-wrap leading-relaxed">{fixReqText}<span className="animate-pulse">█</span></pre>
              </div>

              {/* Payment animation */}
              {stepPhase >= 1 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-6">
                  <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg p-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="text-xs text-purple-400 uppercase tracking-widest mb-5 text-center">x402 Payment — Choose Chain</div>

                      {/* Chain selector */}
                      <div className="flex justify-center gap-4 mb-6">
                        {[
                          { name: 'Base', color: '#3b82f6', icon: (
                            <svg viewBox="0 0 111 111" className="w-7 h-7" fill="none"><circle cx="55.5" cy="55.5" r="55.5" fill="#0052FF"/><path d="M55.4 93.3c20.9 0 37.8-16.9 37.8-37.8S76.3 17.7 55.4 17.7c-19.7 0-35.9 15.1-37.6 34.3h49.8v7h-49.8c1.7 19.2 17.9 34.3 37.6 34.3z" fill="#fff"/></svg>
                          ), selected: false },
                          { name: 'Monad', color: '#a78bfa', icon: (
                            <svg viewBox="0 0 40 40" className="w-7 h-7"><circle cx="20" cy="20" r="20" fill="#836EF9"/><text x="20" y="26" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="monospace">M</text></svg>
                          ), selected: true },
                          { name: 'Solana', color: '#14f195', icon: (
                            <svg viewBox="0 0 40 40" className="w-7 h-7"><circle cx="20" cy="20" r="20" fill="#000"/><path d="M11 26.5l3.2-3.2h14.6l-3.2 3.2H11zm0-5.3l3.2-3.2h14.6l-3.2 3.2H11zm17.8-2.1H14.2l3.2-3.2h14.6l-3.2 3.2z" fill="url(#sg)"/><defs><linearGradient id="sg" x1="11" y1="27" x2="29" y2="15"><stop stopColor="#9945FF"/><stop offset="1" stopColor="#14F195"/></linearGradient></defs></svg>
                          ), selected: false },
                        ].map((chain, i) => (
                          <motion.div
                            key={chain.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.12 }}
                            className={`relative flex flex-col items-center gap-2 px-6 py-4 rounded-lg border min-w-[110px] ${
                              chain.selected
                                ? 'border-purple-400 bg-purple-500/15 shadow-[0_0_20px_rgba(167,139,250,0.15)]'
                                : 'border-gray-700 bg-gray-900/50 opacity-40'
                            }`}
                          >
                            {chain.selected && (
                              <motion.div
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center shadow-lg"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.7, type: 'spring', stiffness: 400 }}
                              >
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </motion.div>
                            )}
                            {chain.icon}
                            <div className="text-sm font-bold" style={{ color: chain.selected ? chain.color : '#6b7280' }}>
                              {chain.name}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">
                          $0.49 <span className="text-lg text-gray-400">USDC</span>
                        </div>
                        <div className="text-sm text-gray-500 mb-4">Paying on <span className="text-purple-400 font-bold">Monad</span></div>
                        <motion.div
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2596be]/10 border border-[#2596be]/30"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2 }}
                        >
                          <svg className="w-4 h-4 text-[#2596be]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-[#2596be] text-sm font-bold">Payment confirmed — Block #1,847,293</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Content cards */}
              {stepPhase >= 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fixContent.map((c, i) => (
                    <motion.div
                      key={c.title}
                      initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30, y: 20 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.3 }}
                      className="bg-gray-950 border rounded-lg p-5"
                      style={{ borderColor: c.color + '40' }}
                    >
                      <div className="text-lg font-bold mb-2" style={{ color: c.color }}>{c.title}</div>
                      <p className="text-gray-400 text-sm leading-relaxed">{c.desc}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ─── STEP 3: DEPLOY ────────────────────── */}
          {currentStep === 2 && (
            <motion.div key="deploy" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
              <StepHeader number={3} title="Deploy" subtitle="Publishing optimized content across channels" />

              <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                <div className="space-y-4">
                  {deploySteps.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: s.delay, duration: 0.4 }}
                      className="flex items-center gap-4"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: s.delay + 0.3, type: 'spring', stiffness: 300 }}
                        className="w-8 h-8 rounded-full bg-[#2596be]/20 border border-[#2596be]/40 flex items-center justify-center flex-shrink-0"
                      >
                        <svg className="w-4 h-4 text-[#2596be]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                      <span className="text-gray-300 text-sm">{s.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 4: RE-AUDIT ──────────────────── */}
          {currentStep === 3 && (
            <motion.div key="reaudit" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
              <StepHeader number={4} title="Re-Audit" subtitle="Measuring the improvement" />

              {stepPhase >= 1 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  {/* Before / After */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* Before */}
                    <div className="bg-gray-950 border border-red-500/20 rounded-lg p-6 text-center">
                      <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">Before</div>
                      <div className="text-5xl md:text-6xl font-black text-red-400">
                        {auditResponse.score}<span className="text-2xl text-gray-600">/100</span>
                      </div>
                      <GradeLabel grade="F" color="#ef4444" />
                    </div>
                    {/* After */}
                    <div className="bg-gray-950 border border-[#2596be]/20 rounded-lg p-6 text-center relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-[#2596be]/5"
                        animate={{ opacity: [0, 0.3, 0] }}
                        transition={{ duration: 2, repeat: 2 }}
                      />
                      <div className="relative">
                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">After</div>
                        <div className="text-5xl md:text-6xl font-black text-[#2596be]">
                          <AnimatedCounter value={reauditResponse.score} active duration={2000} />
                          <span className="text-2xl text-gray-600">/100</span>
                        </div>
                        <GradeLabel grade="B" color="#22c55e" />
                      </div>
                    </div>
                  </div>

                  {/* Improvement */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 }}
                    className="bg-gradient-to-r from-cyan-500/10 to-[#2596be]/10 border border-cyan-500/20 rounded-lg p-6 text-center"
                  >
                    <div className="text-5xl font-black text-cyan-400 mb-2">+188%</div>
                    <div className="text-gray-400">Visibility improvement in one API call</div>
                  </motion.div>

                  {/* Engine comparison */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {reauditResponse.engines.map((e, i) => (
                      <div key={e.label} className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                        <div className="text-xs text-gray-500 mb-2">{e.label}</div>
                        <div className="flex items-center gap-3">
                          <span className="text-red-400 text-lg">{auditResponse.engines[i].value}</span>
                          <span className="text-gray-600">→</span>
                          <span className="text-2xl font-bold" style={{ color: e.color }}>
                            <AnimatedCounter value={e.value} active duration={1500} />
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: e.color }}
                            initial={{ width: `${auditResponse.engines[i].value}%` }}
                            animate={{ width: `${e.value}%` }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.015]" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.1) 2px, rgba(0,255,255,0.1) 4px)',
      }} />
    </div>
  );
}

function StepHeader({ number, title, subtitle }: { number: number; title: string; subtitle: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-cyan-500 text-xs font-bold uppercase tracking-widest">Step {number}</span>
        <div className="h-px flex-1 bg-gray-800" />
      </div>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </motion.div>
  );
}
