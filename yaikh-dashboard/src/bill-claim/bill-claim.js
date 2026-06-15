import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, MessageCircle, Coffee, Fuel, UtensilsCrossed, Car, Package, ParkingMeter,
    FilePlus2, Receipt, Hourglass, BadgeDollarSign, List, Paperclip,
    Plus, X, Loader2, RefreshCw
} from 'lucide-react';
import GeneralAIAgent from '../general-ag';
import { useTranslation } from '../translate/TranslationContext';
import CaptureField from '../components/CaptureField';

const CATEGORIES = [
    { key: 'petrol',    title: 'Petrol',     icon: Fuel,             color: 'bg-gradient-to-br from-orange-500 to-orange-600', shadow: 'shadow-orange-200', blurb: 'Fuel for staff errands' },
    { key: 'meal',      title: 'Meal',       icon: UtensilsCrossed,  color: 'bg-gradient-to-br from-amber-500 to-amber-600',   shadow: 'shadow-amber-200',  blurb: 'Client lunches, candidate meals' },
    { key: 'transport', title: 'Transport',  icon: Car,              color: 'bg-gradient-to-br from-blue-500 to-blue-600',     shadow: 'shadow-blue-200',   blurb: 'Grab, tuk-tuk, taxi' },
    { key: 'coffee',    title: 'Coffee',     icon: Coffee,           color: 'bg-gradient-to-br from-yellow-600 to-amber-700',  shadow: 'shadow-yellow-200', blurb: 'Office meeting drinks' },
    { key: 'courier',   title: 'Courier',    icon: Package,          color: 'bg-gradient-to-br from-purple-500 to-purple-600', shadow: 'shadow-purple-200', blurb: 'Sample courier, urgent doc' },
    { key: 'parking',   title: 'Parking',    icon: ParkingMeter,     color: 'bg-gradient-to-br from-green-500 to-green-600',   shadow: 'shadow-green-200',  blurb: 'GDT, banks, customer visits' },
];

const STATUS_OPTIONS = ['Submitted', 'Manager Approved', 'Accounting Verified', 'Reimbursed', 'Rejected'];
const DEPT_OPTIONS = ['Admin', 'Sales', 'Finance', 'HR', 'Production', 'Merchandising', 'Logistics', 'QA'];

