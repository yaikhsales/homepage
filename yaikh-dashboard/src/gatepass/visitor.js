import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Printer, X, Calendar, MessageCircle } from 'lucide-react';
import GeneralAIAgent from '../general-ag';
import { useTranslation } from '../translate/TranslationContext';

const Visitor = ({ onBack }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isBotOpen, setIsBotOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [visitors, setVisitors] = useState([
        {
            id: 1,
            no: 1,
            date: '23 Dec, 2025',
            visitorName: 'Michael Chen',
            idCardNo: '123456789',
            company: 'ABC Corporation',
            contactPerson: 'John Doe',
            purpose: 'Business Meeting',
            visitorIdNumber: 'V001',
            carMotorPlate: 'ABC-1234',
            carCheck: 'Checked',
            timeIn: '09:15 AM',
            timeOut: '11:30 AM',
            photos: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
            remarks: 'Meeting with management team'
        },
        {
            id: 2,
            no: 2,
            date: '23 Dec, 2025',
            visitorName: 'Lisa Wang',
            idCardNo: '987654321',
            company: 'XYZ Industries',
            contactPerson: 'Sarah Smith',
            purpose: 'Equipment Inspection',
            visitorIdNumber: 'V002',
            carMotorPlate: 'XYZ-5678',
            carCheck: 'Checked',
            timeIn: '02:20 PM',
            timeOut: null,
            photos: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
            remarks: 'Inspecting production equipment'
        },
        {
            id: 3,
            no: 3,
            date: '22 Dec, 2025',
            visitorName: 'Robert Kim',
            idCardNo: '456789123',
            company: 'Tech Solutions Ltd',
            contactPerson: 'David Lee',
            purpose: 'System Installation',
            visitorIdNumber: 'V003',
            carMotorPlate: 'TECH-9012',
            carCheck: 'Checked',
            timeIn: '10:00 AM',
            timeOut: '04:45 PM',
            photos: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
            remarks: 'Installing new software system'
        },
        {
            id: 4,
            no: 4,
            date: '22 Dec, 2025',
            visitorName: 'Emily Brown',
            idCardNo: '789123456',
            company: 'Global Trading',
            contactPerson: 'Mike Johnson',
            purpose: 'Contract Discussion',
            visitorIdNumber: 'V004',
            carMotorPlate: 'GT-3456',
            carCheck: 'Checked',
            timeIn: '01:30 PM',
            timeOut: '03:15 PM',
            photos: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
            remarks: 'Discussing supply contract terms'
        },
        {
            id: 5,
            no: 5,
            date: '21 Dec, 2025',
            visitorName: 'James Wilson',
            idCardNo: '321654987',
            company: 'Quality Assurance Inc',
            contactPerson: 'Emily Chen',
            purpose: 'Audit Visit',
            visitorIdNumber: 'V005',
            carMotorPlate: 'QA-7890',
            carCheck: 'Checked',
            timeIn: '08:45 AM',
            timeOut: '05:00 PM',
            photos: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
            remarks: 'Annual quality audit inspection'
        }
    ]);

    const [formData, setFormData] = useState({
        visitorName: '',
        idCardNo: '',
        contactPerson: '',
        purpose: '',
        date: '2025-12-23',
        visitorCardNo: '',
        carCheck: '',
        remarks: '',
        companyName: '',
        phoneNumber: '',
        timeIn: '12:20 PM',
        carMotorPlate: ''
    });

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({
            visitorName: '',
            idCardNo: '',
            contactPerson: '',
            purpose: '',
            date: '2025-12-23',
            visitorCardNo: '',
            carCheck: '',
            remarks: '',
            companyName: '',
            phoneNumber: '',
            timeIn: '12:20 PM',
            carMotorPlate: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newVisitor = {
            id: visitors.length + 1,
            no: visitors.length + 1,
            date: new Date(formData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            visitorName: formData.visitorName,
            idCardNo: formData.idCardNo,
            company: formData.companyName,
            contactPerson: formData.contactPerson,
            purpose: formData.purpose,
            visitorIdNumber: formData.visitorCardNo,
            carMotorPlate: formData.carMotorPlate,
            carCheck: formData.carCheck,
            timeIn: formData.timeIn,
            timeOut: null,
            photos: null,
            remarks: formData.remarks
        };
        setVisitors([...visitors, newVisitor]);
        handleCloseModal();
    };

    const handleCheckOut = (id) => {
        setVisitors(visitors.map(visitor => 
            visitor.id === id 
                ? { ...visitor, timeOut: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) }
                : visitor
        ));
    };

    const handlePrintRecords = () => {
        console.log('Print Records');
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
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800">{t('visitorLog')}</h1>
                </div>
                <div className="w-32"></div> {/* Right spacer */}
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="w-full h-full">
                    {/* White Card */}
                    <div className="bg-white rounded-lg shadow-md p-6 h-full">
                        {/* Title and Action Buttons */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">{t('visitorLog')}</h2>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleOpenModal}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    {t('addNewVisitor')}
                                </button>
                                <button
                                    onClick={handlePrintRecords}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                                >
                                    <Printer size={16} />
                                    {t('printRecords')}
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">{t('no')}.</th>
                                        <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">{t('date')}</th>
                                        <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">{t('visitorsName')}</th>
                                        <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">{t('idCardNo')}</th>
                                        <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">{t('company')}</th>
                                        <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">{t('contactPerson')}</th>
                                        <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">{t('purpose')}</th>
                                        <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">{t('visitorIdNumber')}</th>
                                        <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">{t('carMotorPlate')}</th>
                                        <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">{t('carCheck')}</th>
                                        <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">{t('timeIn')}</th>
                                        <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">{t('timeOut')}</th>
                                        <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">{t('photos')}</th>
                                        <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">{t('remarks')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visitors.length === 0 ? (
                                        <tr>
                                            <td colSpan={14} className="text-center py-16 text-slate-500">
                                                {t('noVisitorRecordsFound')}
                                            </td>
                                        </tr>
                                    ) : (
                                        visitors.map((visitor) => (
                                            <tr key={visitor.id} className="hover:bg-blue-50 transition-colors">
                                                <td className="px-4 py-4 border border-slate-200 text-slate-700 text-center">{visitor.no}</td>
                                                <td className="px-4 py-4 border border-slate-200 text-slate-700">{visitor.date}</td>
                                                <td className="px-4 py-4 border border-slate-200 text-slate-700">{visitor.visitorName}</td>
                                                <td className="px-4 py-4 border border-slate-200 text-slate-700">{visitor.idCardNo}</td>
                                                <td className="px-4 py-4 border border-slate-200 text-slate-700">{visitor.company}</td>
                                                <td className="px-4 py-4 border border-slate-200 text-slate-700">{visitor.contactPerson}</td>
                                                <td className="px-4 py-4 border border-slate-200 text-slate-700">{visitor.purpose}</td>
                                                <td className="px-4 py-4 border border-slate-200 text-slate-700">{visitor.visitorIdNumber}</td>
                                                <td className="px-4 py-4 border border-slate-200 text-slate-700">{visitor.carMotorPlate}</td>
                                                <td className="px-4 py-4 border border-slate-200 text-slate-700">{visitor.carCheck}</td>
                                                <td className="px-4 py-4 border border-slate-200 text-slate-700">{visitor.timeIn}</td>
                                                <td className="px-4 py-4 border border-slate-200 text-slate-700">
                                                    {visitor.timeOut ? (
                                                        visitor.timeOut
                                                    ) : (
                                                        <button
                                                            onClick={() => handleCheckOut(visitor.id)}
                                                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700 transition-colors"
                                                        >
                                                            {t('checkOut')}
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 border border-slate-200 text-center">
                                                    {visitor.photos ? (
                                                        <img src={visitor.photos} alt={t('visitor')} className="w-12 h-12 object-cover rounded mx-auto" />
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 border border-slate-200 text-slate-700">{visitor.remarks}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add New Visitor Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[300] animate-in fade-in duration-300">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
                        {/* Modal Header */}
                        <div className="bg-white p-6 border-b flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-800">{t('visitorLogNewEntry')}</h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                aria-label={t('close')}
                            >
                                <X size={20} className="text-slate-600" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    {/* Visitor's Name */}
                                    <div>
                                        <label className="flex items-center gap-1 text-sm font-semibold text-slate-700 mb-2">
                                            {t('visitorsName')}
                                        </label>
                                        <input
                                            type="text"
                                            name="visitorName"
                                            value={formData.visitorName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder=""
                                        />
                                    </div>

                                    {/* ID Card No. */}
                                    <div>
                                        <label className="flex items-center gap-1 text-sm font-semibold text-slate-700 mb-2">
                                            {t('idCardNo')}
                                        </label>
                                        <input
                                            type="text"
                                            name="idCardNo"
                                            value={formData.idCardNo}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder=""
                                        />
                                    </div>

                                    {/* Contact Person */}
                                    <div>
                                        <label className="flex items-center gap-1 text-sm font-semibold text-slate-700 mb-2">
                                            {t('contactPerson')}
                                        </label>
                                        <input
                                            type="text"
                                            name="contactPerson"
                                            value={formData.contactPerson}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder=""
                                        />
                                    </div>

                                    {/* Purpose of Visiting */}
                                    <div>
                                        <label className="flex items-center gap-1 text-sm font-semibold text-slate-700 mb-2">
                                            {t('purposeOfVisiting')}
                                        </label>
                                        <input
                                            type="text"
                                            name="purpose"
                                            value={formData.purpose}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder=""
                                        />
                                    </div>

                                    {/* Date */}
                                    <div>
                                        <label className="flex items-center gap-1 text-sm font-semibold text-slate-700 mb-2">
                                            {t('date')}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                                            />
                                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                        </div>
                                    </div>

                                    {/* Visitor Card No. */}
                                    <div>
                                        <label className="flex items-center gap-1 text-sm font-semibold text-slate-700 mb-2">
                                            {t('visitorCardNo')}
                                        </label>
                                        <input
                                            type="text"
                                            name="visitorCardNo"
                                            value={formData.visitorCardNo}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder=""
                                        />
                                    </div>

                                    {/* Car check */}
                                    <div>
                                        <label className="flex items-center gap-1 text-sm font-semibold text-slate-700 mb-2">
                                            {t('carCheck')}
                                        </label>
                                        <input
                                            type="text"
                                            name="carCheck"
                                            value={formData.carCheck}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder=""
                                        />
                                    </div>

                                    {/* Remarks */}
                                    <div>
                                        <label className="flex items-center gap-1 text-sm font-semibold text-slate-700 mb-2">
                                            {t('remarks')}
                                        </label>
                                        <textarea
                                            name="remarks"
                                            value={formData.remarks}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                                            placeholder=""
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    {/* Company Name */}
                                    <div>
                                        <label className="flex items-center gap-1 text-sm font-semibold text-slate-700 mb-2">
                                            {t('companyName')}
                                        </label>
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder=""
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="flex items-center gap-1 text-sm font-semibold text-slate-700 mb-2">
                                            {t('phoneNumber')}
                                        </label>
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder=""
                                        />
                                    </div>

                                    {/* Time In */}
                                    <div>
                                        <label className="flex items-center gap-1 text-sm font-semibold text-slate-700 mb-2">
                                            {t('timeIn')}
                                        </label>
                                        <input
                                            type="text"
                                            name="timeIn"
                                            value={formData.timeIn}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="12:20 PM"
                                        />
                                    </div>

                                    {/* Car/Motor plate */}
                                    <div>
                                        <label className="flex items-center gap-1 text-sm font-semibold text-slate-700 mb-2">
                                            {t('carMotorPlate')}
                                        </label>
                                        <input
                                            type="text"
                                            name="carMotorPlate"
                                            value={formData.carMotorPlate}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder=""
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end mt-6 pt-4 border-t">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors"
                                >
                                    {t('logVisitor')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Bot Button - Bottom Right */}
            <button
                onClick={() => setIsBotOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                aria-label="Ask Visitor bot"
                title="Ask Visitor bot"
            >
                <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            </button>
            
            {/* Bot Modal */}
            {isBotOpen && (
                <GeneralAIAgent 
                    onClose={() => setIsBotOpen(false)}
                    moduleContext="Visitor"
                />
            )}
        </div>
    );
};

export default Visitor;

