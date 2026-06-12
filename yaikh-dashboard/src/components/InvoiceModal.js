import React, { useState } from 'react';
import { X, Eye, Image as ImageIcon } from 'lucide-react';

const InvoiceModal = ({ isOpen, onClose, requestData }) => {
    const [activeQuotationTab, setActiveQuotationTab] = useState(1);
    const [showQuotationViewer, setShowQuotationViewer] = useState(false);
    
    if (!isOpen || !requestData) return null;

    const requestInfo = {
        code: requestData.code || 1958,
        user: requestData.name || '7474Kanda',
        department: requestData.department || 'Admin',
        reason: requestData.productService || 'driver go to Sihanoukville on 25/12/2025',
        status: 'submitted'
    };

    const priceComparison = {
        currency: 'USD',
        requestPrice: 13.77,
        finalPrice: 13.77,
        difference: 0,
        status: 'No change'
    };

    const finalTotal = 13.77;

    return (
        <div 
            className="fixed inset-0 z-[400] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-lg flex items-center justify-between sticky top-0 z-10">
                    <h2 className="text-xl font-bold">Final Quotation Detail</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={24} className="text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Request Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-green-600">📄</span>
                            Request Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600">User:</label>
                                <p className="text-base font-medium text-gray-800">{requestInfo.user}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Department:</label>
                                <p className="text-base font-medium text-gray-800">{requestInfo.department}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Code:</label>
                                <p className="text-base font-medium text-gray-800">{requestInfo.code}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Status:</label>
                                <p className="text-base font-medium text-gray-800">{requestInfo.status}</p>
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm text-gray-600">Reason:</label>
                                <p className="text-base font-medium text-gray-800">{requestInfo.reason}</p>
                            </div>
                        </div>
                    </div>

                    {/* Price Comparison */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-green-600">💰</span>
                            Price Comparison
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Currency</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Request Price</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Final Price</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Difference</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2">{priceComparison.currency}</td>
                                        <td className="border border-gray-300 px-4 py-2">{priceComparison.requestPrice}</td>
                                        <td className="border border-gray-300 px-4 py-2">{priceComparison.finalPrice}</td>
                                        <td className={`border border-gray-300 px-4 py-2 ${priceComparison.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {priceComparison.difference >= 0 ? '+' : ''}{priceComparison.difference}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">{priceComparison.status}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Final Total Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-green-600">🌿</span>
                            Final Total Summary
                        </h3>
                        <div className="flex justify-between items-center bg-white p-4 rounded-lg border-2 border-green-500">
                            <span className="text-lg font-semibold text-gray-800">Total</span>
                            <div className="text-right">
                                <span className="text-sm text-gray-600">{priceComparison.currency} </span>
                                <span className="text-2xl font-bold text-green-600">{finalTotal}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quotation Section */}
                    <div className="bg-purple-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <ImageIcon className="text-purple-600" size={20} />
                            Quotation
                        </h3>
                        
                        {/* Quotation Tabs */}
                        <div className="flex gap-2 mb-4 border-b border-purple-200">
                            <button
                                onClick={() => setActiveQuotationTab(1)}
                                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                                    activeQuotationTab === 1
                                        ? 'border-purple-600 text-purple-600'
                                        : 'border-transparent text-gray-600 hover:text-purple-600'
                                }`}
                            >
                                Quotation 1
                            </button>
                            <button
                                onClick={() => setActiveQuotationTab(2)}
                                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                                    activeQuotationTab === 2
                                        ? 'border-purple-600 text-purple-600'
                                        : 'border-transparent text-gray-600 hover:text-purple-600'
                                }`}
                            >
                                Quotation 2
                            </button>
                        </div>

                        {/* Quotation Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Quotation Thumbnail */}
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="relative">
                                    <img 
                                        src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop" 
                                        alt="Quotation Document" 
                                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop';
                                        }}
                                    />
                                    <button
                                        onClick={() => setShowQuotationViewer(true)}
                                        className="absolute bottom-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                                        title="View Quotation"
                                    >
                                        <Eye size={16} className="text-purple-600" />
                                    </button>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Quotation {activeQuotationTab}</span>
                                    <button
                                        onClick={() => setShowQuotationViewer(true)}
                                        className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
                                    >
                                        <Eye size={14} />
                                        View
                                    </button>
                                </div>
                            </div>

                            {/* Quotation Details */}
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <h4 className="font-semibold text-gray-800 mb-3">Quotation Details</h4>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <label className="text-gray-600">Supplier:</label>
                                        <p className="text-gray-800 font-medium">Vannak Gas</p>
                                    </div>
                                    <div>
                                        <label className="text-gray-600">Date:</label>
                                        <p className="text-gray-800 font-medium">25/12/2025</p>
                                    </div>
                                    <div>
                                        <label className="text-gray-600">Total Amount:</label>
                                        <p className="font-medium text-green-600">USD {finalTotal}</p>
                                    </div>
                                    <div>
                                        <label className="text-gray-600">Status:</label>
                                        <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                            Approved
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <div className="bg-gray-50 p-4 rounded-b-lg flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <X size={18} />
                        Close
                    </button>
                </div>
            </div>

            {/* Quotation Viewer Modal */}
            {showQuotationViewer && (
                <div 
                    className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setShowQuotationViewer(false)}
                >
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto relative">
                        <button
                            onClick={() => setShowQuotationViewer(false)}
                            className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg z-10"
                        >
                            <X size={24} className="text-gray-700" />
                        </button>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Quotation {activeQuotationTab} - Full View</h3>
                            <img 
                                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop" 
                                alt="Quotation Document Full View" 
                                className="w-full h-auto rounded-lg border-2 border-gray-200"
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop';
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoiceModal;

