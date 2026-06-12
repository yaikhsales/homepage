import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Search, RotateCcw } from 'lucide-react';

const MyFaceScan = ({ onBack }) => {
    const navigate = useNavigate();
    const [fromDate, setFromDate] = useState('2025-12-23');
    const [toDate, setToDate] = useState('2025-12-23');

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const handleFilter = () => {
        console.log('Filter logs:', { fromDate, toDate });
    };

    const handleReset = () => {
        setFromDate('2025-12-23');
        setToDate('2025-12-23');
    };

    // Sample face scan history data
    const faceScanHistory = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
            timestamp: '2025-12-23 08:15:32 AM',
            location: 'Main Gate In',
            status: 'success'
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
            timestamp: '2025-12-23 12:30:15 PM',
            location: 'Building A - Entrance',
            status: 'success'
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
            timestamp: '2025-12-23 05:45:22 PM',
            location: 'Main Gate Out',
            status: 'success'
        },
        {
            id: 4,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
            timestamp: '2025-12-22 09:20:10 AM',
            location: 'Main Gate In',
            status: 'success'
        },
        {
            id: 5,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
            timestamp: '2025-12-22 06:15:45 PM',
            location: 'Main Gate Out',
            status: 'success'
        }
    ];

    return (
        <div className="fixed inset-0 bg-slate-100 flex flex-col animate-in fade-in duration-500 z-[200]">
            {/* Header */}
            <div className="bg-white p-4 border-b flex items-center gap-4 flex-shrink-0 shadow-sm relative z-[201]">
                <div className="w-32"></div> {/* Left spacer */}
                <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleBack} 
                            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 rounded transition-colors flex-shrink-0 bg-slate-600 text-white font-semibold text-sm"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-slate-300 hover:border-slate-400 transition-all hover:scale-110 cursor-pointer flex-shrink-0"
                            title="Home"
                        >
                            <img 
                                src="/logo.jpg" 
                                alt="Home" 
                                className="w-full h-full object-cover"
                            />
                        </button>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800 underline">My Face Scan History</h1>
                </div>
                <div className="w-32"></div> {/* Right spacer */}
            </div>

            {/* Main Content - Full Screen */}
            <div className="flex-1 overflow-auto p-6">
                <div className="w-full h-full">
                    {/* White Card with Dashed Border - Full Width */}
                    <div className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-8 h-full min-h-[calc(100vh-200px)] flex flex-col">
                        {/* Filter Section */}
                        <div className="flex flex-wrap items-center gap-6 mb-8">
                            {/* From Date */}
                            <div className="flex items-center gap-3">
                                <Calendar className="text-slate-600 flex-shrink-0" size={20} />
                                <span className="text-sm text-slate-700 font-semibold whitespace-nowrap">From Date</span>
                                <div className="relative">
                                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                    <input
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        className="px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
                                    />
                                </div>
                            </div>

                            {/* To Date */}
                            <div className="flex items-center gap-3">
                                <Calendar className="text-slate-600 flex-shrink-0" size={20} />
                                <span className="text-sm text-slate-700 font-semibold whitespace-nowrap">To Date</span>
                                <div className="relative">
                                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                    <input
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        className="px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
                                    />
                                </div>
                            </div>

                            {/* Filter Logs Button */}
                            <button
                                onClick={handleFilter}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                            >
                                <Search size={16} />
                                Filter Logs
                            </button>

                            {/* Reset Button */}
                            <button
                                onClick={handleReset}
                                className="px-6 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2 whitespace-nowrap"
                            >
                                <RotateCcw size={16} />
                                Reset
                            </button>
                        </div>

                        {/* Face Scan History Table */}
                        <div className="flex-1 overflow-auto">
                            <table className="w-full">
                                <thead className="bg-slate-100 border-b border-slate-300 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">IMAGE</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">TIMESTAMP</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">LOCATION</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {faceScanHistory.map((log) => (
                                        <tr key={log.id} className="border-b border-slate-200 hover:bg-slate-50">
                                            <td className="px-4 py-3">
                                                <img 
                                                    src={log.image} 
                                                    alt="Face Scan" 
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-800">{log.timestamp}</td>
                                            <td className="px-4 py-3 text-sm text-slate-800">{log.location}</td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyFaceScan;

