import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  X,
  ChevronDown,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import { useTranslation } from "../translate/TranslationContext";
import ImageViewer from "../components/ImageViewer";

const BillRecord = ({ onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImagePath, setSelectedImagePath] = useState("");
  const [bills, setBills] = useState([
    {
      id: 1,
      name: "Stationery Purchase",
      department: "Admin",
      topic: "Stationery Items",
      category: "Office Supplies",
      description: "Purchase of monthly office stationery items",
      amount: 150.0,
      currency: "USD",
      date: "2026-02-14",
      image:
        "https://images.unsplash.com/photo-1544211157-961f7743d838?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Printer Toner",
      department: "IT",
      topic: "IT Consumables",
      category: "Maintenance",
      description: "Replacement toner for office printers",
      amount: 220.0,
      currency: "USD",
      date: "2026-02-13",
      image:
        "https://images.unsplash.com/photo-1517677208174-73dc36039b19?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      name: "Staff Transportation",
      department: "HR",
      topic: "Staff Transit",
      category: "Transportation",
      description: "Monthly staff transportation allowance",
      amount: 340.5,
      currency: "USD",
      date: "2026-02-12",
      image:
        "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      name: "Office Lunch",
      department: "Admin",
      topic: "Food & Catering",
      category: "Food & Beverage",
      description: "Team lunch for project milestone",
      amount: 120.0,
      currency: "USD",
      date: "2026-02-11",
      image:
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=400&fit=crop",
    },
    {
      id: 5,
      name: "Electricity Bill",
      department: "Finance",
      topic: "Monthly Utilities",
      category: "Utilities",
      description: "Payment for January electricity bill",
      amount: 580.0,
      currency: "USD",
      date: "2026-02-10",
      image:
        "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=400&fit=crop",
    },
    {
      id: 6,
      name: "Cleaning Supplies",
      department: "Warehouse",
      topic: "Hygiene",
      category: "Office Supplies",
      description: "Purchase of warehouse cleaning agents",
      amount: 95.0,
      currency: "USD",
      date: "2026-02-09",
      image:
        "https://images.unsplash.com/photo-1581578731522-aa76412ef687?w=400&h=400&fit=crop",
    },
    {
      id: 7,
      name: "Internet Bill",
      department: "IT",
      topic: "Connectivity",
      category: "Utilities",
      description: "Payment for broadband internet service",
      amount: 110.0,
      currency: "USD",
      date: "2026-02-08",
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=400&fit=crop",
    },
    {
      id: 8,
      name: "Water Bill",
      department: "Admin",
      topic: "Monthly Utilities",
      category: "Utilities",
      description: "Payment for office water consumption",
      amount: 45.0,
      currency: "USD",
      date: "2026-02-07",
      image:
        "https://images.unsplash.com/photo-1558223126-66632662c16a?w=400&h=400&fit=crop",
    },
    {
      id: 9,
      name: "Fuel Expense",
      department: "Logistics",
      topic: "Fuel",
      category: "Transportation",
      description: "Weekly fuel top-up for delivery vans",
      amount: 180.25,
      currency: "USD",
      date: "2026-02-06",
      image:
        "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=400&fit=crop",
    },
    {
      id: 10,
      name: "Repair Tools",
      department: "Maintenance",
      topic: "Tooling",
      category: "Maintenance",
      description: "Purchase of new screwdriver sets and wrenches",
      amount: 135.0,
      currency: "USD",
      date: "2026-02-05",
      image:
        "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop",
    },
  ]);
  const [formData, setFormData] = useState({
    department: "",
    topic: "",
    category: "",
    description: "",
    amount: "0.00",
    currency: "",
    image: null,
  });

  const departments = [
    "Admin",
    "HR",
    "Production",
    "Quality Assurance",
    "Cutting",
    "Sewing",
    "Pressing",
    "Packaging",
    "Accounting",
    "IT",
  ];

  const categories = [
    "Office Supplies",
    "Equipment",
    "Maintenance",
    "Utilities",
    "Transportation",
    "Food & Beverage",
    "Other",
  ];

  const currencies = ["USD", "KHR", "THB", "EUR"];

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

  const handleOpenViewModal = (bill) => {
    setSelectedBill(bill);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedBill(null);
  };

  const handleViewImage = (imagePath) => {
    setSelectedImagePath(imagePath);
    setShowImageViewer(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      department: "",
      topic: "",
      category: "",
      description: "",
      amount: "0.00",
      currency: "",
      image: null,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add bill to list
    const newBill = {
      id: bills.length + 1,
      name: formData.topic || "Untitled",
      department: formData.department,
      topic: formData.topic,
      category: formData.category,
      amount: `${formData.amount} ${formData.currency}`,
      image: formData.image ? URL.createObjectURL(formData.image) : null,
      date: new Date().toLocaleDateString(),
    };
    setBills([...bills, newBill]);
    handleCloseModal();
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
              <ArrowLeft size={16} /> {t("back")}
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-slate-300 hover:border-slate-400 transition-all hover:scale-110 cursor-pointer flex-shrink-0"
              title={t("home")}
            >
              <img
                src="/logo.jpg"
                alt={t("home")}
                className="w-full h-full object-cover"
              />
            </button>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            {t("billRecord")}
          </h1>
        </div>
        <div className="w-32"></div> {/* Right spacer */}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="w-full h-full">
          {/* White Card */}
          <div className="bg-white h-full p-6">
            {/* Add Bill Record Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={handleOpenModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 border border-black"
              >
                <Plus size={16} />
                {t("addBillRecord")}
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">
                      {t("no")}
                    </th>
                    <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">
                      {t("name")}
                    </th>
                    <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">
                      {t("department")}
                    </th>
                    <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">
                      {t("topic")}
                    </th>
                    <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">
                      {t("category")}
                    </th>
                    <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">
                      {t("amount")}
                    </th>
                    <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">
                      {t("image")}
                    </th>
                    <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">
                      {t("date")}
                    </th>
                    <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">
                      {t("actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bills.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center py-16 text-slate-500"
                      >
                        {t("noBillRecordsFound")}
                      </td>
                    </tr>
                  ) : (
                    bills.map((bill, idx) => (
                      <tr
                        key={bill.id}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-4 py-4 border border-slate-200 text-slate-700 text-center">
                          {bill.id}
                        </td>
                        <td className="px-4 py-4 border border-slate-200 text-slate-700 text-center">
                          {bill.name}
                        </td>
                        <td className="px-4 py-4 border border-slate-200 text-slate-700 text-center">
                          {bill.department}
                        </td>
                        <td className="px-4 py-4 border border-slate-200 text-slate-700 text-center">
                          {bill.topic}
                        </td>
                        <td className="px-4 py-4 border border-slate-200 text-slate-700 text-center">
                          {bill.category}
                        </td>
                        <td className="px-4 py-4 border border-slate-200 text-slate-700 text-center">
                          {typeof bill.amount === "number"
                            ? `${bill.amount.toFixed(2)} ${bill.currency}`
                            : bill.amount}
                        </td>
                        <td className="px-4 py-4 border border-slate-200 text-center">
                          {bill.image ? (
                            <img
                              src={bill.image}
                              alt={t("bill")}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-4 border border-slate-200 text-slate-700 text-center">
                          {bill.date}
                        </td>
                        <td className="px-4 py-4 border border-slate-200 text-center">
                          <button
                            onClick={() => handleOpenViewModal(bill)}
                            className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-transform hover:scale-110"
                          >
                            {t("view")}
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

      {/* Add Bill Record Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[300] animate-in fade-in duration-300">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-slate-800">
                + {t("addBillRecord")}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                aria-label={t("close")}
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t("department")}
                </label>
                <div className="relative">
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">{t("selectDepartment")}</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t("topic")}
                </label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t("enterTopic")}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t("category")}
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">{t("selectCategory")}</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t("description")}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                  placeholder={t("enterDescription")}
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t("amount")} ($)
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  <div className="relative w-40">
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">{t("selectCurrency")}</option>
                      {currencies.map((curr) => (
                        <option key={curr} value={curr}>
                          {curr}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      size={20}
                    />
                  </div>
                </div>
              </div>

              {/* Upload Image */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t("uploadImage")}
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    {formData.image ? (
                      <div className="space-y-2">
                        <img
                          src={URL.createObjectURL(formData.image)}
                          alt={t("preview")}
                          className="w-32 h-32 object-cover rounded-lg mx-auto"
                        />
                        <p className="text-sm text-slate-600">
                          {formData.image.name}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center mx-auto">
                          <ImageIcon size={32} className="text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-600">
                          {t("clickToUploadImage")}
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 bg-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-400 transition-colors"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {t("submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* View Bill Detail Modal */}
      {isViewModalOpen && selectedBill && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[300] animate-in fade-in duration-300 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300 border border-slate-200">
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                {t("billDetail")} #{selectedBill.id}
              </h2>
              <button
                onClick={handleCloseViewModal}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors group"
              >
                <X
                  size={20}
                  className="text-slate-500 group-hover:text-slate-800"
                />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Bill Image Section */}
              <div
                className="relative group cursor-pointer overflow-hidden rounded-xl border-2 border-slate-100 shadow-inner bg-slate-50 h-48 flex items-center justify-center"
                onClick={() => handleViewImage(selectedBill.image)}
              >
                {selectedBill.image ? (
                  <>
                    <img
                      src={selectedBill.image}
                      alt={selectedBill.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/90 p-2 rounded-full shadow-lg">
                        <ImageIcon size={24} className="text-blue-600" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <ImageIcon size={48} />
                    <span className="text-xs font-medium uppercase tracking-wider">
                      {t("noImageAvailable")}
                    </span>
                  </div>
                )}
              </div>

              {/* Bill Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {t("name")}
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {selectedBill.name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {t("department")}
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {selectedBill.department}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {t("topic")}
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {selectedBill.topic}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {t("category")}
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {selectedBill.category}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {t("amount")}
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    {typeof selectedBill.amount === "number"
                      ? `${selectedBill.amount.toFixed(2)} ${selectedBill.currency}`
                      : selectedBill.amount}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {t("date")}
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {selectedBill.date}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  {t("description")}
                </p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-sm">
                  <p className="text-sm text-slate-600 leading-relaxed italic">
                    "{selectedBill.description || t("noDescriptionProvided")}"
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleCloseViewModal}
                className="px-8 py-2.5 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-900 transition-all shadow-md active:scale-95"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Component */}
      {showImageViewer && (
        <ImageViewer
          imagePath={selectedImagePath}
          onClose={() => {
            setShowImageViewer(false);
            setSelectedImagePath("");
          }}
        />
      )}
    </div>
  );
};

export default BillRecord;
