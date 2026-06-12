import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, MessageCircle } from 'lucide-react';
import GeneralAIAgent from '../general-ag';
import { useTranslation } from '../translate/TranslationContext';

const MyConfirmReceived = ({ onBack }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isBotOpen, setIsBotOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('pending');

    // Sample data - pending requests
    const pendingRequests = [
        {
            id: 1,
            code: 1940,
            requestedBy: 'John Smith',
            department: 'IT',
            topic: 'Computer Equipment Purchase',
            requestDate: '15-12-25'
        },
        {
            id: 2,
            code: 1941,
            requestedBy: 'Mary Johnson',
            department: 'HR',
            topic: 'Office Furniture',
            requestDate: '16-12-25'
        },
        {
            id: 3,
            code: 1942,
            requestedBy: 'Peter Wilson',
            department: 'Production',
            topic: 'Raw Materials',
            requestDate: '17-12-25'
        },
        {
            id: 4,
            code: 1943,
            requestedBy: 'Lisa Brown',
            department: 'Admin',
            topic: 'Office Supplies',
            requestDate: '18-12-25'
        }
    ];
    const myReceivedRequests = [
        {
            id: 1,
            code: 1939,
            requestedBy: 'Hoth Tongiang',
            department: 'Admin',
            topic: 'For repair',
            requestDate: '10-12-20'
        },
        {
            id: 2,
            code: 1938,
            requestedBy: 'ZHAOWEI',
            department: 'Cutting',
            topic: '剪样费',
            requestDate: '10-12-20'
        }
    ];

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const handleDetail = (code) => {
        console.log('View details for:', code);
    };

    const handleReceived = (code) => {
        console.log('Confirm received for:', code);
    };

    const currentData = activeTab === 'pending' ? pendingRequests : myReceivedRequests;

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
                            <ArrowLeft size={16} /> {t('back')}
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
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800">{t('confirmReceivedProductService')}</h1>
                </div>
                <div className="w-32"></div> {/* Right spacer */}
            </div>

            {/* Main Content Card */}
            <div className="flex-1 p-6 overflow-auto">
                <div className="max-w-7xl mx-auto bg-white rounded-lg border-2 border-dashed border-slate-300 p-6 min-h-full">
                    {/* Title */}
                    <h2 className="text-xl font-bold text-slate-800 mb-6">{t('confirmReceivedProductServiceList')}</h2>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`px-6 py-3 font-semibold transition-colors rounded-lg ${
                                activeTab === 'pending'
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            {t('pending')}
                        </button>
                        <button
                            onClick={() => setActiveTab('my')}
                            className={`px-6 py-3 font-semibold transition-colors rounded-lg ${
                                activeTab === 'my'
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            {t('myReceived')}
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">№</th>
                                    <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">{t('code')}</th>
                                    <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">{t('requestedBy')}</th>
                                    <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">{t('department')}</th>
                                    <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">{t('topic')}</th>
                                    <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">{t('requestDate')}</th>
                                    <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">{t('detail')}</th>
                                    <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">{t('received')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-16 text-slate-500">
                                            {t('noApprovedRequestsFound')}
                                        </td>
                                    </tr>
                                ) : (
                                    currentData.map((req, idx) => (
                                        <tr key={req.id} className="hover:bg-blue-50 transition-colors">
                                            <td className="px-4 py-4 border border-slate-200 text-slate-700 text-center">{idx + 1}</td>
                                            <td className="px-4 py-4 border border-slate-200 text-slate-700 font-medium">{req.code}</td>
                                            <td className="px-4 py-4 border border-slate-200 text-slate-700">{req.requestedBy}</td>
                                            <td className="px-4 py-4 border border-slate-200 text-slate-700">{req.department}</td>
                                            <td className="px-4 py-4 border border-slate-200 text-slate-700">{req.topic}</td>
                                            <td className="px-4 py-4 border border-slate-200 text-slate-700">{req.requestDate}</td>
                                            <td className="px-4 py-4 border border-slate-200 text-center">
                                                <button
                                                    onClick={() => handleDetail(req.code)}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1 mx-auto"
                                                >
                                                    <Eye size={12} />
                                                    {t('detail')}
                                                </button>
                                            </td>
                                            <td className="px-4 py-4 border border-slate-200 text-center">
                                                {activeTab === 'pending' ? (
                                                    <button
                                                        onClick={() => handleReceived(req.code)}
                                                        className="bg-green-600 text-white px-4 py-2 rounded text-xs font-semibold hover:bg-green-700 transition-colors"
                                                    >
                                                        {t('received')}
                                                    </button>
                                                ) : (
                                                    <span className="text-green-600 font-semibold text-sm">{t('confirmed')}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            {/* Bot Button - Bottom Right */}
            <button
                onClick={() => setIsBotOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                aria-label="Ask My Confirm Received bot"
                title="Ask My Confirm Received bot"
            >
                <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            </button>
            
            {/* Bot Modal */}
            {isBotOpen && (
                <GeneralAIAgent 
                    onClose={() => setIsBotOpen(false)}
                    moduleContext="My Confirm Received"
                />
            )}
        </div>
    );
};

export default MyConfirmReceived;

