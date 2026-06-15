import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, MessageCircle, CalendarDays, Banknote, Gift, FileBadge,
    Receipt, Hourglass, BadgeDollarSign, Users, Paperclip,
    Plus, X, Loader2, RefreshCw
} from 'lucide-react';
import GeneralAIAgent from '../general-ag';
import { useTranslation } from '../translate/TranslationContext';
import CaptureField from '../components/CaptureField';

const CYCLES = [
    { key: '1st half (10th)',              title: '10th — 1st half',  icon: CalendarDays, color: 'bg-gradient-to-br from-blue-500 to-blue-600',     shadow: 'shadow-blue-200',   blurb: 'Sewing operators + line supervisors' },
    { key: '2nd half (25th)',              title: '25th — 2nd half',  icon: CalendarDays, color: 'bg-gradient-to-br from-indigo-500 to-indigo-600', shadow: 'shadow-indigo-200', blurb: 'All staff, OT included' },
    { key: 'Allowance · NSSF employer',    title: 'NSSF',             icon: FileBadge,    color: 'bg-gradient-to-br from-purple-500 to-purple-600', shadow: 'shadow-purple-200', blurb: 'Employer social security' },
    { key: 'Allowance · Overtime',         title: 'Overtime',         icon: Banknote,     color: 'bg-gradient-to-br from-orange-500 to-orange-600', shadow: 'shadow-orange-200', blurb: 'Production-line OT batch' },
    { key: 'Allowance · Foreign worker permit', title: 'Foreign Permit',icon: Gift,       color: 'bg-gradient-to-br from-pink-500 to-pink-600',     shadow: 'shadow-pink-200',   blurb: 'MoLVT permit fee renewals' },
];

const STATUS_OPTIONS = ['Submitted', 'Accounting Review', 'Accounting Verified', 'Finance Approved', 'Paid', 'Rejected'];

