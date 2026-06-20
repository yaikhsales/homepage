import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, MessageCircle, Video, WifiOff, Activity, ShieldCheck,
    Loader2, RefreshCw, Camera,
} from 'lucide-react';
import BotModules from '../chatbot/bot-modules';

const TYPES = [
    { key: 'device-offline',   title: 'Offline',           icon: WifiOff,     color: 'bg-gradient-to-br from-red-500 to-red-600',     blurb: 'Camera not reporting' },
    { key: 'motion-after-hrs', title: 'After-hours motion', icon: Activity,   color: 'bg-gradient-to-br from-amber-500 to-amber-600', blurb: 'Detected outside hours' },
    { key: 'tampering',        title: 'Tampering',         icon: Camera,      color: 'bg-gradient-to-br from-rose-500 to-pink-600',   blurb: 'Obscured or moved' },
];

const PRIORITY_STYLE = {
    high:   'bg-red-50 text-red-700 ring-1 ring-red-200',
    medium: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    low:    'bg-slate-50 text-slate-600 ring-1 ring-slate-200',
};
const STATUS_STYLE = {
    open:     'bg-red-100 text-red-700 border border-red-200',
    resolved: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
};

const CCTV = ({ onBack }) => {
    const navigate = useNavigate();
    const [isBotOpen, setIsBotOpen] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setIsBotOpen(true), 700);
        return () => clearTimeout(t);
    }, []);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeType, setActiveType] = useState(null);

    const fetchItems = useCallback(() => {
        setLoading(true);
        setError(null);
        const qs = activeType ? `?type=${encodeURIComponent(activeType)}` : '';
        fetch(`/api/cctv-incidents${qs}`)
            .then(r => r.json())
            .then(d => {
                if (!d?.ok) throw new Error(d?.error || 'Failed to load');
                setItems(d.items || []);
            })
            .catch(err => setError(err.message || String(err)))
            .finally(() => setLoading(false));
    }, [activeType]);
    useEffect(() => { fetchItems(); }, [fetchItems]);

    const counts = items.reduce((acc, it) => {
        acc.total++;
        if (it.status === 'open') acc.open++;
        if (it.priority === 'high') acc.high++;
        if (it.type === 'device-offline') acc.offline++;
        return acc;
    }, { total: 0, open: 0, high: 0, offline: 0 });

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
                    <Video size={26} className="text-blue-400" />
                    <div>
                        <h1 className="text-xl font-bold leading-tight">CCTV</h1>
                        <p className="text-xs text-slate-400">Camera health & incident log</p>
                    </div>
                </div>
                <button
                    onClick={fetchItems}
                    className="p-2 rounded-lg hover:bg-white/10 transition"
                    title="Refresh"
                >
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* KPI strip */}
            <div className="px-6 pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Kpi label="Total incidents" value={counts.total}   accent="from-slate-700 to-slate-800" />
                <Kpi label="Open"            value={counts.open}    accent="from-red-600 to-red-700" />
                <Kpi label="Offline cams"    value={counts.offline} accent="from-amber-600 to-amber-700" />
                <Kpi label="High priority"   value={counts.high}    accent="from-rose-600 to-rose-700" />
            </div>

            {/* Type filter tiles */}
            <div className="px-6 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                    onClick={() => setActiveType(null)}
                    className={`p-3 rounded-xl border transition text-left ${activeType === null ? 'border-white bg-white text-slate-900' : 'border-white/15 bg-white/5 hover:bg-white/10'}`}
                >
                    <div className="font-bold text-sm">All</div>
                    <div className="text-[11px] opacity-70 mt-0.5">{items.length} item{items.length === 1 ? '' : 's'}</div>
                </button>
                {TYPES.map(t => {
                    const Icon = t.icon;
                    const n = items.filter(i => i.type === t.key).length;
                    const isActive = activeType === t.key;
                    return (
                        <button
                            key={t.key}
                            onClick={() => setActiveType(isActive ? null : t.key)}
                            className={`p-3 rounded-xl text-white text-left transition relative ${t.color} shadow-md ${isActive ? 'ring-2 ring-white scale-[1.02]' : 'hover:scale-[1.02]'}`}
                        >
                            <Icon size={20} className="opacity-80" />
                            <div className="font-bold text-sm mt-1">{t.title}</div>
                            <div className="text-[11px] opacity-80 mt-0.5">{t.blurb}</div>
                            <div className="absolute top-2 right-2 bg-black/30 px-2 py-0.5 rounded-full text-[11px] font-bold">{n}</div>
                        </button>
                    );
                })}
            </div>

            {/* Records */}
            <div className="px-6 py-6">
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                        <h2 className="font-semibold text-sm">
                            {activeType ? `${activeType} incidents` : 'All CCTV incidents'}
                        </h2>
                        {loading && <Loader2 size={16} className="animate-spin text-blue-400" />}
                    </div>
                    {error && (
                        <div className="px-4 py-3 text-sm text-red-300 bg-red-500/10">{error}</div>
                    )}
                    {!loading && !error && items.length === 0 && (
                        <div className="px-4 py-10 text-center text-slate-400">
                            <ShieldCheck size={32} className="mx-auto mb-2 opacity-60" />
                            <p className="text-sm">No incidents under this filter.</p>
                        </div>
                    )}
                    {!loading && items.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
                                        <th className="px-4 py-2">No.</th>
                                        <th className="px-4 py-2">Camera</th>
                                        <th className="px-4 py-2">Type</th>
                                        <th className="px-4 py-2">Detected</th>
                                        <th className="px-4 py-2">Cleared</th>
                                        <th className="px-4 py-2">Priority</th>
                                        <th className="px-4 py-2">Status</th>
                                        <th className="px-4 py-2">Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(it => (
                                        <tr key={it._id} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="px-4 py-2 font-mono text-[11px] text-slate-300">{it.no}</td>
                                            <td className="px-4 py-2">{it.camera}</td>
                                            <td className="px-4 py-2">{it.type}</td>
                                            <td className="px-4 py-2 text-[12px] text-slate-300">{(it.detectedAt || '').replace('T', ' ').slice(0, 16)}</td>
                                            <td className="px-4 py-2 text-[12px] text-slate-300">{it.clearedAt ? it.clearedAt.replace('T', ' ').slice(0, 16) : '—'}</td>
                                            <td className="px-4 py-2">
                                                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${PRIORITY_STYLE[it.priority] || PRIORITY_STYLE.medium}`}>
                                                    {it.priority}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className={`text-[11px] px-2 py-1 rounded-md font-semibold ${STATUS_STYLE[it.status] || STATUS_STYLE.open}`}>
                                                    {it.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-[12px] text-slate-300 max-w-md truncate" title={it.note}>{it.note}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
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
                    moduleContext="CCTV"
                    currentVersion="yai1"
                    botsFilter={["admin-bot"]}
                    initialTopic={null}
                />
            )}
        </div>
    );
};

const Kpi = ({ label, value, accent }) => (
    <div className={`rounded-xl p-3 bg-gradient-to-br ${accent} shadow-md`}>
        <div className="text-[11px] uppercase tracking-wider opacity-80">{label}</div>
        <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
);

export default CCTV;
