import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ShoppingBag,
  Stethoscope,
  Wrench,
  X,
  ArrowLeft,
  MessageCircle,
  Video,
  FileText,
} from "lucide-react";
import ImageViewer from "../components/ImageViewer";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";
import GeneralAIAgent from "../general-ag";

const YShop = ({ onBack }) => {
  const navigate = useNavigate();
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("01/12/2025 / 30/12/2025");
  const [department, setDepartment] = useState("Office");
  const [supplier, setSupplier] = useState("All Suppliers");
  const [subCategory, setSubCategory] = useState("All Categories");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Pagination states
  const [lowStockPage, setLowStockPage] = useState(1);
  const [healthyStockPage, setHealthyStockPage] = useState(1);
  const itemsPerPage = 9;

  // Sample data for Low Stock Products
  const lowStockProducts = [
    {
      id: 1,
      name: "Tape seal 8 roll",
      image:
        "https://ym.yaikh.com/storage/inventory/M4qIcVk6vONbje8SrRElnDbiQYKAHOs8kJbYoFLZ.jpg",
      department: "Office",
      inStock: 5.0,
      unit: "box",
      max: 20,
      min: 5,
      needBuy: 0,
      stockIn: 0,
      stockOut: 0,
      pending: 1,
      needPurchase: false,
    },
    {
      id: 1,
      name: "Paper clip 1013",
      image:
        "https://ym.yaikh.com/storage/inventory/55Z9DBrmd0IFkBMrEd8jxOWDg3jCQeVm5vVd1Z6p.jpg",
      department: "Office",
      inStock: 5.0,
      unit: "box",
      max: 20,
      min: 5,
      needBuy: 0,
      stockIn: 0,
      stockOut: 0,
      pending: 1,
      needPurchase: false,
    },

    {
      id: 2,
      name: "LAMINATING Film A4",
      image:
        "https://ym.yaikh.com/storage/shop_images/rEnCM6paslFJhBXb8HXrUhiNTSmyY828XO28yYcp.jpg",
      department: "Office",
      inStock: 0.0,
      unit: "packet",
      max: 20,
      min: 5,
      needBuy: 0,
      stockIn: 0,
      stockOut: 3,
      pending: 0,
      needPurchase: false,
    },
    {
      id: 3,
      name: "Airpods bluetooth",
      image:
        "https://ym.yaikh.com/storage/inventory/inFAT8uV9DJ9Xf9oWjanOewMckJrxelbojBZFond.jpg",
      department: "Office",
      inStock: 1.0,
      unit: "pcs",
      max: 10,
      min: 5,
      needBuy: 0,
      stockIn: 0,
      stockOut: 0,
      pending: 0,
      needPurchase: false,
    },
    {
      id: 4,
      name: "Whiteboard",
      image:
        "https://ym.yaikh.com/storage/inventory/g77K8arosko0xigMhI6ZFa0SupjCF9bkUSsDR3S4.jpg",
      department: "Office",
      inStock: 0.0,
      unit: "pcs",
      max: 10,
      min: 5,
      needBuy: 0,
      stockIn: 0,
      stockOut: 0,
      pending: 0,
      needPurchase: false,
    },
    {
      id: 5,
      name: "C/A",
      image:
        "https://ym.yaikh.com/storage/inventory/1v1pHlIUZY3Nhn8eCVWjGIYAB3tltP3ncK85Npqk.jpg",
      department: "Office",
      inStock: 18.0,
      unit: "pcs",
      max: 30,
      min: 20,
      needBuy: 0,
      stockIn: 0,
      stockOut: 0,
      pending: 0,
      needPurchase: false,
    },
    {
      id: 6,
      name: "A4 paper (flay blue)",
      image:
        "https://ym.yaikh.com/storage/inventory/lutQmPFpato5szvAA02LnRzR3I3rnZdfbdftxSMm.jpg",
      department: "Office",
      inStock: 12.0,
      unit: "box",
      max: 30,
      min: 15,
      needBuy: 0,
      stockIn: 0,
      stockOut: 0,
      pending: 0,
      needPurchase: false,
    },
    {
      id: 7,
      name: "A4 paper (pink)",
      image:
        "https://ym.yaikh.com/storage/inventory/TbjqOzbrYdWyoAr7ZR08PE4oxsI2vqMJgpX7nhvH.jpg",
      department: "Office",
      inStock: 14.0,
      unit: "box",
      max: 30,
      min: 15,
      needBuy: 0,
      stockIn: 0,
      stockOut: 0,
      pending: 0,
      needPurchase: false,
    },
    {
      id: 8,
      name: "Basket A4",
      image:
        "https://ym.yaikh.com/storage/inventory/dmZiCXxRQQjWemTFOoywdv0koD9wZAREFuErg6hf.jpg",
      department: "Office",
      inStock: 0.0,
      unit: "pcs",
      max: 50,
      min: 10,
      needBuy: 100,
      stockIn: 0,
      stockOut: 48,
      pending: 0,
      needPurchase: true,
    },
  ];

  // Sample data for Healthy Stock Products
  const healthyStockProducts = [
    {
      id: 1,
      name: 'Scissors 12"',
      image:
        "https://ym.yaikh.com/storage/inventory/RE2Jieur1A8BmaLmYdVxpkXQyoT65XBK9hxxQEyo.jpg",
      department: "Office",
      inStock: 15,
      unit: "pcs",
      max: 20,
      min: 5,
      stockIn: 0,
      stockOut: 0,
      pending: 1,
    },
    {
      id: 2,
      name: "Whiteboard eraser",
      image:
        "https://ym.yaikh.com/storage/inventory/O0Rv4gmS7mNdlwiKKWeBifnv7YNie0804PmFOWsh.jpg",
      department: "Office",
      inStock: 18,
      unit: "pcs",
      max: 25,
      min: 5,
      stockIn: 0,
      stockOut: 0,
      pending: 0,
    },
    {
      id: 3,
      name: "Punch small",
      image:
        "https://ym.yaikh.com/storage/inventory/69kKVm3Qz0XHsLAlP3jJEK06JgOU3R6CXVoIRsFd.jpg",
      department: "Office",
      inStock: 10,
      unit: "pcs",
      max: 20,
      min: 5,
      stockIn: 0,
      stockOut: 0,
      pending: 0,
    },
    {
      id: 4,
      name: "Straight ruler 50 cm",
      image:
        "https://ym.yaikh.com/storage/shop_images/lnqHS29CuM0aq77M6zn1QQysBXR7bu780zSF5Pv0.jpg",
      department: "Office",
      inStock: 8,
      unit: "pcs",
      max: 15,
      min: 5,
      stockIn: 0,
      stockOut: 0,
      pending: 0,
    },
    {
      id: 5,
      name: "A3 envelope cowhide",
      image:
        "https://ym.yaikh.com/storage/inventory/zcyozI6Ay5zCMno6uFCnlpwb9RYpVI8msHHZ7zUh.jpg",
      department: "Office",
      inStock: 500,
      unit: "pcs",
      max: 600,
      min: 100,
      stockIn: 0,
      stockOut: 0,
      pending: 0,
    },
    {
      id: 6,
      name: "Out-of-office strips",
      image:
        "https://ym.yaikh.com/storage/inventory/IFEeyLTXDEOAAgTqN6HqNjoB82XLdh30tf4A12ei.jpg",
      department: "Office",
      inStock: 439,
      unit: "pcs",
      max: 500,
      min: 100,
      stockIn: 200,
      stockOut: 0,
      pending: 0,
    },
    {
      id: 7,
      name: "A4 File Dividers",
      image:
        "https://ym.yaikh.com/storage/inventory/694NwrKqVaS17Elgmja0Fs1U2hOwT7fnoxyD4pzi.jpg",
      department: "Office",
      inStock: 15.0,
      unit: "packet",
      max: 30,
      min: 5,
      stockIn: 0,
      stockOut: 0,
      pending: 0,
    },
    {
      id: 8,
      name: "Label rope id carde",
      image:
        "https://ym.yaikh.com/storage/inventory/aFTegiQKnBdFS9j6Lnhv4pM9xrXPgz25mKItKE7o.jpg",
      department: "Office",
      inStock: 900.0,
      unit: "pcs",
      max: 1000,
      min: 100,
      stockIn: 0,
      stockOut: 0,
      pending: 0,
    },
    {
      id: 9,
      name: "Phone stand",
      image:
        "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop",
      department: "Office",
      inStock: 10.0,
      unit: "pcs",
      max: 20,
      min: 5,
      stockIn: 0,
      stockOut: 0,
      pending: 0,
    },
  ];

  const totalLowStock = 37;
  const totalHealthyStock = 160;
  const totalProducts = 197;

  // Calculate pagination
  const lowStockStart = (lowStockPage - 1) * itemsPerPage;
  const lowStockEnd = lowStockStart + itemsPerPage;
  const displayedLowStock = lowStockProducts.slice(lowStockStart, lowStockEnd);
  const totalLowStockPages = Math.ceil(totalLowStock / itemsPerPage);

  const healthyStockStart = (healthyStockPage - 1) * itemsPerPage;
  const healthyStockEnd = healthyStockStart + itemsPerPage;
  const displayedHealthyStock = healthyStockProducts.slice(
    healthyStockStart,
    healthyStockEnd,
  );
  const totalHealthyStockPages = Math.ceil(totalHealthyStock / itemsPerPage);

  const renderProductCard = (product, isLowStock = false) => (
    <div
      key={product.id}
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-16 h-16 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setSelectedImage(product.image)}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded border border-gray-200"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-gray-800 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex flex-wrap gap-1 mb-2">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
              {product.department}
            </span>
            {isLowStock && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-md">
                Low Stock
              </span>
            )}
            {product.needPurchase && (
              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-md">
                Need Purchase
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div>
          <span className="text-gray-600">In Stock:</span>
          <span className="font-semibold text-gray-800 ml-1">
            {product.inStock} {product.unit}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Max:</span>
          <span className="font-semibold text-gray-800 ml-1">
            {product.max} {product.unit}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Min:</span>
          <span className="font-semibold text-gray-800 ml-1">
            {product.min} {product.unit}
          </span>
        </div>
        {isLowStock && product.needBuy > 0 && (
          <div>
            <span className="text-gray-600">Need Buy:</span>
            <span className="font-semibold text-gray-800 ml-1">
              {product.needBuy} {product.unit}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-2">
        <div className="flex-1 bg-green-50 rounded-md p-2 text-center border border-green-100">
          <div className="text-xs text-gray-600 mb-1">Stock In</div>
          <div className="font-bold text-green-600">{product.stockIn || 0}</div>
        </div>
        <div className="flex-1 bg-red-50 rounded-md p-2 text-center border border-red-100">
          <div className="text-xs text-gray-600 mb-1">Stock Out</div>
          <div className="font-bold text-red-600">{product.stockOut || 0}</div>
        </div>
        <div className="flex-1 bg-yellow-50 rounded-md p-2 text-center border border-yellow-100">
          <div className="text-xs text-gray-600 mb-1">Pending</div>
          <div className="font-bold text-yellow-600">
            {product.pending || 0}
          </div>
        </div>
      </div>

      <button className="text-xs text-blue-600 hover:text-blue-800 font-medium w-full text-left mt-2">
        Click to view details
      </button>
    </div>
  );

  const renderPagination = (
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    startItem,
    endItem,
  ) => (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-600">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
          const page = i + 1;
          if (totalPages > 10 && page === 10) {
            return (
              <React.Fragment key={page}>
                <span className="px-2">...</span>
                <button
                  onClick={() => onPageChange(totalPages - 1)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === totalPages - 1
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {totalPages - 1}
                </button>
                <button
                  onClick={() => onPageChange(totalPages)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === totalPages
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {totalPages}
                </button>
              </React.Fragment>
            );
          }
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded border ${
                currentPage === page
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-100 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Empty space for balance */}
            <div className="w-32"></div>

            {/* Center: Back Button, Home Button, and OFFICE Button */}
            <div className="flex items-center gap-3 absolute left-1/2 transform -translate-x-1/2">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Back</span>
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-gray-300 hover:border-gray-400 transition-all hover:scale-110 cursor-pointer flex-shrink-0"
                title="Home"
              >
                <img
                  src="/logo.jpg"
                  alt="Home"
                  className="w-full h-full object-cover"
                />
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
                OFFICE
              </button>
            </div>

            {/* Right: Icons and Search Controls */}
            <div className="flex items-center gap-4">
              <button
            onClick={() => setSelectedVideo("/assets/short-video-training/new-updated-vd/y-shop.mp4",)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
            title="Video Training"
        >
            <Video size={20} className="text-blue-600" />
        </button>
              <button
                onClick={() =>
                  setSelectedDocument(
                    "/assets/report-training/Y-shop-report.xlsx",
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Report Training"
              >
                <FileText size={20} className="text-blue-600" />
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Shop"
              >
                <ShoppingBag size={20} className="text-gray-600" />
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Nurse"
              >
                <Stethoscope size={20} className="text-gray-600" />
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Mechanic"
              >
                <Wrench size={20} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="outline-none text-sm w-32"
                />
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Search
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-6">
        {/* Filter Section */}
        {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Data</h2>
                        <p className="text-sm text-gray-600">Filter and view stock transactions.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                        <div className="lg:col-span-2 flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-white">
                            <Search size={16} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 outline-none text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-white">
                            <Calendar size={16} className="text-gray-400" />
                            <input
                                type="text"
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="flex-1 outline-none text-sm"
                            />
                        </div>
                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                        >
                            <option>Office</option>
                            <option>HR</option>
                            <option>IT</option>
                        </select>
                        <select
                            value={supplier}
                            onChange={(e) => setSupplier(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                        >
                            <option>All Suppliers</option>
                            <option>Supplier 1</option>
                            <option>Supplier 2</option>
                        </select>
                    </div>
                    
                    <div className="mb-4">
                        <select
                            value={subCategory}
                            onChange={(e) => setSubCategory(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none w-full md:w-auto"
                        >
                            <option>All Categories</option>
                            <option>Category 1</option>
                            <option>Category 2</option>
                        </select>
                    </div>

                    <div className="text-sm text-gray-600">
                        <strong>Total Products:</strong> {totalProducts} Showing results from {dateRange.split(' / ')[0]} to {dateRange.split(' / ')[1]}
                    </div>
                </div> */}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Products */}
          <div className="flex flex-col">
            <div className="bg-red-600 text-white rounded-lg px-6 py-4 mb-4 shadow-sm">
              <div className="flex items-center gap-3">
                <AlertTriangle size={24} className="text-white" />
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Low Stock Products
                  </h3>
                  <p className="text-sm text-red-50">
                    {totalLowStock} products need attention
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 flex-1">
              {displayedLowStock.map((product) =>
                renderProductCard(product, true),
              )}
            </div>

            {renderPagination(
              lowStockPage,
              totalLowStockPages,
              setLowStockPage,
              totalLowStock,
              lowStockStart + 1,
              Math.min(lowStockEnd, totalLowStock),
            )}
          </div>

          {/* Healthy Stock Products */}
          <div className="flex flex-col">
            <div className="bg-green-600 text-white rounded-lg px-6 py-4 mb-4 shadow-sm">
              <div className="flex items-center gap-3">
                <CheckCircle size={24} className="text-white" />
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Healthy Stock Products
                  </h3>
                  <p className="text-sm text-green-50">
                    {totalHealthyStock} products in good condition
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 flex-1">
              {displayedHealthyStock.map((product) =>
                renderProductCard(product, false),
              )}
            </div>

            {renderPagination(
              healthyStockPage,
              totalHealthyStockPages,
              setHealthyStockPage,
              totalHealthyStock,
              healthyStockStart + 1,
              Math.min(healthyStockEnd, totalHealthyStock),
            )}
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {selectedImage && (
        <ImageViewer
          imagePath={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {/* Video Viewer Modal */}
      {selectedVideo && (
        <VideoViewer
          videoPath={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewer
          documentPath={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}

      {/* Bot Button - Bottom Right */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Ask Y Shop bot"
        title="Ask Y Shop bot"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Bot Modal */}
      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Y Shop"
        />
      )}
    </div>
  );
};

export default YShop;
