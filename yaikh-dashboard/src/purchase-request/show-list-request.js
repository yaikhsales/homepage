import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, MessageCircle, FilePlus2, Hourglass, BadgeDollarSign,
    Users, Receipt, ClipboardCheck, XCircle, Paperclip,
    Plus, X, Loader2, RefreshCw, Trash2,
} from 'lucide-react';
import GeneralAIAgent from '../general-ag';
import { useTranslation } from '../translate/TranslationContext';
import CaptureField from '../components/CaptureField';

/* Modernised Purchase Request module — matches the Bill Claim / Shipping Bill /
 * Salary Bill pattern (KPI strip + filter tiles + records table + create modal).
 * Backed by /api/purchase-requests on yaikh-com (Mongo-grounded).
 */

// Status → display label + flow stage. Keep order matching the actual flow.
const STATUS_FLOW = [
    { key: 'submitted',           label: 'Awaiting Supervisor', color: 'amber'  },
    { key: 'supervisor_approved', label: 'Awaiting Manager',    color: 'blue'   },
    { key: 'manager_approved',    label: 'Awaiting Finance',    color: 'indigo' },
    { key: 'finance_approved',    label: 'Awaiting Payment',    color: 'purple' },
    { key: 'paid',                label: 'Paid',                color: 'green'  },
    { key: 'rejected',            label: 'Rejected',            color: 'red'    },
];

const STATUS_BADGE = {
    submitted:           'bg-amber-100   text-amber-800   ring-amber-200',
    supervisor_approved: 'bg-blue-100    text-blue-800    ring-blue-200',
    manager_approved:    'bg-indigo-100  text-indigo-800  ring-indigo-200',
    finance_approved:    'bg-purple-100  text-purple-800  ring-purple-200',
    paid:                'bg-green-100   text-green-800   ring-green-200',
    rejected:            'bg-red-100     text-red-800     ring-red-200',
    draft:               'bg-gray-100    text-gray-700    ring-gray-200',
};

const FILTER_TILES = [
    { key: 'submitted',           title: 'Awaiting Supervisor', icon: Hourglass,       color: 'bg-gradient-to-br from-amber-500 to-amber-600',   shadow: 'shadow-amber-200',  blurb: 'New PRs, first approval pending' },
    { key: 'supervisor_approved', title: 'Awaiting Manager',    icon: ClipboardCheck,  color: 'bg-gradient-to-br from-blue-500 to-blue-600',     shadow: 'shadow-blue-200',   blurb: 'Past supervisor, with GM' },
    { key: 'manager_approved',    title: 'Awaiting Finance',    icon: Users,           color: 'bg-gradient-to-br from-indigo-500 to-indigo-600', shadow: 'shadow-indigo-200', blurb: 'GM-approved, waiting Finance sign-off' },
    { key: 'finance_approved',    title: 'Awaiting Payment',    icon: BadgeDollarSign, color: 'bg-gradient-to-br from-purple-500 to-purple-600', shadow: 'shadow-purple-200', blurb: 'Finance done, cashier to release' },
    { key: 'paid',                title: 'Paid',                icon: Receipt,         color: 'bg-gradient-to-br from-green-500 to-green-600',   shadow: 'shadow-green-200',  blurb: 'Fully reimbursed / paid' },
    { key: 'rejected',            title: 'Rejected',            icon: XCircle,         color: 'bg-gradient-to-br from-red-500 to-red-600',       shadow: 'shadow-red-200',    blurb: 'Returned at some step' },
];

const DEPT_OPTIONS = ['Admin', 'Sales', 'Finance', 'HR', 'Production', 'Merchandising', 'Logistics', 'QA'];

