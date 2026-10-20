import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, X } from 'lucide-react';
import { useTranslation } from '../translate/TranslationContext';

const CallOut = ({ onBack }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [qualityAlerts, setQualityAlerts] = useState([]);
    const [qualityError, setQualityError] = useState('');

    const loadQualityAlerts = useCallback(async () => {
        try {
            const responses = await Promise.all(['first-output', 'endline'].map(mode => fetch(`/api/yqms/sewing?mode=${mode}`, { credentials: 'same-origin', cache: 'no-store' })));
            const payloads = await Promise.all(responses.map(response => response.json()));
            const failed = payloads.find(payload => !payload.ok);
            if (failed) throw new Error(failed.error || 'Could not load live quality call-outs.');
            const first = payloads[0].records.filter(row => row.decision !== 'approved').map(row => ({ ...row, kind: 'startup' }));
            const endline = payloads[1].records.filter(row => row.result !== 'pass' && row.repairStatus === 'open').map(row => ({ ...row, kind: 'endline' }));
            setQualityAlerts([...first, ...endline].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            setQualityError('');
        } catch (error) { setQualityError(error.message); }
    }, []);
    useEffect(() => { loadQualityAlerts(); }, [loadQualityAlerts]);

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const handleRefresh = () => {
        loadQualityAlerts();
    };

    // Generate data for Lines 1-30
    const generateLineData = (prefix) => {
        const data = {};
        for (let i = 1; i <= 30; i++) {
            data[`Line ${i}`] = [
                `${prefix}${i}-1 YAIAA80-1`,
                `${prefix}${i}-2 YAIAA80-1`,
                `${prefix}${i}-3 YAIAA80-1`
            ];
        }
        return data;
    };
    
    // Helper function to translate line titles
    const translateLineTitle = (title) => {
        if (title.startsWith('Line ')) {
            const lineNum = title.replace('Line ', '');
            return t(`line${lineNum}`);
        }
        return title;
    };

    // Sample data for Sewing (Lines 1-30)
    const sewingData = generateLineData('S');

    // Sample data for Finishing Input (A, B, C, ...)
    const finishingInputData = {
        'A': ['A-001 YAIAA80-1', 'A-002 YAIAA80-1'],
        'B': ['B-001 YAIAA80-1', 'B-002 YAIAA80-1'],
        'C': ['C-001 YAIAA80-1', 'C-002 YAIAA80-1'],
        'D': ['D-001 YAIAA80-1', 'D-002 YAIAA80-1'],
        'E': ['E-001 YAIAA80-1', 'E-002 YAIAA80-1'],
        'F': ['F-001 YAIAA80-1', 'F-002 YAIAA80-1'],
        'G': ['G-001 YAIAA80-1', 'G-002 YAIAA80-1'],
        'H': ['H-001 YAIAA80-1', 'H-002 YAIAA80-1'],
        'I': ['I-001 YAIAA80-1', 'I-002 YAIAA80-1'],
        'J': ['J-001 YAIAA80-1', 'J-002 YAIAA80-1']
    };

    // Sample data for Packing (A, B, C, ...)
    const packingData = {
        'A': ['A-001 YAIAA80-1', 'A-002 YAIAA80-1'],
        'B': ['B-001 YAIAA80-1', 'B-002 YAIAA80-1'],
        'C': ['C-001 YAIAA80-1', 'C-002 YAIAA80-1'],
        'D': ['D-001 YAIAA80-1', 'D-002 YAIAA80-1'],
        'E': ['E-001 YAIAA80-1', 'E-002 YAIAA80-1'],
        'F': ['F-001 YAIAA80-1', 'F-002 YAIAA80-1'],
        'G': ['G-001 YAIAA80-1', 'G-002 YAIAA80-1'],
        'H': ['H-001 YAIAA80-1', 'H-002 YAIAA80-1'],
        'I': ['I-001 YAIAA80-1', 'I-002 YAIAA80-1'],
        'J': ['J-001 YAIAA80-1', 'J-002 YAIAA80-1']
    };

    const renderEmptyColumn = (maxItems = 3) => {
        return (
            <div key="empty" className="flex flex-col border-r border-gray-600 w-[150px] max-w-[150px] flex-shrink-0 box-border">
                {/* Icon Row */}
                <div className="bg-gray-800 border-b border-gray-600 p-1 text-center min-h-[80px] flex items-center justify-center">
                    <div className="w-10 h-10"></div>
                </div>
                {/* Line Header Row */}
                <div className="bg-gray-800 border-b border-gray-600 p-2 text-center min-h-[40px] flex items-center justify-center">
                    <span className="text-white font-semibold text-sm whitespace-nowrap"></span>
                </div>
                {/* Data Rows */}
                <div className="flex-1 bg-gray-900">
                    {Array.from({ length: maxItems }).map((_, idx) => (
                        <div 
                            key={idx}
                            className="p-2 border-b border-gray-700 text-xs text-white text-center min-h-[40px] flex items-center justify-center"
                        ></div>
                    ))}
                </div>
            </div>
        );
    };

    const renderGridColumn = (title, items, columnColor = null) => {
        // Determine colors for data area based on columnColor
        let dataBgColor = 'bg-gray-900';
        let textColor = 'text-white';
        let borderColor = 'border-gray-600';
        let emojiIcon = null;
        let statusIcon = null;
        
        if (columnColor === 'green') {
            dataBgColor = 'bg-green-900/20';
            textColor = 'text-green-300';
            borderColor = 'border-green-500';
            emojiIcon = '😊'; // Happy icon for green
            statusIcon = '✅'; // Checkmark icon for green
        } else if (columnColor === 'red') {
            dataBgColor = 'bg-red-900/20';
            textColor = 'text-red-300';
            borderColor = 'border-red-500';
            emojiIcon = '😢'; // Crying icon for red
            statusIcon = '❌'; // X icon for red
        } else if (columnColor === 'orange') {
            dataBgColor = 'bg-orange-900/20';
            textColor = 'text-orange-300';
            borderColor = 'border-orange-500';
            emojiIcon = '😟'; // Worried icon for orange
            statusIcon = '❓'; // Question mark icon for orange
        }
        
        return (
        <div key={title} className={`flex flex-col border-r ${borderColor} w-[150px] max-w-[150px] flex-shrink-0 box-border`}>
            {/* Icon Row */}
            <div className="bg-gray-800 border-b border-gray-600 p-1 text-center min-h-[80px] flex items-center justify-center">
                {emojiIcon ? (
                    <span className="text-6xl">
                        {emojiIcon}
                    </span>
                ) : (
                    <div className="w-10 h-10"></div>
                )}
            </div>
            {/* Line Header Row */}
            <div className="bg-gray-800 border-b border-gray-600 p-2 text-center min-h-[40px] flex items-center justify-center">
                <span className="text-white font-semibold text-sm whitespace-nowrap">{translateLineTitle(title)}</span>
            </div>
            {/* Data Rows */}
            <div className={`flex-1 ${dataBgColor}`}>
                {items.length > 0 ? (
                    items.map((item, idx) => (
                        <div 
                            key={idx} 
                            className={`p-2 border-b border-gray-700 text-xs ${textColor} flex items-center justify-center min-h-[40px]`}
                        >
                            {statusIcon && <span className="text-2xl">{statusIcon}</span>}
                        </div>
                    ))
                ) : (
                    <div className={`p-2 ${textColor}/50 text-xs text-center min-h-[40px] flex items-center justify-center`}>-</div>
                )}
            </div>
        </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-gray-900 flex flex-col overflow-hidden z-[100]">
            <style>{`
                .scrollbar-thin::-webkit-scrollbar {
                    height: 8px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: #1f2937;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #4b5563;
                    border-radius: 4px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: #6b7280;
                }
            `}</style>
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 shadow-lg sticky top-0 z-[101]">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 px-3 py-1.5 text-white hover:bg-gray-700 rounded transition-colors"
                        >
                            <ArrowLeft size={18} />
                            <span className="font-medium">Back</span>
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500 hover:border-orange-400 transition-all hover:scale-110 cursor-pointer flex-shrink-0 bg-orange-500"
                            title="Home"
                        >
                            <img 
                                src="/logo.jpg" 
                                alt="Home" 
                                className="w-full h-full object-cover"
                            />
                        </button>
                    </div>
                    <h1 className="text-5xl font-bold text-white flex-1 text-center">Call Out</h1>
                    <div className="flex-1 flex justify-end">
                        <button
                            onClick={handleBack}
                            className="px-3 py-1.5 rounded text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-1"
                        >
                            <X size={16} />
                            {t('exit')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Top Filter Bar */}
            <div className="bg-gray-800 border-b border-gray-700 px-4 py-2.5 flex items-center gap-2 flex-wrap">
                <span className="text-gray-300 text-sm font-semibold">Sewing quality · live records</span>
                <button
                    onClick={handleRefresh}
                    className="px-4 py-1.5 rounded text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors flex items-center gap-1.5"
                >
                    <RefreshCw size={16} />
                    {t('refresh')}
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-gray-900 p-4">
                <section className="mb-6 rounded-xl border border-emerald-700 bg-gray-800 p-4 text-white">
                    <h2 className="text-lg font-bold mb-2">Live sewing quality call-outs</h2>
                    {qualityError && <p className="text-amber-300 text-sm">{qualityError}</p>}
                    {!qualityError && qualityAlerts.length === 0 && <p className="text-gray-400 text-sm">No open sewing quality call-outs.</p>}
                    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">{qualityAlerts.map(row => <div key={row._id} className="rounded-lg border border-gray-600 bg-gray-900 p-3 text-sm">
                        <b>{row.kind === 'startup' ? 'Startup review / hold' : 'End-line repair / recheck'} · {row.line}</b>
                        <p>MO {row.mo} · {row.style}{row.pieceId ? ` · Piece ${row.pieceId}` : ''}</p>
                        <p>To: {row.kind === 'startup' ? 'QA leader / manager, sewing supervisor and line leader' : `Line leader and sewing supervisor${row.machine ? ', mechanic' : ''}; QA leader for recurrence`}</p>
                        <p>{row.defects?.join(', ') || (row.decision === 'pending-qa' ? 'Awaiting QA review' : 'Check startup cause')}</p>
                        <button className="text-emerald-300 font-bold" onClick={() => navigate(row.kind === 'startup' ? '/dashboard/yqms/first-output-sewing' : '/dashboard/yqms/endline-check')}>Open quality record →</button>
                    </div>)}</div>
                </section>
                <details className="text-gray-400 text-xs"><summary className="cursor-pointer mb-3">Show legacy sample layout (not live data)</summary>
                {/* Sewing Section */}
                <div className="mb-5">
                    <div className="text-white font-bold text-base mb-2 px-1">{t('sewing')} · reference layout</div>
                    <div className="bg-gray-800 border border-gray-700 overflow-hidden">
                        <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                            {renderEmptyColumn(Math.max(...Object.values(sewingData).map(items => items.length)))}
                            {Object.entries(sewingData).map(([line, items], index) => {
                                const colors = ['green', 'red', 'orange'];
                                const columnColor = colors[index % colors.length];
                                return renderGridColumn(
                                    line,
                                    items,
                                    columnColor
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Finishing Input Section */}
                <div className="mb-5">
                    <div className="text-white font-bold text-base mb-2 px-1">Finishing </div>
                    <div className="bg-gray-800 border border-gray-700 overflow-hidden">
                        <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                            {renderEmptyColumn(Math.max(...Object.values(finishingInputData).map(items => items.length)))}
                            {Object.entries(finishingInputData).map(([area, items], index) => {
                                const colors = ['green', 'red', 'orange'];
                                const columnColor = colors[index % colors.length];
                                return renderGridColumn(area, items, columnColor);
                            })}
                        </div>
                    </div>
                </div>

                {/* Packing Section */}
                <div className="mb-5">
                    <div className="text-white font-bold text-base mb-2 px-1">{t('packing')}</div>
                    <div className="bg-gray-800 border border-gray-700 overflow-hidden">
                        <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                            {renderEmptyColumn(Math.max(...Object.values(packingData).map(items => items.length)))}
                            {Object.entries(packingData).map(([area, items], index) => {
                                const colors = ['green', 'red', 'orange'];
                                const columnColor = colors[index % colors.length];
                                return renderGridColumn(area, items, columnColor);
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer Logo */}
                <div className="flex justify-center items-center mt-8 mb-4 gap-4">
                    <div className="text-gray-500 text-xs">xiaomi</div>
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                    </div>
                </div>
                </details>
            </div>
        </div>
    );
};

export default CallOut;

