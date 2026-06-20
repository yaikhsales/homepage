import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, MessageCircle, ShieldAlert, ShieldQuestion, AlertTriangle,
    DollarSign, Clock, Wrench, MoreHorizontal, FilePlus2, X, Loader2,
    RefreshCw, Lock,
} from 'lucide-react';
import BotModules from '../chatbot/bot-modules';

const CATEGORIES = [
    { key: 'Wage',        title: 'Wage',        icon: DollarSign,      color: 'bg-gradient-to-br from-amber-500 to-amber-600',   shadow: 'shadow-amber-200',  blurb: 'OT pay, attendance bonus, deductions' },
    { key: 'Safety',      title: 'Safety',      icon: AlertTriangle,   color: 'bg-gradient-to-br from-red-500 to-red-600',       shadow: 'shadow-red-200',    blurb: 'Machine guards, electrical, fire risk' },
    { key: 'Harassment',  title: 'Harassment',  icon: ShieldAlert,     color: 'bg-gradient-to-br from-rose-500 to-pink-600',     shadow: 'shadow-rose-200',   blurb: 'Verbal abuse, intimidation, bias' },
    { key: 'Hours',       title: 'Hours',       icon: Clock,           color: 'bg-gradient-to-br from-blue-500 to-blue-600',     shadow: 'shadow-blue-200',   blurb: 'Mandatory OT, shift changes' },
    { key: 'Environment', title: 'Environment', icon: Wrench,          color: 'bg-gradient-to-br from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-200', blurb: 'Canteen, toilets, lockers, water' },
    { key: 'Other',       title: 'Other',       icon: MoreHorizontal,  color: 'bg-gradient-to-br from-slate-500 to-slate-600',   shadow: 'shadow-slate-200',  blurb: 'Anything not in the categories above' },
];

const STATUS_OPTIONS = ['open', 'reviewing', 'resolved', 'closed'];
const STATUS_STYLE = {
    open:      'bg-red-100 text-red-700 border border-red-200',
    reviewing: 'bg-amber-100 text-amber-700 border border-amber-200',
    resolved:  'bg-emerald-100 text-emerald-700 border border-emerald-200',
    closed:    'bg-slate-100 text-slate-700 border border-slate-200',
};
const PRIORITY_STYLE = {
    high:   'bg-red-50 text-red-700 ring-1 ring-red-200',
    medium: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    low:    'bg-slate-50 text-slate-600 ring-1 ring-slate-200',
};