const SalaryBill = ({ onBack }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isBotOpen, setIsBotOpen] = useState(false);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCycle, setActiveCycle] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchBills = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/salary-bills');
            const data = await res.json();
            if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);
            setItems(data.items || []);
        } catch (e) {
            setError(e.message || String(e));
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchBills(); }, [fetchBills]);

    const handleBack = () => (onBack ? onBack() : navigate(-1));

    const visibleItems = activeCycle ? items.filter((i) => i.cycle === activeCycle) : items;

    const statusBadge = (status) => {
        const map = {
            'Submitted':            'bg-amber-100 text-amber-800 ring-amber-200',
            'Accounting Review':    'bg-blue-100 text-blue-800 ring-blue-200',
            'Accounting Verified':  'bg-purple-100 text-purple-800 ring-purple-200',
            'Finance Approved':     'bg-indigo-100 text-indigo-800 ring-indigo-200',
            'Paid':                 'bg-green-100 text-green-800 ring-green-200',
            'Rejected':             'bg-red-100 text-red-800 ring-red-200',
        };
        return `text-xs font-medium px-2.5 py-1 rounded-full ring-1 ${map[status] || 'bg-gray-100 text-gray-700 ring-gray-200'}`;
    };

    const totalSubmitted  = visibleItems.filter(b => b.status === 'Submitted' || b.status === 'Accounting Review').reduce((s, b) => s + (b.net || 0), 0);
    const totalPending    = visibleItems.filter(b => b.status === 'Accounting Verified' || b.status === 'Finance Approved').reduce((s, b) => s + (b.net || 0), 0);
    const totalPaid       = visibleItems.filter(b => b.status === 'Paid').reduce((s, b) => s + (b.net || 0), 0);
    const totalHeadcount  = visibleItems.reduce((s, b) => s + (b.headcount || 0), 0);

    return (
        <div className="fixed inset-0 bg-gray-100 flex flex-col overflow-hidden z-[100]">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-[101]">
                <div className="px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0 relative">
                    <div className="flex-1"></div>
                    <div className="flex items-center gap-3 sm:gap-4 justify-center flex-1">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
                            aria-label="Back"
                        >
                            <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
                            <span className="font-medium hidden sm:inline">{t ? t('back') : 'Back'}</span>
                        </button>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 px-2 sm:px-4">Salary Bill</h1>
                        <button
                            onClick={() => navigate('/')}
                            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-gray-300 hover:border-gray-400 transition-all hover:scale-110 cursor-pointer flex-shrink-0"
                            title="Home"
                        >
                            <img src="/logo.jpg" alt="Home" className="w-full h-full object-cover" />
                        </button>
                    </div>
                    <div className="flex-1 flex justify-end pr-2">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all text-sm font-semibold"
                        >
                            <Plus size={18} /> Submit New Batch
                        </button>
                    </div>
                </div>
                <div className="px-3 sm:px-6 pb-2 text-xs uppercase tracking-wider text-gray-500">
                    Administration · Billing · Salary Bill
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* KPI strip */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Submitted / Review',  value: `$${totalSubmitted.toFixed(2)}`, color: 'text-amber-700', ring: 'ring-amber-200', icon: Receipt },
                            { label: 'Pending Pay',         value: `$${totalPending.toFixed(2)}`,  color: 'text-blue-700',  ring: 'ring-blue-200',  icon: Hourglass },
                            { label: 'Paid MTD',            value: `$${totalPaid.toFixed(2)}`,     color: 'text-green-700', ring: 'ring-green-200', icon: BadgeDollarSign },
                            { label: 'Total Headcount',     value: totalHeadcount.toString(),       color: 'text-slate-700', ring: 'ring-slate-200', icon: Users },
                        ].map((kpi) => {
                            const Icon = kpi.icon;
                            return (
                                <div key={kpi.label} className={`bg-white rounded-xl shadow-sm ring-1 ${kpi.ring} p-4 flex items-center gap-3`}>
                                    <div className="p-2 rounded-lg bg-gray-50">
                                        <Icon className={`w-5 h-5 ${kpi.color}`} />
                                    </div>
                                    <div>
                                        <div className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</div>
                                        <div className="text-xs text-gray-500">{kpi.label}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Cycle tiles */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-semibold text-gray-700">Filter by cycle</h2>
                            {activeCycle && (
                                <button
                                    onClick={() => setActiveCycle(null)}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                >
                                    <X size={14} /> Clear filter
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                            {CYCLES.map((m) => {
                                const Icon = m.icon;
                                const isActive = activeCycle === m.key;
                                return (
                                    <button
                                        key={m.key}
                                        onClick={() => setActiveCycle(isActive ? null : m.key)}
                                        className={`${m.color} text-white p-5 rounded-xl shadow-lg ${m.shadow} hover:shadow-2xl active:scale-95 transition-all duration-300 flex flex-col items-start text-left gap-3 min-h-[150px] relative overflow-hidden group ${isActive ? 'ring-4 ring-white scale-[1.02]' : 'hover:scale-[1.02]'}`}
                                    >
                                        <div className="relative z-10 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="font-bold text-base mb-1">{m.title}</div>
                                            <div className="text-xs text-white/80 leading-snug">{m.blurb}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Records table */}
                    <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {activeCycle ? `Cycle: ${activeCycle}` : 'Recent salary bills'}
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">HR submits → Accounting verifies → Finance approves → Cashier pays via ABA bulk / Wing</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={fetchBills}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" title="Refresh">
                                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                                </button>
                                <button onClick={() => setShowCreateModal(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
                                    <Plus size={14} /> New Batch
                                </button>
                            </div>
                        </div>
                        {error && (
                            <div className="px-5 py-3 bg-red-50 border-b border-red-100 text-sm text-red-700">
                                Failed to load: {error}
                            </div>
                        )}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-5 py-3 text-left">Batch No.</th>
                                        <th className="px-5 py-3 text-left">Cycle</th>
                                        <th className="px-5 py-3 text-right">Headcount</th>
                                        <th className="px-5 py-3 text-right">Gross</th>
                                        <th className="px-5 py-3 text-right">NSSF + Tax</th>
                                        <th className="px-5 py-3 text-right">Net</th>
                                        <th className="px-5 py-3 text-left">Status</th>
                                        <th className="px-5 py-3 text-left">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading && visibleItems.length === 0 && (
                                        <tr><td colSpan={8} className="px-5 py-10 text-center text-gray-500">
                                            <Loader2 className="inline-block w-5 h-5 animate-spin mr-2" /> Loading…
                                        </td></tr>
                                    )}
                                    {!loading && visibleItems.length === 0 && !error && (
                                        <tr><td colSpan={8} className="px-5 py-10 text-center text-gray-500">
                                            No salary bills yet. Click <strong>New Batch</strong> to submit one.
                                        </td></tr>
                                    )}
                                    {visibleItems.map((b) => (
                                        <tr key={b._id || b.no} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3 font-mono text-xs text-gray-700">
                                                <div className="flex items-center gap-1.5">
                                                    {b.no}
                                                    {Array.isArray(b.attachments) && b.attachments.length > 0 && (
                                                        <span className="inline-flex items-center gap-0.5 text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full" title={`${b.attachments.length} attachment${b.attachments.length === 1 ? '' : 's'}`}>
                                                            <Paperclip size={10} /> {b.attachments.length}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-gray-600">{b.cycle}</td>
                                            <td className="px-5 py-3 text-right text-gray-700">{b.headcount}</td>
                                            <td className="px-5 py-3 text-right text-gray-700">${Number(b.gross || 0).toFixed(2)}</td>
                                            <td className="px-5 py-3 text-right text-gray-500 text-xs">${(Number(b.nssf || 0) + Number(b.tax || 0)).toFixed(2)}</td>
                                            <td className="px-5 py-3 text-right font-semibold text-gray-800">${Number(b.net || 0).toFixed(2)}</td>
                                            <td className="px-5 py-3"><span className={statusBadge(b.status)}>{b.status}</span></td>
                                            <td className="px-5 py-3 text-gray-500 text-xs">{b.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
                            <span>Showing {visibleItems.length} batch{visibleItems.length === 1 ? '' : 'es'}{activeCycle ? ` in ${activeCycle}` : ''}</span>
                            <span>Currency: USD · Cambodia entity · Live from Mongo</span>
                        </div>
                    </div>

                    {/* SOP reminder */}
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 text-sm text-indigo-900">
                        <div className="font-semibold mb-1">Cambodia garment-factory payroll rhythm</div>
                        <p className="leading-relaxed">
                            Two regular cycles: <strong>10th</strong> (1st-half wages) and <strong>25th</strong> (2nd-half wages + OT).
                            Plus monthly allowances: <strong>NSSF</strong> employer contribution, <strong>tax withholding</strong> filed to GDT,
                            <strong> foreign-worker permit fees</strong> to MoLVT, and ad-hoc overtime batches when production spikes.
                            All routed to Accountant → Verify → Finance Approve → Cashier pays via ABA bulk transfer or Wing.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bot Button */}
            <button
                onClick={() => setIsBotOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                aria-label="Ask Salary Bill bot"
                title="Ask Salary Bill bot"
            >
                <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            </button>

            {isBotOpen && (
                <GeneralAIAgent
                    onClose={() => setIsBotOpen(false)}
                    moduleContext="Salary Bill"
                />
            )}

            {/* Create modal */}
            {showCreateModal && (
                <CreateSalaryBillModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={() => { setShowCreateModal(false); fetchBills(); }}
                />
            )}
        </div>
    );
};

const CreateSalaryBillModal = ({ onClose, onCreated }) => {
    const [form, setForm] = useState({
        period: '',
        cycle: '1st half (10th)',
        headcount: '',
        gross: '',
        nssf: '',
        tax: '',
        net: '',
        note: '',
        status: 'Submitted',
    });
    const [attachments, setAttachments] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [err, setErr] = useState(null);

    const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const submit = async (e) => {
        e.preventDefault();
        setErr(null);
        setSubmitting(true);
        try {
            const res = await fetch('/api/salary-bills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    headcount: parseInt(form.headcount, 10) || 0,
                    gross: parseFloat(form.gross) || 0,
                    nssf: parseFloat(form.nssf) || 0,
                    tax: parseFloat(form.tax) || 0,
                    net: parseFloat(form.net),
                    attachments,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);
            onCreated(data.item);
        } catch (e) {
            setErr(e.message || String(e));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Submit new salary batch</h3>
                        <p className="text-xs text-gray-500 mt-0.5">HR → Accounting → Finance → Pay</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>
                <form onSubmit={submit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Period *</label>
                            <input type="text" value={form.period}
                                onChange={(e) => update('period', e.target.value)}
                                placeholder="e.g. 2026-06-25 or 2026-06"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none" required />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Cycle *</label>
                            <select value={form.cycle}
                                onChange={(e) => update('cycle', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none" required>
                                {CYCLES.map((c) => <option key={c.key} value={c.key}>{c.title}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Headcount</label>
                        <input type="number" min="0" value={form.headcount}
                            onChange={(e) => update('headcount', e.target.value)}
                            placeholder="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Gross</label>
                            <input type="number" min="0" step="0.01" value={form.gross}
                                onChange={(e) => update('gross', e.target.value)}
                                placeholder="0.00"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">NSSF</label>
                            <input type="number" min="0" step="0.01" value={form.nssf}
                                onChange={(e) => update('nssf', e.target.value)}
                                placeholder="0.00"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Tax</label>
                            <input type="number" min="0" step="0.01" value={form.tax}
                                onChange={(e) => update('tax', e.target.value)}
                                placeholder="0.00"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Net *</label>
                            <input type="number" min="0" step="0.01" value={form.net}
                                onChange={(e) => update('net', e.target.value)}
                                placeholder="0.00"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Note</label>
                        <textarea value={form.note}
                            onChange={(e) => update('note', e.target.value)}
                            placeholder="Any context: anomalies, OT spike, headcount change…"
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none resize-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Initial status</label>
                        <select value={form.status}
                            onChange={(e) => update('status', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none">
                            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <CaptureField
                        value={attachments}
                        onChange={setAttachments}
                        accentClass="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                        label="Supporting documents"
                        helpText="Snap HR payroll register, NSSF voucher, tax filing, etc."
                    />
                    {err && (
                        <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{err}</div>
                    )}
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                        <button type="submit" disabled={submitting}
                            className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow hover:shadow-lg font-semibold transition-all disabled:opacity-60 flex items-center gap-2">
                            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {submitting ? 'Saving…' : 'Save to Mongo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SalaryBill;
