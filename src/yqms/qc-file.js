import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Search,
    Filter,
    Maximize2,
    Download,
    Plus,
    // eslint-disable-next-line no-unused-vars
    ChevronRight,
    // eslint-disable-next-line no-unused-vars
    Package,
    Clock,
    // eslint-disable-next-line no-unused-vars
    TrendingUp,
    // eslint-disable-next-line no-unused-vars
    Truck,
    FileText,
    CheckCircle,
    Activity,
    Eye,
    Pencil,
    Trash2,
    Calendar,
    // eslint-disable-next-line no-unused-vars
    ThumbsUp,
    MessageSquare,
    X,
    Send,
    FileUp,
    // eslint-disable-next-line no-unused-vars
    Loader2
} from 'lucide-react';
import { useTranslation } from '../translate/TranslationContext';

const QCFile = ({ onBack }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const fileInputRef = React.useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [modalType, setModalType] = useState('recommend'); // 'recommend' or 'feedback'
    const [commentText, setCommentText] = useState('');
    const [uploadingId, setUploadingId] = useState(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const initialRecords = [
        { id: 'GPAR12376NOS', date: '2024-02-14', buyer: 'Aritzia', style: 'FFS 99-06-60284-R-SU26', rolls: 45, qty: '2,250m', status: 'Completed', statusColor: 'text-emerald-700 bg-emerald-100 border-emerald-200', file: 'QC_Report_001.pdf', comments: 12 },
        { id: 'GPAR12261', date: '2024-02-14', buyer: 'Aritzia', style: 'RBCY 02-01-10008-SU26(RMG0546)', rolls: 12, qty: '600m', status: 'Completed', statusColor: 'text-emerald-700 bg-emerald-100 border-emerald-200', file: 'QC_Report_002.pdf', comments: 5 },
        { id: 'PTCOC400A', date: '2024-02-13', buyer: 'Costco', style: 'CR1411CC-01', rolls: 88, qty: '4,000m', status: 'Completed', statusColor: 'text-emerald-700 bg-emerald-100 border-emerald-200', file: 'QC_Report_003.pdf', comments: 5 },
        { id: 'GPAF6007RGD', date: '2024-02-11', buyer: 'ANF', style: 'S261220001', rolls: 25, qty: '1,250m', status: 'Completed', statusColor: 'text-emerald-700 bg-emerald-100 border-emerald-200', file: 'QC_Report_004.pdf', comments: 8 },
        { id: 'GPAR12343NOS', date: '2024-02-10', buyer: 'Aritzia', style: 'FFS 99-03-44504-SU26-02', rolls: 30, qty: '1,500m', status: 'Completed', statusColor: 'text-emerald-700 bg-emerald-100 border-emerald-200', file: 'QC_Report_005.pdf', comments: 3 },
        { id: 'GPRT00188A', date: '2024-02-09', buyer: 'Reitmans', style: 'W02-493553', rolls: 50, qty: '2,500m', status: 'Completed', statusColor: 'text-emerald-700 bg-emerald-100 border-emerald-200', file: 'QC_Report_006.pdf', comments: 15 },
        { id: 'PTAF0449', date: '2024-02-08', buyer: 'ANF', style: '134F0410', rolls: 40, qty: '2,000m', status: 'Completed', statusColor: 'text-emerald-700 bg-emerald-100 border-emerald-200', file: 'QC_Report_007.pdf', comments: 2 },
        { id: 'GPRT00174A', date: '2024-02-07', buyer: 'Reitmans', style: 'P21-470072', rolls: 60, qty: '3,000m', status: 'Completed', statusColor: 'text-emerald-700 bg-emerald-100 border-emerald-200', file: 'QC_Report_008.pdf', comments: 20 },
        { id: 'GPAF6137R', date: '2024-02-06', buyer: 'ANF', style: 'S261220058', rolls: 15, qty: '750m', status: 'Completed', statusColor: 'text-emerald-700 bg-emerald-100 border-emerald-200', file: 'QC_Report_009.pdf', comments: 4 },
        { id: 'PTCOC381R', date: '2024-02-05', buyer: 'Costco', style: 'STCO6690', rolls: 35, qty: '1,750m', status: 'Completed', statusColor: 'text-emerald-700 bg-emerald-100 border-emerald-200', file: 'QC_Report_010.pdf', comments: 6 },
        { id: 'GPAR12167GD-2', date: '2024-02-04', buyer: 'Aritzia', style: 'FFS 99-03-32364-SU26(DW1830)', rolls: 20, qty: '1,000m', status: 'Completed', statusColor: 'text-emerald-700 bg-emerald-100 border-emerald-200', file: 'QC_Report_011.pdf', comments: 9 },
        { id: 'GPAR12275-1', date: '2024-02-03', buyer: 'Aritzia', style: 'FFS 99-03-44514-SU26', rolls: 45, qty: '2,250m', status: 'Completed', statusColor: 'text-emerald-700 bg-emerald-100 border-emerald-200', file: 'QC_Report_012.pdf', comments: 2 },
        { id: 'GPAR12220', date: '2024-02-02', buyer: 'Aritzia', style: 'RBC 02-01-52114-SU26(AG2276)', rolls: 55, qty: '2,750m', status: 'Completed', statusColor: 'text-emerald-700 bg-emerald-100 border-emerald-200', file: 'QC_Report_013.pdf', comments: 11 },
        { id: 'GPAR12274-1', date: '2024-02-01', buyer: 'Aritzia', style: 'FFS 99-03-44504-SU26', rolls: 10, qty: '500m', status: 'Completed', statusColor: 'text-emerald-700 bg-emerald-100 border-emerald-200', file: 'QC_Report_014.pdf', comments: 7 }
    ];

    const [records, setRecords] = useState(() => {
        // We forcibly update to initialRecords to reflect the "No Upload" state for the demo
        localStorage.removeItem('qc_records_demo');
        return initialRecords;
    });

    React.useEffect(() => {
        localStorage.setItem('qc_records_demo', JSON.stringify(records));
    }, [records]);

    const totalMeters = records.reduce((sum, r) => sum + parseInt(r.qty.replace(/,/g, '')), 0); // eslint-disable-line no-unused-vars
    const totalRolls = records.reduce((sum, r) => sum + r.rolls, 0); // eslint-disable-line no-unused-vars
    const totalComments = records.reduce((sum, r) => sum + (r.comments || 0), 0);

    const stats = [
        { label: 'Total Complete', value: `${records.filter(r => r.status === 'Completed').length} Styles`, icon: CheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
        { label: 'Total File', value: `${records.length} Files`, icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-100' },
        { label: 'Pending Docs', value: `${records.filter(r => r.file === 'Pending').length} Styles`, icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-100' },
        { label: 'Total Comment', value: `${totalComments.toLocaleString()}`, icon: MessageSquare, color: 'text-purple-600', bgColor: 'bg-purple-100' }
    ];

    const filteredRecords = records.filter(record =>
        record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.style.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRecords = filteredRecords.slice(indexOfFirstItem, indexOfLastItem);

    const handleBack = () => {
        if (onBack) onBack();
        else navigate(-1);
    };

    const handleFileClick = (record) => { // eslint-disable-line no-unused-vars
        setSelectedRecord(record);
        fileInputRef.current?.click();
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0] || event.dataTransfer?.files?.[0];
        if (!file || !selectedRecord) return;

        setUploadingId(selectedRecord.id);
        setUploadProgress(10);

        // Simulate upload progress
        for (let i = 20; i <= 100; i += 20) {
            await new Promise(r => setTimeout(r, 200));
            setUploadProgress(i);
        }

        // In a real app, this URL would be a permanent link from a server.
        // For this demo, we use a blob URL which is session-bound.
        const fileUrl = URL.createObjectURL(file);

        setRecords(prev => prev.map(rec =>
            rec.id === selectedRecord.id
                ? { ...rec, file: file.name, fileUrl: fileUrl, status: 'Completed', statusColor: 'text-emerald-700 bg-emerald-100 border-emerald-200' }
                : rec
        ));

        setTimeout(() => {
            setUploadingId(null);
            setSelectedRecord(null);
            setUploadProgress(0);
            setIsUploadModalOpen(false);
            if (event.target) event.target.value = '';
        }, 500);
    };

    const handleDownloadPDF = (record) => {
    const fileName = "GPAR12356 制单 2026-2-2.pdf";
    const fileUrl = `/pdf/${fileName}`;

    window.open(fileUrl, "_blank");
};

    return (
        <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-5 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl sticky top-0 z-30">
                <div className="flex items-center gap-6">
                    <button
                        onClick={handleBack}
                        className="p-2.5 hover:bg-slate-100/80 rounded-2xl transition-all group text-slate-600 border border-transparent hover:border-slate-200 shadow-sm hover:shadow"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase flex items-center gap-2 leading-none">
                                    QC<span className="text-blue-600">File</span>
                                </h1>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Material Inflow & Documentation</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 hover:bg-white border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all text-slate-600 hover:shadow-sm">
                        <Maximize2 className="w-4 h-4" /> Full Screen
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 hover:bg-white border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all text-slate-600 hover:shadow-sm">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 transition-all hover:-translate-y-0.5 active:translate-y-0">
                        <Plus className="w-4 h-4" /> New Entry
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 relative overflow-hidden group hover:border-blue-300 transition-all shadow-sm hover:shadow-md">
                            <div className="absolute top-0 right-0 p-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Updates</div>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filter & Search Section */}
                <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-xl">
                        <form className="w-full" onSubmit={(e) => e.preventDefault()}>
                            <label htmlFor="search" className="sr-only">Search</label>
                            <div className="relative group/search">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                                    <Search className="w-4 h-4 text-slate-400 group-focus-within/search:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="search"
                                    id="search"
                                    className="block w-full p-3.5 ps-11 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-4 focus:ring-red-50 focus:border-red-500 transition-all shadow-sm placeholder:text-slate-400"
                                    placeholder="Search by ID, Style or Buyer..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute end-1.5 bottom-2.5 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-100 font-bold rounded-lg text-[10px] px-3 py-2 uppercase tracking-wider transition-all shadow-sm"
                                >
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-tight hover:border-slate-300 transition-all shadow-sm text-slate-700">
                            <Filter className="w-4 h-4 text-blue-600" /> Filters
                        </button>
                        <div className="h-4 w-px bg-slate-200 mx-2"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Showing {filteredRecords.length} Records</span>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-sm uppercase font-bold tracking-widest text-slate-800 border-b border-slate-200">
                                <th className="px-10 py-6 text-left font-bold">No.</th>
                                <th className="px-10 py-6 text-left font-bold">Date</th>
                                <th className="px-10 py-6 text-left font-bold">Factory Style</th>
                                <th className="px-6 py-4 font-bold">Buyer</th>
                                <th className="px-6 py-4 font-bold">Buyer Style</th>
                                <th className="px-6 py-4 text-center font-bold">Recommended</th>
                                <th className="px-6 py-4 text-center font-bold">Status</th>
                                <th className="px-6 py-4 text-center font-bold">File</th>
                                <th className="px-6 py-4 w-24 text-center font-bold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {currentRecords.map((record, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/80 transition-colors cursor-pointer">
                                    <td className="px-10 py-4 text-left">
                                        <div className="text-sm font-bold text-slate-800 tracking-tight">{indexOfFirstItem + idx + 1}</div>
                                    </td>
                                    <td className="px-10 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                            <div className="text-sm font-bold text-slate-800 tracking-tight">{record.date}</div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-4 text-left">
                                        <div className="text-sm font-bold text-slate-800 tracking-tight">{record.id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-slate-800">{record.buyer}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm"></div>
                                            <span className="text-sm font-medium text-slate-700">{record.style}</span>
                                        </div>
                                    </td>
                                    {/* <td className="px-6 py-4 text-center">
                                        <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600 border border-slate-200">{record.rolls}</span>
                                    </td> */}
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            className="flex items-center justify-center gap-2 mx-auto hover:bg-blue-50 px-2 py-1 rounded-xl transition-all group/comment border border-blue-200 hover:border-blue-200 shadow-sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedRecord(record);
                                                setCommentText('');
                                                setModalType('feedback');
                                                setIsCommentModalOpen(true);
                                            }}
                                        >

                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Feedback</span>
                                                <span className="bg-blue-100 text-blue-700 text-[11px] font-black px-2 py-0.5 rounded-full border border-blue-200">
                                                    {record.comments || 0}
                                                </span>
                                            </div>
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold tracking-tight border ${record.statusColor}`}>
                                                {record.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (record.fileUrl) {
                                                        window.open(record.fileUrl, '_blank');
                                                    } else {
                                                        // Trigger the real download for already existing/persisted files
                                                        handleDownloadPDF(record);
                                                    }
                                                }}
                                                className="flex items-center gap-2 px-2 py-1.5 hover:bg-red-200 rounded-lg text-red-600 transition-all border border-slate-200 group/down"
                                                title={record.fileUrl ? `View ${record.file}` : `Click to view report`}
                                            >
                                                <Download className="w-4 h-4 text-red-600 group-hover/down:scale-110 transition-transform" />
                                                <span className="text-[10px] font-bold uppercase tracking-tight">{record.file ? record.file.split('.').pop() : 'PDF'}</span>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button
                                                className="flex items-center gap-2 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border border-emerald-100 group/inline shadow-sm"
                                                title="Recommend"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedRecord(record);
                                                    setCommentText('');
                                                    setModalType('recommend');
                                                    setIsCommentModalOpen(true);
                                                }}
                                            >
                                                <MessageSquare className="w-3.5 h-3.5 group-hover/inline:scale-110 transition-transform" />
                                            </button>
                                            <button
                                                className="flex items-center gap-2 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border border-blue-100 group/inline shadow-sm"
                                                title="View Detail"
                                            >
                                                <Eye className="w-3.5 h-3.5 group-hover/inline:scale-110 transition-transform" />
                                            </button>
                                            <button
                                                className="flex items-center gap-2 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border border-amber-100 group/inline shadow-sm"
                                                title="Edit Record"
                                            >
                                                <Pencil className="w-3.5 h-3.5 group-hover/inline:scale-110 transition-transform" />
                                            </button>
                                            <button
                                                className="flex items-center gap-2 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border border-red-100 group/inline shadow-sm"
                                                title="Delete Record"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 group-hover/inline:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-200">
                        <span className="text-[11px] font-bold text-slate-500 tracking-widest">Page {currentPage} of {totalPages}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm transition-all border ${currentPage === 1
                                    ? 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed'
                                    : 'bg-white border-slate-300 text-slate-600 hover:border-blue-400 hover:text-blue-600'
                                    }`}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm transition-all border ${currentPage === totalPages
                                    ? 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed'
                                    : 'bg-white border-slate-300 text-slate-600 hover:border-blue-400 hover:text-blue-600'
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* File Upload Modal */}
            {isUploadModalOpen && selectedRecord && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
                        onClick={() => !uploadingId && setIsUploadModalOpen(false)}
                    />
                    <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 border border-blue-100 shadow-sm transition-transform hover:rotate-3">
                                    <FileUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Upload Documentation</h3>
                                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{selectedRecord.id} • {selectedRecord.buyer}</p>
                                </div>
                            </div>
                            {!uploadingId && (
                                <button
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="p-2.5 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600 hover:rotate-90"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            )}
                        </div>

                        {/* Modal Body */}
                        <div className="p-8">
                            {uploadingId === selectedRecord.id ? (
                                <div className="py-12 flex flex-col items-center justify-center">
                                    <div className="relative w-32 h-32 mb-8">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="64" cy="64" r="60"
                                                fill="transparent"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                className="text-slate-100"
                                            />
                                            <circle
                                                cx="64" cy="64" r="60"
                                                fill="transparent"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                strokeDasharray={2 * Math.PI * 60}
                                                strokeDashoffset={2 * Math.PI * 60 * (1 - uploadProgress / 100)}
                                                className="text-blue-600 transition-all duration-300 ease-out"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-2xl font-black text-slate-900 leading-none">{uploadProgress}%</span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Uploading</span>
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-slate-600 animate-pulse uppercase tracking-widest">Processing Secure Transfer...</p>
                                </div>
                            ) : (
                                <div
                                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-blue-500', 'bg-blue-50/50'); }}
                                    onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50/50'); }}
                                    onDrop={(e) => { e.preventDefault(); handleFileUpload(e); }}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-200 rounded-[24px] p-12 flex flex-col items-center justify-center gap-4 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-slate-100">
                                        <FileUp className="w-8 h-8 text-blue-500" />
                                    </div>
                                    <div className="text-center">
                                        <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">Drop documents here</h4>
                                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-1">or click to browse files</p>
                                    </div>
                                    <div className="flex items-center gap-6 mt-4">
                                        <div className="flex flex-col items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                            <div className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center bg-white shadow-sm">
                                                <span className="text-[10px] font-black text-slate-600">PDF</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                            <div className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center bg-white shadow-sm">
                                                <span className="text-[10px] font-black text-slate-600">JPG</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                            <div className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center bg-white shadow-sm">
                                                <span className="text-[10px] font-black text-slate-600">PNG</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        {!uploadingId && (
                            <div className="px-8 py-6 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-[200px]">Maximum file size: 25MB. All transfers are encrypted.</span>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95"
                                >
                                    Select File
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Feedback Modal */}
            {isCommentModalOpen && selectedRecord && !isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsCommentModalOpen(false)}
                    />

                    {modalType === 'recommend' ? (
                        /* ADD RECOMMENDATION UI */
                        <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-300">
                            {/* Header */}
                            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 border border-emerald-100 shadow-sm">
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Add Recommendation</h3>
                                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{selectedRecord.id} • {selectedRecord.buyer}</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsCommentModalOpen(false)} className="p-2.5 hover:bg-slate-100 rounded-full transition-all text-slate-400">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-8 space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Your Comment / Suggestion</label>
                                    <div className="relative group">
                                        <textarea
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="Type your feedback here..."
                                            className="w-full h-40 p-6 bg-white border-2 border-emerald-100 rounded-[24px] text-sm focus:ring-8 focus:ring-emerald-50 focus:border-emerald-500 transition-all outline-none resize-none placeholder:text-slate-300 font-bold tracking-tight shadow-sm"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex gap-4">
                                    <Activity className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                    <div className="text-[12px] font-bold text-blue-700/80 leading-relaxed tracking-tight">
                                        Your recommendation will be visible to the QC team and the buyer. This helps in improving material quality and processing.
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-end gap-4 bg-slate-50/30">
                                <button
                                    onClick={() => setIsCommentModalOpen(false)}
                                    className="px-6 py-3 text-[11px] font-black text-slate-500 hover:bg-slate-200 rounded-2xl transition-all uppercase tracking-[0.15em]"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        console.log('Posting recommendation:', commentText);
                                        setIsCommentModalOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[11px] font-black shadow-xl shadow-emerald-200 transition-all uppercase tracking-[0.15em] hover:-translate-y-1"
                                >
                                    <Send className="w-4 h-4" /> Post Comment
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* FEEDBACK & RECOMMENDATIONS HISTORY UI */
                        <div className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                            {/* Modal Header */}
                            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600 border border-blue-100/50 shadow-sm">
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Feedback & Recommendations</h3>
                                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{selectedRecord.id} • {selectedRecord.buyer}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsCommentModalOpen(false)}
                                    className="p-2.5 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600 hover:rotate-90"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body - Scrollable Feedback List */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 px-1">Previous Conversations</h4>

                                <div className="space-y-6">
                                    {[
                                        { user: 'Buyer Admin', time: '2 hours ago', text: 'Material hand-feel is good, but check the color consistency on roll #12.', initial: 'B', color: 'bg-rose-500', iconColor: 'text-white' },
                                        { user: 'QC Team', time: '5 hours ago', text: 'Roll #12 inspected. Minor variation found, but within tolerance.', initial: 'Q', color: 'bg-purple-500', iconColor: 'text-white' },
                                        { user: 'System Update', time: 'Yesterday', text: 'Status changed to "In-Progress" based on initial yardage check.', initial: 'S', color: 'bg-emerald-400', iconColor: 'text-white' }
                                    ].map((c, i) => (
                                        <div key={i} className="flex gap-5 group">
                                            <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center ${c.iconColor} text-sm font-black shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                                                {c.initial}
                                            </div>
                                            <div className="flex-1 pt-0.5">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-extrabold text-slate-800 tracking-tight">{c.user}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.time}</span>
                                                </div>
                                                <div className="text-[13px] text-slate-600 leading-relaxed p-4 bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none font-medium shadow-sm group-hover:bg-slate-100/50 transition-colors">
                                                    {c.text}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
            />
        </div>
    );
};

export default QCFile;
