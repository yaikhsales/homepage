import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Calendar, Video, Clock, Filter, ChevronUp, ChevronDown, Search, Building, User, Users, Briefcase, Hash, Link2, Check, MessageCircle } from 'lucide-react';
import GeneralAIAgent from '../general-ag';
import { useTranslation } from '../translate/TranslationContext';

const MeetingRoom = ({ onBack }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isBotOpen, setIsBotOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('my-history');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        employeeId: 'TS00000005',
        name: 'Testuser1',
        department: 'CSR',
        meetingType: '',
        mentionPerson: '',
        meetingDate: '2025-12-23',
        startHour: '12',
        startMinute: '55',
        endHour: '13',
        endMinute: '55',
        meetingLink: '',
        selectedRoom: null
    });

    const meetingTypes = [
        t('teamMeeting'),
        t('clientPresentation'),
        t('trainingSession'),
        t('interview'),
        t('projectReview'),
        t('other')
    ];

    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

    const meetingRooms = [
        { id: 1, name: 'Conference Room 01', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400' },
        { id: 2, name: 'Conference Room 02', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400' },
        { id: 3, name: 'Conference Room 03', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400' },
        { id: 4, name: 'Conference Room 04', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400' },
        { id: 5, name: 'Conference Room 05', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400' }
    ];

    // Sample meeting bookings data
    const meetings = [
        {
            id: 1,
            meetingInfo: 'Team Standup Meeting',
            organizer: { name: 'John Doe', department: 'IT', employeeId: 'TS00000001' },
            schedule: { date: '2025-12-24', startTime: '09:00 AM', endTime: '09:30 AM' },
            status: 'ongoing',
            participants: 8,
            meetingLink: 'https://meet.google.com/abc-defg-hij',
            room: 'Conference Room 01',
            meetingType: 'Team Meeting'
        },
        {
            id: 2,
            meetingInfo: 'Client Presentation - Q4 Review',
            organizer: { name: 'Sarah Smith', department: 'Sales', employeeId: 'TS00000002' },
            schedule: { date: '2025-12-24', startTime: '02:00 PM', endTime: '03:30 PM' },
            status: 'upcoming',
            participants: 12,
            meetingLink: 'https://zoom.us/j/123456789',
            room: 'Conference Room 02',
            meetingType: 'Client Presentation'
        },
        {
            id: 3,
            meetingInfo: 'Training Session - New System',
            organizer: { name: 'Mike Johnson', department: 'HR', employeeId: 'TS00000003' },
            schedule: { date: '2025-12-25', startTime: '10:00 AM', endTime: '12:00 PM' },
            status: 'upcoming',
            participants: 25,
            meetingLink: 'https://teams.microsoft.com/l/meetup-join/...',
            room: 'Conference Room 03',
            meetingType: 'Training Session'
        },
        {
            id: 4,
            meetingInfo: 'Project Review Meeting',
            organizer: { name: 'Emily Chen', department: 'Production', employeeId: 'TS00000004' },
            schedule: { date: '2025-12-23', startTime: '11:00 AM', endTime: '12:00 PM' },
            status: 'completed',
            participants: 6,
            meetingLink: 'https://meet.google.com/xyz-uvwx-rst',
            room: 'Conference Room 01',
            meetingType: 'Project Review'
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

    const handleAddMeetingLink = () => {
        const link = prompt(t('enterMeetingLink'));
        if (link) {
            setFormData({ ...formData, meetingLink: link });
        }
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
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800">{t('meetingRoomBooking')}</h1>
                </div>
                <button
                    onClick={handleOpenModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={16} />
                    {t('newBooking')}
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Tabs */}
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setActiveTab('my-history')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                                activeTab === 'my-history' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-blue-100 text-blue-700'
                            }`}
                        >
                            {t('myHistory')}
                        </button>
                        <button
                            onClick={() => setActiveTab('all-booking')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                                activeTab === 'all-booking' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-blue-100 text-blue-700'
                            }`}
                        >
                            {t('allBooking')}
                        </button>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Calendar className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <div className="text-sm text-slate-600 mb-1">{t('totalMeetings')}</div>
                                <div className="text-2xl font-bold text-slate-800">0</div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 flex items-center gap-4">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <Video className="text-green-600" size={24} />
                            </div>
                            <div>
                                <div className="text-sm text-slate-600 mb-1">{t('ongoing')}</div>
                                <div className="text-2xl font-bold text-slate-800">0</div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 flex items-center gap-4">
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <Clock className="text-yellow-600" size={24} />
                            </div>
                            <div>
                                <div className="text-sm text-slate-600 mb-1">{t('upcoming')}</div>
                                <div className="text-2xl font-bold text-slate-800">0</div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 flex items-center gap-4">
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <Calendar className="text-purple-600" size={24} />
                            </div>
                            <div>
                                <div className="text-sm text-slate-600 mb-1">{t('today')}</div>
                                <div className="text-2xl font-bold text-slate-800">0</div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-slate-200 flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <Filter className="text-slate-600" size={20} />
                            <span className="text-slate-700 font-semibold">{t('filterByStatus')}:</span>
                            <div className="flex gap-2">
                                {['all', 'ongoing', 'upcoming', 'today'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                                            filterStatus === status
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-200 text-slate-700'
                                        }`}
                                    >
                                        {t(status === 'all' ? 'all' : status)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="text-slate-600 text-sm">
                            {t('showing')} {meetings.length} {t('meetings')}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t('meetingInfo')}</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t('organizer')}</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t('schedule')}</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t('status')}</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t('participants')}</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t('meetingLink')}</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                            <div className="flex items-center gap-2">
                                                {t('actions')}
                                                <div className="flex flex-col">
                                                    <ChevronUp size={12} className="text-slate-400" />
                                                    <ChevronDown size={12} className="text-slate-400" />
                                                </div>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {meetings.map((meeting) => (
                                        <tr key={meeting.id} className="border-b border-slate-200 hover:bg-slate-50">
                                            <td className="px-4 py-3">
                                                <div className="font-semibold text-slate-800">{meeting.meetingInfo}</div>
                                                <div className="text-xs text-slate-600 mt-1">{meeting.room}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-semibold text-slate-800">{meeting.organizer.name}</div>
                                                <div className="text-xs text-slate-600">{meeting.organizer.department} • {meeting.organizer.employeeId}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm text-slate-800">{meeting.schedule.date}</div>
                                                <div className="text-xs text-slate-600">{meeting.schedule.startTime} - {meeting.schedule.endTime}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    meeting.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                                                    meeting.status === 'upcoming' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-slate-100 text-slate-700'
                                                }`}>
                                                    {t(meeting.status === 'ongoing' ? 'ongoing' : meeting.status === 'upcoming' ? 'upcoming' : 'completed')}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <Users size={16} className="text-slate-600" />
                                                    <span className="text-sm text-slate-800">{meeting.participants}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                                                    <Link2 size={14} />
                                                    {t('join')}
                                                </a>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                                                    {t('view')}
                                                </button>
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
                    <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between z-10">
                            <div className="flex items-center gap-2">
                                <Users size={20} className="text-slate-600" />
                                <h2 className="text-xl font-bold text-slate-800">{t('meetingRoomBookingForm')}</h2>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-slate-600" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Employee Info Section */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <Briefcase size={16} />
                                        {t('employeeId')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.employeeId}
                                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <User size={16} />
                                        {t('yourName')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <Building size={16} />
                                        {t('department')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Meeting Type */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                    <Users size={16} />
                                    {t('meetingType')}
                                </label>
                                <select
                                    value={formData.meetingType}
                                    onChange={(e) => setFormData({ ...formData, meetingType: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">{t('selectMeetingType')}</option>
                                    {meetingTypes.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Mention Person */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                    <User size={16} />
                                    {t('mentionPersonOptional')}
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        value={formData.mentionPerson}
                                        onChange={(e) => setFormData({ ...formData, mentionPerson: e.target.value })}
                                        placeholder={t('searchByEmployeeName')}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Date and Time */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <Calendar size={16} />
                                        {t('meetingDate')}
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                        <input
                                            type="date"
                                            value={formData.meetingDate}
                                            onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                                            className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <Clock size={16} />
                                        {t('startTime')}*
                                    </label>
                                    <div className="flex gap-2">
                                        <select
                                            value={formData.startHour}
                                            onChange={(e) => setFormData({ ...formData, startHour: e.target.value })}
                                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {hours.map((hour) => (
                                                <option key={hour} value={hour}>{hour}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={formData.startMinute}
                                            onChange={(e) => setFormData({ ...formData, startMinute: e.target.value })}
                                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {minutes.map((minute) => (
                                                <option key={minute} value={minute}>{minute}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <Clock size={16} />
                                        {t('endTime')}*
                                    </label>
                                    <div className="flex gap-2">
                                        <select
                                            value={formData.endHour}
                                            onChange={(e) => setFormData({ ...formData, endHour: e.target.value })}
                                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {hours.map((hour) => (
                                                <option key={hour} value={hour}>{hour}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={formData.endMinute}
                                            onChange={(e) => setFormData({ ...formData, endMinute: e.target.value })}
                                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {minutes.map((minute) => (
                                                <option key={minute} value={minute}>{minute}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Meeting Link */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                    <Link2 size={16} />
                                    {t('meetingLinkOptional')}
                                </label>
                                {formData.meetingLink ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={formData.meetingLink}
                                            readOnly
                                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, meetingLink: '' })}
                                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            {t('remove')}
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleAddMeetingLink}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <Plus size={16} />
                                        {t('addMeetingLink')}
                                    </button>
                                )}
                            </div>

                            {/* Select Meeting Room */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
                                    <Building size={16} />
                                    {t('selectMeetingRoom')}
                                </label>
                                <div className="flex gap-4 overflow-x-auto pb-4">
                                    {meetingRooms.map((room) => (
                                        <div
                                            key={room.id}
                                            onClick={() => setFormData({ ...formData, selectedRoom: room.id })}
                                            className={`flex-shrink-0 w-48 cursor-pointer transition-all ${
                                                formData.selectedRoom === room.id
                                                    ? 'ring-4 ring-blue-500 rounded-lg'
                                                    : ''
                                            }`}
                                        >
                                            <div className="bg-slate-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={room.image}
                                                    alt={room.name}
                                                    className="w-full h-32 object-cover"
                                                />
                                                <div className="p-3 bg-white">
                                                    <div className="flex items-center gap-2">
                                                        <Building size={16} className="text-slate-600" />
                                                        <span className="text-sm font-semibold text-slate-800">{room.name}</span>
                                                    </div>
                                                    {formData.selectedRoom === room.id && (
                                                        <div className="mt-2 flex items-center gap-1 text-blue-600">
                                                            <Check size={16} />
                                                            <span className="text-xs">{t('selected')}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
                                    <Check size={16} />
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
                aria-label="Ask Meeting Room bot"
                title="Ask Meeting Room bot"
            >
                <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            </button>
            
            {/* Bot Modal */}
            {isBotOpen && (
                <GeneralAIAgent 
                    onClose={() => setIsBotOpen(false)}
                    moduleContext="Meeting Room"
                />
            )}
        </div>
    );
};

export default MeetingRoom;

