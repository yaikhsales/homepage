import React from 'react';
import { X } from 'lucide-react';

const RequestDetailModal = ({ isOpen, onClose, requestData }) => {
    if (!isOpen || !requestData) return null;

    // Sample data structure - replace with actual data
    const requestInfo = {
        code: requestData.code || 1959,
        department: requestData.department || 'Admin_Department',
        category: 'Local Purchase',
        user: requestData.name || 'Sim Buna',
        reason: requestData.productService || 'Cooking gas fee for kitchen',
        paymentType: 'Credit-Paid',
        status: 'submitted'
    };

    const items = [
        {
            no: 1,
            productName: 'Cooking gas/4tanks/15kg',
            description: 'Cooking gas fee',
            brand: 'Vannak Gas',
            qty: 4,
            uom: 'Tank',
            supplier: 'Vannak Gas',
            unitPrice: 16.3,
            unitType: 'USD',
            total: 65.20,
            remark: 'Add new stocks'
        }
    ];

    return (
        <div 
            className="fixed inset-0 z-[400] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between sticky top-0 z-10">
                    <h2 className="text-xl font-bold">Request Details</h2>
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
                                <label className="text-sm text-gray-600">Code:</label>
                                <p className="text-base font-medium text-gray-800">{requestInfo.code}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Department:</label>
                                <p className="text-base font-medium text-gray-800">{requestInfo.department}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Category:</label>
                                <p className="text-base font-medium text-gray-800">{requestInfo.category}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">User:</label>
                                <p className="text-base font-medium text-gray-800">{requestInfo.user}</p>
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm text-gray-600">Reason:</label>
                                <p className="text-base font-medium text-gray-800">{requestInfo.reason}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Payment Type:</label>
                                <p className="text-base font-medium text-gray-800">{requestInfo.paymentType}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Status:</label>
                                <p className="text-base font-medium text-gray-800">{requestInfo.status}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items Details */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Items Details</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">N°</th>
                                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Product Name</th>
                                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Description</th>
                                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Brand</th>
                                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Qty</th>
                                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">UoM</th>
                                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Supplier</th>
                                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Unit Price</th>
                                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Unit Type</th>
                                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Total</th>
                                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Remark</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-300 px-3 py-2">{item.no}</td>
                                            <td className="border border-gray-300 px-3 py-2">{item.productName}</td>
                                            <td className="border border-gray-300 px-3 py-2">{item.description}</td>
                                            <td className="border border-gray-300 px-3 py-2">{item.brand}</td>
                                            <td className="border border-gray-300 px-3 py-2">{item.qty}</td>
                                            <td className="border border-gray-300 px-3 py-2">{item.uom}</td>
                                            <td className="border border-gray-300 px-3 py-2">{item.supplier}</td>
                                            <td className="border border-gray-300 px-3 py-2">{item.unitPrice}</td>
                                            <td className="border border-gray-300 px-3 py-2">{item.unitType}</td>
                                            <td className="border border-gray-300 px-3 py-2 font-semibold">{item.total}</td>
                                            <td className="border border-gray-300 px-3 py-2">{item.remark}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Picture of Product */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Picture of Product</h3>
                        <div className="flex justify-center">
                            <img 
                                src="https://images.unsplash.com/photo-1621905251918-48116d7b8a2b?w=500&h=400&fit=crop" 
                                alt="Product" 
                                className="rounded-lg shadow-md max-w-full h-auto max-h-64 object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=400&fit=crop';
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestDetailModal;

