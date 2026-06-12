import React, { useState } from 'react';
import { X, Search, ArrowLeft } from 'lucide-react';

const ProductSelectionModal = ({ onClose, onSelectProduct }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [department, setDepartment] = useState('Office');
    const [supplierName, setSupplierName] = useState('All');
    const [subCategory, setSubCategory] = useState('All');
    const [showNonSellable, setShowNonSellable] = useState(false);

    // Sample product data
    const products = [
        {
            id: 1,
            title: 'Spray',
            image: '/assets/modules-image/spray.jpg',
            supplierName: 'Taobao',
            category: 'office',
            price: 1.00,
            stock: 12,
            unit: 'PCS',
            department: 'Office'
        },
        {
            id: 2,
            title: 'Foam paper used in warehouse',
            image: '/assets/modules-image/foam-paper.jpg',
            supplierName: 'Taobao',
            category: '-',
            price: 11.50,
            stock: 80,
            unit: 'BOX',
            department: 'Office'
        },
        {
            id: 3,
            title: 'Cabinet office',
            image: '/assets/modules-image/cabinet.jpg',
            supplierName: 'N/A',
            category: '-',
            price: 0.00,
            stock: 2,
            unit: 'SET',
            department: 'Office'
        },
        {
            id: 4,
            title: 'Wood office 1400x1000x25',
            image: '/assets/modules-image/wood.jpg',
            supplierName: 'N/A',
            category: '-',
            price: 0.00,
            stock: 10,
            unit: 'PCS',
            department: 'Office'
        },
        {
            id: 5,
            title: 'Wood office curved',
            image: '/assets/modules-image/wood-curved.jpg',
            supplierName: 'N/A',
            category: '-',
            price: 0.00,
            stock: 16,
            unit: 'PCS',
            department: 'Office'
        },
        {
            id: 6,
            title: 'Money counting machine',
            image: '/assets/modules-image/money-counter.jpg',
            supplierName: 'N/A',
            category: '-',
            price: 0.00,
            stock: 1,
            unit: 'PCS',
            department: 'Office'
        },
        {
            id: 7,
            title: 'Printing bill',
            image: '/assets/modules-image/printing-bill.jpg',
            supplierName: 'N/A',
            category: '-',
            price: 0.00,
            stock: 50,
            unit: 'PCS',
            department: 'Office'
        },
        {
            id: 8,
            title: 'Petty cash voucher',
            image: '/assets/modules-image/petty-cash.jpg',
            supplierName: 'N/A',
            category: '-',
            price: 0.00,
            stock: 100,
            unit: 'PCS',
            department: 'Office'
        },
        {
            id: 9,
            title: 'Paper cutter machine',
            image: '/assets/modules-image/paper-cutter.jpg',
            supplierName: 'N/A',
            category: '-',
            price: 0.00,
            stock: 2,
            unit: 'PCS',
            department: 'Office'
        },
        {
            id: 10,
            title: '贴纸-圆形蓝色',
            image: '/assets/modules-image/sticker.jpg',
            supplierName: '采购部门确定',
            category: '-',
            price: 0.00,
            stock: 5,
            unit: 'PCS',
            department: 'Office'
        }
    ];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = department === 'All' || product.department === department;
        const matchesSupplier = supplierName === 'All' || product.supplierName === supplierName;
        const matchesCategory = subCategory === 'All' || product.category === subCategory;
        return matchesSearch && matchesDepartment && matchesSupplier && matchesCategory;
    });

    const handleReset = () => {
        setSearchTerm('');
        setDepartment('Office');
        setSupplierName('All');
        setSubCategory('All');
        setShowNonSellable(false);
    };

    return (
        <div className="fixed inset-0 bg-white z-[400] flex flex-col animate-in fade-in duration-300">
            {/* Header */}
            <div className="bg-white border-b p-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 rounded-lg transition-colors bg-gray-100"
                    >
                        <ArrowLeft size={18} /> Back
                    </button>
                    <h2 className="text-xl font-bold text-slate-800">Select Product</h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-slate-50 border-b p-4 flex-shrink-0">
                <div className="flex flex-col gap-4">
                    {/* Search Bar */}
                    <div className="flex justify-end">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search Product..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-semibold text-gray-700">Department:</label>
                            <select
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="All">All</option>
                                <option value="Office">Office</option>
                                <option value="Warehouse">Warehouse</option>
                                <option value="Production">Production</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm font-semibold text-gray-700">Supplier Name:</label>
                            <select
                                value={supplierName}
                                onChange={(e) => setSupplierName(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="All">All</option>
                                <option value="Taobao">Taobao</option>
                                <option value="N/A">N/A</option>
                                <option value="采购部门确定">采购部门确定</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm font-semibold text-gray-700">Sub Category:</label>
                            <select
                                value={subCategory}
                                onChange={(e) => setSubCategory(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="All">All</option>
                                <option value="office">Office</option>
                                <option value="-">-</option>
                            </select>
                        </div>

                        <button
                            onClick={() => {
                                // Apply filters
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
                        >
                            Filter
                        </button>

                        <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-300 transition-colors"
                        >
                            Reset
                        </button>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showNonSellable}
                                onChange={(e) => setShowNonSellable(e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-semibold text-gray-700">Show Non Sellable</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-auto p-6 bg-gray-50">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {/* Product Image */}
                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400" style={{ display: product.image ? 'none' : 'flex' }}>
                                    No Image
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                <h3 className="font-bold text-sm text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem]">
                                    {product.title}
                                </h3>
                                <p className="text-xs text-gray-600 mb-1">
                                    <span className="font-semibold">Supplier Name:</span> {product.supplierName}
                                </p>
                                <p className="text-xs text-gray-600 mb-1">
                                    <span className="font-semibold">Category:</span> {product.category}
                                </p>
                                <p className="text-xs text-gray-600 mb-1">
                                    <span className="font-semibold">Price:</span> {product.price.toFixed(2)} USD
                                </p>
                                <p className="text-xs text-gray-600 mb-3">
                                    <span className="font-semibold">In Stock:</span> {product.stock} {product.unit}
                                </p>
                                <button
                                    onClick={() => onSelectProduct(product)}
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
                                >
                                    Order Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductSelectionModal;

