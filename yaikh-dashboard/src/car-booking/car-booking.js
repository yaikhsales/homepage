import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, MessageCircle, Car, Users, GraduationCap, HeartPulse,
    Briefcase, Landmark, Truck, Loader2, RefreshCw, Clock,
} from 'lucide-react';
import BotModules from '../chatbot/bot-modules';

const CATEGORIES = [
    { key: 'buyer-visit', title: 'Buyer Visit',  icon: Briefcase,    color: 'bg-gradient-to-br from-emerald-500 to-emerald-600', blurb: 'Buyer airport pickups / returns' },
    { key: 'training',    title: 'Training',     icon: GraduationCap, color: 'bg-gradient-to-br from-blue-500 to-blue-600',       blurb: 'Staff transport to off-site training' },
    { key: 'medical',     title: 'Medical',      icon: HeartPulse,    color: 'bg-gradient-to-br from-red-500 to-red-600',         blurb: 'Worker → hospital / clinic' },
    { key: 'government',  title: 'Government',   icon: Landmark,      color: 'bg-gradient-to-br from-purple-500 to-purple-600',   blurb: 'MoC / MLVT / ministry visits' },
    { key: 'logistics',   title: 'Logistics',    icon: Truck,         color: 'bg-gradient-to-br from-amber-500 to-amber-600',     blurb: 'Port, customs, supplier runs' },
    { key: 'hr',          title: 'HR / New-hire',icon: Users,         color: 'bg-gradient-to-br from-cyan-500 to-cyan-600',       blurb: 'New-hire pickup, candidate trips' },
];

const STATUS_STYLE = {
    pending:      'bg-amber-100 text-amber-700 border border-amber-200',
    confirmed:    'bg-blue-100 text-blue-700 border border-blue-200',
    'in-progress':'bg-emerald-100 text-emerald-700 border border-emerald-200',
    completed:    'bg-slate-100 text-slate-700 border border-slate-200',
};
const PRIORITY_STYLE = {
    high:   'bg-red-50 text-red-700 ring-1 ring-red-200',
};

