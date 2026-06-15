"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { BarChart3, Activity, ChevronRight, Fingerprint } from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip as RechartsTooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
    Legend
} from 'recharts';

const COLORS = {
    Safe: 'url(#volSafe)',
    Adjust: 'url(#volAdjust)',
    Toxic: 'url(#volToxic)',
};

/* ── 3D Tilt Card Component ─────────────────────────────────────── */
const TiltCard = ({ children, className }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={`relative ${className}`}
        >
            <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="w-full h-full">
                {children}
            </div>
        </motion.div>
    );
};

export default function AnalyticsDashboard({ isUnlocked, reportData = [] }) {
    const [showVisuals, setShowVisuals] = useState(isUnlocked);

    const derivedData = useMemo(() => {
        if (!reportData || reportData.length === 0) {
            return {
                confidence: 0,
                riskDistribution: [
                    { name: 'Safe', value: 0, color: COLORS.Safe },
                    { name: 'Adjust Dosage', value: 0, color: COLORS.Adjust },
                    { name: 'Toxic', value: 0, color: COLORS.Toxic }
                ],
                drugRisk: [],
                geneInvolvement: [],
                timeline: ['VCF Validation', 'Variant Parsing', 'Rule Engine', 'Risk Classification', 'JSON Output']
            };
        }

        let sumConf = 0, cCount = 0;
        let safeCount = 0, adjustCount = 0, toxicCount = 0;
        const drugMap = [];
        const geneMap = {};

        reportData.forEach(item => {
            if (item.confidence) { sumConf += item.confidence; cCount++; }
            let numLevel = 1;
            if (item.riskLevel === 'HIGH') { toxicCount++; numLevel = 3; }
            else if (item.riskLevel === 'MODERATE') { adjustCount++; numLevel = 2; }
            else { safeCount++; numLevel = 1; }

            if (item.drug) {
                drugMap.push({
                    name: item.drug,
                    RiskLevel: numLevel,
                    color: numLevel === 3 ? COLORS.Toxic : numLevel === 2 ? COLORS.Adjust : COLORS.Safe
                });
            }
            if (item.gene) {
                if (!geneMap[item.gene]) geneMap[item.gene] = { name: item.gene, "High Risk": 0, "Moderate Risk": 0, "Low Risk": 0 };
                if (item.riskLevel === 'HIGH') geneMap[item.gene]["High Risk"]++;
                else if (item.riskLevel === 'MODERATE') geneMap[item.gene]["Moderate Risk"]++;
                else geneMap[item.gene]["Low Risk"]++;
            }
        });

        const confidence = cCount > 0 ? (sumConf / cCount).toFixed(2) : 0.85;

        return {
            confidence,
            riskDistribution: [
                { name: 'Safe', value: safeCount, color: COLORS.Safe },
                { name: 'Adjust Dosage', value: adjustCount, color: COLORS.Adjust },
                { name: 'Toxic', value: toxicCount, color: COLORS.Toxic }
            ],
            drugRisk: drugMap,
            geneInvolvement: Object.values(geneMap),
            timeline: ['VCF Validation', 'Variant Parsing', 'Rule Engine', 'Risk Classification', 'JSON Output']
        };
    }, [reportData]);

    const handleAnalyze = () => setShowVisuals(true);

    const containerVariants = { hidden: { perspective: 2000 }, show: { perspective: 2000, transition: { staggerChildren: 0.15 } } };
    const itemVariants = { 
        hidden: { opacity: 0, z: -100, rotateX: 30, y: 50 }, 
        show: { opacity: 1, z: 0, rotateX: 0, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } } 
    };

    const cardClass = "bg-white/80 backdrop-blur-2xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2rem] p-4 sm:p-6 lg:p-8 overflow-hidden";
    
    const tooltipStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.8)',
        color: '#1e293b',
        fontSize: '12px',
        fontWeight: '600',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        padding: '12px 16px'
    };

    return (
        <div className="w-full rounded-[2rem] overflow-hidden mt-8 mb-6 relative bg-slate-50 border border-slate-200/60 shadow-[0_20px_60px_rgba(0,0,0,0.03)]" style={{ perspective: 2000 }}>
            {/* SVG Definitions for 3D Volumetric Charts */}
            <svg width="0" height="0" className="absolute">
                <defs>
                    <linearGradient id="volSafe" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#059669" />
                        <stop offset="50%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <linearGradient id="volAdjust" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#d97706" />
                        <stop offset="50%" stopColor="#fcd34d" />
                        <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                    <linearGradient id="volToxic" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#e11d48" />
                        <stop offset="50%" stopColor="#fb7185" />
                        <stop offset="100%" stopColor="#f43f5e" />
                    </linearGradient>
                    <filter id="glassInnerShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#ffffff" floodOpacity="0.5" />
                    </filter>
                </defs>
            </svg>

            {/* Glowing 3D ambient orbs */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="relative px-8 py-6 flex items-center justify-between border-b border-white/50 bg-white/40 backdrop-blur-xl z-20">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-white shadow-sm">
                        <Fingerprint className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-800 tracking-tight">
                            Genomic Analytics
                        </h2>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                            Pharmacogenomic 3D Visualization Subsystem
                        </p>
                    </div>
                </div>
                {showVisuals && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-white shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Live</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="relative min-h-[500px] p-8 lg:p-10 flex flex-col justify-center z-10" style={{ transformStyle: "preserve-3d" }}>
                <AnimatePresence mode="wait">
                    {/* LOCKED */}
                    {!isUnlocked && !showVisuals && (
                        <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center"
                        >
                            <TiltCard>
                                <div className="w-24 h-24 rounded-[2.5rem] bg-white flex items-center justify-center mb-6 mx-auto border border-slate-100 shadow-xl shadow-slate-200/50">
                                    <Activity className="w-10 h-10 text-slate-300" />
                                </div>
                                <p className="text-sm font-bold text-slate-400 text-center">
                                    Run analysis to unlock visual insights
                                </p>
                            </TiltCard>
                        </motion.div>
                    )}

                    {/* UNLOCKED — show "Analyze Insights" button */}
                    {isUnlocked && !showVisuals && (
                        <motion.div key="unlocked" initial={{ opacity: 0, scale: 0.9, rotateX: 20 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }} exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            className="absolute inset-0 flex flex-col items-center justify-center p-6"
                        >
                            <TiltCard>
                                <div className="bg-white/90 backdrop-blur-3xl border border-white shadow-[0_30px_80px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-10 max-w-sm text-center relative overflow-hidden group">
                                    <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-[50px] pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                                    
                                    <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 flex items-center justify-center mb-6 mx-auto relative z-10 border border-white shadow-xl">
                                        <BarChart3 className="w-10 h-10 text-indigo-500" />
                                    </div>
                                    
                                    <h3 className="text-2xl font-black text-slate-800 mb-3 relative z-10 tracking-tight">Ready for Render</h3>
                                    <p className="text-sm text-slate-500 mb-10 leading-relaxed relative z-10 font-medium">
                                        Data parsed successfully. The 3D volumetric rendering engine is primed.
                                    </p>
                                    
                                    <button
                                        onClick={handleAnalyze}
                                        className="relative w-full py-4 rounded-2xl font-bold text-sm tracking-wide text-white outline-none overflow-hidden group shadow-[0_15px_30px_rgba(99,102,241,0.4)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.6)] transition-all duration-300 hover:-translate-y-1"
                                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef)', backgroundSize: '200% 200%' }}
                                    >
                                        <motion.div animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }} transition={{ duration: 5, repeat: Infinity }} className="absolute inset-0 z-0" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef)', backgroundSize: '200% 200%' }} />
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Initialize Engine <ChevronRight className="w-4 h-4" />
                                        </span>
                                    </button>
                                </div>
                            </TiltCard>
                        </motion.div>
                    )}

                    {/* VISUALS */}
                    {showVisuals && (
                        <motion.div key="visual" variants={containerVariants} initial="hidden" animate="show" className="w-full flex justify-center">
                            <div className="w-full max-w-6xl flex flex-col gap-8">

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Risk Distribution Pie + Confidence */}
                                    <TiltCard className="lg:col-span-1">
                                        <motion.div variants={itemVariants} className={`h-full ${cardClass}`}>
                                            <div className="flex justify-between items-center mb-8">
                                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Risk Dist.</h4>
                                                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-white shadow-inner">
                                                    <svg width="20" height="20" viewBox="0 0 36 36" className="transform -rotate-90 drop-shadow-md">
                                                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                                                        <motion.path
                                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                            fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"
                                                            initial={{ strokeDasharray: "0, 100" }}
                                                            animate={{ strokeDasharray: `${derivedData.confidence * 100}, 100` }}
                                                            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                                                        />
                                                    </svg>
                                                    <span className="text-xs font-bold text-slate-700">{derivedData.confidence * 100}%</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex-1 flex justify-center items-center h-[200px]" style={{ filter: 'drop-shadow(0px 20px 20px rgba(0,0,0,0.15))' }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie data={derivedData.riskDistribution} dataKey="value" cx="50%" cy="50%" innerRadius="55%" outerRadius="75%" paddingAngle={5} stroke="none" cornerRadius={8}>
                                                            {derivedData.riskDistribution.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.color} filter="url(#glassInnerShadow)" />
                                                            ))}
                                                        </Pie>
                                                        <RechartsTooltip contentStyle={tooltipStyle} cursor={{fill: 'transparent'}} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <p className="text-xs text-center mt-6 font-medium text-slate-400">
                                                Distribution across analyzed drugs
                                            </p>
                                        </motion.div>
                                    </TiltCard>

                                    {/* Drug-wise Risk Bar Chart */}
                                    <TiltCard className="lg:col-span-2">
                                        <motion.div variants={itemVariants} className={`h-full ${cardClass}`}>
                                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">Drug Severity Profile</h4>
                                            <div className="h-[220px] w-full" style={{ filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.1))' }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart layout="vertical" data={derivedData.drugRisk} margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                                                        <XAxis type="number" domain={[0, 3]} ticks={[0, 1, 2, 3]}
                                                            tickFormatter={v => v === 1 ? 'Safe' : v === 2 ? 'Adjust' : v === 3 ? 'Toxic' : ''}
                                                            stroke="#cbd5e1" fontSize={11} axisLine={false} tickLine={false}
                                                        />
                                                        <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={11} fontWeight={600} axisLine={false} tickLine={false} width={80} />
                                                        <RechartsTooltip
                                                            cursor={{ fill: 'rgba(241,245,249,0.8)', radius: 12 }}
                                                            contentStyle={tooltipStyle}
                                                            formatter={(value) => [value === 1 ? 'Safe' : value === 2 ? 'Adjust Dosage' : 'Toxic', 'Severity']}
                                                        />
                                                        <Bar dataKey="RiskLevel" radius={[0, 12, 12, 0]} barSize={26}>
                                                            {derivedData.drugRisk.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                                            ))}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </motion.div>
                                    </TiltCard>
                                </div>

                                {/* Gene Involvement Map */}
                                <TiltCard className="w-full">
                                    <motion.div variants={itemVariants} className={cardClass}>
                                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">Gene Involvement Mapping</h4>
                                        <div className="h-[260px] w-full" style={{ filter: 'drop-shadow(0px 15px 20px rgba(0,0,0,0.1))' }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={derivedData.geneInvolvement} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} fontWeight={600} axisLine={false} tickLine={false} dy={10} />
                                                    <YAxis stroke="#cbd5e1" fontSize={11} axisLine={false} tickLine={false} />
                                                    <RechartsTooltip cursor={{ fill: 'rgba(241,245,249,0.8)' }} contentStyle={tooltipStyle} />
                                                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px', color: '#64748b', fontWeight: 600 }} iconType="circle" />
                                                    <Bar dataKey="High Risk" stackId="a" fill={COLORS.Toxic} radius={[0, 0, 0, 0]} barSize={46} />
                                                    <Bar dataKey="Moderate Risk" stackId="a" fill={COLORS.Adjust} radius={[0, 0, 0, 0]} />
                                                    <Bar dataKey="Low Risk" stackId="a" fill={COLORS.Safe} radius={[8, 8, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </motion.div>
                                </TiltCard>

                                {/* Analysis Pipeline Timeline - Live Energy Pulse */}
                                <TiltCard className="w-full">
                                    <motion.div variants={itemVariants} className={cardClass}>
                                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-6 lg:mb-10">Live Execution Trajectory</h4>
                                        <div className="w-full overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                                            <div className="flex items-center justify-between min-w-[600px] lg:min-w-full px-2 sm:px-8 pb-4">
                                            {derivedData.timeline.map((step, index, arr) => (
                                                <div key={step} className="flex items-center flex-1 group">
                                                    <div className="flex flex-col items-center gap-4 z-10 relative">
                                                        <motion.div 
                                                            className="w-12 h-12 rounded-[1.25rem] bg-white border-2 border-indigo-100 shadow-xl shadow-indigo-500/20 flex items-center justify-center relative z-10"
                                                            animate={{ boxShadow: ["0px 10px 20px rgba(99,102,241,0.1)", "0px 10px 40px rgba(99,102,241,0.4)", "0px 10px 20px rgba(99,102,241,0.1)"] }}
                                                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.4 }}
                                                        >
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ delay: 0.8 + index * 0.2, type: "spring", stiffness: 300 }}
                                                                className="w-3.5 h-3.5 rounded-full bg-indigo-500 relative z-10"
                                                            />
                                                        </motion.div>
                                                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 whitespace-nowrap absolute -bottom-8">
                                                            {step}
                                                        </span>
                                                    </div>
                                                    {index < arr.length - 1 && (
                                                        <div className="flex-1 h-[4px] mx-5 relative bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                                            {/* Base progress fill */}
                                                            <motion.div
                                                                className="absolute inset-y-0 left-0 bg-indigo-200"
                                                                initial={{ width: 0 }}
                                                                animate={{ width: '100%' }}
                                                                transition={{ duration: 0.6, delay: 1 + index * 0.2, ease: "easeInOut" }}
                                                            />
                                                            {/* Glowing energy pulse flowing through */}
                                                            <motion.div
                                                                className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-[2px]"
                                                                animate={{ x: ['-100px', '400px'] }}
                                                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 1.5 + index * 0.2 }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                </TiltCard>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
