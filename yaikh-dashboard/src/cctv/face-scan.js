import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, Download, ChevronLeft, ChevronRight, User, Eye } from 'lucide-react';

const FaceScan = ({ onBack }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [fromDate, setFromDate] = useState('2026-10-23');
    const [toDate, setToDate] = useState('2026-10-23');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const totalResults = 10501;

    const faceScanLogs = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
            userName: 'Unknown User',
            userId: null,
            camera: 'Main Gate Out',
            cameraId: '00000000',
            timestamp: '23.05.2026 00:01:17 PM',
            status: 'unknown'
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
            userName: 'Rym Draynel',
            userId: null,
            camera: 'Main Gate In',
            cameraId: '00000000',
            timestamp: '23.05.2026 11:45:32 AM',
            status: 'known'
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
            userName: 'Zarra Bal',
            userId: '00000000',
            camera: 'Main Gate Out',
            cameraId: '00000000',
            timestamp: '23.05.2026 10:30:15 AM',
            status: 'known'
        },
        {
            id: 4,
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
            userName: 'Cleath Charwan',
            userId: null,
            camera: 'Main Gate In',
            cameraId: '00000000',
            timestamp: '23.05.2026 09:15:42 AM',
            status: 'unknown'
        },
        {
            id: 5,
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
            userName: 'In Bavourah',
            userId: '00000000',
            camera: 'Main Gate Out',
            cameraId: '00000000',
            timestamp: '23.05.2026 08:22:11 AM',
            status: 'known'
        },
        {
            id: 6,
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
            userName: 'Thush Santhush',
            userId: null,
            camera: 'Main Gate In',
            cameraId: '00000000',
            timestamp: '23.05.2026 07:45:28 AM',
            status: 'unknown'
        },
        {
            id: 7,
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
            userName: 'Kil Nahia',
            userId: '00000000',
            camera: 'Main Gate Out',
            cameraId: '00000000',
            timestamp: '23.05.2026 06:30:55 AM',
            status: 'known'
        },
        {
            id: 8,
            image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
            userName: 'Ben Marr',
            userId: null,
            camera: 'Main Gate In',
            cameraId: '00000000',
            timestamp: '23.05.2026 05:15:33 AM',
            status: 'unknown'
        },
        {
            id: 9,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
            userName: 'Unknown User',
            userId: null,
            camera: 'Main Gate Out',
            cameraId: '00000000',
            timestamp: '23.05.2026 04:22:17 AM',
            status: 'unknown'
        },
        {
            id: 10,
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
            userName: 'Rym Draynel',
            userId: '00000000',
            camera: 'Main Gate In',
            cameraId: '00000000',
            timestamp: '23.05.2026 03:45:12 AM',
            status: 'known'
        },
        {
            id: 11,
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
            userName: 'Zarra Bal',
            userId: null,
            camera: 'Main Gate Out',
            cameraId: '00000000',
            timestamp: '23.05.2026 02:30:45 AM',
            status: 'unknown'
        },
        {
            id: 12,
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
            userName: 'Cleath Charwan',
            userId: '00000000',
            camera: 'Main Gate In',
            cameraId: '00000000',
            timestamp: '23.05.2026 01:15:28 AM',
            status: 'known'
        },
        {
            id: 13,
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
            userName: 'In Bavourah',
            userId: null,
            camera: 'Main Gate Out',
            cameraId: '00000000',
            timestamp: '23.05.2026 00:45:11 AM',
            status: 'unknown'
        },
        {
            id: 14,
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
            userName: 'Thush Santhush',
            userId: '00000000',
            camera: 'Main Gate In',
            cameraId: '00000000',
            timestamp: '22.05.2026 11:30:55 PM',
            status: 'known'
        },
        {
            id: 15,
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
            userName: 'Kil Nahia',
            userId: null,
            camera: 'Main Gate Out',
            cameraId: '00000000',
            timestamp: '22.05.2026 10:22:33 PM',
            status: 'unknown'
        },
        {
            id: 16,
            image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
            userName: 'Ben Marr',
            userId: '00000000',
            camera: 'Main Gate In',
            cameraId: '00000000',
            timestamp: '22.05.2026 09:15:17 PM',
            status: 'known'
        },
        {
            id: 17,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
            userName: 'Unknown User',
            userId: null,
            camera: 'Main Gate Out',
            cameraId: '00000000',
            timestamp: '22.05.2026 08:45:42 PM',
            status: 'unknown'
        },
        {
            id: 18,
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
            userName: 'Rym Draynel',
            userId: null,
            camera: 'Main Gate In',
            cameraId: '00000000',
            timestamp: '22.05.2026 07:30:28 PM',
            status: 'known'
        },
        {
            id: 19,
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
            userName: 'Zarra Bal',
            userId: '00000000',
            camera: 'Main Gate Out',
            cameraId: '00000000',
            timestamp: '22.05.2026 06:15:11 PM',
            status: 'unknown'
        },
        {
            id: 20,
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
            userName: 'Cleath Charwan',
            userId: null,
            camera: 'Main Gate In',
            cameraId: '00000000',
            timestamp: '22.05.2026 05:22:55 PM',
            status: 'known'
        }
    ];

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const handleFilter = () => {
        console.log('Filter logs:', { searchQuery, fromDate, toDate, statusFilter });
    };

    const handleExport = () => {
        console.log('Export logs');
    };

    const handleIdentity = (logId) => {
        console.log('Identify user for log:', logId);
    };

    const handleViewProfile = (logId) => {
        console.log('View profile for log:', logId);
    };

    const totalPages = Math.ceil(totalResults / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalResults);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 10;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 5) {
                for (let i = 1; i <= 10; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 4) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 9; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    const filteredLogs = faceScanLogs.filter(log => {
        if (statusFilter !== 'all' && log.status !== statusFilter) return false;
        if (searchQuery && !log.userName.toLowerCase().includes(searchQuery.toLowerCase()) && 
            !(log.userId && log.userId.includes(searchQuery))) return false;
        return true;
    });

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
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800">Face Scan Logs</h1>
                </div>
                <div className="w-32"></div> {/* Right spacer */}
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Search and Filter Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Search Input */}
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by name/ID..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Date Filters */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-700 font-semibold">From Date</span>
                                <div className="relative">
                                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                    <input
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        className="px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-700 font-semibold">To Date</span>
                                <div className="relative">
                                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                    <input
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        className="px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Status Dropdown */}
                            <div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">all</option>
                                    <option value="known">known</option>
                                    <option value="unknown">unknown</option>
                                </select>
                            </div>

                            {/* Action Buttons */}
                            <button
                                onClick={handleFilter}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Filter Logs
                            </button>
                            <button
                                onClick={handleExport}
                                className="px-4 py-2 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors flex items-center gap-2"
                            >
                                <Download size={16} />
                                Export
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Image</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">User Info</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Camera / Service</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Timestamp</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLogs.map((log, index) => (
                                        <tr key={log.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50 hover:bg-blue-50'}>
                                            <td className="px-4 py-3">
                                                <img
                                                    src={log.image}
                                                    alt={log.userName}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-semibold text-slate-800">{log.userName}</div>
                                                <div className="text-sm text-slate-600">
                                                    {log.userId ? `ID: ${log.userId}` : 'No ID Registered'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm text-slate-800">{log.camera}</div>
                                                <div className="text-xs text-slate-600">ID: {log.cameraId}</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-800">{log.timestamp}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-3 py-1 rounded text-xs font-semibold ${
                                                    log.status === 'known'
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-red-500 text-white'
                                                }`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {log.status === 'unknown' ? (
                                                    <button
                                                        onClick={() => handleIdentity(log.id)}
                                                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                                                    >
                                                        identity
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleViewProfile(log.id)}
                                                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-1"
                                                    >
                                                        <Eye size={14} />
                                                        View Profile
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex items-center justify-between">
                            <div className="text-sm text-slate-600">
                                Showing {startIndex}-{endIndex} of {totalResults} results
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                {getPageNumbers().map((page, index) => (
                                    <React.Fragment key={index}>
                                        {page === '...' ? (
                                            <span className="px-2 text-slate-600">...</span>
                                        ) : (
                                            <button
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-1 rounded-lg font-semibold text-sm ${
                                                    currentPage === page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        )}
                                    </React.Fragment>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaceScan;