const BillClaim = ({ onBack }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isBotOpen, setIsBotOpen] = useState(false);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchClaims = useCallback(async (cat) => {
        setLoading(true);
        setError(null);
        try {
            const url = cat ? `/api/bill-claims?category=${encodeURIComponent(cat)}` : '/api/bill-claims';
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

    useEffect(() => { fetchClaims(activeCategory); }, [fetchClaims, activeCategory]);

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

    const totalSubmittedMTD   = items.filter(c => c.status === 'Submitted').reduce((s, c) => s + (c.amount || 0), 0);
    const totalPendingMTD     = items.filter(c => c.status === 'Manager Approved' || c.status === 'Accounting Verified').reduce((s, c) => s + (c.amount || 0), 0);
    const totalReimbursedMTD  = items.filter(c => c.status === 'Reimbursed').reduce((s, c) => s + (c.amount || 0), 0);
    const totalAllMTD         = items.reduce((s, c) => s + (c.amount || 0), 0);

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
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 px-2 sm:px-4">Bill Claim</h1>
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
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all text-sm font-semibold"
                        >
                            <Plus size={18} /> Submit New Claim
                        </button>
                    </div>
                </div>
                <div className="px-3 sm:px-6 pb-2 text-xs uppercase tracking-wider text-gray-500">
                    Administration · Billing · Bill Claim
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* KPI strip */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Submitted MTD',    value: totalSubmittedMTD,  color: 'text-amber-700',  ring: 'ring-amber-200',  icon: Receipt },
                            { label: 'Pending Approval', value: totalPendingMTD,    color: 'text-blue-700',   ring: 'ring-blue-200',   icon: Hourglass },
                            { label: 'Reimbursed MTD',   value: totalReimbursedMTD, color: 'text-green-700',  ring: 'ring-green-200',  icon: BadgeDollarSign },
                            { label: 'Total Claims MTD', value: totalAllMTD,        color: 'text-slate-700',  ring: 'ring-slate-200',  icon: List },
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

                    {/* Category tiles */}
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {CATEGORIES.map((m) => {
                                const Icon = m.icon;
                                const isActive = activeCategory === m.key;
                                return (
                                    <button
                                        key={m.key}
                                        onClick={() => setActiveCategory(isActive ? null : m.key)}
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
                                    {activeCategory ? `Category: ${categoryLabel(activeCategory)}` : 'Recent claims'}
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">Petty cash &amp; staff reimbursements — not subject to PR / 3-quotation rule</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => fetchClaims(activeCategory)}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" title="Refresh">
                                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                                </button>
                                <button onClick={() => setShowCreateModal(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors">
                                    <Plus size={14} /> New Claim
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
                                        <th className="px-5 py-3 text-left">Claim No.</th>
                                        <th className="px-5 py-3 text-left">Claimant</th>
                                        <th className="px-5 py-3 text-left">Dept</th>
                                        <th className="px-5 py-3 text-left">Category</th>
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
                                            No claims yet. Click <strong>New Claim</strong> to submit one.
                                        </td></tr>
                                    )}
                                    {items.map((c) => (
                                        <tr key={c._id || c.no} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3 font-mono text-xs text-gray-700">
                                                <div className="flex items-center gap-1.5">
                                                    {c.no}
                                                    {Array.isArray(c.attachments) && c.attachments.length > 0 && (
                                                        <span className="inline-flex items-center gap-0.5 text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full" title={`${c.attachments.length} attachment${c.attachments.length === 1 ? '' : 's'}`}>
                                                            <Paperclip size={10} /> {c.attachments.length}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 font-medium text-gray-800">{c.claimant}</td>
                                            <td className="px-5 py-3 text-gray-600">{c.dept}</td>
                                            <td className="px-5 py-3 text-gray-600">{categoryLabel(c.category)}</td>
                                            <td className="px-5 py-3 text-gray-600">{c.description}</td>
                                            <td className="px-5 py-3 text-right font-semibold text-gray-800">${Number(c.amount).toFixed(2)}</td>
                                            <td className="px-5 py-3"><span className={statusBadge(c.status)}>{c.status}</span></td>
                                            <td className="px-5 py-3 text-gray-500 text-xs">{c.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
                            <span>Showing {items.length} claim{items.length === 1 ? '' : 's'}{activeCategory ? ` in ${categoryLabel(activeCategory)}` : ''}</span>
                            <span>Currency: USD · Cambodia entity · Live from Mongo</span>
                        </div>
                    </div>

                    {/* SOP reminder */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-900">
                        <div className="font-semibold mb-1">When to use Bill Claim vs Purchase Request</div>
                        <p className="leading-relaxed">
                            Bill Claim is for <strong>small day-to-day staff expenses</strong> — petrol, coffee, lunches, tuk-tuk rides, parking, urgent small purchases.
                            No 3-quotation rule, no supplier verification, just a receipt and a manager sign-off.
                            For anything that needs a supplier, formal invoice, or repeat-buy (fabric, accessories, machinery), use <strong>Purchase Request</strong> instead.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bot Button */}
            <button
                onClick={() => setIsBotOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                aria-label="Ask Bill Claim bot"
                title="Ask Bill Claim bot"
            >
                <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            </button>

            {isBotOpen && (
                <GeneralAIAgent
                    onClose={() => setIsBotOpen(false)}
                    moduleContext="Bill Claim"
                />
            )}

            {/* Create modal */}
            {showCreateModal && (
                <CreateBillClaimModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={() => { setShowCreateModal(false); fetchClaims(activeCategory); }}
                />
            )}
        </div>
    );
};

const CreateBillClaimModal = ({ onClose, onCreated }) => {
    const [form, setForm] = useState({
        claimant: '',
        dept: 'Admin',
        category: 'petrol',
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
            const res = await fetch('/api/bill-claims', {
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
                        <h3 className="text-lg font-bold text-gray-800">Submit new claim</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Petty cash / small staff reimbursement</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>
                <form onSubmit={submit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Claimant *</label>
                            <input type="text" value={form.claimant}
                                onChange={(e) => update('claimant', e.target.value)}
                                placeholder="e.g. Mr. Khun"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none" required />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Department *</label>
                            <select value={form.dept}
                                onChange={(e) => update('dept', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none">
                                {DEPT_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
                            <select value={form.category}
                                onChange={(e) => update('category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none" required>
                                {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.title}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Initial status</label>
                            <select value={form.status}
                                onChange={(e) => update('status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none">
                                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
                        <textarea value={form.description}
                            onChange={(e) => update('description', e.target.value)}
                            placeholder="What was the expense?"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none resize-none" required />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Amount (USD) *</label>
                        <input type="number" min="0" step="0.01" value={form.amount}
                            onChange={(e) => update('amount', e.target.value)}
                            placeholder="0.00"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none" required />
                    </div>
                    <CaptureField
                        value={attachments}
                        onChange={setAttachments}
                        accentClass="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                        label="Receipt photos"
                        helpText="Snap the receipt with your phone camera, or attach from your gallery"
                    />
                    {err && (
                        <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{err}</div>
                    )}
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                        <button type="submit" disabled={submitting}
                            className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg shadow hover:shadow-lg font-semibold transition-all disabled:opacity-60 flex items-center gap-2">
                            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {submitting ? 'Saving…' : 'Save to Mongo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BillClaim;
