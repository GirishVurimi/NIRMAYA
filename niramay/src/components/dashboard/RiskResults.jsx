"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle, CheckCircle, Info, ChevronDown,
    ChevronUp, Download, Copy, FileJson, Activity, FlaskConical, BookOpen
} from 'lucide-react';
import { EmptyState } from '@/components/dashboard/StatusStates';

export default function RiskResults({ data, rawResponse }) {
    const [expandedCards, setExpandedCards] = useState([]);
    const [jsonOpen, setJsonOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    if (!data || data.length === 0) {
        return <EmptyState />;
    }

    // Auto-expand high risk cards on mount
    useEffect(() => {
        if (data) {
            const highRiskIds = data.filter(d => d.riskLevel === 'HIGH').map(d => d.id);
            setExpandedCards(highRiskIds);
        }
    }, [data]);

    const toggleCard = (id) => {
        setExpandedCards(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleCopy = () => {
        const exportData = rawResponse || data;
        navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const handleDownload = () => {
        const exportData = rawResponse || data;
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `niramay-pharmacogenomic-report-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const getRiskStyles = (level) => {
        switch (level) {
            case 'HIGH':
                return {
                    border: 'border-rose-200/60',
                    bg: 'bg-gradient-to-br from-rose-50/80 to-white/80 hover:from-rose-50 hover:to-rose-50/50',
                    text: 'text-rose-600',
                    badge: 'bg-rose-100 text-rose-700 border-rose-200',
                    icon: <AlertTriangle className="w-6 h-6 text-rose-500" />,
                    shadow: 'shadow-[0_8px_30px_rgba(244,63,94,0.06)]',
                    glow: { boxShadow: ["0 0 0px rgba(244,63,94,0)", "0 0 20px rgba(244,63,94,0.15)", "0 0 0px rgba(244,63,94,0)"] }
                };
            case 'MODERATE':
                return {
                    border: 'border-amber-200/60',
                    bg: 'bg-gradient-to-br from-amber-50/80 to-white/80 hover:from-amber-50 hover:to-amber-50/50',
                    text: 'text-amber-600',
                    badge: 'bg-amber-100 text-amber-700 border-amber-200',
                    icon: <Activity className="w-6 h-6 text-amber-500" />,
                    shadow: 'shadow-[0_8px_30px_rgba(245,158,11,0.06)]',
                    glow: {}
                };
            case 'LOW':
                return {
                    border: 'border-emerald-200/60',
                    bg: 'bg-gradient-to-br from-emerald-50/80 to-white/80 hover:from-emerald-50 hover:to-emerald-50/50',
                    text: 'text-emerald-600',
                    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                    icon: <CheckCircle className="w-6 h-6 text-emerald-500" />,
                    shadow: 'shadow-[0_8px_30px_rgba(16,185,129,0.06)]',
                    glow: {}
                };
            default:
                return {};
        }
    };

    return (
        <div className="w-full space-y-8 mt-10">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <h3 className="text-sm uppercase tracking-widest text-slate-800 font-bold">
                    Clinical Risk Assessment
                </h3>
                <button
                    onClick={() => setJsonOpen(!jsonOpen)}
                    className="flex items-center gap-2 text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100"
                >
                    <FileJson className="w-4 h-4" />
                    {jsonOpen ? 'Hide Source' : 'View Source'}
                </button>
            </div>

            <div className="space-y-6">
                <AnimatePresence>
                    {data.map((item, index) => {
                        const styles = getRiskStyles(item.riskLevel);
                        const isExpanded = expandedCards.includes(item.id);

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                layout
                                className={`relative rounded-3xl border ${styles.border} ${styles.bg} ${styles.shadow} backdrop-blur-xl overflow-hidden transition-all duration-300 hover:shadow-lg`}
                            >
                                {/* High Risk Glow Animation */}
                                {item.riskLevel === 'HIGH' && (
                                    <motion.div
                                        className="absolute inset-0 pointer-events-none rounded-3xl"
                                        animate={styles.glow}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                )}

                                {/* Card Header */}
                                <div
                                    onClick={() => toggleCard(item.id)}
                                    className="px-6 py-5 flex items-center justify-between cursor-pointer relative z-10"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`p-3 rounded-2xl bg-white border ${styles.border} shadow-sm`}>
                                            {styles.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h4 className="text-lg text-slate-800 font-bold tracking-tight">
                                                    {item.gene}
                                                </h4>
                                                {item.drug && (
                                                    <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 font-semibold bg-white shadow-sm">
                                                        <FlaskConical className="w-3.5 h-3.5 text-slate-400" />
                                                        {item.drug}
                                                    </span>
                                                )}
                                                <span className={`text-[10px] px-2.5 py-1 rounded-lg border ${styles.badge} font-bold uppercase shadow-sm tracking-wide`}>
                                                    {item.riskLevel}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1.5 font-medium">
                                                {item.phenotype} <span className="mx-1 text-slate-300">|</span> Variant: <span className="font-mono bg-slate-100 px-1 rounded text-slate-600">{item.variant}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <motion.div
                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm"
                                    >
                                        <ChevronDown className="w-5 h-5" />
                                    </motion.div>
                                </div>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                            className="relative z-10 border-t border-slate-200/50 bg-white/50"
                                        >
                                            <div className="p-6 md:p-8 space-y-6">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                    <div>
                                                        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-3">Impact Analysis</span>
                                                        <p className="text-sm text-slate-600 leading-relaxed bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-5">
                                                        <div>
                                                            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-3">Phenotype</span>
                                                            <p className="text-sm text-slate-700 font-semibold">{item.phenotype}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-3">Clinical Action</span>
                                                            <div className={`text-sm ${styles.text} bg-white p-5 rounded-2xl border ${styles.border} shadow-sm leading-relaxed font-medium`}>
                                                                {item.recommendation}
                                                            </div>
                                                        </div>
                                                        {item.dosingRecommendation && (
                                                            <div>
                                                                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-3">Dosing Recommendation</span>
                                                                <p className="text-sm text-slate-600 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm leading-relaxed">
                                                                    {item.dosingRecommendation}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {item.alternativeDrugs && item.alternativeDrugs.length > 0 && (
                                                            <div>
                                                                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-3">Alternative Drugs</span>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {item.alternativeDrugs.map((alt, i) => (
                                                                        <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-indigo-100 text-indigo-600 bg-indigo-50 shadow-sm">
                                                                            {alt}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {(item.confidence || item.guidelineSource) && (
                                                            <div className="flex items-center gap-3 mt-4 flex-wrap pt-4 border-t border-slate-200/50">
                                                                {item.confidence && (
                                                                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 rounded-lg px-2.5 py-1">
                                                                        Confidence: {(item.confidence * 100).toFixed(0)}%
                                                                    </span>
                                                                )}
                                                                {item.guidelineSource && (
                                                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-100 rounded-lg px-2.5 py-1">
                                                                        <BookOpen className="w-3 h-3" />
                                                                        {item.guidelineSource}
                                                                    </span>
                                                                )}
                                                                {item.citations && item.citations.map((c, i) => (
                                                                    <span key={i} className="text-[10px] font-bold text-indigo-500/80 bg-indigo-50 rounded-lg px-2.5 py-1 border border-indigo-100/50">
                                                                        {c}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* JSON Output Panel */}
            <AnimatePresence>
                {jsonOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                            <span className="text-sm font-bold text-slate-700">JSON Output</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCopy}
                                    className="p-2 hover:bg-white rounded-xl text-slate-500 shadow-sm border border-transparent hover:border-slate-200 transition-all flex items-center gap-2"
                                    title="Copy to Clipboard"
                                >
                                    <Copy className="w-4 h-4" />
                                    {copySuccess && <span className="text-[10px] font-bold text-emerald-500">Copied!</span>}
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="p-2 hover:bg-white rounded-xl text-slate-500 shadow-sm border border-transparent hover:border-slate-200 transition-all"
                                    title="Download JSON"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 overflow-x-auto max-h-96 bg-slate-800">
                            <pre className="text-xs font-mono text-emerald-400 leading-relaxed whitespace-pre-wrap">
                                {JSON.stringify(rawResponse || data, null, 2)}
                            </pre>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
