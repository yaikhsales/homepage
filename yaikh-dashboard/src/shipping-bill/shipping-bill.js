import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, MessageCircle, Ship, DoorOpen, Forklift, HardHat,
    FileBadge2, FilePlus2, Container, Receipt, Hourglass, BadgeDollarSign, Paperclip,
    Plus, X, Loader2, RefreshCw
} from 'lucide-react';
import GeneralAIAgent from '../general-ag';
import { useTranslation } from '../translate/TranslationContext';
import CaptureField from '../components/CaptureField';

const CATEGORIES = [
    { key: 'cargo-clearance', title: 'Cargo Clearance', icon: Ship,       color: 'bg-gradient-to-br from-cyan-500 to-cyan-600',     shadow: 'shadow-cyan-200',   blurb: 'Sihanoukville / PP Port clearance fees' },
    { key: 'gate-clearance',  title: 'Gate Clearance',  icon: DoorOpen,   color: 'bg-gradient-to-br from-sky-500 to-sky-600',       shadow: 'shadow-sky-200',    blurb: 'Factory gate & security pass charges' },
    { key: 'equipment',       title: 'Crane & Forklift',icon: Forklift,   color: 'bg-gradient-to-br from-amber-500 to-amber-600',   shadow: 'shadow-amber-200',  blurb: 'Heavy-lift equipment hire fees' },
    { key: 'worker-fees',     title: 'Worker Unloading',icon: HardHat,    color: 'bg-gradient-to-br from-orange-500 to-orange-600', shadow: 'shadow-orange-200', blurb: 'Daily-rate unloading crew' },
    { key: 'customs',         title: 'Customs & Duty',  icon: FileBadge2, color: 'bg-gradient-to-br from-violet-500 to-violet-600', shadow: 'shadow-violet-200', blurb: 'Import duty + GDT customs filings' },
];

const STATUS_OPTIONS = ['Submitted', 'Manager Approved', 'Accounting Verified', 'Reimbursed', 'Rejected'];