const CarBooking = ({ onBack }) => {
    const navigate = useNavigate();
    const [isBotOpen, setIsBotOpen] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setIsBotOpen(true), 700);
        return () => clearTimeout(t);
    }, []);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);

    const fetchItems = useCallback(() => {
        setLoading(true);
        setError(null);
        const qs = activeCategory ? `?category=${encodeURIComponent(activeCategory)}` : '';
        fetch(`/api/car-bookings${qs}`)
            .then(r => r.json())
            .then(d => {
                if (!d?.ok) throw new Error(d?.error || 'Failed to load');
                setItems(d.items || []);
            })
            .catch(err => setError(err.message || String(err)))
            .finally(() => setLoading(false));
    }, [activeCategory]);
    useEffect(() => { fetchItems(); }, [fetchItems]);

    const todayISO = new Date().toISOString().slice(0, 10);
    const todayCount = items.filter(it => it.date === todayISO).length;
    const inProgress = items.filter(it => it.status === 'in-progress').length;
    const pending    = items.filter(it => it.status === 'pending').length;
    const highPrio   = items.filter(it => it.priority === 'high').length;

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Header */}
            <div className="bg-slate-950/80 backdrop-blur px-6 py-4 flex items-center justify-between border-b border-white/10 sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <button onClick={onBack ? onBack : () => navigate(-1)} className="p-2 rounded-lg hover:bg-white/10 transition" aria-label="Back">
                        <ArrowLeft size={20} />
                    </button>
                    <Car size={26} className="text-cyan-400" />
                    <div>
                        <h1 className="text-xl font-bold leading-tight">Car Booking</h1>
                        <p className="text-xs text-slate-400">Company-vehicle schedule · today + tomorrow</p>
                    </div>
                </div>
                <button onClick={fetchItems} className="p-2 rounded-lg hover:bg-white/10 transition" title="Refresh">
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* KPI strip */}
            <div className="px-6 pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Kpi label="Today"        value={todayCount} accent="from-cyan-600 to-cyan-700" />
                <Kpi label="In progress"  value={inProgress} accent="from-emerald-600 to-emerald-700" />
                <Kpi label="Pending"      value={pending}    accent="from-amber-600 to-amber-700" />
                <Kpi label="High priority" value={highPrio}  accent="from-red-600 to-red-700" pulse={highPrio > 0} />
            </div>

            {/* Category filter tiles */}
            <div className="px-6 pt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <button
                    onClick={() => setActiveCategory(null)}
                    className={`p-3 rounded-xl border transition text-left ${activeCategory === null ? 'border-white bg-white text-slate-900' : 'border-white/15 bg-white/5 hover:bg-white/10'}`}
                >
                    <div className="font-bold text-sm">All</div>
                    <div className="text-[11px] opacity-70 mt-0.5">{items.length} trip{items.length === 1 ? '' : 's'}</div>
                </button>
                {CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    const n = items.filter(i => i.category === cat.key).length;
                    const isActive = activeCategory === cat.key;
                    return (
                        <button
                            key={cat.key}
                            onClick={() => setActiveCategory(isActive ? null : cat.key)}
                            className={`p-3 rounded-xl text-white text-left transition relative ${cat.color} shadow-md ${isActive ? 'ring-2 ring-white scale-[1.02]' : 'hover:scale-[1.02]'}`}
                        >
                            <Icon size={20} className="opacity-80" />
                            <div className="font-bold text-sm mt-1">{cat.title}</div>
                            <div className="text-[11px] opacity-80 mt-0.5">{cat.blurb}</div>
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
                            {activeCategory ? `${CATEGORIES.find(c => c.key === activeCategory)?.title} trips` : 'All trips'}
                        </h2>
                        {loading && <Loader2 size={16} className="animate-spin text-cyan-400" />}
                    </div>
                    {error && <div className="px-4 py-3 text-sm text-red-300 bg-red-500/10">{error}</div>}
                    {!loading && !error && items.length === 0 && (
                        <div className="px-4 py-10 text-center text-slate-400 text-sm">No trips under this filter.</div>
                    )}
                    {!loading && items.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
                                        <th className="px-4 py-2">No.</th>
                                        <th className="px-4 py-2">Date</th>
                                        <th className="px-4 py-2">Time</th>
                                        <th className="px-4 py-2">Category</th>
                                        <th className="px-4 py-2">Vehicle / Driver</th>
                                        <th className="px-4 py-2">Requester</th>
                                        <th className="px-4 py-2">Purpose</th>
                                        <th className="px-4 py-2">Pax</th>
                                        <th className="px-4 py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(it => (
                                        <tr key={it._id} className={`border-b border-white/5 hover:bg-white/5 ${it.priority === 'high' ? 'bg-red-500/5' : ''}`}>
                                            <td className="px-4 py-2 font-mono text-[11px] text-slate-300">{it.no}</td>
                                            <td className="px-4 py-2 text-[12px] text-slate-300">{it.date}</td>
                                            <td className="px-4 py-2 text-[12px] text-slate-300 flex items-center gap-1"><Clock size={10} className="opacity-60" />{it.start}–{it.end}</td>
                                            <td className="px-4 py-2 text-[12px]">{it.category}</td>
                                            <td className="px-4 py-2">
                                                <div className="font-medium text-[12px]">{it.vehicle}</div>
                                                <div className="text-[11px] text-slate-400">{it.driver}</div>
                                            </td>
                                            <td className="px-4 py-2 text-[12px]">{it.requester}</td>
                                            <td className="px-4 py-2 text-[12px] text-slate-300 max-w-md">{it.purpose}</td>
                                            <td className="px-4 py-2 text-[12px] text-center">{it.passengers || '—'}</td>
                                            <td className="px-4 py-2">
                                                <span className={`text-[11px] px-2 py-1 rounded-md font-semibold ${STATUS_STYLE[it.status] || STATUS_STYLE.pending}`}>
                                                    {it.status}
                                                </span>
                                                {it.priority === 'high' && (
                                                    <div className={`text-[10px] mt-1 px-2 py-0.5 rounded-full font-semibold ${PRIORITY_STYLE.high} inline-block`}>HIGH</div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Admin PA */}
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
                    moduleContext="Car Booking"
                    currentVersion="yai1"
                    botsFilter={["admin-bot"]}
                    initialTopic={null}
                />
            )}
        </div>
    );
};

const Kpi = ({ label, value, accent, pulse }) => (
    <div className={`rounded-xl p-3 bg-gradient-to-br ${accent} shadow-md ${pulse ? 'animate-pulse' : ''}`}>
        <div className="text-[11px] uppercase tracking-wider opacity-80">{label}</div>
        <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
);

export default CarBooking;
