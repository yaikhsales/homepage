import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { useTranslation } from '../translate/TranslationContext'; // Assuming this context exists and is used elsewhere

export default function AuditPlanTimeline({ plans, onBack }) {
    const { t } = useTranslation();
    const [year, setYear] = useState(new Date().getFullYear());

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const getMonthFromDate = (dateStr) => {
        if (!dateStr) return -1;
        const date = new Date(dateStr);
        return date.getMonth();
    };

    const getYearFromDate = (dateStr) => {
        if (!dateStr) return -1;
        const date = new Date(dateStr);
        return date.getFullYear();
    };

    const getDayFromDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.getDate().toString().padStart(2, '0');
    };

    // Filter plans relevant to the selected year
    const filteredPlans = plans.filter(plan => {
        const details = plan.details || {};
        // Check if any stage falls in this year
        // We primarily care about Pre-Audit and On-site Audit
        const preAuditDate = details.preAuditDate || (plan.stages?.find(s => s.name === "Pre-Audit")?.date);
        const auditDate = details.auditDate || (plan.stages?.find(s => s.name === "On-site Audit")?.date);

        // Accessing year from date strings
        // Note: plan.stages dates might be formatted as "DD MMM YYYY", we need to parse that if so.
        // But createForm creates ISO strings "YYYY-MM-DD".
        // The display logic in AuditPlan uses formatDate which converts to "DD MMM YYYY".
        // However, 'details' stores the original form data which is "YYYY-MM-DD".
        // So checking details first is safer.

        const preAuditYear = preAuditDate ? new Date(preAuditDate).getFullYear() : -1;
        const auditYear = auditDate ? new Date(auditDate).getFullYear() : -1;

        return preAuditYear === year || auditYear === year;
    });

    const renderCell = (plan, monthIndex) => {
        const details = plan.details || {};
        const typeOfAudit = details.typeOfAudit || plan.company || "Audit";
        const auditName = details.auditName || plan.company;

        // Find relevant stages for this month
        const events = [];

        // Check Pre-Audit
        let preAuditDate = details.preAuditDate;
        // Fallback for legacy data or if date is in stage array (formatted)
        if (!preAuditDate && plan.stages) {
            const stage = plan.stages.find(s => s.name === "Pre-Audit");
            if (stage && stage.date) preAuditDate = stage.date; // This might be "DD MMM YYYY" which Date() can often parse
        }

        if (preAuditDate) {
            const dateObj = new Date(preAuditDate);
            if (dateObj.getFullYear() === year && dateObj.getMonth() === monthIndex) {
                events.push({
                    type: 'Pre-Audit',
                    date: dateObj.getDate(),
                    label: typeOfAudit,
                    color: 'bg-slate-100 border-slate-200 text-slate-600',
                    textColor: 'text-slate-600'
                });
            }
        }

        // Check On-site Audit
        let auditDate = details.auditDate;
        if (!auditDate && plan.stages) {
            const stage = plan.stages.find(s => s.name === "On-site Audit");
            if (stage && stage.date) auditDate = stage.date;
        }

        if (auditDate) {
            const dateObj = new Date(auditDate);
            if (dateObj.getFullYear() === year && dateObj.getMonth() === monthIndex) {
                // Determine color based on completion or type?
                // Screenshot uses Yellow/Gold for most. Purple for some.
                // Let's use Gold by default.
                events.push({
                    type: 'Audit',
                    date: dateObj.getDate(),
                    label: typeOfAudit,
                    color: 'bg-amber-400 border-amber-500 text-slate-800',
                    // Example purple condition: if name contains CTPAT maybe? Just simple check for variety or matching screenshot
                    // mimicking screenshot logic if possible (e.g. CTPAT is purple)
                    color: typeOfAudit.toUpperCase().includes('CTPAT') ? 'bg-purple-400 border-purple-500 text-white' : 'bg-amber-400 border-amber-500 text-slate-800'
                });
            }
        }

        if (events.length === 0) return null;

        return (
            <div className="flex flex-col gap-1 items-center justify-center h-full w-full p-1">
                {events.map((evt, i) => (
                    <div key={i} className={`w-full ${evt.color} rounded p-1 text-[10px] md:text-xs font-bold text-center border shadow-sm flex flex-col items-center justify-center leading-tight`}>
                        <div className="mb-0.5 opacity-80">{evt.type === 'Pre-Audit' ? 'Pre Audit' : 'Audit'}</div>
                        <div className="text-lg leading-none mb-0.5">{evt.date}</div>
                        <div className="uppercase tracking-tighter truncate w-full">{evt.label}</div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-white z-[250] flex flex-col animate-in fade-in duration-300">
            {/* Header */}
            <div className="bg-white p-4 border-b flex items-center justify-between flex-shrink-0 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-800 rounded transition-colors flex-shrink-0 bg-black text-white font-semibold text-sm"
                    >
                        <ArrowLeft size={16} /> {t('back')}
                    </button>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                        {t('auditPlanning') || `Audit Planning ${year}`}
                    </h1>
                    <span className="text-sm text-slate-500 hidden md:inline-block">Timeline view of scheduled audits</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setYear(y => y - 1)}
                        className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-100 flex items-center gap-1 text-sm font-semibold"
                    >
                        <ChevronLeft size={16} /> Previous Year
                    </button>
                    <span className="text-lg font-bold min-w-[60px] text-center">{year}</span>
                    <button
                        onClick={() => setYear(y => y + 1)}
                        className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-100 flex items-center gap-1 text-sm font-semibold"
                    >
                        Next Year <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Timeline Grid */}
            <div className="flex-1 overflow-auto bg-slate-50 p-4">
                <div className="bg-white rounded-lg shadow border border-slate-200 min-w-[1000px]">
                    {/* Header Row */}
                    <div className="flex border-b border-slate-200">
                        <div className="w-40 md:w-64 p-3 font-bold text-slate-700 bg-slate-100 sticky left-0 z-10 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                            Audit Name / Location
                        </div>
                        {months.map((m, i) => (
                            <div key={i} className="flex-1 min-w-[100px] p-3 text-center font-bold text-slate-700 bg-slate-50 border-r border-slate-200 last:border-r-0">
                                {m}-{year.toString().slice(2)}
                            </div>
                        ))}
                    </div>

                    {/* Body Rows */}
                    {filteredPlans.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 italic">
                            No audit plans found for {year}.
                        </div>
                    ) : (
                        filteredPlans.map((plan) => (
                            <div key={plan.id} className="flex border-b border-slate-200 hover:bg-blue-50/30 transition-colors min-h-[6rem]">
                                <div className="w-40 md:w-64 p-3 bg-white sticky left-0 z-10 border-r border-slate-200 flex flex-col justify-center shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                    <div className="font-bold text-slate-800 text-sm truncate" title={plan.location}>
                                        {plan.location}
                                    </div>
                                    <div className="text-xs text-slate-500 truncate" title={plan.details?.typeOfAudit || plan.company}>
                                        {plan.details?.typeOfAudit || plan.company}
                                    </div>
                                </div>
                                {months.map((_, i) => (
                                    <div key={i} className="flex-1 min-w-[100px] border-r border-slate-200 last:border-r-0 relative">
                                        {renderCell(plan, i)}
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Legend */}
            <div className="bg-white p-3 border-t text-xs flex items-center gap-6 text-slate-600">
                <span className="font-bold mr-2">Legend:</span>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-slate-100 border border-slate-300 rounded"></div> Pre-Audit
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-400 border border-amber-500 rounded"></div> On-site Audit
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-400 border border-purple-500 rounded"></div> CTPAT Special
                </div>
            </div>
        </div>
    );
}
