import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, MessageCircle, Flame, AlertTriangle, ShieldCheck, Calendar,
    Wrench, Loader2, RefreshCw, MapPin,
} from 'lucide-react';
import BotModules from '../chatbot/bot-modules';

const TYPES = [
    { key: 'drill',       title: 'Drill',         icon: Calendar,       color: 'bg-gradient-to-br from-blue-500 to-blue-600',     blurb: 'Scheduled fire-drill' },
    { key: 'false-alarm', title: 'False Alarm',   icon: AlertTriangle,  color: 'bg-gradient-to-br from-amber-500 to-amber-600',   blurb: 'Sensor pulled, no real event' },
    { key: 'real-event',  title: 'Real Event',    icon: Flame,          color: 'bg-gradient-to-br from-red-500 to-red-600',       blurb: 'Confirmed incident' },
    { key: 'maintenance', title: 'Maintenance',   icon: Wrench,         color: 'bg-gradient-to-br from-slate-500 to-slate-600',   blurb: 'Detector service / replacement' },
];

const SEVERITY_STYLE = {
    info:   'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    low:    'bg-slate-50 text-slate-700 ring-1 ring-slate-200',
    medium: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    high:   'bg-red-50 text-red-700 ring-1 ring-red-200',
};
const STATUS_STYLE = {
    scheduled: 'bg-blue-100 text-blue-700 border border-blue-200',
    open:      'bg-red-100 text-red-700 border border-red-200',
    closed:    'bg-slate-100 text-slate-600 border border-slate-200',
};

const FireAlarm = ({ onBack }) => {
    const navigate = useNavigate();
    const [isBotOpen, setIsBotOpen] = useState(false);
    // Admin PA greets on land.
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
        fetch(`/api/fire-alarm-events${qs}`)
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
        if (it.status === 'scheduled') acc.scheduled++;
        if (it.severity === 'high') acc.high++;
        if (it.type === 'real-event') acc.real++;
        return acc;
    }, { total: 0, scheduled: 0, high: 0, real: 0 });

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
                    <Flame size={26} className="text-red-400" />
                    <div>
                        <h1 className="text-xl font-bold leading-tight">Fire Alarm & Life Safety</h1>
                        <p className="text-xs text-slate-400">Sensor pulls · drills · maintenance windows</p>
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
                <Kpi label="Total events" value={counts.total}     accent="from-slate-700 to-slate-800" />
                <Kpi label="Scheduled"    value={counts.scheduled} accent="from-blue-600 to-blue-700" />
                <Kpi label="Real events"  value={counts.real}      accent="from-red-600 to-red-700" />
                <Kpi label="High severity" value={counts.high}     accent="from-amber-600 to-amber-700" />
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
                            {activeType ? `${activeType} events` : 'All fire-alarm events'}
                        </h2>
                        {loading && <Loader2 size={16} className="animate-spin text-red-400" />}
                    </div>
                    {error && (
                        <div className="px-4 py-3 text-sm text-red-300 bg-red-500/10">{error}</div>
                    )}
                    {!loading && !error && items.length === 0 && (
                        <div className="px-4 py-10 text-center text-slate-400">
                            <ShieldCheck size={32} className="mx-auto mb-2 opacity-60" />
                            <p className="text-sm">No events under this filter.</p>
                        </div>
                    )}
                    {!loading && items.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
                                        <th className="px-4 py-2">No.</th>
                                        <th className="px-4 py-2">Type</th>
                                        <th className="px-4 py-2">Location</th>
                                        <th className="px-4 py-2">Detected</th>
                                        <th className="px-4 py-2">Cleared</th>
                                        <th className="px-4 py-2">Severity</th>
                                        <th className="px-4 py-2">Status</th>
                                        <th className="px-4 py-2">Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(it => (
                                        <tr key={it._id} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="px-4 py-2 font-mono text-[11px] text-slate-300">{it.no}</td>
                                            <td className="px-4 py-2">{it.type}</td>
                                            <td className="px-4 py-2 flex items-center gap-1 text-[12px]"><MapPin size={11} className="opacity-60" />{it.location}</td>
                                            <td className="px-4 py-2 text-[12px] text-slate-300">{(it.detectedAt || '').replace('T', ' ').slice(0, 16)}</td>
                                            <td className="px-4 py-2 text-[12px] text-slate-300">{it.clearedAt ? it.clearedAt.replace('T', ' ').slice(0, 16) : '—'}</td>
                                            <td className="px-4 py-2">
                                                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${SEVERITY_STYLE[it.severity] || SEVERITY_STYLE.info}`}>
                                                    {it.severity}
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
                    moduleContext="Fire Alarm"
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

export default FireAlarm;
