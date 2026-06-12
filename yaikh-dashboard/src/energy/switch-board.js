import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Plus, Zap, Leaf, Calculator, Eye } from 'lucide-react';
import { useTranslation } from '../translate/TranslationContext';

const SwitchBoard = ({ onBack }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Sample switch board data
    const switchBoards = [
        { id: 1, name: 'Front Desk, shipping, GM Office, Planing', equipmentCount: 20 },
        { id: 2, name: 'IT Server, IT Room, VIP WC, Staff WC, CESA Office', equipmentCount: 21 },
        { id: 3, name: 'Merchandising Floor', equipmentCount: 13 },
        { id: 4, name: 'Staff Pantry, Accounting', equipmentCount: 15 },
        { id: 5, name: 'GM Office, SMall meeting room, QA Meeting room, Admin Shop', equipmentCount: 12 },
        { id: 6, name: 'QA, HR, Admin', equipmentCount: 14 },
        { id: 7, name: 'CSR, YAIL, Meeting room 5, QA Checking Table', equipmentCount: 25 },
        { id: 8, name: 'Sample Room', equipmentCount: 43 },
        { id: 9, name: 'Boiler', equipmentCount: 2 },
        { id: 10, name: 'Cutting Room', equipmentCount: 10 },
        { id: 11, name: 'Pressing', equipmentCount: 10 },
        { id: 12, name: 'SCC', equipmentCount: 13 },
        { id: 13, name: 'Washing', equipmentCount: 11 },
        { id: 14, name: 'New Pressing', equipmentCount: 15 },
        { id: 15, name: 'Finish good wharehouse', equipmentCount: 7 },
        { id: 16, name: 'Air compressor', equipmentCount: 6 },
        { id: 17, name: 'test', equipmentCount: 1 }
    ];

    const totalSwitchBoards = switchBoards.length;
    const totalEquipments = switchBoards.reduce((sum, board) => sum + board.equipmentCount, 0);
    const averageEquipments = (totalEquipments / totalSwitchBoards).toFixed(1);

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const handleImportExcel = () => {
        console.log('Import Excel');
    };

    const handleAddSwitchBoard = () => {
        console.log('Add Switch Board');
    };

    const handleViewDetails = (id) => {
        console.log('View details for switch board:', id);
    };

    return (
        <div className="fixed inset-0 bg-slate-50 flex flex-col animate-in fade-in duration-500 z-[200]">
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
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800">{t('switchBoardList')}</h1>
                </div>
                <div className="w-32"></div> {/* Right spacer */}
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Top Section */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('switchBoards')}</h2>
                                <p className="text-slate-600">{t('monitorAllRegisteredSwitchBoards')}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleImportExcel}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                                >
                                    <Download size={16} />
                                    {t('importExcel')}
                                </button>
                                <button
                                    onClick={handleAddSwitchBoard}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    Add Switch Board
                                </button>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-white border border-slate-300 rounded-lg p-6 flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Zap size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-slate-600 mb-1">TOTAL SWITCH BOARDS</div>
                                    <div className="text-2xl font-bold text-slate-800">{totalSwitchBoards}</div>
                                </div>
                            </div>
                            <div className="bg-white border border-slate-300 rounded-lg p-6 flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Leaf size={24} className="text-green-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-slate-600 mb-1">TOTAL EQUIPMENTS</div>
                                    <div className="text-2xl font-bold text-slate-800">{totalEquipments}</div>
                                </div>
                            </div>
                            <div className="bg-white border border-slate-300 rounded-lg p-6 flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Calculator size={24} className="text-purple-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-slate-600 mb-1">AVERAGE EQUIPMENTS / BOARD</div>
                                    <div className="text-2xl font-bold text-slate-800">{averageEquipments}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Switch Board Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {switchBoards.map((board) => (
                            <div key={board.id} className="bg-white border border-slate-300 rounded-lg p-6 hover:shadow-lg transition-shadow">
                                {/* Switch Board Icon */}
                                <div className="flex justify-center mb-4">
                                    <div className="w-20 h-20 bg-slate-800 rounded-lg flex items-center justify-center">
                                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            {/* Central switch board unit */}
                                            <rect x="15" y="10" width="30" height="20" rx="2" fill="white" stroke="white" strokeWidth="1"/>
                                            <rect x="18" y="13" width="8" height="3" fill="black"/>
                                            <rect x="28" y="13" width="8" height="3" fill="black"/>
                                            <rect x="38" y="13" width="8" height="3" fill="black"/>
                                            <rect x="18" y="18" width="8" height="3" fill="black"/>
                                            <rect x="28" y="18" width="8" height="3" fill="black"/>
                                            <rect x="38" y="18" width="8" height="3" fill="black"/>
                                            
                                            {/* Cables extending downward */}
                                            <line x1="20" y1="30" x2="12" y2="45" stroke="white" strokeWidth="2"/>
                                            <line x1="25" y1="30" x2="20" y2="45" stroke="white" strokeWidth="2"/>
                                            <line x1="30" y1="30" x2="30" y2="45" stroke="white" strokeWidth="2"/>
                                            <line x1="35" y1="30" x2="40" y2="45" stroke="white" strokeWidth="2"/>
                                            <line x1="40" y1="30" x2="48" y2="45" stroke="white" strokeWidth="2"/>
                                            
                                            {/* Connected devices (circles/ovals) */}
                                            <ellipse cx="12" cy="50" rx="4" ry="3" fill="white"/>
                                            <ellipse cx="20" cy="50" rx="4" ry="3" fill="white"/>
                                            <ellipse cx="30" cy="50" rx="4" ry="3" fill="white"/>
                                            <ellipse cx="40" cy="50" rx="4" ry="3" fill="white"/>
                                            <ellipse cx="48" cy="50" rx="4" ry="3" fill="white"/>
                                        </svg>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="font-bold text-slate-800 mb-2 text-center min-h-[48px] flex items-center justify-center">
                                    {board.name}
                                </h3>

                                {/* Equipment Count */}
                                <div className="text-center text-slate-600 mb-4">
                                    {board.equipmentCount} {t('equipmentCount')}
                                </div>

                                {/* View Details Link */}
                                <div className="text-center">
                                    <button
                                        onClick={() => handleViewDetails(board.id)}
                                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 mx-auto hover:underline"
                                    >
                                        <Eye size={14} />
                                        {t('viewDetails')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SwitchBoard;

