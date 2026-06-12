import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Check,
    FileText,
    LayoutGrid,
    Plus,
    Clock,
    Calendar,
    Image as ImageIcon,
    ArrowLeft,
    Shield,
    Sparkles,
    User,
    X,
    Save,
    Download
} from 'lucide-react';
import { useTranslation } from '../../translate/TranslationContext';
import HumidityReportDetail from './HumidityReportDetail';

const HumidityReportAdd = ({ onBack }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState('Inspection');
    const [showDetail, setShowDetail] = useState(false);
    const [reportType, setReportType] = useState('Inline');
    const [factoryStyleNo, setFactoryStyleNo] = useState('');
    const [buyerStyleNo, setBuyerStyleNo] = useState('');
    const [customer, setCustomer] = useState('');
    const [fabrication, setFabrication] = useState('');
    const [colorName, setColorName] = useState('');
    const [aquaboyReadingSpec, setAquaboyReadingSpec] = useState('');
    const [beforeDryRoom, setBeforeDryRoom] = useState('');
    const [date, setDate] = useState('02/23/2026');
    const [remark, setRemark] = useState('');
    const [readings, setReadings] = useState({
        topBody: '',
        middleBody: '',
        bottomBody: ''
    });

    const handleReadingChange = (id, value) => {
        setReadings(prev => ({
            ...prev,
            [id]: value
        }));
    };


    const tabs = [
        { id: 'Inspection', label: 'Inspection', icon: Check },
        { id: 'Qc-daily-report', label: 'Qc-daily-report', icon: FileText },
        { id: 'Dashboard', label: 'Dashboard', icon: LayoutGrid },
    ];

    return (
        <div className="w-full flex flex-col min-h-screen bg-[#F0F4F8]">
            {/* High-Fidelity Header */}
            <div className="w-full bg-gradient-to-r from-[#5340C7] via-[#9F37B3] to-[#C9338D] p-4 shadow-xl relative z-50 rounded-xl">
                <div className="w-full flex items-center justify-between gap-4 px-4">
                    {/* Brand Section */}
                    <div className="flex items-center gap-4 shrink-0">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center border border-white/20 hover:scale-105 transition-all shadow-lg text-white font-black active:scale-95"
                        >
                            <ArrowLeft size={20} strokeWidth={3} />
                        </button>

                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/40">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-black text-white leading-tight flex items-center gap-2">
                                {t('humidityReport')} | {t('addNew')}
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                                    <Sparkles size={12} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-[10px] font-black tracking-wider text-white">PRO</span>
                                </div>
                            </h1>
                            <p className="text-white/80 text-[10px] font-bold uppercase mt-0.5">Humidity Level Monitoring & Control</p>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="flex items-center gap-3 py-2 px-4 bg-black/10 rounded-2xl border border-white/40">
                            <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
                                <User className="text-white w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-white leading-none">QA Officer</span>
                                <span className="text-[9px] font-bold text-white/50 uppercase mt-1">ID: YM7625</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto w-full">
                {/* Tab Navigation */}
                <div className="flex items-center gap-8 border-b border-slate-200 px-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                if (tab.id === 'Qc-daily-report') {
                                    navigate('/dashboard/yqms/aquaboy/list');
                                } else {
                                    setActiveTab(tab.id);
                                }
                            }}
                            className={`flex items-center gap-2 py-4 px-2 transition-all relative ${activeTab === tab.id
                                ? 'text-blue-600 font-bold'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <tab.icon size={16} />
                            <span className="text-sm font-bold uppercase tracking-tight">{tab.label.toUpperCase()}</span>
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded" />
                            )}
                        </button>
                    ))}
                </div>



                {/* Report Type Selection */}
                <div className="bg-white p-6 border-b border-slate-200 rounded-t-lg">
                    <h3 className="text-xl font-black text-slate-800 mb-4 uppercase tracking-tight">{t('reportType')}</h3>
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all ${reportType === 'Inline' ? 'border-blue-600 bg-blue-50' : 'border-slate-300 group-hover:border-slate-400'
                                }`}>
                                {reportType === 'Inline' && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-sm" />}
                            </div>
                            <input
                                type="radio"
                                className="hidden"
                                name="reportType"
                                value="Inline"
                                checked={reportType === 'Inline'}
                                onChange={() => setReportType('Inline')}
                            />
                            <span className={`text-sm font-black uppercase tracking-tight transition-colors ${reportType === 'Inline' ? 'text-blue-600' : 'text-slate-400'}`}>Inline</span>
                        </label>
                    </div>
                </div>


                {/* General Information Card */}
                <div className="bg-white p-6 border-b border-slate-200 flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-1 h-6 bg-blue-600 rounded-full" />
                        <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">{t('generalInformation')}</h2>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-600 uppercase flex items-center gap-1">
                                {t('factoryStyleNo')} <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                value={factoryStyleNo}
                                onChange={(e) => setFactoryStyleNo(e.target.value)}
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300"
                                placeholder="Enter Style No"
                            />
                        </div>


                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-600 uppercase flex items-center gap-1">
                                {t('buyerStyleNo')} <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                value={buyerStyleNo}
                                onChange={(e) => setBuyerStyleNo(e.target.value)}
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                            />
                        </div>


                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-600 uppercase flex items-center gap-1">
                                {t('Customer')} <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                value={customer}
                                onChange={(e) => setCustomer(e.target.value)}
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                            />
                        </div>


                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-600 uppercase flex items-center gap-1">
                                {t('Fabrication')} <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                value={fabrication}
                                onChange={(e) => setFabrication(e.target.value)}
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                            />
                        </div>


                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-600 uppercase flex items-center gap-1">
                                {t('Color Name')} <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                value={colorName}
                                onChange={(e) => setColorName(e.target.value)}
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                            />
                        </div>


                        <div className="space-y-2 group">
                            <label className="text-[11px] font-black text-slate-600 uppercase flex items-center gap-1">
                                {t('aquaboyReadingSpec')} <span className="text-red-500 font-bold">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={aquaboyReadingSpec}
                                    onChange={(e) => setAquaboyReadingSpec(e.target.value)}
                                    className="w-full bg-blue-50/20 border border-blue-100 rounded-lg py-2.5 px-4 text-sm font-black text-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all pr-12"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-400 uppercase tracking-wider">% RH</span>
                            </div>
                        </div>


                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-600 uppercase flex items-center gap-1">
                                {t('beforeDryRoom')} <span className="text-red-500 font-bold">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={beforeDryRoom}
                                    onChange={(e) => setBeforeDryRoom(e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all pr-10"
                                    placeholder="--:-- --"
                                />
                                <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                            </div>
                        </div>


                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-600 uppercase flex items-center gap-1">{t('DATE')}</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-bold text-slate-700 focus:outline-none pr-10 cursor-default"
                                    value={date}
                                    readOnly
                                />
                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                            </div>
                        </div>


                    </div>
                </div>

                {/* Inspection Records Card */}
                <div className="bg-white border-b border-slate-100 flex flex-col">
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-1 h-6 bg-blue-600 rounded-full" />
                            <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">{t('inspectionRecords')}</h2>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-blue-600 rounded-lg font-black text-[10px] uppercase tracking-widest border border-slate-100 hover:bg-white transition-all">
                            <Plus size={14} strokeWidth={3} />
                            {t('addNewRecord')}
                        </button>
                    </div>


                    <div className="px-6 pb-6 pt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column: Readings */}
                        <div className="bg-slate-50/30 rounded-2xl p-6 border border-slate-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-200">
                                    <FileText size={16} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-800 tracking-tight">{t('Aquaboy Reading')}</h3>
                            </div>

                            <div className="space-y-5">
                                {[
                                    { id: 'topBody', label: 'Top' },
                                    { id: 'middleBody', label: 'Middle' },
                                    { id: 'bottomBody', label: 'Bottom' }
                                ].map((item) => (
                                    <div key={item.id} className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
                                            {item.label} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <div className="relative flex-1">
                                                <input
                                                    type="text"
                                                    value={readings[item.id]}
                                                    onChange={(e) => handleReadingChange(item.id, e.target.value)}
                                                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500 shadow-sm transition-all"
                                                    placeholder="Body"
                                                />
                                            </div>
                                            <span className="text-slate-300 text-[11px] font-bold italic w-8 text-right italic">{t('n/a')}</span>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>

                        {/* Right Column: Photos */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 px-2">
                                <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-300">
                                    <ImageIcon size={16} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-800 tracking-tight">{t('Inspection Photos')}</h3>
                            </div>

                            <div className="flex-1 bg-white border border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4 transition-all hover:bg-slate-50 group border-dashed">
                                <div className="relative">
                                    <div className="w-16 h-16 bg-slate-50 group-hover:bg-white rounded-2xl flex items-center justify-center text-slate-200 group-hover:text-blue-500 transition-all border border-slate-100 shadow-sm">
                                        <ImageIcon size={32} strokeWidth={1.5} />
                                    </div>
                                    {!factoryStyleNo && (
                                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                                            <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-slate-800 font-bold text-base tracking-tight">{t('Selection Required')}</p>
                                    <p className="text-slate-400 font-bold text-xs leading-relaxed italic max-w-[200px]">{t('Choose Style No to enable upload')}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                    {/* Remark Section */}
                    <div className="p-6 flex flex-col gap-3">
                        <label className="text-sm font-bold text-gray-800 tracking-tight uppercase">{t('Remark')}</label>
                        <textarea
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            placeholder="Enter general remarks here..."
                            className="w-full min-h-[100px] bg-white border border-slate-200 rounded-lg p-4 text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500 shadow-sm resize-none"
                        />
                    </div>
                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 py-3 px-4">
                        <button
                            onClick={() => setShowDetail(true)}
                            className="flex items-center gap-2 px-5 py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all active:scale-95"
                        >
                            <Download size={18} strokeWidth={3} />
                            Preview & Export
                        </button>
                        <button
                            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:scale-105 transition-all active:scale-95"
                        >
                            <Check size={18} strokeWidth={3} />
                            {t('Submit')}
                        </button>
                    </div>
                </div>
            </div>

            {showDetail && (
                <HumidityReportDetail
                    onClose={() => setShowDetail(false)}
                    data={{
                        id: factoryStyleNo,
                        buyerStyle: buyerStyleNo,
                        customer: customer,
                        fabrication: fabrication,
                        color: colorName,
                        spec: aquaboyReadingSpec,
                        beforeDry: beforeDryRoom,
                        afterDry: 'N/A',
                        sections: {
                            top: { body: readings.topBody, status: 'PASS' },
                            middle: { body: readings.middleBody, status: 'PASS' },
                            bottom: { body: readings.bottomBody, status: 'PASS' }
                        },
                        totalResult: 'PASS'
                    }}
                />
            )}
        </div>
    );
};

export default HumidityReportAdd;
