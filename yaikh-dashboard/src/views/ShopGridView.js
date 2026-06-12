import React, { useState } from 'react';
import { ArrowLeft, Lock, Image as ImageIcon } from 'lucide-react';
import ProductSelectionModal from './ProductSelectionModal';
import { useTranslation } from '../translate/TranslationContext';

const ShopGridView = ({ onBack }) => {
    const { t } = useTranslation();
    const [requests, setRequests] = useState([]);
    const [showProductModal, setShowProductModal] = useState(false);

    const columns = [t('photo'), t('department'), t('subject'), t('quantity'), t('unit'), t('requestor'), t('requestDate'), t('action')];

    return (
        <>
            <div className="fixed inset-0 bg-white flex flex-col animate-in fade-in duration-500 relative z-10">
                <div className="bg-slate-50 p-4 border-b flex justify-between items-center flex-shrink-0 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onBack} 
                            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-semibold"
                        >
                            {t('back')}
                        </button>
                        <h2 className="text-2xl font-bold text-slate-800 underline">{t('yShop')}</h2>
                    </div>
                </div>
                
                <div className="flex-1 overflow-auto p-6 bg-gray-100">
                    <div className="bg-white border-2 border-dashed border-gray-400 rounded-lg p-6">
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => setShowProductModal(true)}
                                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md"
                            >
                                <Lock size={18} />
                                {t('addNewRequest')}
                            </button>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-200 text-gray-800 uppercase font-bold text-xs">
                                    <tr>
                                        {columns.map((col, i) => (
                                            <th key={i} className="px-4 py-3 border-b-2 border-gray-300">
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {requests.length === 0 ? (
                                        <tr>
                                            <td colSpan={columns.length} className="text-center py-20 text-gray-500">
                                                {t('noRequestsYetClickAddNewRequest')}
                                            </td>
                                        </tr>
                                    ) : (
                                        requests.map((request, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    {request.photo ? (
                                                        <img src={request.photo} alt={request.subject} className="w-12 h-12 object-cover rounded" />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                                            <ImageIcon size={20} className="text-gray-400" />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-gray-700">{request.department}</td>
                                                <td className="px-4 py-3 text-gray-700 font-medium">{request.subject}</td>
                                                <td className="px-4 py-3 text-gray-700">{request.quantity}</td>
                                                <td className="px-4 py-3 text-gray-700">{request.unit}</td>
                                                <td className="px-4 py-3 text-gray-700">{request.requestor}</td>
                                                <td className="px-4 py-3 text-gray-700">{request.requestDate}</td>
                                                <td className="px-4 py-3">
                                                    <button className="text-blue-600 hover:text-blue-800 font-semibold text-xs">
                                                        {t('view')}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            {showProductModal && (
                <ProductSelectionModal
                    onClose={() => setShowProductModal(false)}
                    onSelectProduct={(product) => {
                        // Handle product selection - add to requests
                        const newRequest = {
                            id: Date.now(),
                            photo: product.image,
                            department: product.department || 'Office',
                            subject: product.title,
                            quantity: 1,
                            unit: product.unit || 'PCS',
                            requestor: 'Current User',
                            requestDate: new Date().toLocaleDateString()
                        };
                        setRequests(prev => [newRequest, ...prev]);
                        setShowProductModal(false);
                    }}
                />
            )}
        </>
    );
};

export default ShopGridView;
