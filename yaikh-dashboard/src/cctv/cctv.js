import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, MessageCircle, Video, WifiOff, ShieldAlert, ScanFace,
    Loader2, RefreshCw, AlertTriangle,
} from 'lucide-react';
import BotModules from '../chatbot/bot-modules';

const STATUS_RING = {
    live:    'ring-emerald-500/60',
    offline: 'ring-red-500/60',
};

const CCTV = ({ onBack }) => {
    const navigate = useNavigate();
    const [isBotOpen, setIsBotOpen] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setIsBotOpen(true), 700);
        return () => clearTimeout(t);
    }, []);

    const [cameras, setCameras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [zoneFilter, setZoneFilter] = useState(null);
    const [selectedCam, setSelectedCam] = useState(null);

    const fetchCameras = useCallback(() => {
        setLoading(true);
        setError(null);
        fetch('/api/cctv-cameras')
            .then(r => r.json())
            .then(d => {
                if (!d?.ok) throw new Error(d?.error || 'Failed to load');
                setCameras(d.items || []);
            })
            .catch(err => setError(err.message || String(err)))
            .finally(() => setLoading(false));
    }, []);
    useEffect(() => { fetchCameras(); }, [fetchCameras]);

    const visibleCams = zoneFilter ? cameras.filter(c => c.zone === zoneFilter) : cameras;
    const total      = cameras.length;
    const live       = cameras.filter(c => c.status === 'live').length;
    const offline    = cameras.filter(c => c.status === 'offline').length;
    const faceAlerts = cameras.filter(c => c.faceAlert && c.faceAlert.priority === 'high').length;
    const zones      = Array.from(new Set(cameras.map(c => c.zone))).sort();

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="bg-black/60 backdrop-blur px-6 py-4 flex items-center justify-between border-b border-white/10 sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <button onClick={onBack ? onBack : () => navigate(-1)} className="p-2 rounded-lg hover:bg-white/10 transition" aria-label="Back">
                        <ArrowLeft size={20} />
                    </button>
                    <Video size={26} className="text-cyan-400" />
                    <div>
                        <h1 className="text-xl font-bold leading-tight">CCTV Wall</h1>
                        <p className="text-xs text-slate-400">{total} cameras · {live} live · {offline} offline</p>
                    </div>
                </div>
                <button onClick={fetchCameras} className="p-2 rounded-lg hover:bg-white/10 transition" title="Refresh">
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* KPI strip */}
            <div className="px-6 pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Kpi label="Cameras"        value={total}      accent="from-slate-700 to-slate-800" />
                <Kpi label="Live"           value={live}       accent="from-emerald-600 to-emerald-700" />
                <Kpi label="Offline"        value={offline}    accent="from-red-600 to-red-700" pulse={offline > 0} />
                <Kpi label="Face alerts"    value={faceAlerts} accent="from-rose-600 to-pink-700" pulse={faceAlerts > 0} />
            </div>

            {/* Zone chips */}
            <div className="px-6 pt-4 flex flex-wrap gap-2">
                <button
                    onClick={() => setZoneFilter(null)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${zoneFilter === null ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >All zones</button>
                {zones.map(z => (
                    <button
                        key={z}
                        onClick={() => setZoneFilter(zoneFilter === z ? null : z)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${zoneFilter === z ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >{z}</button>
                ))}
            </div>

            {/* Camera grid */}
            <div className="px-6 py-6">
                {loading && (
                    <div className="text-center py-10 text-slate-400 text-sm flex items-center justify-center gap-2">
                        <Loader2 size={16} className="animate-spin" /> Loading cameras…
                    </div>
                )}
                {error && (
                    <div className="px-4 py-3 text-sm text-red-300 bg-red-500/10 rounded-lg">{error}</div>
                )}
                {!loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {visibleCams.map(cam => {
                            const isOffline = cam.status === 'offline';
                            const hasAlert  = cam.faceAlert && cam.faceAlert.priority === 'high';
                            return (
                                <button
                                    key={cam.no}
                                    onClick={() => setSelectedCam(cam)}
                                    className={`relative aspect-video rounded-xl overflow-hidden ring-2 ${hasAlert ? 'ring-red-500 animate-pulse' : STATUS_RING[cam.status] || 'ring-slate-700'} text-left transition hover:scale-[1.02]`}
                                >
                                    {/* Fake camera tile background — simulated feed */}
                                    <div className={`absolute inset-0 ${isOffline ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-700 to-slate-900'}`}>
                                        {isOffline ? (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                                                <WifiOff size={28} className="mb-1" />
                                                <span className="text-[10px] uppercase tracking-wider">No signal</span>
                                            </div>
                                        ) : (
                                            <>
                                                {/* CRT scan lines */}
                                                <div className="absolute inset-0 opacity-20" style={{
                                                    background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 1px, transparent 1px, transparent 3px)',
                                                }} />
                                                {/* LIVE dot */}
                                                <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                    <span className="text-[9px] font-bold text-white/90">LIVE</span>
                                                </div>
                                            </>
                                        )}

                                        {/* Face-alert overlay */}
                                        {hasAlert && (
                                            <>
                                                <div className="absolute inset-0 bg-red-500/10" />
                                                {/* Face-scan box (centered) */}
                                                <svg viewBox="0 0 100 56" className="absolute inset-0 w-full h-full pointer-events-none">
                                                    <rect x="36" y="14" width="28" height="28" fill="none" stroke="#f87171" strokeWidth="0.8" strokeDasharray="2,1.5">
                                                        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.6s" repeatCount="indefinite" />
                                                    </rect>
                                                    <line x1="40" y1="20" x2="44" y2="20" stroke="#f87171" strokeWidth="0.6" />
                                                    <line x1="40" y1="20" x2="40" y2="24" stroke="#f87171" strokeWidth="0.6" />
                                                    <line x1="60" y1="20" x2="56" y2="20" stroke="#f87171" strokeWidth="0.6" />
                                                    <line x1="60" y1="20" x2="60" y2="24" stroke="#f87171" strokeWidth="0.6" />
                                                    <line x1="40" y1="36" x2="44" y2="36" stroke="#f87171" strokeWidth="0.6" />
                                                    <line x1="40" y1="36" x2="40" y2="32" stroke="#f87171" strokeWidth="0.6" />
                                                    <line x1="60" y1="36" x2="56" y2="36" stroke="#f87171" strokeWidth="0.6" />
                                                    <line x1="60" y1="36" x2="60" y2="32" stroke="#f87171" strokeWidth="0.6" />
                                                </svg>
                                                <div className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-lg">
                                                    <ScanFace size={10} /> ALERT
                                                </div>
                                            </>
                                        )}

                                        {/* Camera label */}
                                        <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/70 text-white text-[10px] px-1.5 py-1 rounded">
                                            <div className="font-mono font-bold">{cam.no}</div>
                                            <div className="opacity-80 truncate">{cam.location}</div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Selected camera detail */}
            {selectedCam && (
                <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedCam(null)}>
                    <div className="bg-slate-900 border border-white/15 rounded-2xl max-w-lg w-full p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Video size={20} className="text-cyan-400" />
                                <div>
                                    <div className="font-mono text-xs text-slate-400">{selectedCam.no}</div>
                                    <div className="font-bold">{selectedCam.location}</div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedCam(null)} className="p-1 hover:bg-white/10 rounded">✕</button>
                        </div>
                        <div className="aspect-video bg-slate-800 rounded-lg mb-3 flex items-center justify-center text-slate-500">
                            {selectedCam.status === 'offline' ? <WifiOff size={48} /> : <Video size={48} />}
                        </div>
                        <div className="space-y-1.5 text-sm">
                            <Row label="Zone"        value={selectedCam.zone} />
                            <Row label="Status"      value={selectedCam.status} />
                            <Row label="Resolution"  value={selectedCam.resolution} />
                            <Row label="Last frame"  value={(selectedCam.lastFrameAt || '').replace('T', ' ').slice(0, 16)} />
                            {selectedCam.note && <Row label="Note" value={selectedCam.note} />}
                        </div>
                        {selectedCam.faceAlert && (
                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <div className="flex items-center gap-2 text-red-300 font-semibold text-sm mb-1">
                                    <ScanFace size={16} /> Face-detection alert · {selectedCam.faceAlert.priority}
                                </div>
                                <div className="text-xs text-slate-300 space-y-0.5">
                                    <div><span className="text-slate-400">ID:</span> <span className="font-mono">{selectedCam.faceAlert.id}</span></div>
                                    <div><span className="text-slate-400">Confidence:</span> {(selectedCam.faceAlert.confidence * 100).toFixed(1)}%</div>
                                    <div><span className="text-slate-400">Match:</span> {selectedCam.faceAlert.matchedAgainst}</div>
                                    <div><span className="text-slate-400">Captured:</span> {(selectedCam.faceAlert.capturedAt || '').replace('T', ' ').slice(0, 16)}</div>
                                    <div className="text-slate-200 mt-1.5">{selectedCam.faceAlert.note}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Face-alert banner */}
            {faceAlerts > 0 && (
                <div className="fixed top-20 right-6 z-40 bg-red-600/95 text-white px-4 py-2.5 rounded-lg shadow-2xl border border-red-400/50 max-w-sm">
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={16} className="text-amber-200" />
                        <div className="text-sm font-bold">{faceAlerts} suspicious face detection</div>
                    </div>
                    <p className="text-[11px] opacity-90 mt-0.5">
                        AI face-scan flagged an unrecognised person at the Main Gate. Tap CAM-02 for details.
                    </p>
                </div>
            )}

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
                    moduleContext="CCTV"
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

const Row = ({ label, value }) => (
    <div className="flex"><div className="w-24 text-slate-400">{label}:</div><div className="text-slate-200">{value}</div></div>
);

export default CCTV;
