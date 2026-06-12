import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Check, Clock, ExternalLink, Search, X, MessageCircle } from 'lucide-react';
import GeneralAIAgent from '../general-ag';

const RequestWorkerList = ({ onBack }) => {
    const navigate = useNavigate();
    const [isBotOpen, setIsBotOpen] = useState(false);
    const [fromDate, setFromDate] = useState('2025-12-23');
    const [toDate, setToDate] = useState('2025-12-23');
    const [requests, setRequests] = useState([
        {
            id: 1,
            requestNo: 'TWR-001',
            department: 'Production',
            requestor: 'John Doe',
            workerType: 'Temporary Worker',
            numberOfWorkers: 5,
            gender: 'Male',
            startDate: '2025-12-25',
            endDate: '2025-12-31',
            reason: 'Increased production demand',
            status: 'pending',
            requestDate: '2025-12-23'
        },
        {
            id: 2,
            requestNo: 'TWR-002',
            department: 'Packaging',
            requestor: 'Sarah Johnson',
            workerType: 'Seasonal Worker',
            numberOfWorkers: 3,
            gender: 'Female',
            startDate: '2025-12-26',
            endDate: '2026-01-05',
            reason: 'Holiday season peak workload',
            status: 'approved',
            requestDate: '2025-12-22'
        },
        {
            id: 3,
            requestNo: 'TWR-003',
            department: 'Quality Control',
            requestor: 'Mike Brown',
            workerType: 'Temporary Worker',
            numberOfWorkers: 2,
            gender: 'Male',
            startDate: '2025-12-24',
            endDate: '2025-12-30',
            reason: 'Additional QC inspection needed',
            status: 'pending',
            requestDate: '2025-12-21'
        },
        {
            id: 4,
            requestNo: 'TWR-004',
            department: 'Warehouse',
            requestor: 'Emily Chen',
            workerType: 'Part-time Worker',
            numberOfWorkers: 4,
            gender: 'Female',
            startDate: '2025-12-27',
            endDate: '2026-01-10',
            reason: 'Inventory management support',
            status: 'rejected',
            requestDate: '2025-12-20'
        },
        {
            id: 5,
            requestNo: 'TWR-005',
            department: 'Shipping',
            requestor: 'David Lee',
            workerType: 'Temporary Worker',
            numberOfWorkers: 6,
            gender: 'Male',
            startDate: '2025-12-28',
            endDate: '2026-01-15',
            reason: 'Year-end shipping rush',
            status: 'approved',
            requestDate: '2025-12-19'
        }
    ]);

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const handleSearch = () => {
        console.log('Search from', fromDate, 'to', toDate);
        // Add search logic here
    };

    const handleClear = () => {
        setFromDate('');
        setToDate('');
        setRequests([]);
    };

    const handleApproveList = () => {
        console.log('Approve List');
    };

    const handleRejectList = () => {
        console.log('Reject List');
    };

    const handleMonthlyReport = () => {
        console.log('Monthly Report');
    };

    const handleExport = () => {
        console.log('Export');
    };

    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

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
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800 underline">Temporary Worker Request</h1>
                </div>
                <div className="w-32"></div> {/* Right spacer */}
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="w-full h-full">
                    {/* White Card */}
                    <div className="bg-white h-full p-6">
                        {/* Top Section: Filters and Action Buttons */}
                        <div className="mb-6">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-start gap-4 mb-4">
                                {/* Filter Section (Left) */}
                                <div className="flex items-center gap-3 flex-wrap">
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={fromDate}
                                                onChange={(e) => setFromDate(e.target.value)}
                                                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 w-40"
                                            />
                                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                        </div>
                                        <span className="text-slate-600 font-medium">to</span>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={toDate}
                                                onChange={(e) => setToDate(e.target.value)}
                                                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 w-40"
                                            />
                                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleSearch}
                                        className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
                                    >
                                        <Search size={16} />
                                        Search
                                    </button>
                                    <button
                                        onClick={handleClear}
                                        className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2"
                                    >
                                        <X size={16} />
                                        Clear
                                    </button>
                                </div>

                                {/* Action Buttons (Right) */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <button
                                        onClick={handleApproveList}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                                    >
                                        <Check size={16} />
                                        Approve List
                                    </button>
                                    <button
                                        onClick={handleRejectList}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                                    >
                                        <Clock size={16} />
                                        Reject List
                                    </button>
                                    <button
                                        onClick={handleMonthlyReport}
                                        className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2"
                                    >
                                        <ExternalLink size={16} />
                                        Monthly Report
                                    </button>
                                    <button
                                        onClick={handleExport}
                                        className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2"
                                    >
                                        <ExternalLink size={16} />
                                        Export
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">N°</th>
                                        <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">HR CHECK</th>
                                        <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">HR APPROVAL</th>
                                        <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">GM</th>
                                        <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">REQUESTOR</th>
                                        <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">DEPARTMENT</th>
                                        <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">WORKER TYPE</th>
                                        <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center" colSpan={2}>
                                            GENDER OF WORKER
                                        </th>
                                        <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">ACTION</th>
                                    </tr>
                                    <tr>
                                        <th className="px-4 py-2 border border-slate-200 bg-slate-50"></th>
                                        <th className="px-4 py-2 border border-slate-200 bg-slate-50"></th>
                                        <th className="px-4 py-2 border border-slate-200 bg-slate-50"></th>
                                        <th className="px-4 py-2 border border-slate-200 bg-slate-50"></th>
                                        <th className="px-4 py-2 border border-slate-200 bg-slate-50"></th>
                                        <th className="px-4 py-2 border border-slate-200 bg-slate-50"></th>
                                        <th className="px-4 py-2 border border-slate-200 bg-slate-50"></th>
                                        <th className="px-4 py-2 border border-slate-200 text-slate-600 font-bold text-xs text-center bg-slate-50">M</th>
                                        <th className="px-4 py-2 border border-slate-200 text-slate-600 font-bold text-xs text-center bg-slate-50">F</th>
                                        <th className="px-4 py-2 border border-slate-200 bg-slate-50"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.length === 0 ? (
                                        <tr>
                                            <td colSpan={10} className="text-center py-16 text-slate-500">
                                                No requests found.
                                            </td>
                                        </tr>
                                    ) : (
                                        requests.map((request, idx) => (
                                            <tr key={request.id} className="hover:bg-blue-50 transition-colors">
                                                <td className="px-4 py-4 border border-slate-200 text-slate-700 text-center">{idx + 1}</td>
                                                <td className="px-4 py-4 border border-slate-200 text-slate-700 text-center">
                                                    {/* HR CHECK status */}
                                                </td>
                                                <td className="px-4 py-4 border border-slate-200 text-slate-700 text-center">
                                                    {/* HR APPROVAL status */}
                                                </td>
                                                <td className="px-4 py-4 border border-slate-200 text-slate-700 text-center">
                                                    {/* GM status */}
                                                </td>
                                                <td className="px-4 py-4 border border-slate-200 text-slate-700">{request.requestor}</td>
                                                <td className="px-4 py-4 border border-slate-200 text-slate-700">{request.department}</td>
                                                <td className="px-4 py-4 border border-slate-200 text-slate-700">{request.workerType}</td>
                                                <td className="px-4 py-4 border border-slate-200 text-slate-700 text-center">
                                                    {request.gender === 'Male' ? '1' : '0'}
                                                </td>
                                                <td className="px-4 py-4 border border-slate-200 text-slate-700 text-center">
                                                    {request.gender === 'Female' ? '1' : '0'}
                                                </td>
                                                <td className="px-4 py-4 border border-slate-200 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Bot Button - Bottom Right */}
            <button
                onClick={() => setIsBotOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                aria-label="Ask Request Worker List bot"
                title="Ask Request Worker List bot"
            >
                <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            </button>
            
            {/* Bot Modal */}
            {isBotOpen && (
                <GeneralAIAgent 
                    onClose={() => setIsBotOpen(false)}
                    moduleContext="Request Worker List"
                />
            )}
        </div>
    );
};

export default RequestWorkerList;