const ShippingBill = ({ onBack }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isBotOpen, setIsBotOpen] = useState(false);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchBills = useCallback(async (cat) => {
        setLoading(true);
        setError(null);
        try {
            const url = cat ? `/api/shipping-bills?category=${encodeURIComponent(cat)}` : '/api/shipping-bills';
            const res = await fetch(url);
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

    useEffect(() => { fetchBills(activeCategory); }, [fetchBills, activeCategory]);

    const handleBack = () => (onBack ? onBack() : navigate(-1));

    const statusBadge = (status) => {
        const map = {
            'Submitted':            'bg-amber-100 text-amber-800 ring-amber-200',
            'Manager Approved':     'bg-blue-100 text-blue-800 ring-blue-200',
            'Accounting Verified':  'bg-purple-100 text-purple-800 ring-purple-200',
            'Reimbursed':           'bg-green-100 text-green-800 ring-green-200',
            'Rejected':             'bg-red-100 text-red-800 ring-red-200',
        };
        return `text-xs font-medium px-2.5 py-1 rounded-full ring-1 ${map[status] || 'bg-gray-100 text-gray-700 ring-gray-200'}`;
    };

    const categoryLabel = (key) => CATEGORIES.find((c) => c.key === key)?.title || key;

    const totalSubmittedMTD  = items.filter(b => b.status === 'Submitted').reduce((s, b) => s + (b.amount || 0), 0);
    const totalPendingMTD    = items.filter(b => b.status === 'Manager Approved' || b.status === 'Accounting Verified').reduce((s, b) => s + (b.amount || 0), 0);
    const totalPaidMTD       = items.filter(b => b.status === 'Reimbursed').reduce((s, b) => s + (b.amount || 0), 0);
    const totalAllMTD        = items.reduce((s, b) => s + (b.amount || 0), 0);

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
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 px-2 sm:px-4">Shipping Bill</h1>
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
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all text-sm font-semibold"
                        >
                            <Plus size={18} /> Create New Bill
                        </button>
                    </div>
                </div>
                <div className="px-3 sm:px-6 pb-2 text-xs uppercase tracking-wider text-gray-500">
                    Administration · Billing · Shipping Bill
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* KPI strip */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Submitted MTD',    value: totalSubmittedMTD, color: 'text-amber-700',  ring: 'ring-amber-200',  icon: Receipt },
                            { label: 'Pending Approval', value: totalPendingMTD,   color: 'text-blue-700',   ring: 'ring-blue-200',   icon: Hourglass },
                            { label: 'Paid MTD',         value: totalPaidMTD,      color: 'text-green-700',  ring: 'ring-green-200',  icon: BadgeDollarSign },
                            { label: 'Total Bills MTD',  value: totalAllMTD,       color: 'text-slate-700',  ring: 'ring-slate-200',  icon: Container },
                        ].map((kpi) => {
                            const Icon = kpi.icon;
                            return (
                                <div key={kpi.label} className={`bg-white rounded-xl shadow-sm ring-1 ${kpi.ring} p-4 flex items-center gap-3`}>
                                    <div className="p-2 rounded-lg bg-gray-50">
                                        <Icon className={`w-5 h-5 ${kpi.color}`} />
                                    </div>
                                    <div>
                                        <div className={`text-xl font-bold ${kpi.color}`}>${kpi.value.toFixed(2)}</div>
                                        <div className="text-xs text-gray-500">{kpi.label}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Category tiles — clicking filters the table in-place */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-semibold text-gray-700">Filter by category</h2>
                            {activeCategory && (
                                <button
                                    onClick={() => setActiveCategory(null)}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                >
                                    <X size={14} /> Clear filter
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
                            {CATEGORIES.map((m) => {
                                const Icon = m.icon;
                                const isActive = activeCategory === m.key;
                                return (
                                    <button
                                        key={m.key}
                                        onClick={() => setActiveCategory(isActive ? null : m.key)}
                                        className={`${m.color} text-white p-5 rounded-xl shadow-lg ${m.shadow} hover:shadow-2xl active:scale-95 transition-all duration-300 flex flex-col items-start text-left gap-3 min-h-[150px] relative overflow-hidden group ${isActive ? 'ring-4 ring-white scale-[1.02]' : 'hover:scale-[1.02]'}`}
                                    >
                                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                            {/* Create New Bill — primary CTA tile */}
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-gradient-to-br from-slate-700 to-slate-800 text-white p-5 rounded-xl shadow-lg shadow-slate-200 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 flex flex-col items-start text-left gap-3 min-h-[150px] relative overflow-hidden group ring-2 ring-cyan-400/50"
                            >
                                <div className="relative z-10 w-10 h-10 bg-cyan-400/30 rounded-lg flex items-center justify-center">
                                    <FilePlus2 className="w-5 h-5" />
                                </div>
                                <div className="relative z-10">
                                    <div className="font-bold text-base mb-1">Submit New Bill</div>
                                    <div className="text-xs text-white/80 leading-snug">Logistics → Accounting request</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Records table */}
                    <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {activeCategory ? `Category: ${categoryLabel(activeCategory)}` : 'Recent shipping bills'}
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">Import / export bills raised by Logistics — flow to Accounting for verify → approve → pay</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => fetchBills(activeCategory)}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                    title="Refresh"
                                >
                                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                                </button>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    <Plus size={14} /> New Bill
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
                                        <th className="px-5 py-3 text-left">Bill No.</th>
                                        <th className="px-5 py-3 text-left">Category</th>
                                        <th className="px-5 py-3 text-left">Vendor</th>
                                        <th className="px-5 py-3 text-left">Container / Ref</th>
                                        <th className="px-5 py-3 text-left">Description</th>
                                        <th className="px-5 py-3 text-right">Amount</th>
                                        <th className="px-5 py-3 text-left">Status</th>
                                        <th className="px-5 py-3 text-left">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading && items.length === 0 && (
                                        <tr><td colSpan={8} className="px-5 py-10 text-center text-gray-500">
                                            <Loader2 className="inline-block w-5 h-5 animate-spin mr-2" /> Loading…
                                        </td></tr>
                                    )}
                                    {!loading && items.length === 0 && !error && (
                                        <tr><td colSpan={8} className="px-5 py-10 text-center text-gray-500">
                                            No bills yet in this category. Click <strong>New Bill</strong> to create one.
                                        </td></tr>
                                    )}
                                    {items.map((b) => (
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
                                            <td className="px-5 py-3 text-gray-600">{categoryLabel(b.category)}</td>
                                            <td className="px-5 py-3 font-medium text-gray-800">{b.vendor}</td>
                                            <td className="px-5 py-3 font-mono text-xs text-gray-500">{b.ref}</td>
                                            <td className="px-5 py-3 text-gray-600">{b.description}</td>
                                            <td className="px-5 py-3 text-right font-semibold text-gray-800">${Number(b.amount).toFixed(2)}</td>
                                            <td className="px-5 py-3"><span className={statusBadge(b.status)}>{b.status}</span></td>
                                            <td className="px-5 py-3 text-gray-500 text-xs">{b.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
                            <span>Showing {items.length} bill{items.length === 1 ? '' : 's'}{activeCategory ? ` in ${categoryLabel(activeCategory)}` : ''}</span>
                            <span>Currency: USD · Sihanoukville &amp; Phnom Penh ports · Live from Mongo</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bot Button */}
            <button
                onClick={() => setIsBotOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                aria-label="Ask Shipping Bill bot"
                title="Ask Shipping Bill bot"
            >
                <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            </button>

            {isBotOpen && (
                <GeneralAIAgent
                    onClose={() => setIsBotOpen(false)}
                    moduleContext="Shipping Bill"
                />
            )}

            {/* Create modal */}
            {showCreateModal && (
                <CreateShippingBillModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={() => { setShowCreateModal(false); fetchBills(activeCategory); }}
                />
            )}
        </div>
    );
};

const CreateShippingBillModal = ({ onClose, onCreated }) => {
    const [form, setForm] = useState({
        vendor: '',
        category: 'cargo-clearance',
        ref: '',
        description: '',
        amount: '',
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
            const res = await fetch('/api/shipping-bills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    amount: parseFloat(form.amount),
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
                        <h3 className="text-lg font-bold text-gray-800">Create new shipping bill</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Logistics → Accounting request</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>
                <form onSubmit={submit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
                            <select
                                value={form.category}
                                onChange={(e) => update('category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none"
                                required
                            >
                                {CATEGORIES.map((c) => (
                                    <option key={c.key} value={c.key}>{c.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Initial status</label>
                            <select
                                value={form.status}
                                onChange={(e) => update('status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none"
                            >
                                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Vendor *</label>
                        <input
                            type="text"
                            value={form.vendor}
                            onChange={(e) => update('vendor', e.target.value)}
                            placeholder="e.g. Bolloré Logistics Cambodia"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Container / Reference</label>
                        <input
                            type="text"
                            value={form.ref}
                            onChange={(e) => update('ref', e.target.value)}
                            placeholder="e.g. CMAU-789-123 or GDT-IMP-2026-319"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => update('description', e.target.value)}
                            placeholder="What is this bill for?"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none resize-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Amount (USD) *</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.amount}
                            onChange={(e) => update('amount', e.target.value)}
                            placeholder="0.00"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none"
                            required
                        />
                    </div>
                    <CaptureField
                        value={attachments}
                        onChange={setAttachments}
                        accentClass="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600"
                        label="Supporting documents"
                        helpText="Snap broker invoice, customs declaration, container photo, etc."
                    />
                    {err && (
                        <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            {err}
                        </div>
                    )}
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting}
                            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-lg shadow hover:shadow-lg font-semibold transition-all disabled:opacity-60 flex items-center gap-2">
                            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {submitting ? 'Saving…' : 'Save to Mongo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShippingBill;