const SpeakUp = ({ onBack }) => {
    const navigate = useNavigate();
    const [isBotOpen, setIsBotOpen] = useState(false);
    // HR PA greets on land, pre-scoped to Speak Up.
    useEffect(() => {
        const t = setTimeout(() => setIsBotOpen(true), 700);
        return () => clearTimeout(t);
    }, []);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null); // null = all
    const [activeStatus, setActiveStatus] = useState(null);     // null = all
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchItems = useCallback(() => {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (activeStatus) params.append('status', activeStatus);
        if (activeCategory) params.append('category', activeCategory);
        const qs = params.toString() ? `?${params.toString()}` : '';
        fetch(`/api/speak-up${qs}`)
            .then(r => r.json())
            .then(d => {
                if (!d?.ok) throw new Error(d?.error || 'Failed to load');
                setItems(d.items || []);
            })
            .catch(err => setError(err.message || String(err)))
            .finally(() => setLoading(false));
    }, [activeStatus, activeCategory]);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const counts = items.reduce((acc, it) => {
        acc.total++;
        acc[it.status] = (acc[it.status] || 0) + 1;
        return acc;
    }, { total: 0, open: 0, reviewing: 0, resolved: 0, closed: 0 });

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
                    <ShieldAlert size={26} className="text-indigo-400" />
                    <div>
                        <h1 className="text-xl font-bold leading-tight">Speak Up</h1>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Lock size={12} className="text-emerald-400" />
                            Anonymous · Your identity is never shown
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchItems}
                        className="p-2 rounded-lg hover:bg-white/10 transition"
                        title="Refresh"
                    >
                        <RefreshCw size={18} />
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 transition flex items-center gap-2 font-semibold shadow-lg"
                    >
                        <FilePlus2 size={16} />
                        Submit Complaint
                    </button>
                </div>
            </div>

            {/* KPI strip */}
            <div className="px-6 pt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
                <Kpi label="Total"     value={counts.total}     accent="from-slate-700 to-slate-800" />
                <Kpi label="Open"      value={counts.open}      accent="from-red-600 to-red-700" />
                <Kpi label="Reviewing" value={counts.reviewing} accent="from-amber-500 to-amber-600" />
                <Kpi label="Resolved"  value={counts.resolved}  accent="from-emerald-600 to-emerald-700" />
                <Kpi label="Closed"    value={counts.closed}    accent="from-slate-600 to-slate-700" />
            </div>

            {/* Status filter tabs */}
            <div className="px-6 pt-4 flex flex-wrap gap-2">
                <button
                    onClick={() => setActiveStatus(null)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${activeStatus === null ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >All statuses</button>
                {STATUS_OPTIONS.map(s => (
                    <button
                        key={s}
                        onClick={() => setActiveStatus(s)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${activeStatus === s ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >{s}</button>
                ))}
            </div>

            {/* Category tiles */}
            <div className="px-6 pt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <button
                    onClick={() => setActiveCategory(null)}
                    className={`p-3 rounded-xl border transition text-left ${activeCategory === null ? 'border-white bg-white text-slate-900' : 'border-white/15 bg-white/5 hover:bg-white/10'}`}
                >
                    <div className="font-bold text-sm">All</div>
                    <div className="text-[11px] opacity-70 mt-0.5">{items.length} item{items.length === 1 ? '' : 's'}</div>
                </button>
                {CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    const n = items.filter(i => i.category === cat.key).length;
                    const isActive = activeCategory === cat.key;
                    return (
                        <button
                            key={cat.key}
                            onClick={() => setActiveCategory(isActive ? null : cat.key)}
                            className={`p-3 rounded-xl text-white text-left transition relative ${cat.color} ${cat.shadow} shadow-md ${isActive ? 'ring-2 ring-white scale-[1.02]' : 'hover:scale-[1.02]'}`}
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
                            {activeCategory ? `${activeCategory} — ` : ''}
                            {activeStatus ? `${activeStatus} grievances` : 'All grievances'}
                        </h2>
                        {loading && <Loader2 size={16} className="animate-spin text-indigo-400" />}
                    </div>
                    {error && (
                        <div className="px-4 py-3 text-sm text-red-300 bg-red-500/10">{error}</div>
                    )}
                    {!loading && !error && items.length === 0 && (
                        <div className="px-4 py-10 text-center text-slate-400">
                            <ShieldQuestion size={32} className="mx-auto mb-2 opacity-60" />
                            <p className="text-sm">No grievances under this filter.</p>
                        </div>
                    )}
                    {!loading && items.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
                                        <th className="px-4 py-2">No.</th>
                                        <th className="px-4 py-2">Submitted</th>
                                        <th className="px-4 py-2">Category</th>
                                        <th className="px-4 py-2">Subject</th>
                                        <th className="px-4 py-2">Alias</th>
                                        <th className="px-4 py-2">Line</th>
                                        <th className="px-4 py-2">Priority</th>
                                        <th className="px-4 py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(it => (
                                        <tr key={it._id} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="px-4 py-2 font-mono text-[11px] text-slate-300">{it.no}</td>
                                            <td className="px-4 py-2 text-[12px] text-slate-300">{(it.submittedAt || '').slice(0, 10)}</td>
                                            <td className="px-4 py-2">{it.category}</td>
                                            <td className="px-4 py-2">
                                                <div className="font-medium">{it.subject}</div>
                                                <div className="text-[11px] text-slate-400 mt-0.5 max-w-md truncate">{it.body}</div>
                                            </td>
                                            <td className="px-4 py-2 font-mono text-[11px] text-indigo-300" title="Anonymous handle">{it.alias}</td>
                                            <td className="px-4 py-2 text-[12px]">{it.line || '—'}</td>
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <p className="text-[11px] text-slate-500 mt-3 flex items-center gap-1">
                    <Lock size={11} className="text-emerald-500" />
                    Workers submit by alias. HR sees the alias only — never the real identity. HR triages via the HR PA chat (right side) or by tapping rows here.
                </p>
            </div>

            {/* HR PA — indigo bubble (hidden while panel open) */}
            {!isBotOpen && (
                <button
                    onClick={() => setIsBotOpen(true)}
                    className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                    aria-label="Ask HR PA"
                    title="Ask HR PA"
                >
                    <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                </button>
            )}

            {isBotOpen && (
                <BotModules
                    onClose={() => setIsBotOpen(false)}
                    moduleContext="Speak Up"
                    currentVersion="yai1"
                    botsFilter={["hr-bot"]}
                    initialTopic="Speak Up"
                />
            )}

            {showCreateModal && (
                <SubmitComplaintModal
                    onClose={() => setShowCreateModal(false)}
                    onSubmitted={() => { setShowCreateModal(false); fetchItems(); }}
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

const SubmitComplaintModal = ({ onClose, onSubmitted }) => {
    const [category, setCategory] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [line, setLine] = useState('');
    const [priority, setPriority] = useState('medium');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [submitted, setSubmitted] = useState(null);

    const submit = () => {
        if (!category) { setError('Pick a category'); return; }
        if (subject.trim().length < 4) { setError('Subject is too short'); return; }
        if (body.trim().length < 10) { setError('Tell us a bit more (at least 10 chars)'); return; }
        setSubmitting(true);
        setError(null);
        fetch('/api/speak-up', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category, subject, body, line: line || null, priority }),
        })
            .then(r => r.json())
            .then(d => {
                if (!d?.ok) throw new Error(d?.error || 'Submission failed');
                setSubmitted(d.item);
            })
            .catch(err => setError(err.message || String(err)))
            .finally(() => setSubmitting(false));
    };

    if (submitted) {
        return (
            <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                    <div className="flex items-center gap-2 mb-3">
                        <ShieldAlert className="text-emerald-500" />
                        <h2 className="text-lg font-bold">Submitted</h2>
                    </div>
                    <p className="text-sm text-slate-700">
                        Your grievance has been recorded anonymously. HR will triage it.
                    </p>
                    <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
                        <div><span className="text-slate-500">Reference:</span> <span className="font-mono">{submitted.no}</span></div>
                        <div><span className="text-slate-500">Your alias:</span> <span className="font-mono text-indigo-700">{submitted.alias}</span></div>
                        <div className="text-[12px] text-slate-500 mt-2">
                            Save the alias if you want to follow up. HR will respond against this alias — your real identity is never recorded.
                        </div>
                    </div>
                    <button
                        onClick={onSubmitted}
                        className="mt-4 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold"
                    >
                        Done
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="text-indigo-500" />
                        <h2 className="text-lg font-bold">Speak Up — Anonymous</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded hover:bg-slate-100">
                        <X size={18} />
                    </button>
                </div>
                <p className="text-[12px] text-slate-500 mb-4 flex items-center gap-1">
                    <Lock size={12} className="text-emerald-500" />
                    No name, no employee ID, no email. You'll get an alias to follow up.
                </p>

                <div className="space-y-3">
                    <Field label="Category *">
                        <div className="grid grid-cols-3 gap-2">
                            {CATEGORIES.map(c => (
                                <button
                                    key={c.key}
                                    onClick={() => setCategory(c.key)}
                                    type="button"
                                    className={`px-2 py-2 rounded-lg text-xs font-semibold border transition ${category === c.key ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                                >
                                    {c.title}
                                </button>
                            ))}
                        </div>
                    </Field>

                    <Field label="Subject *">
                        <input
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            placeholder="Short summary (e.g. 'OT in May not paid')"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            maxLength={120}
                        />
                    </Field>

                    <Field label="What happened? *">
                        <textarea
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            placeholder="Be specific — date, line, what was said or done. Anything that helps HR act."
                            rows={5}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none"
                            maxLength={2000}
                        />
                        <div className="text-[10px] text-slate-400 text-right mt-1">{body.length}/2000</div>
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Line (optional)">
                            <input
                                value={line}
                                onChange={e => setLine(e.target.value)}
                                placeholder="L1, L2, shared…"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                maxLength={20}
                            />
                        </Field>
                        <Field label="Priority">
                            <select
                                value={priority}
                                onChange={e => setPriority(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High — safety / harassment</option>
                            </select>
                        </Field>
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
                    )}
                </div>

                <div className="mt-5 flex items-center justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm">
                        Cancel
                    </button>
                    <button
                        onClick={submit}
                        disabled={submitting}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold flex items-center gap-2 text-sm disabled:opacity-60"
                    >
                        {submitting && <Loader2 size={14} className="animate-spin" />}
                        Submit Anonymously
                    </button>
                </div>
            </div>
        </div>
    );
};

const Field = ({ label, children }) => (
    <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
        {children}
    </div>
);

export default SpeakUp;
