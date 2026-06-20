import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, MessageCircle, ShieldAlert, Users, Truck, Package, Eye,
    Loader2, RefreshCw, Clock, MapPin, Video, AlertTriangle,
} from 'lucide-react';
import BotModules from '../chatbot/bot-modules';

const TABS = [
    { key: 'workers',   title: 'Workers',     icon: Users,        color: 'bg-gradient-to-br from-emerald-500 to-emerald-600', types: ['worker-in', 'worker-out'] },
    { key: 'trucks',    title: 'Trucks',      icon: Truck,        color: 'bg-gradient-to-br from-amber-500 to-amber-600',     types: ['truck-in', 'truck-out'] },
    { key: 'materials', title: 'Materials',   icon: Package,      color: 'bg-gradient-to-br from-blue-500 to-blue-600',       types: ['material-in', 'material-out'] },
    { key: 'visitors',  title: 'Visitors',    icon: Eye,          color: 'bg-gradient-to-br from-purple-500 to-purple-600',   types: ['visitor'] },
    { key: 'security',  title: 'Security',    icon: ShieldAlert,  color: 'bg-gradient-to-br from-red-500 to-red-600',         types: [] }, // sourced from cctv_incidents
];

const DIRECTION_STYLE = {
    'in':           'bg-emerald-100 text-emerald-700 border border-emerald-200',
    'worker-in':    'bg-emerald-100 text-emerald-700 border border-emerald-200',
    'truck-in':     'bg-emerald-100 text-emerald-700 border border-emerald-200',
    'material-in':  'bg-emerald-100 text-emerald-700 border border-emerald-200',
    'out':          'bg-slate-100 text-slate-700 border border-slate-200',
    'worker-out':   'bg-slate-100 text-slate-700 border border-slate-200',
    'truck-out':    'bg-slate-100 text-slate-700 border border-slate-200',
    'material-out': 'bg-slate-100 text-slate-700 border border-slate-200',
    'open':         'bg-amber-100 text-amber-700 border border-amber-200',
    'closed':       'bg-slate-100 text-slate-600 border border-slate-200',
    'visitor':      'bg-purple-100 text-purple-700 border border-purple-200',
};

const PRIORITY_STYLE = {
    high:   'bg-red-50 text-red-700 ring-1 ring-red-200',
    medium: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    low:    'bg-slate-50 text-slate-600 ring-1 ring-slate-200',
};

