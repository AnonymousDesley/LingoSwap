
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, CheckCircle, ArrowRight, Zap, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";

// Mock data for demo
const LEGACY_CODE = `
import { useTranslation } from 'react-i18next';

export function Welcome() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('welcome.description')}</p>
      <Trans i18nKey="footer.text">
        Built with love.
      </Trans>
    </div>
  );
}
`.trim();

const LINGO_CODE = `
// Optimized by LingoSwap

export function Welcome() {
  
  return (
    <div>
      <h1>Welcome to LingoSwap</h1>
      <p>Automated localization for modern apps.</p>
      
        Built with love.
      
    </div>
  );
}
`.trim();

export default function Dashboard() {
    const searchParams = useSearchParams();
    const repo = searchParams.get("repo") || "unknown/repo";

    const [stage, setStage] = useState(0); // 0: Analyze, 1: Transform, 2: Done
    const [stats, setStats] = useState({ lines: 0, size: 0, hours: 0 });

    useEffect(() => {
        // Simulate migration process
        const timer1 = setTimeout(() => setStage(1), 1500);
        const timer2 = setTimeout(() => {
            setStage(2);
            setStats({ lines: 420, size: 15, hours: 24 });
        }, 4500);

        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground p-6 pt-24">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Migration Dashboard</h2>
                        <p className="text-white/60">Target: <code className="bg-white/10 px-2 py-1 rounded text-cyan">{repo}</code></p>
                    </div>

                    {/* ROI Ticker */}
                    <div className="flex gap-4">
                        <MetricCard label="JSON Lines Deleted" value={stats.lines} suffix="" delay={0} />
                        <MetricCard label="Bundle Shrunk" value={stats.size} suffix="%" delay={0.1} />
                        <MetricCard label="Dev Hours Saved" value={stats.hours} suffix="h" delay={0.2} />
                    </div>
                </header>

                {/* Surgical Theater */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">

                    {/* Legacy Pane */}
                    <div className="glass-panel rounded-xl p-6 flex flex-col relative overflow-hidden group border-red-500/20">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50" />
                        <div className="flex justify-between items-center mb-4 text-red-400">
                            <h3 className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider"><Code className="w-4 h-4" /> Legacy Code</h3>
                            {stage > 0 && <span className="text-xs bg-red-500/20 px-2 py-1 rounded">Deprecating...</span>}
                        </div>
                        <pre className="font-mono text-sm text-white/70 overflow-auto flex-1 p-4 bg-black/40 rounded-lg">
                            <code>
                                {LEGACY_CODE.split('\n').map((line, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 1 }}
                                        animate={stage > 0 && (line.includes('useTranslation') || line.includes('t(') || line.includes('Trans')) ? { opacity: 0.3, x: -10, textDecoration: "line-through", color: "#ef4444" } : {}}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        {line}
                                    </motion.div>
                                ))}
                            </code>
                        </pre>
                    </div>

                    {/* Lingo Pane */}
                    <div className="glass-panel rounded-xl p-6 flex flex-col relative overflow-hidden border-cyan/20">
                        <div className="absolute top-0 left-0 w-full h-1 bg-cyan/50" />
                        <div className="flex justify-between items-center mb-4 text-cyan">
                            <h3 className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider"><Zap className="w-4 h-4" /> Lingo.dev Optimized</h3>
                            {stage < 2 && <RefreshCw className="w-4 h-4 animate-spin" />}
                        </div>
                        <pre className="font-mono text-sm text-cyan/90 overflow-auto flex-1 p-4 bg-black/40 rounded-lg">
                            <code>
                                {LINGO_CODE.split('\n').map((line, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={stage >= 1 ? { opacity: 1, x: 0 } : {}}
                                        transition={{ delay: 0.5 + i * 0.1 }}
                                        className="border-l-2 border-transparent pl-2"
                                        whileHover={{ borderColor: "#06B6D4", backgroundColor: "rgba(6, 182, 212, 0.05)" }}
                                    >
                                        {line}
                                    </motion.div>
                                ))}
                            </code>
                        </pre>
                    </div>

                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, suffix, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            className="glass-panel p-4 rounded-lg min-w-[140px] text-center"
        >
            <div className="text-3xl font-bold text-white mb-1">
                {value}{suffix}
            </div>
            <div className="text-xs text-white/50 uppercase tracking-wide">{label}</div>
        </motion.div>
    );
}
