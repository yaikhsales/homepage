import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Filter,
    Plus,
    Calendar,
    Users,
    CheckCircle2,
    Clock,
    ArrowLeft,
    Maximize2,
    Download,
    Eye,
    Pencil,
    Trash2,
    CalendarDays,
    LayoutDashboard,
    FileUp,
    Loader2,
    X,
    Video,
    FileText,
} from 'lucide-react';
import { useTranslation } from '../../translate/TranslationContext';
import AddMeeting from './add-meeting';
import VideoViewer from '../../components/VideoViewer';
import ModuleBotButton from '../../components/ModuleBotButton';

const PPM_VIDEO_PATH = '/assets/short-video-training/Ppm.mp4';

const PreProductionMeeting = ({ onBack }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const fileInputRef = React.useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadingId, setUploadingId] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const itemsPerPage = 8;

    const initialMeetings = [
        { id: 'PPM-2024-001', date: '2024-02-18', buyer: 'Aritzia', style: 'AR-701-BLU', attendees: 12, status: 'Scheduled', statusColor: 'text-red-700 bg-red-100 border-red-200', file: 'PPM_Plan.pdf' },
        { id: 'PPM-2024-002', date: '2024-02-18', buyer: 'Costco', style: 'CS-SILK-TW', attendees: 8, status: 'In-Progress', statusColor: 'text-amber-700 bg-amber-100 border-amber-200', file: 'Pending' },
        { id: 'PPM-2024-003', date: '2024-02-17', buyer: 'Arizia', style: 'LL-FAST-BLK', attendees: 15, status: 'Finished', statusColor: 'text-emerald-700 bg-emerald-100 border-emerald-200', file: 'Meeting_Notes.pdf' },
        { id: 'PPM-2024-004', date: '2024-02-17', buyer: 'ANF', style: 'NK-TECH-GRY', attendees: 10, status: 'Finished', statusColor: 'text-emerald-700 bg-emerald-100 border-emerald-200', file: 'Meeting_Notes.pdf' },
        { id: 'PPM-2024-005', date: '2024-02-19', buyer: 'Reitmans', style: 'GP-DENIM-99', attendees: 6, status: 'Scheduled', statusColor: 'text-red-700 bg-red-100 border-red-200', file: 'Pending' },
        { id: 'PPM-2024-006', date: '2024-02-20', buyer: 'Arizia', style: 'UQ-AIR-772', attendees: 14, status: 'Scheduled', statusColor: 'text-red-700 bg-red-100 border-red-200', file: 'Pending' },
        { id: 'PPM-2024-007', date: '2024-02-16', buyer: 'Arizia', style: 'ZR-COAT-W24', attendees: 20, status: 'Finished', statusColor: 'text-emerald-700 bg-emerald-100 border-emerald-200', file: 'Meeting_Notes.pdf' },
        { id: 'PPM-2024-008', date: '2024-02-15', buyer: 'Costco', style: 'HM-KNIT-PR', attendees: 5, status: 'Cancelled', statusColor: 'text-slate-700 bg-slate-100 border-slate-200', file: 'Pending' },
        { id: 'PPM-2024-009', date: '2024-02-21', buyer: 'ANF', style: 'AD-PERF-RUN', attendees: 9, status: 'Scheduled', statusColor: 'text-red-700 bg-red-100 border-red-200', file: 'Pending' },
    ];

    const [meetings, setMeetings] = useState(() => {
        const saved = localStorage.getItem('ppm_meetings_demo');
        return saved ? JSON.parse(saved) : initialMeetings;
    });

    React.useEffect(() => {
        localStorage.setItem('ppm_meetings_demo', JSON.stringify(meetings));
    }, [meetings]);

    const stats = [
        { label: 'Total Meetings', value: meetings.length, icon: LayoutDashboard, color: 'text-red-600', bgColor: 'bg-red-50' },
        { label: 'Meetings Today', value: '2', icon: CalendarDays, color: 'text-purple-600', bgColor: 'bg-purple-50' },
        { label: 'Pending / Planned', value: '4', icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-50' },
        { label: 'Completed', value: '3', icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    ];

    const filteredMeetings = meetings.filter(m =>
        m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.style.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredMeetings.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMeetings = filteredMeetings.slice(indexOfFirstItem, indexOfLastItem);

    const handleBack = () => {
        if (onBack) onBack();
        else navigate(-1);
    };

    const handleDownload = (meeting) => {
        const fileName = 'PP meeting form (3).xlsx';
        const fileUrl = `/${fileName}`;
        window.open(fileUrl, '_blank');
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0] || event.dataTransfer?.files?.[0];
        if (!file || !selectedMeeting) return;

        setUploadingId(selectedMeeting.id);
        setUploadProgress(10);

        // Simulate upload progress
        for (let i = 20; i <= 100; i += 20) {
            await new Promise(r => setTimeout(r, 200));
            setUploadProgress(i);
        }

        const fileUrl = URL.createObjectURL(file);

        setMeetings(prev => prev.map(m =>
            m.id === selectedMeeting.id
                ? { ...m, file: file.name, fileUrl: fileUrl, status: 'Finished', statusColor: 'text-emerald-700 bg-emerald-100 border-emerald-200' }
                : m
        ));

        setTimeout(() => {
            setUploadingId(null);
            setSelectedMeeting(null);
            setUploadProgress(0);
            setIsUploadModalOpen(false);
            if (event.target) event.target.value = '';
        }, 500);
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-6">
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors group text-slate-600"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase flex items-center gap-2">
                            Pre-Production<span className="text-red-600">Meeting</span>
                        </h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Strategy, Planning & Technical Alignment</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
            onClick={() => setSelectedVideo(PPM_VIDEO_PATH)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
            title="Video Training"
        >
            <Video size={20} className="text-blue-600" />
        </button>
                    <button
                        className="flex items-center justify-center w-9 h-9 rounded-full border border-dashed border-slate-200 text-slate-300 cursor-default"
                        title="Report Training (coming soon)"
                    >
                        <FileText className="w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold transition-all text-slate-700">
                        <Download className="w-4 h-4" /> Export Summary
                    </button>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-md shadow-red-200 transition-all active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> New Meeting
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden group hover:border-red-300 transition-all shadow-sm hover:shadow-md">
                                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-full border border-emerald-100/50 transition-all group-hover:bg-emerald-100/80">
                                    <div className="relative flex h-1.5 w-1.5">
                                        <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></div>
                                        <div className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></div>
                                    </div>
                                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest leading-none">Active Data</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={`p-4 rounded-2xl ${stat.bgColor} ${stat.color}`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-slate-900 leading-tight">{stat.value}</div>
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
                                <label htmlFor="search-ppm" className="sr-only">Search</label>
                                <div className="relative group/search">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                                        <Search className="w-4 h-4 text-slate-400 group-focus-within/search:text-red-500 transition-colors" />
                                    </div>
                                    <input
                                        type="search"
                                        id="search-ppm"
                                        className="block w-full p-3.5 ps-11 bg-white border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-4 focus:ring-red-50 focus:border-red-500 transition-all shadow-sm placeholder:text-slate-400"
                                        placeholder="Search by ID, Style or Buyer..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute end-1 bottom-1.5 top-1.5 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-slate-100 font-bold rounded-lg text-[10px] px-4 uppercase tracking-wider transition-all shadow-sm"
                                    >
                                        Search
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:border-slate-300 transition-all shadow-sm text-slate-700">
                                <Filter className="w-4 h-4 text-red-600" /> Advanced Filters
                            </button>
                            <div className="h-6 w-px bg-slate-200 mx-2"></div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pr-2">Found {filteredMeetings.length} Results</span>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-sm uppercase font-bold tracking-widest text-slate-800 border-b border-slate-200">
                                    <th className="px-8 py-5 text-center w-16">No.</th>
                                    <th className="px-6 py-5">Meeting ID</th>
                                    <th className="px-6 py-5">Date</th>
                                    <th className="px-6 py-5">Style / Model</th>
                                    <th className="px-6 py-5">Buyer</th>
                                    <th className="px-6 py-5 text-center">Attendees</th>
                                    <th className="px-6 py-5 text-center">Status</th>
                                    <th className="px-6 py-5 text-center">Report</th>
                                    <th className="px-12 py-5 text-right w-24">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {currentMeetings.map((meeting, idx) => (
                                    <tr key={idx} className="group hover:bg-slate-50/80 transition-colors cursor-pointer">
                                        <td className="px-8 py-4 text-center">
                                            <div className="text-xs font-bold text-slate-400 group-hover:text-slate-900 transition-colors">{indexOfFirstItem + idx + 1}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-900 tracking-tight">{meeting.id}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                                <Calendar className="w-3.5 h-3.5 text-red-500" />
                                                {meeting.date}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-800">{meeting.style}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-slate-600">{meeting.buyer}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2.5">
                                                <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600 border border-purple-100/50 shadow-sm transition-transform group-hover:scale-110">
                                                    <Users className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-sm font-black text-slate-800 tracking-tight">{meeting.attendees}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-black border shadow-sm ${meeting.statusColor}`}>
                                                    {meeting.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                {meeting.file !== 'Pending' ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (meeting.fileUrl) {
                                                                window.open(meeting.fileUrl, '_blank');
                                                            } else {
                                                                handleDownload(meeting);
                                                            }
                                                        }}
                                                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-red-200 rounded-lg text-red-600 transition-all border border-slate-200 group/down"
                                                        title={meeting.fileUrl ? `View ${meeting.file}` : `Download Template`}
                                                    >
                                                        <Download className="w-4 h-4 text-red-600 group-hover/down:scale-110 transition-transform" />
                                                        <span className="text-[10px] font-bold uppercase tracking-tight">XLSX</span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedMeeting(meeting);
                                                            setIsUploadModalOpen(true);
                                                        }}
                                                        disabled={uploadingId === meeting.id}
                                                        className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-600 transition-all border border-red-200 group/upload cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
                                                    >
                                                        {uploadingId === meeting.id ? (
                                                            <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
                                                        ) : (
                                                            <FileUp className="w-4 h-4 text-red-600 group-hover/upload:-translate-y-0.5 transition-transform" />
                                                        )}
                                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                                            {uploadingId === meeting.id ? 'Uploading...' : 'Upload'}
                                                        </span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right w-24 ">
                                            <div className="flex items-center justify-end gap-1 text-slate-700">
                                                <button className="flex items-center gap-2 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border border-amber-100 group/inline shadow-sm" title="Meeting Minutes">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="flex items-center gap-2 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border border-blue-100 group/inline shadow-sm" title="Edit Plan">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button className="flex items-center gap-2 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border border-red-100 group/inline shadow-sm" title="Cancel Meeting">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination Area */}
                        <div className="px-8 py-3 bg-slate-50/50 flex items-center justify-between border-t border-slate-200">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border shadow-sm ${currentPage === 1
                                        ? 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-red-500 hover:text-red-600 active:scale-95'
                                        }`}
                                >
                                    Previous
                                </button>
                                <div className="flex items-center px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 shadow-sm">
                                    {currentPage}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border shadow-sm ${currentPage === totalPages
                                        ? 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-red-500 hover:text-red-600 active:scale-95'
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* File Upload Modal */}
            {isUploadModalOpen && selectedMeeting && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
                        onClick={() => !uploadingId && setIsUploadModalOpen(false)}
                    />
                    <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-50 rounded-2xl text-red-600 border border-red-100 shadow-sm transition-transform hover:rotate-3">
                                    <FileUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Upload Meeting Report</h3>
                                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{selectedMeeting.id} • {selectedMeeting.buyer}</p>
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
                            {uploadingId === selectedMeeting.id ? (
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
                                                className="text-red-600 transition-all duration-300 ease-out"
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
                                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-red-500', 'bg-red-50/50'); }}
                                    onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-red-500', 'bg-red-50/50'); }}
                                    onDrop={(e) => { e.preventDefault(); handleFileUpload(e); }}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-200 rounded-[24px] p-12 flex flex-col items-center justify-center gap-4 hover:border-red-400 hover:bg-red-50/30 transition-all cursor-pointer group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-slate-100">
                                        <FileUp className="w-8 h-8 text-red-500" />
                                    </div>
                                    <div className="text-center">
                                        <h4 className="text-base font-black text-slate-900 uppercase tracking-tight">Drop meeting report here</h4>
                                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-1">or click to browse XLSX files</p>
                                    </div>
                                    <div className="flex items-center gap-6 mt-4">
                                        <div className="flex flex-col items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                            <div className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center bg-white shadow-sm">
                                                <span className="text-[10px] font-black text-slate-600">XLSX</span>
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

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".xlsx"
                onChange={handleFileUpload}
            />

            {/* Modal Popup */}
            {showForm && (
                <AddMeeting
                    onCancel={() => setShowForm(false)}
                    onSave={(data) => {
                        console.log("New Meeting Saved:", data);
                        setShowForm(false);
                    }}
                />
            )}
            {selectedVideo && (
                <VideoViewer
                    videoPath={selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                />
            )}

            <ModuleBotButton moduleName="YQMS - PPM" />
        </div>
    );
};

export default PreProductionMeeting;
