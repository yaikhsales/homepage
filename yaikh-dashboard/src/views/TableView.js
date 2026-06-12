import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import MapModal from './MapModal';
import { useTranslation } from '../translate/TranslationContext';

const TableView = ({ onBack }) => {
    const { moduleId } = useParams();
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);

    // Define data based on the route parameter
    const tableConfig = {
        car: {
            title: t('myCarBookings'),
            columns: [t('id'), t('destination'), t('date'), t('status')],
            data: [
                { id: '#CB-001', destination: 'Suvarnabhumi Airport', date: '2024-11-30', status: 'ACTIVE' },
                { id: '#CB-002', destination: 'Client Office (Silom)', date: '2024-12-02', status: 'ACTIVE' },
            ],
            actionLabel: t('newBooking'),
            showAction: true,
        },
        default: {
            title: t('dataList'),
            columns: [t('id'), t('name'), t('value')],
            data: [{ id: 'N/A', name: t('noDataAvailable'), value: '' }],
            showAction: false,
        }
    };

    const { title, columns, data, actionLabel, showAction } = tableConfig[moduleId] || tableConfig.default;
    const isCar = moduleId === 'car';

    return (
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-[600px] animate-in slide-in-from-bottom-4 duration-500 m-4">
            <div className="bg-slate-100 p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 hover:bg-slate-300 rounded-lg bg-slate-200">
                        <ArrowLeft size={18} /> {t('back')}
                    </button>
                    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                </div>
                {showAction && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-blue-700"
                    >
                        <Plus size={16} /> {actionLabel}
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-auto p-4">
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
                        {data.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                                {Object.values(row).map((val, vIdx) => (
                                    <td key={vIdx} className="px-6 py-4 font-medium text-gray-900">
                                        {val === 'ACTIVE' ? (
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                                {t('active')}
                                            </span>
                                        ) : (
                                            val
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && isCar && <MapModal onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default TableView;

