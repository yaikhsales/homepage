import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Car, Truck, Calendar, Search, MapPin, User, Clock, CheckCircle, XCircle, AlertCircle, List, Maximize2, Minus, Plus as PlusIcon, MessageCircle } from 'lucide-react';
import GeneralAIAgent from '../general-ag';
import { useTranslation } from '../translate/TranslationContext';

const CarBooking = ({ onBack }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isBotOpen, setIsBotOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [vehicleType, setVehicleType] = useState('car');
    
    const [formData, setFormData] = useState({
        userName: 'Testuser1',
        code: 'TS00000005',
        date: '2025-12-23',
        numberOfPeople: '',
        pickupLocation: ''
    });

    const bookings = [
        {
            no: '0008',
            date: '28-11-25',
            startTime: '10:04 PM',
            endTime: '01:01 PM',
            timeExtension: '+1 hour',
            numberOfPeople: 1,
            destination: 'MCB A...',
            driver: null,
            status: 'Rejected',
            driverStatus: 'In Progress'
        },
        {
            no: '0007',
            date: '28-11-25',
            startTime: '09:02 PM',
            endTime: '10:04 PM',
            numberOfPeople: 1,
            destination: 'GoPro...',
            driver: { name: 'Vann Bunthoeun', phone: '2019-6486', share: true },
            status: 'Approved & Relooking',
            driverStatus: 'Completed'
        },
        {
            no: '0006',
            date: '28-11-25',
            startTime: '07:02 PM',
            endTime: '07:18 PM',
            numberOfPeople: 1,
            destination: 'CBKH...',
            driver: null,
            status: 'Cancelled',
            driverStatus: 'In Progress'
        },
        {
            no: '0005',
            date: '28-11-25',
            startTime: '08:02 PM',
            endTime: '08:08 PM',
            numberOfPeople: 1,
            destination: 'Kambol...',
            driver: { name: 'Vann Bunthoeun', phone: '2019-6486', share: true },
            status: 'Approved & Relooking',
            driverStatus: 'Completed'
        },
        {
            no: '0004',
            date: '27-11-25',
            startTime: '07:21 AM',
            endTime: '08:04 AM',
            numberOfPeople: 1,
            destination: 'Kambol...',
            driver: null,
            status: 'Cancelled',
            driverStatus: 'In Progress'
        },
        {
            no: '0003',
            date: '26-11-25',
            startTime: '08:02 PM',
            endTime: '08:08 PM',
            numberOfPeople: 1,
            destination: 'YMB...',
            driver: { name: 'Vann Bunthoeun', phone: '2019-6486', share: true },
            status: 'Approved & Relooking',
            driverStatus: 'Completed'
        },
        {
            no: '0002',
            date: '27-11-25',
            startTime: '07:21 AM',
            endTime: '08:07 AM',
            numberOfPeople: 1,
            destination: 'JC...',
            driver: { name: 'Vann Bunthoeun', phone: '2019-6486', share: true },
            status: 'Approved & Relooking',
            driverStatus: 'Completed'
        },
        {
            no: '0001',
            date: '26-11-25',
            startTime: '07:02 PM',
            endTime: '07:08 PM',
            numberOfPeople: 1,
            destination: 'TL...',
            driver: { name: 'Tim Huon', phone: '', share: false },
            status: 'Approved & Relooking',
            driverStatus: 'Completed'
        }
    ];

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
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setIsModalOpen(false);
    };

    const getStatusBadge = (status) => {
        if (status === 'Rejected' || status === 'Cancelled') {
            return (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 flex items-center gap-1">
                    <XCircle size={12} />
                    {status === 'Rejected' ? t('rejected') : t('cancelled')}
                </span>
            );
        } else if (status === 'Approved & Relooking') {
            return (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1">
                    <CheckCircle size={12} />
                    {t('approved')}
                </span>
            );
        }
        return null;
    };

    const getDriverStatusBadge = (status) => {
        if (status === 'In Progress') {
            return (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                    {t('inProgress')}
                </span>
            );
        } else if (status === 'Completed') {
            return (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    {t('completed')}
                </span>
            );
        }
        return null;
    };

    return (
        <div className="fixed inset-0 bg-blue-50 flex flex-col animate-in fade-in duration-500 z-[200]">
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
                    <div className="flex items-center gap-2">
                        <Car className="text-blue-600" size={24} />
                        <h1 className="text-xl md:text-2xl font-bold text-slate-800">{t('myCarBooking')}</h1>
                    </div>
                </div>
                <div className="w-32"></div> {/* Right spacer */}
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg p-6 shadow-sm border-t-4 border-green-500 flex items-center justify-between">
                            <div>
                                <div className="text-sm text-slate-600 mb-1 font-semibold">{t('total')}</div>
                                <div className="text-3xl font-bold text-slate-800">8</div>
                            </div>
                            <List className="text-green-500" size={24} />
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm border-t-4 border-orange-500 flex items-center justify-between">
                            <div>
                                <div className="text-sm text-slate-600 mb-1 font-semibold">{t('request')}</div>
                                <div className="text-3xl font-bold text-slate-800">0</div>
                            </div>
                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm border-t-4 border-blue-500 flex items-center justify-between">
                            <div>
                                <div className="text-sm text-slate-600 mb-1 font-semibold">{t('approved')}</div>
                                <div className="text-3xl font-bold text-slate-800">5</div>
                            </div>
                            <CheckCircle className="text-blue-500" size={24} />
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm border-t-4 border-red-500 flex items-center justify-between">
                            <div>
                                <div className="text-sm text-slate-600 mb-1 font-semibold">{t('cancelled')}</div>
                                <div className="text-3xl font-bold text-slate-800">1</div>
                            </div>
                            <XCircle className="text-red-500" size={24} />
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={handleOpenModal}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Plus size={16} />
                            {t('bookingForOldPeople')}
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t('no')}</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t('dateTime')}</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t('numberOfPeople')}</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t('destination')}</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t('driver')}</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t('status')}</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t('driverStatus')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking, index) => (
                                        <tr key={booking.no} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 text-sm text-slate-800 font-semibold">{booking.no}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div>
                                                        <div className="text-sm text-slate-800 font-semibold">{booking.date}</div>
                                                        <div className="text-xs text-slate-600 flex items-center gap-1">
                                                            <Clock size={12} />
                                                            {booking.startTime} - {booking.endTime}
                                                            {booking.timeExtension && (
                                                                <span className="text-blue-600">{booking.timeExtension}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-purple-600 font-semibold">{booking.numberOfPeople}</span>
                                                    <User size={14} className="text-purple-600" />
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                                                    <MapPin size={12} />
                                                    {booking.destination}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {booking.driver ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <User size={16} className="text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold text-slate-800">{booking.driver.name}</div>
                                                            {booking.driver.phone && (
                                                                <div className="text-xs text-slate-600">{booking.driver.phone}</div>
                                                            )}
                                                            {booking.driver.share && (
                                                                <div className="text-xs text-blue-600">{t('share')}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                                        {t('noDriverAssignedYet')}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {getStatusBadge(booking.status)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {getDriverStatusBadge(booking.driverStatus)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[300] p-4" onClick={handleCloseModal}>
                    <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 z-10">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-bold text-slate-800">{t('newBooking')}</h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X size={20} className="text-slate-600" />
                                </button>
                            </div>
                            <p className="text-slate-600">{t('planYourRoute')}</p>
                        </div>

                        {/* Modal Content */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Vehicle Type Selection */}
                            <div className="flex gap-4 border-b border-slate-200 pb-4">
                                <button
                                    type="button"
                                    onClick={() => setVehicleType('car')}
                                    className={`px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${
                                        vehicleType === 'car'
                                            ? 'text-blue-600 border-b-2 border-blue-600'
                                            : 'text-slate-600'
                                    }`}
                                >
                                    <Car size={20} />
                                    {t('car')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setVehicleType('truck')}
                                    className={`px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${
                                        vehicleType === 'truck'
                                            ? 'text-blue-600 border-b-2 border-blue-600'
                                            : 'text-slate-600'
                                    }`}
                                >
                                    <Truck size={20} />
                                    {t('truck')}
                                </button>
                            </div>

                            {/* Your Information Section */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{t('yourInformation')}</h3>
                                <p className="text-sm text-slate-600 mb-4">{t('selectUserBooking')}</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                            <User size={16} />
                                            {t('user')}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.userName}
                                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                            className="w-full px-4 py-2 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <div className="mt-2 text-sm text-slate-600">
                                            <div>{formData.userName}</div>
                                            <div>{t('code')} {formData.code}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                            <Calendar size={16} />
                                            {t('date')}
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                            <input
                                                type="date"
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                            <User size={16} />
                                            {t('numberOfPeople')}
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.numberOfPeople}
                                            onChange={(e) => setFormData({ ...formData, numberOfPeople: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Route Planning Section */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4">{t('routePlanning')}</h3>
                                <div className="border border-slate-300 rounded-lg overflow-hidden">
                                    {/* Map Controls */}
                                    <div className="bg-slate-100 p-4 flex items-center justify-between flex-wrap gap-4">
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-white border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                                            >
                                                {t('map')}
                                            </button>
                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-slate-200 border border-slate-300 rounded-lg font-semibold text-slate-600 hover:bg-slate-50"
                                            >
                                                {t('satellite')}
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-lg">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-xs font-semibold text-green-700">{t('gps')} 0 - {t('min')} 10s</span>
                                            </div>
                                            <button
                                                type="button"
                                                className="p-2 hover:bg-slate-200 rounded-lg"
                                            >
                                                <Maximize2 size={18} className="text-slate-600" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Search Bar */}
                                    <div className="p-4 border-b border-slate-300">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                placeholder={t('qSearchPickUp')}
                                                value={formData.pickupLocation}
                                                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Map Area */}
                                    <div className="relative bg-slate-200 h-96">
                                        {/* Map Controls Sidebar */}
                                        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 text-sm"
                                            >
                                                {t('clearRoute')}
                                            </button>
                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 text-sm"
                                            >
                                                {t('centerMap')}
                                            </button>
                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 text-sm"
                                            >
                                                {t('showSelected')}
                                            </button>
                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-green-800 text-white rounded-lg font-semibold hover:bg-green-900 text-sm"
                                            >
                                                {t('showCar')}
                                            </button>
                                            <div className="px-4 py-2 bg-blue-800 text-white rounded-lg font-semibold text-sm text-center">
                                                126/126
                                            </div>
                                        </div>

                                        {/* Zoom Controls */}
                                        <div className="absolute right-4 bottom-4 z-10 flex flex-col gap-2">
                                            <button
                                                type="button"
                                                className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm"
                                            >
                                                <PlusIcon size={18} className="text-slate-600" />
                                            </button>
                                            <button
                                                type="button"
                                                className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm"
                                            >
                                                <Minus size={18} className="text-slate-600" />
                                            </button>
                                        </div>

                                        {/* Placeholder Map */}
                                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                                            <div className="text-center">
                                                <MapPin size={48} className="mx-auto mb-2 text-slate-400" />
                                                <p className="text-sm">{t('interactiveMapDisplayed')}</p>
                                                <p className="text-xs text-slate-400 mt-1">{t('phnomPenhArea')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <CheckCircle size={16} />
                                    {t('book')}
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
                aria-label="Ask Car Booking bot"
                title="Ask Car Booking bot"
            >
                <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            </button>
            
            {/* Bot Modal */}
            {isBotOpen && (
                <GeneralAIAgent 
                    onClose={() => setIsBotOpen(false)}
                    moduleContext="Car Booking"
                />
            )}
        </div>
    );
};

export default CarBooking;

