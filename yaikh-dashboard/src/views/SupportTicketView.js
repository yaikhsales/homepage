import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Ticket as TicketIcon, Image as ImageIcon, X } from 'lucide-react';
import SupportTicketForm from '../support-tickets/form';
import { useTranslation } from '../translate/TranslationContext';

const SupportTicketView = ({ onBack }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [requests, setRequests] = useState([
        {
            id: 1,
            ref: 'ST-001',
            type: 'GA - Main',
            subject: 'Broken Office Chair',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
            details: 'Office chair in meeting room 2 is broken. The backrest is loose and needs repair or replacement.',
            createdDate: '2025-12-20',
            planDate: '2025-12-25',
            finishDate: '2025-12-24',
            status: 'Completed',
            nature: '6S, H&S',
            keyword: false
        },
        {
            id: 2,
            ref: 'ST-002',
            type: 'IT Support',
            subject: 'Printer Not Working',
            image: 'https://images.unsplash.com/photo-1605244863941-3a1499b2f0a4?w=200&h=200&fit=crop',
            details: 'Printer in the admin office is showing error code E-01. Unable to print documents. Please check and fix.',
            createdDate: '2025-12-21',
            planDate: '2025-12-26',
            finishDate: null,
            status: 'In Progress',
            nature: 'Equipment',
            keyword: false
        },
        {
            id: 3,
            ref: 'ST-003',
            type: 'GA - Main',
            subject: 'Air Conditioner Issue',
            image: null,
            details: 'Air conditioner in production area is not cooling properly. Temperature is too high affecting work environment.',
            createdDate: '2025-12-22',
            planDate: '2025-12-27',
            finishDate: null,
            status: 'Pending',
            nature: '6S, H&S',
            keyword: true
        },
        {
            id: 4,
            ref: 'ST-004',
            type: 'Maintenance',
            subject: 'Leaking Pipe in Restroom',
            image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=200&h=200&fit=crop',
            details: 'Water pipe in second floor restroom is leaking. Water is dripping from the ceiling. Urgent repair needed.',
            createdDate: '2025-12-23',
            planDate: '2025-12-23',
            finishDate: null,
            status: 'In Progress',
            nature: 'Maintenance',
            keyword: true
        },
        {
            id: 5,
            ref: 'ST-005',
            type: 'IT Support',
            subject: 'Network Connection Problem',
            image: null,
            details: 'WiFi connection in the warehouse area is very weak. Employees cannot access the system properly.',
            createdDate: '2025-12-19',
            planDate: '2025-12-24',
            finishDate: '2025-12-23',
            status: 'Completed',
            nature: 'Network',
            keyword: false
        },
        {
            id: 6,
            ref: 'ST-006',
            type: 'GA - Main',
            subject: 'Broken Window Glass',
            image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=200&h=200&fit=crop',
            details: 'Window glass in conference room 1 is cracked. Safety concern and needs immediate replacement.',
            createdDate: '2025-12-18',
            planDate: '2025-12-22',
            finishDate: '2025-12-21',
            status: 'Completed',
            nature: 'Safety',
            keyword: true
        },
        {
            id: 7,
            ref: 'ST-007',
            type: 'Maintenance',
            subject: 'Elevator Not Working',
            image: null,
            details: 'Elevator is stuck on 3rd floor. Cannot move up or down. Please send technician immediately.',
            createdDate: '2025-12-24',
            planDate: '2025-12-24',
            finishDate: null,
            status: 'Pending',
            nature: 'Safety',
            keyword: true
        },
        {
            id: 8,
            ref: 'ST-008',
            type: 'IT Support',
            subject: 'Computer Screen Flickering',
            image: 'https://images.unsplash.com/photo-1605244863941-3a1499b2f0a4?w=200&h=200&fit=crop',
            details: 'Computer screen in HR department keeps flickering. Makes it difficult to work. Needs replacement.',
            createdDate: '2025-12-17',
            planDate: '2025-12-20',
            finishDate: '2025-12-19',
            status: 'Completed',
            nature: 'Equipment',
            keyword: false
        }
    ]);
    const [showForm, setShowForm] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showImage, setShowImage] = useState(false);

    const columns = [t('ref'), t('type'), t('subject'), t('image'), t('details'), t('createdDate'), t('planDate'), t('finishDate'), t('status')];

    const handleRowClick = (request) => {
        setSelectedRequest(request);
        setShowForm(true);
    };

    return (
        <>
            <div className="fixed inset-0 bg-white flex flex-col animate-in fade-in duration-500 relative z-10">
                <div className="bg-slate-100 p-4 border-b flex items-center justify-between flex-shrink-0 shadow-sm">
                    <div className="w-32"></div> {/* Left spacer */}
                    <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onBack}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-slate-200 rounded-lg transition-colors bg-slate-100"
                                aria-label={t('goBack')}
                            >
                                <ArrowLeft size={18} /> {t('back')}
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-slate-300 hover:border-slate-400 transition-all hover:scale-110 cursor-pointer flex-shrink-0"
                                title={t('home')}
                            >
                                <img 
                                    src="/logo.jpg" 
                                    alt={t('home')} 
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">{t('supportTicket')}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowImage(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                            aria-label={t('viewSupportTicketImage')}
                        >
                            <ImageIcon size={16} /> {t('viewImage')}
                        </button>
                        <button
                            onClick={() => {
                                setSelectedRequest(null);
                                setShowForm(true);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                            aria-label={t('addNewSupportRequest')}
                        >
                            <Plus size={16} /> {t('addRequest')}
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-auto p-6">
                    <div className="overflow-x-auto h-full">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                                <tr>
                                    {columns.map((col, i) => (
                                        <th key={i} className="px-6 py-3">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length} className="text-center py-32">
                                            <div className="flex flex-col items-center justify-center">
                                                <TicketIcon size={64} className="text-slate-300 mb-6" />
                                                <h3 className="text-2xl font-bold text-slate-700 mb-2">
                                                    {t('looksLikeYouHaveNoRequestsYet')}
                                                </h3>
                                                <p className="text-slate-500 text-lg">
                                                    {t('needHelpSubmitTicket')}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((request, idx) => (
                                        <tr
                                            key={idx}
                                            onClick={() => handleRowClick(request)}
                                            className="hover:bg-blue-50 cursor-pointer transition-colors"
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-900">{request.ref || `#${idx + 1}`}</td>
                                            <td className="px-6 py-4 text-gray-700">{request.type}</td>
                                            <td className="px-6 py-4 text-gray-700">{request.subject}</td>
                                            <td className="px-6 py-4 text-gray-700">{request.image ? t('yes') : t('no')}</td>
                                            <td className="px-6 py-4 text-gray-700 truncate max-w-xs">{request.details}</td>
                                            <td className="px-6 py-4 text-gray-700">{request.createdDate}</td>
                                            <td className="px-6 py-4 text-gray-700">{request.planDate}</td>
                                            <td className="px-6 py-4 text-gray-700">{request.finishDate}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    request.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                    request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                    request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {request.status || t('pending')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {showForm && (
                <SupportTicketForm
                    onClose={() => {
                        setShowForm(false);
                        setSelectedRequest(null);
                    }}
                    onSubmit={(formData) => {
                        // Add new request or update existing
                        if (selectedRequest) {
                            // Update existing request
                            setRequests(prev => prev.map(req => 
                                req.id === selectedRequest.id ? { ...req, ...formData } : req
                            ));
                        } else {
                            // Add new request
                            const newRequest = {
                                id: Date.now(),
                                ref: `REF-${Date.now().toString().slice(-6)}`,
                                ...formData,
                                createdDate: new Date().toLocaleDateString(),
                                status: 'Pending'
                            };
                            setRequests(prev => [newRequest, ...prev]);
                        }
                        setShowForm(false);
                        setSelectedRequest(null);
                    }}
                    initialData={selectedRequest}
                />
            )}
            {showImage && (
                <div 
                    className="fixed inset-0 bg-black/90 z-[400] flex items-center justify-center p-4 animate-in fade-in duration-300"
                    onClick={() => setShowImage(false)}
                >
                    <div className="relative w-full h-full flex items-center justify-center">
                        <button
                            onClick={() => setShowImage(false)}
                            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-10"
                        >
                            <X size={24} className="text-white" />
                        </button>
                        <img
                            src="/assets/icons/sub-icons/support-ticket.png"
                            alt={t('supportTicket')}
                            className="max-w-full max-h-full object-contain"
                            style={{ 
                                imageRendering: 'high-quality',
                                imageRendering: '-webkit-optimize-contrast',
                                imageRendering: 'crisp-edges'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default SupportTicketView;

