import React, { useState, useEffect } from "react";
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar,
} from "lucide-react";
import { useTranslation } from "../translate/TranslationContext";

const AuditCalendar = ({ plans, onBack, onCreateEvent }) => {
    const { t } = useTranslation();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState("Month"); // 'Month', 'Week', 'Day'

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        );
    };

    const handleNextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        );
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const renderCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        // Empty cells for days before start of month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-32 border border-slate-100 bg-slate-50/30"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isToday =
                new Date().toDateString() === new Date(year, month, day).toDateString();

            // Find events for this day
            const dayEvents = plans.flatMap(plan => {
                const events = [];
                const details = plan.details || {};

                // Check Pre-Audit
                let preAuditDate = details.preAuditDate;
                // fallback
                if (!preAuditDate && plan.stages) {
                    const s = plan.stages.find(st => st.name === 'Pre-Audit');
                    if (s && s.date) {
                        // Try to parse "DD MMM YYYY" if needed, but assuming ISO for comparison
                        // If s.date is "01 Jan 2026", new Date() works.
                        const d = new Date(s.date);
                        if (!isNaN(d.getTime())) {
                            preAuditDate = d.toISOString().split('T')[0];
                        }
                    }
                }

                if (preAuditDate === dateStr) {
                    events.push({
                        type: 'Pre-Audit',
                        title: filterTitle(details.typeOfAudit || plan.company),
                        color: 'bg-blue-100 text-blue-700 border-blue-200'
                    });
                }

                // Check On-site Audit
                let auditDate = details.auditDate;
                if (!auditDate && plan.stages) {
                    const s = plan.stages.find(st => st.name === 'On-site Audit');
                    if (s && s.date) {
                        const d = new Date(s.date);
                        if (!isNaN(d.getTime())) {
                            auditDate = d.toISOString().split('T')[0];
                        }
                    }
                }

                if (auditDate === dateStr) {
                    events.push({
                        type: 'Audit',
                        title: filterTitle(details.typeOfAudit || plan.company),
                        color: 'bg-amber-100 text-amber-700 border-amber-200'
                    });
                }

                return events;
            });


            days.push(
                <div
                    key={`day-${day}`}
                    className={`h-32 border border-slate-200 p-2 relative group hover:bg-slate-50 transition-colors ${isToday ? "bg-blue-50/50" : "bg-white"
                        }`}
                >
                    <div className={`text-right mb-1 ${isToday ? "font-bold text-blue-600" : "text-slate-500"}`}>
                        <span className={`inline-block w-7 h-7 leading-7 text-center rounded-full ${isToday ? "bg-blue-600 text-white" : ""}`}>
                            {day}
                        </span>
                    </div>
                    <div className="space-y-1 overflow-y-auto max-h-[calc(100%-2rem)]">
                        {dayEvents.map((evt, idx) => (
                            <div key={idx} className={`text-xs px-2 py-1 rounded border ${evt.color} truncate font-medium cursor-pointer hover:opacity-80`} title={`${evt.type}: ${evt.title}`}>
                                {evt.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return days;
    };

    const filterTitle = (title) => {
        if (!title) return "Audit";
        return title;
    }

    const renderMiniCalendar = () => {
        // Simplified mini calendar for display
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        // Headers
        const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

        for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="text-center py-1"></div>);
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = new Date().getDate() === i && new Date().getMonth() === month && new Date().getFullYear() === year;
            const isSelected = currentDate.getDate() === i; // Just highlighting selected date if needed
            days.push(
                <button key={i} className={`text-center py-1 text-xs rounded-full w-6 h-6 mx-auto flex items-center justify-center hover:bg-slate-100 ${isToday ? 'bg-blue-600 text-white font-bold' : 'text-slate-700'}`}>
                    {i}
                </button>
            );
        }

        return (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded"><ChevronLeft size={14} /></button>
                    <span className="font-bold text-sm text-slate-800">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded"><ChevronRight size={14} /></button>
                </div>
                <div className="grid grid-cols-7 mb-2">
                    {weekDays.map(d => <div key={d} className="text-center text-[10px] font-bold text-slate-400">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-y-1">
                    {days}
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-white z-[250] flex flex-col animate-in fade-in duration-300">
            {/* Header */}
            <div className="bg-white p-4 border-b flex items-center justify-between flex-shrink-0 shadow-sm z-20 relative">
                <div className="flex items-center gap-4">
                    {/* Back Button matching screenshot style */}
                    <button
                        onClick={onBack}
                        className="bg-slate-800 text-white px-6 py-2 rounded font-semibold text-sm hover:bg-slate-700 transition-colors"
                    >
                        Back
                    </button>
                </div>

                <h1 className="text-xl font-bold text-slate-800 text-center flex-1">
                    Calendar Report
                </h1>

                <div className="w-24"></div> {/* Spacer for center alignment */}
            </div>

            <div className="flex flex-1 overflow-hidden bg-slate-50">
                {/* Sidebar */}
                <div className="w-80 bg-white border-r border-slate-200 p-6 flex flex-col overflow-y-auto hidden md:flex">
                    <button
                        onClick={onCreateEvent}
                        className="bg-blue-600 text-white w-full py-3 rounded-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 mb-6"
                    >
                        <Plus size={20} /> Create Event
                    </button>

                    {renderMiniCalendar()}

                    <div className="mt-auto">
                        {/* Placeholder for future widgets */}
                    </div>
                </div>

                {/* Main Calendar Area */}
                <div className="flex-1 flex flex-col p-6 overflow-hidden">
                    {/* Controls */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <button onClick={handlePrevMonth} className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded hover:bg-slate-50 bg-white"><ChevronLeft size={16} /></button>
                            <button onClick={handleNextMonth} className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded hover:bg-slate-50 bg-white"><ChevronRight size={16} /></button>
                            <button onClick={handleToday} className="px-4 py-1.5 border border-slate-300 rounded hover:bg-slate-50 font-semibold text-slate-700 bg-slate-500 text-white">Today</button>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-800">
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h2>

                        <div className="flex border border-slate-300 rounded overflow-hidden bg-white">
                            <button
                                onClick={() => setView('Month')}
                                className={`px-4 py-1.5 text-sm font-semibold border-r border-slate-300 last:border-r-0 ${view === 'Month' ? 'bg-blue-600 text-white' : 'hover:bg-slate-50 text-slate-700'}`}
                            >
                                Month
                            </button>
                            <button
                                onClick={() => setView('Week')}
                                className={`px-4 py-1.5 text-sm font-semibold border-r border-slate-300 last:border-r-0 ${view === 'Week' ? 'bg-blue-600 text-white' : 'hover:bg-slate-50 text-slate-700'}`}
                            >
                                Week
                            </button>
                            <button
                                onClick={() => setView('Day')}
                                className={`px-4 py-1.5 text-sm font-semibold border-r border-slate-300 last:border-r-0 ${view === 'Day' ? 'bg-blue-600 text-white' : 'hover:bg-slate-50 text-slate-700'}`}
                            >
                                Day
                            </button>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="flex-1 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
                        {/* Weekday Headers */}
                        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                                <div key={day} className="py-2 text-center text-xs font-bold text-slate-500 tracking-wider">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="grid grid-cols-7 border-b border-slate-200 last:border-b-0 auto-rows-fr">
                                {renderCalendarDays()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditCalendar;
