import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, MessageCircle, Flame, AlertTriangle, ShieldCheck, BatteryLow,
    Loader2, RefreshCw,
} from 'lucide-react';
import BotModules from '../chatbot/bot-modules';

const STATE_COLOR = {
    ok:            { fill: '#22c55e', stroke: '#16a34a', label: 'OK',          chip: 'bg-emerald-100 text-emerald-700' },
    'low-battery': { fill: '#f59e0b', stroke: '#d97706', label: 'Low battery', chip: 'bg-amber-100 text-amber-700' },
    faulty:        { fill: '#ef4444', stroke: '#b91c1c', label: 'Faulty',      chip: 'bg-red-100 text-red-700' },
};

const FireAlarm = ({ onBack }) => {
    const navigate = useNavigate();
    const [isBotOpen, setIsBotOpen] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setIsBotOpen(true), 700);
        return () => clearTimeout(t);
    }, []);

    const [sensors, setSensors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hovered, setHovered] = useState(null);

    const fetchSensors = useCallback(() => {
        setLoading(true);
        setError(null);
        fetch('/api/fire-alarm-sensors')
            .then(r => r.json())
            .then(d => {
                if (!d?.ok) throw new Error(d?.error || 'Failed to load');
                setSensors(d.items || []);
            })
            .catch(err => setError(err.message || String(err)))
            .finally(() => setLoading(false));
    }, []);
    useEffect(() => { fetchSensors(); }, [fetchSensors]);

    // Group sensors by building
    const buildings = sensors.reduce((acc, s) => {
        const b = s.building;
        if (!acc[b]) acc[b] = { id: b, name: s.buildingName, sensors: [] };
        acc[b].sensors.push(s);
        return acc;
    }, {});
    const buildingList = Object.values(buildings);

    const total      = sensors.length;
    const ok         = sensors.filter(s => s.state === 'ok').length;
    const lowBattery = sensors.filter(s => s.state === 'low-battery').length;
    const faulty     = sensors.filter(s => s.state === 'faulty').length;

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <div className="bg-slate-950/80 backdrop-blur px-6 py-4 flex items-center justify-between border-b border-white/10 sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <button onClick={onBack ? onBack : () => navigate(-1)} className="p-2 rounded-lg hover:bg-white/10 transition" aria-label="Back">
                        <ArrowLeft size={20} />
                    </button>
                    <Flame size={26} className="text-red-400" />
                    <div>
                        <h1 className="text-xl font-bold leading-tight">Fire Alarm Floor Plan</h1>
                        <p className="text-xs text-slate-400">{buildingList.length} buildings · {total} sensors</p>
                    </div>
                </div>
                <button onClick={fetchSensors} className="p-2 rounded-lg hover:bg-white/10 transition" title="Refresh">
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* KPI strip */}
            <div className="px-6 pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Kpi label="Total sensors" value={total}      accent="from-slate-700 to-slate-800" />
                <Kpi label="OK"            value={ok}         accent="from-emerald-600 to-emerald-700" />
                <Kpi label="Low battery"   value={lowBattery} accent="from-amber-600 to-amber-700" pulse={lowBattery > 0} />
                <Kpi label="Faulty"        value={faulty}     accent="from-red-600 to-red-700"     pulse={faulty > 0} />
            </div>

            {/* Legend */}
            <div className="px-6 pt-4 flex flex-wrap gap-3 text-xs">
                {Object.entries(STATE_COLOR).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
                        <span className="w-3 h-3 rounded-full" style={{ background: v.fill, border: `1.5px solid ${v.stroke}` }} />
                        <span>{v.label}</span>
                    </div>
                ))}
            </div>

            {/* Floor-plan grid — each building is a card with sensors as dots */}
            <div className="px-6 py-6">
                {loading && (
                    <div className="text-center py-10 text-slate-400 text-sm flex items-center justify-center gap-2">
                        <Loader2 size={16} className="animate-spin" /> Loading floor plan…
                    </div>
                )}
                {error && (
                    <div className="px-4 py-3 text-sm text-red-300 bg-red-500/10 rounded-lg">{error}</div>
                )}
                {!loading && buildingList.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {buildingList.map(b => {
                            const bFaulty = b.sensors.filter(s => s.state === 'faulty').length;
                            const bLow    = b.sensors.filter(s => s.state === 'low-battery').length;
                            return (
                                <div key={b.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                    <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-sm">{b.id} · {b.name}</div>
                                            <div className="text-[11px] text-slate-400">{b.sensors.length} sensors</div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[11px]">
                                            {bFaulty > 0 && <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full font-semibold">{bFaulty} faulty</span>}
                                            {bLow    > 0 && <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold">{bLow} low</span>}
                                            {bFaulty + bLow === 0 && <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">all clear</span>}
                                        </div>
                                    </div>
                                    {/* SVG floor plan */}
                                    <div className="aspect-[2/1] bg-gradient-to-br from-slate-800 to-slate-900 relative">
                                        <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                                            {/* building outline */}
                                            <rect x="1" y="1" width="98" height="48" fill="none" stroke="#475569" strokeWidth="0.6" strokeDasharray="2,1" rx="1.5" />
                                            {/* sensors as dots */}
                                            {b.sensors.map(s => {
                                                const c = STATE_COLOR[s.state] || STATE_COLOR.ok;
                                                const x = (s.xPct / 100) * 96 + 2;
                                                const y = (s.yPct / 100) * 46 + 2;
                                                const isHover = hovered === s.no;
                                                return (
                                                    <g key={s.no} onMouseEnter={() => setHovered(s.no)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'pointer' }}>
                                                        {s.state !== 'ok' && (
                                                            <circle cx={x} cy={y} r={isHover ? 4.5 : 3.5} fill={c.fill} opacity="0.25">
                                                                <animate attributeName="r" values={`${isHover ? 4.5 : 3.5};${isHover ? 6.5 : 5.5};${isHover ? 4.5 : 3.5}`} dur="1.8s" repeatCount="indefinite" />
                                                            </circle>
                                                        )}
                                                        <circle cx={x} cy={y} r={isHover ? 2.4 : 1.8} fill={c.fill} stroke={c.stroke} strokeWidth="0.4" />
                                                    </g>
                                                );
                                            })}
                                        </svg>
                                        {/* hover tooltip */}
                                        {hovered && b.sensors.find(s => s.no === hovered) && (() => {
                                            const s = b.sensors.find(x => x.no === hovered);
                                            const c = STATE_COLOR[s.state] || STATE_COLOR.ok;
                                            return (
                                                <div className="absolute top-2 left-2 bg-slate-950/95 border border-white/15 rounded-lg px-3 py-2 text-xs shadow-lg z-10">
                                                    <div className="font-mono text-[11px] text-slate-300">{s.no}</div>
                                                    <div className="font-semibold mt-0.5">{s.type} · {s.buildingName}</div>
                                                    <div className="mt-1 flex items-center gap-1.5">
                                                        <span className={`px-1.5 py-0.5 rounded-md ${c.chip} font-semibold text-[10px]`}>{c.label}</span>
                                                        <span className="text-slate-400 text-[10px]">battery {s.battery}%</span>
                                                    </div>
                                                    {s.note && <div className="mt-1 text-slate-400 text-[10px] max-w-[260px]">{s.note}</div>}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Anomalies table */}
                {!loading && (lowBattery + faulty) > 0 && (
                    <div className="mt-6 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                            <AlertTriangle size={14} className="text-red-400" />
                            <h2 className="font-semibold text-sm">Anomalies — needs attention</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
                                        <th className="px-4 py-2">Sensor</th>
                                        <th className="px-4 py-2">Building</th>
                                        <th className="px-4 py-2">Type</th>
                                        <th className="px-4 py-2">State</th>
                                        <th className="px-4 py-2">Battery</th>
                                        <th className="px-4 py-2">Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sensors.filter(s => s.state !== 'ok').map(s => {
                                        const c = STATE_COLOR[s.state] || STATE_COLOR.ok;
                                        return (
                                            <tr key={s.no} className="border-b border-white/5 hover:bg-white/5">
                                                <td className="px-4 py-2 font-mono text-[11px] text-slate-300">{s.no}</td>
                                                <td className="px-4 py-2 text-[12px]">{s.buildingName}</td>
                                                <td className="px-4 py-2 text-[12px]">{s.type}</td>
                                                <td className="px-4 py-2"><span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${c.chip}`}>{c.label}</span></td>
                                                <td className="px-4 py-2 text-[12px] flex items-center gap-1">
                                                    {s.battery < 20 && <BatteryLow size={12} className="text-amber-400" />}
                                                    {s.battery}%
                                                </td>
                                                <td className="px-4 py-2 text-[12px] text-slate-300 max-w-md">{s.note}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {!loading && (lowBattery + faulty) === 0 && total > 0 && (
                    <div className="mt-6 px-4 py-6 text-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <ShieldCheck size={32} className="mx-auto mb-2 text-emerald-400" />
                        <p className="text-sm text-emerald-300">All sensors green. No anomalies.</p>
                    </div>
                )}
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
                    moduleContext="Fire Alarm"
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

export default FireAlarm;
