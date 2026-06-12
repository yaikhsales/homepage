import React, { useState, useEffect } from "react";
import {
  X,
  Upload,
  ChevronDown,
  MessageCircle,
  Video,
  FileText,
} from "lucide-react";
import GeneralAIAgent from "../general-ag";
import { useTranslation } from "../translate/TranslationContext";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";

const SupportTicketForm = ({ onClose, onSubmit, initialData = null }) => {
  const { t } = useTranslation();
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [formData, setFormData] = useState({
    type: initialData?.type || "GA - Main",
    subject: initialData?.subject || "",
    nature: initialData?.nature || "6S, H&S",
    keyword: initialData?.keyword || false,
    details: initialData?.details || "",
    image: initialData?.image || null,
  });

  const [imagePreview, setImagePreview] = useState(
    initialData?.imagePreview || null,
  );

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || "GA - Main",
        subject: initialData.subject || "",
        nature: initialData.nature || "6S, H&S",
        keyword: initialData.keyword || false,
        details: initialData.details || "",
        image: initialData.image || null,
      });
      setImagePreview(initialData.imagePreview || null);
    } else {
      // Reset to default values for new form
      setFormData({
        type: "GA - Main",
        subject: "",
        nature: "6S, H&S",
        keyword: false,
        details: "",
        image: null,
      });
      setImagePreview(null);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      if (
        !["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
          file.type,
        )
      ) {
        alert("Image should be in JPG, PNG, or GIF format");
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    if (onSubmit) onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-white z-[300] flex flex-col animate-in fade-in duration-300">
      <div className="bg-white w-full h-full overflow-auto flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-white flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-800">
            {t("supportTicket")}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setSelectedVideo(
                  "/assets/short-video-training/new-updated-vd/Support-Ticket.mp4",
                )
              }
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
              title="Video Training"
            >
              <Video size={20} className="text-blue-600" />
            </button>
            <button
              onClick={() =>
                setSelectedDocument("/assets/report-training/form.pdf")
              }
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
              title="Report Training"
            >
              <FileText size={20} className="text-blue-600" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 rounded-full transition-colors ml-4"
              aria-label={t("close")}
            >
              <X size={20} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 flex-1 overflow-y-auto max-w-7xl mx-auto w-full">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Row: Type and Subject */}
            <div className="grid grid-cols-2 gap-4">
              {/* Type Dropdown */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  {t("type")}
                </label>
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer"
                  >
                    <option value="GA - Main">GA - Main</option>
                    <option value="IT Support">IT Support</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="HR Request">HR Request</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Subject Input */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  {t("subject")}
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder={t("type")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Second Row: Nature and Keyword */}
            <div className="grid grid-cols-2 gap-4">
              {/* Nature Dropdown */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  {t("nature")}
                </label>
                <div className="relative">
                  <select
                    name="nature"
                    value={formData.nature}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer"
                  >
                    <option value="6S, H&S">6S, H&S</option>
                    <option value="Safety">Safety</option>
                    <option value="Quality">Quality</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Keyword Toggle */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  {t("keyword")}
                </label>
                <div className="flex items-center h-[48px]">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="keyword"
                      checked={formData.keyword}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Details Textarea */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                {t("details")}
              </label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                rows="6"
                placeholder={t("writeYourThoughts")}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                {t("image")}
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview(null);
                        setFormData((prev) => ({ ...prev, image: null }));
                        document.getElementById("image-upload").value = "";
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={32} className="text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {t("uploadImage")}
                    </p>
                    <p className="text-xs text-gray-500 text-center px-4">
                      {t("imageSizeWarning")} <strong>5mb</strong>{" "}
                      {t("imageFormatWarning")}{" "}
                      <strong>JPG, PNG, {t("or")} GIF</strong> {t("format")}.
                    </p>
                  </>
                )}
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                {t("submit")}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bot Button - Bottom Right */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Ask Support Ticket Form bot"
        title="Ask Support Ticket Form bot"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Bot Modal */}
      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Support Ticket Form"
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

export default SupportTicketForm;
