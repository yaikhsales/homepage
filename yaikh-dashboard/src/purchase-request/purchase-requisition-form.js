import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  X,
  Calendar,
  Upload,
  MessageCircle,
  Video,
  FileText,
} from "lucide-react";
import GeneralAIAgent from "../general-ag";
import { useTranslation } from "../translate/TranslationContext";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";

const PurchaseRequisitionForm = ({ onBack }) => {
  const navigate = useNavigate();
  const { t, translateModuleTitle } = useTranslation();
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [formData, setFormData] = useState({
    requestBy: "Khun",
    department: "CSR",
    expectDeliveryDate: "",
    reference: "YM-CSR-213",
    purchaseType: "Local Purchase",
    topic: "New Purchase",
    paymentType: "Pre-Paid",
    purchaseBy: "Buy By Myself",
    products: [
      {
        productName: "",
        productDetails: "",
        brand: "",
        qty: "",
        uom: "PCS",
        supplier: "",
        unitPrice: "",
        unitType: "USD",
        totalAmount: "",
        remark: "",
      },
    ],
    productPicture: null,
    finalPaymentInvoice: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...formData.products];
    newProducts[index][field] = value;

    // Calculate total amount if qty, unitPrice, or unitType changes
    if (field === "qty" || field === "unitPrice" || field === "unitType") {
      const qty = parseFloat(newProducts[index].qty) || 0;
      const price = parseFloat(newProducts[index].unitPrice) || 0;
      newProducts[index].totalAmount = (qty * price).toFixed(2);
    }

    setFormData((prev) => ({
      ...prev,
      products: newProducts,
    }));
  };

  const addProductRow = () => {
    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          productName: "",
          productDetails: "",
          brand: "",
          qty: "",
          uom: "PCS",
          supplier: "",
          unitPrice: "",
          unitType: "USD",
          totalAmount: "",
          remark: "",
        },
      ],
    }));
  };

  const removeProductRow = (index) => {
    if (formData.products.length > 1) {
      setFormData((prev) => ({
        ...prev,
        products: prev.products.filter((_, i) => i !== index),
      }));
    }
  };

  const handleFileUpload = (field, file) => {
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [field]: file,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const hasEmptyRequiredFields = formData.products.some(
      (product) =>
        !product.productName ||
        !product.qty ||
        !product.uom ||
        !product.unitPrice ||
        !product.unitType,
    );

    if (hasEmptyRequiredFields) {
      alert("Please fill in all required fields (marked with *)");
      return;
    }

    if (!formData.productPicture) {
      alert("Please upload a picture of the product");
      return;
    }

    // Handle form submission here
    console.log("Form submitted:", formData);
    alert("Purchase Requisition Form submitted successfully!");

    // Optionally navigate back or to purchase list
    // navigate('/dashboard/show-list-request');
  };

  return (
    <div className="fixed inset-0 bg-gray-100 overflow-y-auto">
      <div className="w-full h-full">
        {/* Header */}
        <div className="bg-white shadow-md p-4 md:p-6 sticky top-0 z-10">
          <div className="absolute top-4 right-4 hidden sm:flex items-center gap-2">
            <button
              onClick={() =>
                setSelectedVideo("/assets/short-video-training/new-updated-vd/Purchase.mp4")
              }
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
              title="Video Training"
            >
              <Video size={20} className="text-blue-600" />
            </button>
            <button
              onClick={() =>
                setSelectedDocument("/assets/purchase/view-pdf.pdf")
              }
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
              title="Report Training"
            >
              <FileText size={20} className="text-blue-600" />
            </button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-32"></div> {/* Left spacer */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={onBack || (() => navigate(-1))}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <ArrowLeft size={18} />
                  <span>{t("back")}</span>
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
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                {t("purchaseRequest")}
              </h2>
            </div>
            <button
              onClick={() => navigate("/dashboard/show-list-request")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {t("purchaseList")}
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              TexLink Technologies
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
              {t("purchaseRequisitionForm")}
            </h2>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-4 md:p-6 lg:p-8">
          {/* Request Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("requestBy")}:
                </label>
                <input
                  type="text"
                  name="requestBy"
                  value={formData.requestBy}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("department")}:
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="CSR">CSR</option>
                  <option value="HR">HR</option>
                  <option value="Admin">Admin</option>
                  <option value="IT">IT</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("expectDeliveryDate")}:
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="expectDeliveryDate"
                    value={formData.expectDeliveryDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Calendar
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>
              </div>
            </div>

            {/* Middle Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("reference")}:
                </label>
                <input
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("purchaseType")}:
                </label>
                <select
                  name="purchaseType"
                  value={formData.purchaseType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Local Purchase">{t("localPurchase")}</option>
                  <option value="Import Purchase">{t("importPurchase")}</option>
                  <option value="Both">{t("both")}</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("topic")}:
                </label>
                <select
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="New Purchase">{t("newPurchase")}</option>
                  <option value="Replacement">{t("replacement")}</option>
                  <option value="Repair">{t("repair")}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("paymentType")}:
                </label>
                <select
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Pre-Paid">{t("prePaid")}</option>
                  <option value="Post-Paid">{t("postPaid")}</option>
                  <option value="COD">COD</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Details Table */}
          <div className="mb-6 md:mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t("productDetails")}
            </h3>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                        {t("productName")}
                        <span className="text-red-500">*</span>
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                        {t("productDetails")}, etc.
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                        {t("brand")}
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                        {t("qty")}
                        <span className="text-red-500">*</span>
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                        {t("uom")}
                        <span className="text-red-500">*</span>
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                        {t("supplier")}
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                        {t("unitPrice")}
                        <span className="text-red-500">*</span>
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                        {t("unit")} {t("type")}
                        <span className="text-red-500">*</span>
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                        {t("total")}
                        <span className="text-red-500">*</span>
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                        {t("remarks")}
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700">
                        {t("actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.products.map((product, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-2 py-1">
                          <input
                            type="text"
                            value={product.productName}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                "productName",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          <input
                            type="text"
                            value={product.productDetails}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                "productDetails",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          <input
                            type="text"
                            value={product.brand}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                "brand",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          <input
                            type="number"
                            value={product.qty}
                            onChange={(e) =>
                              handleProductChange(index, "qty", e.target.value)
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          <select
                            value={product.uom}
                            onChange={(e) =>
                              handleProductChange(index, "uom", e.target.value)
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="PCS">PCS</option>
                            <option value="BOX">BOX</option>
                            <option value="SET">SET</option>
                            <option value="KG">KG</option>
                          </select>
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          <input
                            type="text"
                            value={product.supplier}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                "supplier",
                                e.target.value,
                              )
                            }
                            placeholder="Type supplier name..."
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          <input
                            type="number"
                            step="0.01"
                            value={product.unitPrice}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                "unitPrice",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          <select
                            value={product.unitType}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                "unitType",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="USD">USD</option>
                            <option value="KHR">KHR</option>
                            <option value="RMB">RMB</option>
                          </select>
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          <input
                            type="text"
                            value={product.totalAmount}
                            readOnly
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          <input
                            type="text"
                            value={product.remark}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                "remark",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-center">
                          {formData.products.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeProductRow(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <button
              type="button"
              onClick={addProductRow}
              className="mt-3 w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* File Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Picture of Product<span className="text-red-500">*</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  formData.productPicture
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-blue-500"
                }`}
              >
                <input
                  type="file"
                  id="productPicture"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileUpload("productPicture", e.target.files[0])
                  }
                  className="hidden"
                />
                <label
                  htmlFor="productPicture"
                  className="cursor-pointer block"
                >
                  <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm text-gray-600">
                    {formData.productPicture
                      ? `Selected: ${formData.productPicture.name}`
                      : "Picture of Product/Estimate Price"}
                  </p>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Final Payment Invoice
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  formData.finalPaymentInvoice
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-blue-500"
                }`}
              >
                <input
                  type="file"
                  id="finalPaymentInvoice"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    handleFileUpload("finalPaymentInvoice", e.target.files[0])
                  }
                  className="hidden"
                />
                <label
                  htmlFor="finalPaymentInvoice"
                  className="cursor-pointer block"
                >
                  <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm text-gray-600">
                    {formData.finalPaymentInvoice
                      ? `Selected: ${formData.finalPaymentInvoice.name}`
                      : "Payment invoice after buy goods"}
                  </p>
                </label>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <button
              type="button"
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              Add Support Quotation
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                {t("purchaseBy")}:
              </span>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="purchaseBy"
                  value="Buy By Myself"
                  checked={formData.purchaseBy === "Buy By Myself"}
                  onChange={handleInputChange}
                  className="text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  {t("buyByMyself")}
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="purchaseBy"
                  value="Buy By Purchaser"
                  checked={formData.purchaseBy === "Buy By Purchaser"}
                  onChange={handleInputChange}
                  className="text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  {t("buyByCompany")}
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              {t("submit")}
            </button>
          </div>
        </form>
      </div>

      {/* Bot Button - Bottom Right */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Ask Purchase Requisition Form bot"
        title="Ask Purchase Requisition Form bot"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Bot Modal */}
      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Purchase Requisition Form"
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
    </div>
  );
};

export default PurchaseRequisitionForm;