const ShowListRequest = ({ onBack }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isBotOpen, setIsBotOpen] = useState(false);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeStatus, setActiveStatus] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchPRs = useCallback(async (status) => {
        setLoading(true);
        setError(null);
        try {
            const url = status ? `/api/purchase-requests?status=${encodeURIComponent(status)}` : '/api/purchase-requests';
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

    useEffect(() => { fetchPRs(activeStatus); }, [fetchPRs, activeStatus]);

    const handleBack = () => (onBack ? onBack() : navigate(-1));

    const statusBadge = (status) => `text-xs font-medium px-2.5 py-1 rounded-full ring-1 ${STATUS_BADGE[status] || STATUS_BADGE.draft}`;
    const statusLabel = (status) => STATUS_FLOW.find(s => s.key === status)?.label || status;

    const totalSubmittedMTD  = items.filter(i => i.status === 'submitted').reduce((s, i) => s + (i.totalAmount || 0), 0);
    const totalPendingMTD    = items.filter(i => ['supervisor_approved','manager_approved','finance_approved'].includes(i.status)).reduce((s, i) => s + (i.totalAmount || 0), 0);
    const totalPaidMTD       = items.filter(i => i.status === 'paid').reduce((s, i) => s + (i.totalAmount || 0), 0);
    const totalAllMTD        = items.reduce((s, i) => s + (i.totalAmount || 0), 0);

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
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 px-2 sm:px-4">Purchase Request</h1>
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
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all text-sm font-semibold"
                        >
                            <Plus size={18} /> New Purchase Request
                        </button>
                    </div>
                </div>
                <div className="px-3 sm:px-6 pb-2 text-xs uppercase tracking-wider text-gray-500">
                    Administration · Billing · Purchase Request
                </div>
            </div>

            {/* Main */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* KPI strip */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Submitted MTD',    value: totalSubmittedMTD, color: 'text-amber-700',  ring: 'ring-amber-200',  icon: Receipt },
                            { label: 'Pending Approval', value: totalPendingMTD,   color: 'text-blue-700',   ring: 'ring-blue-200',   icon: Hourglass },
                            { label: 'Paid MTD',         value: totalPaidMTD,      color: 'text-green-700',  ring: 'ring-green-200',  icon: BadgeDollarSign },
                            { label: 'Total PRs MTD',    value: totalAllMTD,       color: 'text-slate-700',  ring: 'ring-slate-200',  icon: ClipboardCheck },
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

                    {/* Status filter tiles */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-semibold text-gray-700">Filter by approval stage</h2>
                            {activeStatus && (
                                <button
                                    onClick={() => setActiveStatus(null)}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                >
                                    <X size={14} /> Clear filter
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {FILTER_TILES.map((m) => {
                                const Icon = m.icon;
                                const isActive = activeStatus === m.key;
                                return (
                                    <button
                                        key={m.key}
                                        onClick={() => setActiveStatus(isActive ? null : m.key)}
                                        className={`${m.color} text-white p-4 rounded-xl shadow-lg ${m.shadow} hover:shadow-2xl active:scale-95 transition-all duration-300 flex flex-col items-start text-left gap-2 min-h-[120px] relative overflow-hidden group ${isActive ? 'ring-4 ring-white scale-[1.02]' : 'hover:scale-[1.02]'}`}
                                    >
                                        <div className="relative z-10 w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="font-bold text-sm mb-0.5">{m.title}</div>
                                            <div className="text-[11px] text-white/80 leading-snug">{m.blurb}</div>
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
                                    {activeStatus ? `Stage: ${statusLabel(activeStatus)}` : 'Recent purchase requests'}
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">Formal supplier requests · ≥3-quotation SOP · multi-step approval ladder</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => fetchPRs(activeStatus)}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" title="Refresh">
                                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                                </button>
                                <button onClick={() => setShowCreateModal(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors">
                                    <Plus size={14} /> New PR
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
                                        <th className="px-5 py-3 text-left">PR No.</th>
                                        <th className="px-5 py-3 text-left">Requester</th>
                                        <th className="px-5 py-3 text-left">Dept</th>
                                        <th className="px-5 py-3 text-left">Items</th>
                                        <th className="px-5 py-3 text-right">Amount</th>
                                        <th className="px-5 py-3 text-center">Quotes</th>
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
                                            No purchase requests yet. Click <strong>New PR</strong> to raise one.
                                        </td></tr>
                                    )}
                                    {items.map((pr) => {
                                        const id = String(pr._id || pr.prNo);
                                        const itemSummary = (pr.items || []).map(i => `${i.qty}× ${i.name}`).join(', ');
                                        return (
                                            <tr key={id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-3 font-mono text-xs text-gray-700">
                                                    <div className="flex items-center gap-1.5">
                                                        {pr.prNo}
                                                        {Array.isArray(pr.attachments) && pr.attachments.length > 0 && (
                                                            <span className="inline-flex items-center gap-0.5 text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full" title={`${pr.attachments.length} attachment${pr.attachments.length === 1 ? '' : 's'}`}>
                                                                <Paperclip size={10} /> {pr.attachments.length}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3 font-medium text-gray-800">{pr.requester?.name || '—'}</td>
                                                <td className="px-5 py-3 text-gray-600">{pr.requester?.dept || '—'}</td>
                                                <td className="px-5 py-3 text-gray-600 max-w-xs truncate" title={itemSummary}>{itemSummary || '—'}</td>
                                                <td className="px-5 py-3 text-right font-semibold text-gray-800">${Number(pr.totalAmount || 0).toFixed(2)}</td>
                                                <td className="px-5 py-3 text-center">
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ring-1 ${(pr.quotations?.length || 0) >= 3 ? 'bg-green-100 text-green-800 ring-green-200' : 'bg-amber-100 text-amber-800 ring-amber-200'}`}>
                                                        {pr.quotations?.length || 0}/3
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3"><span className={statusBadge(pr.status)}>{statusLabel(pr.status)}</span></td>
                                                <td className="px-5 py-3 text-gray-500 text-xs">{pr.date}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
                            <span>Showing {items.length} PR{items.length === 1 ? '' : 's'}{activeStatus ? ` in stage ${statusLabel(activeStatus)}` : ''}</span>
                            <span>Currency: USD · Cambodia entity · Live from Mongo</span>
                        </div>
                    </div>

                    {/* SOP reminder */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-sm text-yellow-900">
                        <div className="font-semibold mb-1">Procurement SOP — read before submitting</div>
                        <p className="leading-relaxed">
                            Every PR must carry <strong>≥3 quotations</strong> from different suppliers (regular-supplier prices are re-checked against the supplier-master).
                            Items must be on the chart-of-accounts. PRs flow: <strong>Supervisor → GM → Finance → Cashier pays (ABA / Wing)</strong>.
                            For small day-to-day items (petrol, lunches, parking, small office supplies), use <strong>Bill Claim</strong> instead — no quotation rule needed.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bot Button (toggles open/closed) */}
            <button
                onClick={() => setIsBotOpen((v) => !v)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                aria-label={isBotOpen ? "Hide assistant" : "Ask Purchase Request bot"}
                title={isBotOpen ? "Hide assistant" : "Ask Purchase Request bot"}
            >
                <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            </button>

            {isBotOpen && (
                <GeneralAIAgent
                    onClose={() => setIsBotOpen(false)}
                    moduleContext="Purchase Request"
                />
            )}

            {showCreateModal && (
                <CreatePurchaseRequestModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={() => { setShowCreateModal(false); fetchPRs(activeStatus); }}
                />
            )}
        </div>
    );
};

/* --------------------------------------------------------------------- *
 * Create-PR modal: requester + dept + multi-line items + 3 quotations.
 * Auto-totals as user edits item qty × unit price.
 * --------------------------------------------------------------------- */
const CreatePurchaseRequestModal = ({ onClose, onCreated }) => {
    const [requester, setRequester] = useState('');
    const [dept, setDept] = useState('Admin');
    const [description, setDescription] = useState('');
    const [items, setItems] = useState([{ name: '', qty: 1, unitPrice: 0 }]);
    const [quotations, setQuotations] = useState([
        { supplier: '', amount: 0 },
        { supplier: '', amount: 0 },
        { supplier: '', amount: 0 },
    ]);
    const [attachments, setAttachments] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [err, setErr] = useState(null);

    const updateItem = (idx, field, value) => {
        setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: value } : it));
    };
    const addItem = () => setItems(prev => [...prev, { name: '', qty: 1, unitPrice: 0 }]);
    const removeItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));

    const updateQuote = (idx, field, value) => {
        setQuotations(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q));
    };

    const totalAmount = items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.unitPrice) || 0), 0);
    const filledQuotes = quotations.filter(q => q.supplier && Number(q.amount) > 0).length;

    const submit = async (e) => {
        e.preventDefault();
        setErr(null);
        if (!requester || items.length === 0 || items.some(i => !i.name)) {
            setErr('Requester and at least one named item are required.');
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch('/api/purchase-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requester,
                    dept,
                    description,
                    items: items.map(i => ({ name: i.name, qty: Number(i.qty), unitPrice: Number(i.unitPrice), currency: 'USD' })),
                    quotations: quotations.filter(q => q.supplier && Number(q.amount) > 0).map(q => ({ supplier: q.supplier, amount: Number(q.amount) })),
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Raise a new purchase request</h3>
                        <p className="text-xs text-gray-500 mt-0.5">≥3 quotations required for the supervisor stage to accept it</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>
                <form onSubmit={submit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Requester *</label>
                            <input type="text" value={requester} onChange={(e) => setRequester(e.target.value)}
                                placeholder="e.g. Mr. Khun"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none" required />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Department *</label>
                            <select value={dept} onChange={(e) => setDept(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none">
                                {DEPT_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Items */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-medium text-gray-600">Items *</label>
                            <span className="text-xs text-gray-500">Total: <strong className="text-gray-800">${totalAmount.toFixed(2)}</strong></span>
                        </div>
                        <div className="space-y-2">
                            {items.map((it, idx) => (
                                <div key={idx} className="flex gap-2 items-start">
                                    <input type="text" value={it.name}
                                        onChange={(e) => updateItem(idx, 'name', e.target.value)}
                                        placeholder="Item description (e.g. Office desk)"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none text-sm" />
                                    <input type="number" min="0" step="1" value={it.qty}
                                        onChange={(e) => updateItem(idx, 'qty', e.target.value)}
                                        placeholder="Qty"
                                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none text-sm text-right" />
                                    <input type="number" min="0" step="0.01" value={it.unitPrice}
                                        onChange={(e) => updateItem(idx, 'unitPrice', e.target.value)}
                                        placeholder="Unit $"
                                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none text-sm text-right" />
                                    {items.length > 1 && (
                                        <button type="button" onClick={() => removeItem(idx)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove item">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addItem}
                            className="mt-2 text-xs text-yellow-700 hover:text-yellow-800 font-medium flex items-center gap-1">
                            <Plus size={14} /> Add another item
                        </button>
                    </div>

                    {/* Quotations */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-medium text-gray-600">Quotations · 3 required</label>
                            <span className={`text-xs font-medium ${filledQuotes >= 3 ? 'text-green-700' : 'text-amber-700'}`}>
                                {filledQuotes}/3 filled
                            </span>
                        </div>
                        <div className="space-y-2">
                            {quotations.map((q, idx) => (
                                <div key={idx} className="flex gap-2 items-center">
                                    <span className="text-xs text-gray-500 w-6">#{idx + 1}</span>
                                    <input type="text" value={q.supplier}
                                        onChange={(e) => updateQuote(idx, 'supplier', e.target.value)}
                                        placeholder={`Supplier ${idx + 1} name`}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none text-sm" />
                                    <input type="number" min="0" step="0.01" value={q.amount}
                                        onChange={(e) => updateQuote(idx, 'amount', e.target.value)}
                                        placeholder="Quote $"
                                        className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none text-sm text-right" />
                                </div>
                            ))}
                        </div>
                        {filledQuotes < 3 && (
                            <p className="text-[11px] text-amber-700 mt-1">SOP: PRs with fewer than 3 quotations are flagged at supervisor stage.</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description / justification</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                            placeholder="Why is this needed? Any context for the approvers?"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none resize-none text-sm" />
                    </div>

                    <CaptureField
                        value={attachments}
                        onChange={setAttachments}
                        accentClass="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600"
                        label="Quotation scans / supporting docs"
                        helpText="Snap each quotation or attach PDFs from your gallery"
                    />

                    {err && (
                        <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{err}</div>
                    )}
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                        <button type="submit" disabled={submitting}
                            className="px-5 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-lg shadow hover:shadow-lg font-semibold transition-all disabled:opacity-60 flex items-center gap-2">
                            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {submitting ? 'Saving…' : 'Save to Mongo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShowListRequest;