const GatePass = ({ onBack }) => {
    const navigate = useNavigate();
    const [isBotOpen, setIsBotOpen] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setIsBotOpen(true), 700);
        return () => clearTimeout(t);
    }, []);

    const [activeTab, setActiveTab] = useState('workers');
    const [passes, setPasses] = useState([]);
    const [cctv, setCctv] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const todayISO = new Date().toISOString().slice(0, 10);

    const fetchAll = useCallback(() => {
        setLoading(true);
        setError(null);
        Promise.all([
            fetch(`/api/gate-passes?date=${todayISO}`).then(r => r.json()),
            fetch(`/api/cctv-incidents?status=open`).then(r => r.json()),
        ])
            .then(([gp, cc]) => {
                if (!gp?.ok) throw new Error(gp?.error || 'Gate-passes load failed');
                if (!cc?.ok) throw new Error(cc?.error || 'CCTV load failed');
                setPasses(gp.items || []);
                setCctv(cc.items || []);
            })
            .catch(err => setError(err.message || String(err)))
            .finally(() => setLoading(false));
    }, [todayISO]);
    useEffect(() => { fetchAll(); }, [fetchAll]);

    // Per-tab filtered records
    const tabCfg = TABS.find(t => t.key === activeTab);
    const tabRows = activeTab === 'security'
        ? cctv
        : passes.filter(p => tabCfg.types.includes(p.type));

    // KPI counters
    const workersIn  = passes.filter(p => p.type === 'worker-in').length;
    const workersOut = passes.filter(p => p.type === 'worker-out').length;
    const trucksToday = passes.filter(p => p.type === 'truck-in' || p.type === 'truck-out').length;
    const materialsToday = passes.filter(p => p.type === 'material-in' || p.type === 'material-out').length;
    const securityOpen = cctv.filter(c => c.status === 'open').length;

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Header */}
            <div className="bg-slate-950/80 backdrop-blur px-6 py-4 flex items-center justify-between border-b border-white/10 sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack ? onBack : () => navigate(-1)}
                        className="p-2 rounded-lg hover:bg-white/10 transition"
                        aria-label="Back"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <ShieldAlert size={26} className="text-cyan-400" />
                    <div>
                        <h1 className="text-xl font-bold leading-tight">Gate Pass Control</h1>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock size={11} className="text-slate-500" />
                            {todayISO} · Security · Gate-1 / Gate-2
                        </p>
                    </div>
                </div>
                <button
                    onClick={fetchAll}
                    className="p-2 rounded-lg hover:bg-white/10 transition"
                    title="Refresh"
                >
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* KPI strip */}
            <div className="px-6 pt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
                <Kpi label="Workers in"     value={workersIn}      accent="from-emerald-600 to-emerald-700" />
                <Kpi label="Workers out"    value={workersOut}     accent="from-slate-600 to-slate-700" />
                <Kpi label="Trucks today"   value={trucksToday}    accent="from-amber-600 to-amber-700" />
                <Kpi label="Material moves" value={materialsToday} accent="from-blue-600 to-blue-700" />
                <Kpi label="CCTV alerts"    value={securityOpen}   accent="from-red-600 to-red-700" pulse={securityOpen > 0} />
            </div>

            {/* Tabs */}
            <div className="px-6 pt-4 flex flex-wrap gap-2">
                {TABS.map(t => {
                    const Icon = t.icon;
                    const n = t.key === 'security'
                        ? cctv.length
                        : passes.filter(p => t.types.includes(p.type)).length;
                    const isActive = activeTab === t.key;
                    return (
                        <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            className={`px-4 py-2 rounded-xl text-white text-left transition relative ${t.color} shadow-md flex items-center gap-2 ${isActive ? 'ring-2 ring-white scale-[1.02]' : 'opacity-80 hover:opacity-100'}`}
                        >
                            <Icon size={16} />
                            <span className="font-semibold text-sm">{t.title}</span>
                            <span className="bg-black/30 px-2 py-0.5 rounded-full text-[11px] font-bold">{n}</span>
                        </button>
                    );
                })}
            </div>

            {/* Records */}
            <div className="px-6 py-6">
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                        <h2 className="font-semibold text-sm flex items-center gap-2">
                            {activeTab === 'security' && <AlertTriangle size={14} className="text-red-400" />}
                            {tabCfg.title} — today
                        </h2>
                        {loading && <Loader2 size={16} className="animate-spin text-cyan-400" />}
                    </div>
                    {error && (
                        <div className="px-4 py-3 text-sm text-red-300 bg-red-500/10">{error}</div>
                    )}
                    {!loading && !error && tabRows.length === 0 && (
                        <div className="px-4 py-10 text-center text-slate-400 text-sm">
                            Nothing to show under this tab today.
                        </div>
                    )}

                    {/* Security tab — CCTV incidents */}
                    {!loading && activeTab === 'security' && tabRows.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
                                        <th className="px-4 py-2">No.</th>
                                        <th className="px-4 py-2">Camera</th>
                                        <th className="px-4 py-2">Type</th>
                                        <th className="px-4 py-2">Detected</th>
                                        <th className="px-4 py-2">Priority</th>
                                        <th className="px-4 py-2">Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tabRows.map(it => (
                                        <tr key={it._id} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="px-4 py-2 font-mono text-[11px] text-slate-300">{it.no}</td>
                                            <td className="px-4 py-2 flex items-center gap-1 text-[12px]"><Video size={11} className="opacity-60" />{it.camera}</td>
                                            <td className="px-4 py-2">{it.type}</td>
                                            <td className="px-4 py-2 text-[12px] text-slate-300">{(it.detectedAt || '').replace('T', ' ').slice(0, 16)}</td>
                                            <td className="px-4 py-2">
                                                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${PRIORITY_STYLE[it.priority] || PRIORITY_STYLE.medium}`}>
                                                    {it.priority}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-[12px] text-slate-300 max-w-md truncate" title={it.note}>{it.note}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* All other tabs — gate-pass rows */}
                    {!loading && activeTab !== 'security' && tabRows.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
                                        <th className="px-4 py-2">No.</th>
                                        <th className="px-4 py-2">Time</th>
                                        <th className="px-4 py-2">Direction</th>
                                        <th className="px-4 py-2">Who</th>
                                        <th className="px-4 py-2">{activeTab === 'trucks' ? 'Plate / Driver' : (activeTab === 'workers' ? 'Line' : 'Item')}</th>
                                        <th className="px-4 py-2">Purpose</th>
                                        <th className="px-4 py-2">Host</th>
                                        <th className="px-4 py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tabRows.map(it => (
                                        <tr key={it._id} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="px-4 py-2 font-mono text-[11px] text-slate-300">{it.no}</td>
                                            <td className="px-4 py-2 text-[12px] text-slate-300">{it.time}</td>
                                            <td className="px-4 py-2">
                                                <span className={`text-[11px] px-2 py-1 rounded-md font-semibold ${DIRECTION_STYLE[it.type] || 'bg-slate-100 text-slate-700'}`}>
                                                    {it.type.replace(/-/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2">
                                                <div className="font-medium">{it.who}</div>
                                                {it.flag && (
                                                    <span className="text-[10px] text-amber-400 italic">flag: {it.flag}</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-[12px]">
                                                {activeTab === 'trucks' ? (it.plate ? <div><div className="font-mono">{it.plate}</div><div className="text-slate-400 text-[11px]">{it.driver}</div></div> : '—')
                                                    : activeTab === 'workers' ? (it.line || '—')
                                                    : (it.item || '—')}
                                            </td>
                                            <td className="px-4 py-2 text-[12px] text-slate-300">{it.purpose}</td>
                                            <td className="px-4 py-2 flex items-center gap-1 text-[12px] text-slate-300"><MapPin size={10} className="opacity-60" />{it.host}</td>
                                            <td className="px-4 py-2">
                                                <span className={`text-[11px] px-2 py-1 rounded-md font-semibold ${DIRECTION_STYLE[it.status] || 'bg-slate-100 text-slate-700'}`}>
                                                    {it.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {activeTab === 'security' && cctv.length > 0 && (
                    <p className="text-[11px] text-slate-500 mt-3 flex items-center gap-1">
                        <ShieldAlert size={11} className="text-red-500" />
                        Suspicious-person and device-health alerts pulled from the CCTV channel. High-priority items appear at the top of the Admin PA chat.
                    </p>
                )}
            </div>

            {/* Admin PA — blue/cyan bubble (hidden while panel open) */}
            {!isBotOpen && (
                <button
                    onClick={() => setIsBotOpen(true)}
                    className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                    aria-label="Ask Admin PA"
                    title="Ask Admin PA"
                >
                    <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                </button>
            )}

            {isBotOpen && (
                <BotModules
                    onClose={() => setIsBotOpen(false)}
                    moduleContext="Gate Pass"
                    currentVersion="yai1"
                    botsFilter={["admin-bot"]}
                    initialTopic="Gate passes today"
                />
            )}
        </div>
    );
};

const Kpi = ({ label, value, accent, pulse }) => (
    <div className={`rounded-xl p-3 bg-gradient-to-br ${accent} shadow-md relative ${pulse ? 'animate-pulse' : ''}`}>
        <div className="text-[11px] uppercase tracking-wider opacity-80">{label}</div>
        <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
);

export default GatePass;
