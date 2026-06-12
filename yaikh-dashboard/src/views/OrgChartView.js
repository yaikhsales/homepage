import React, { useState } from 'react';
import { ArrowLeft, ZoomIn, ZoomOut, RotateCcw, Users } from 'lucide-react';
import { useTranslation } from '../translate/TranslationContext';

const OrgChartView = ({ onBack }) => {
    const { t } = useTranslation();
    const [zoom, setZoom] = useState(1);
    const [panX, setPanX] = useState(0);
    const [panY, setPanY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const chartData = {
        name: 'CEO / President',
        title: 'YAI',
        level: 0,
        photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        children: [
            {
                name: 'VP of Operations',
                title: 'Operations',
                level: 1,
                photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
                children: [
                    { name: 'Production Manager', title: 'Production', level: 2, photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
                    { name: 'QA Manager', title: 'QA', level: 2, photo: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' }
                ]
            },
            {
                name: 'VP of Finance',
                title: 'Finance',
                level: 1,
                photo: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
                children: [
                    { name: 'Accountant', title: 'Accounting', level: 2, photo: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
                    { name: 'Purchasing Head', title: 'Purchasing', level: 2, photo: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' }
                ]
            },
            {
                name: 'VP of HR & Admin',
                title: 'HR & Admin',
                level: 1,
                photo: 'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
                children: [
                    { name: 'HR Manager', title: 'HR', level: 2, photo: 'https://images.pexels.com/photos/1181346/pexels-photo-1181346.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
                    { name: 'Admin Manager', title: 'Admin', level: 2, photo: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' }
                ]
            },
        ],
    };

    const getNodeStyle = (level) => {
        const styles = {
            0: 'bg-gradient-to-br from-purple-600 to-purple-800 text-white border-purple-700 shadow-purple-500/50',
            1: 'bg-gradient-to-br from-blue-500 to-blue-700 text-white border-blue-600 shadow-blue-500/50',
            2: 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 border-slate-300 shadow-slate-400/50',
        };
        return styles[level] || styles[2];
    };

    const handleMouseDown = (e) => {
        if (e.button === 0) { // Left mouse button
            setIsDragging(true);
            setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPanX(e.clientX - dragStart.x);
            setPanY(e.clientY - dragStart.y);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
    const handleReset = () => {
        setZoom(1);
        setPanX(0);
        setPanY(0);
    };

    const renderNode = (node, index = 0, totalSiblings = 1) => {
        const hasChildren = node.children && node.children.length > 0;
        const level = node.level || 0;
        const nodeStyle = getNodeStyle(level);

        return (
            <li
                key={node.name}
                className="relative flex flex-col items-center"
                style={{ margin: '0 20px' }}
            >
                {/* Node Card */}
                <div
                    className={`group relative ${nodeStyle} px-6 py-4 rounded-xl border-2 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl min-w-[200px] max-w-[250px] cursor-pointer`}
                >
                    <div className="flex flex-col items-center gap-2">
                        {/* Profile Photo */}
                        {node.photo && (
                            <div className={`relative ${level === 0 ? 'w-20 h-20' : level === 1 ? 'w-16 h-16' : 'w-14 h-14'} rounded-full overflow-hidden border-2 ${level === 2 ? 'border-slate-300' : 'border-white/30'} shadow-lg`}>
                                <img 
                                    src={node.photo} 
                                    alt={node.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(node.name)}&background=random&size=128`;
                                    }}
                                />
                            </div>
                        )}
                        <div className="flex flex-col items-center gap-1">
                            <h3 className={`font-bold text-center ${level === 0 ? 'text-lg' : level === 1 ? 'text-base' : 'text-sm'}`}>
                                {node.name}
                            </h3>
                            <p className={`text-xs font-medium ${level === 2 ? 'text-slate-600' : 'text-white/90'}`}>
                                {node.title}
                            </p>
                        </div>
                    </div>
                    
                    {/* Hover Effect Glow */}
                    <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Vertical Connector Line (down from parent) */}
                {hasChildren && (
                    <div className="w-0.5 h-8 bg-gradient-to-b from-slate-400 to-slate-300 mt-2"></div>
                )}

                {/* Children Container */}
                {hasChildren && (
                    <>
                        {/* Horizontal Connector Line */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent" style={{ marginTop: '32px' }}></div>
                        
                        {/* Children List */}
                        <ul className="flex justify-center items-start pt-10 relative">
                            {node.children.map((child, childIndex) => (
                                <React.Fragment key={child.name}>
                                    {renderNode(child, childIndex, node.children.length)}
                                    {/* Vertical Connector Line (up to parent) */}
                                    {childIndex < node.children.length - 1 && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-0.5 bg-slate-300" style={{ marginTop: '-40px' }}></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </ul>
                    </>
                )}
            </li>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-2xl h-[600px] m-4 animate-in fade-in duration-500 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-200 rounded-lg transition-colors bg-slate-100"
                    >
                        <ArrowLeft size={18} /> {t('back')}
                    </button>
                    <h2 className="text-xl font-bold text-slate-800">{t('masterOrganizationChart')}</h2>
                </div>
                
                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleZoomOut}
                        disabled={zoom <= 0.5}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={t('zoomOut')}
                    >
                        <ZoomOut size={18} />
                    </button>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg min-w-[60px] text-center">
                        {Math.round(zoom * 100)}%
                    </span>
                    <button
                        onClick={handleZoomIn}
                        disabled={zoom >= 2}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={t('zoomIn')}
                    >
                        <ZoomIn size={18} />
                    </button>
                    <button
                        onClick={handleReset}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors ml-2"
                        title={t('resetView')}
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>
            </div>

            {/* Chart Container with Pan and Zoom */}
            <div
                className="flex-1 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
                <div
                    className="absolute inset-0 flex items-start justify-center pt-8 pb-8 transition-transform duration-200"
                    style={{
                        transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
                        transformOrigin: 'center top',
                    }}
                >
                    <ul className="flex flex-col items-center">
                        {renderNode(chartData)}
                    </ul>
                </div>

                {/* Instructions Overlay */}
                {zoom === 1 && panX === 0 && panY === 0 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-slate-200">
                        <p className="text-xs text-slate-600 text-center">
                            <span className="font-semibold">{t('tip')}:</span> {t('clickAndDragToPan')} • {t('useZoomControlsToAdjustSize')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrgChartView;

