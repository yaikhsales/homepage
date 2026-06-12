import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  MessageCircle,
  FileText,
  Send,
} from "lucide-react";
import GeneralAIAgent from "../general-ag";
import { useTranslation } from "../translate/TranslationContext";

const RequestWorkerForm = ({ onBack }) => {
  const navigate = useNavigate();
  const { t, translateModuleTitle } = useTranslation();
  const [isBotOpen, setIsBotOpen] = useState(false);

  const [formData, setFormData] = useState({
    requestor: "Testuser",
    department: "",
    gender: "",
    shift: "",
    workerType: "",
    hourlyRate: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [errors, setErrors] = useState({});

  const departments = [
    "Admin",
    "HR",
    "Production",
    "Quality Assurance",
    "Cutting",
    "Sewing",
    "Pressing",
    "Packaging",
  ];

  const genders = ["Male", "Female", "Other"];

  const shifts = [
    "Morning Shift",
    "Afternoon Shift",
    "Night Shift",
    "Full Day",
  ];

  const workerTypes = ["Full-time", "Part-time", "Contract", "Temporary"];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.department) newErrors.department = t("departmentRequired");
    if (!formData.gender) newErrors.gender = t("genderRequired");
    if (!formData.shift) newErrors.shift = t("shiftRequired");
    if (!formData.workerType) newErrors.workerType = t("workerTypeRequired");
    if (!formData.startDate) newErrors.startDate = t("startDateRequired");
    if (!formData.endDate) newErrors.endDate = t("endDateRequired");
    if (!formData.reason) newErrors.reason = t("reasonRequired");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Handle form submission
    console.log("Form submitted:", formData);
    // You can add API call here
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
            {t("temporaryWorkerRequest")}
          </h1>
        </div>
        <div className="w-32"></div> {/* Right spacer */}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* Table-Style Form Container */}
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-8 duration-700">
            {/* Form Header */}
            <div className="bg-slate-900 px-8 py-6 text-white flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {t("temporaryWorkerRequest")}
                </h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                  Personnel Requisition Form
                </p>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <FileText size={24} className="text-blue-400" />
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 divide-y divide-slate-100">
                {/* Row: Requestor */}
                <div className="grid grid-cols-3 min-h-[64px]">
                  <div className="bg-slate-50/50 p-6 flex items-center border-r border-slate-100">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {t("requestor")}
                    </label>
                  </div>
                  <div className="col-span-2 p-4 flex items-center">
                    <input
                      type="text"
                      name="requestor"
                      value={formData.requestor}
                      onChange={handleChange}
                      className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none focus:ring-0 placeholder:text-slate-300"
                      required
                    />
                  </div>
                </div>

                {/* Row: Department */}
                <div className="grid grid-cols-3 min-h-[64px]">
                  <div className="bg-slate-50/50 p-6 flex items-center border-r border-slate-100">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {t("department")}
                    </label>
                  </div>
                  <div className="col-span-2 p-4 flex items-center relative">
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none focus:ring-0 appearance-none cursor-pointer"
                      required
                    >
                      <option value="">{t("selectDepartment")}</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {translateModuleTitle(dept)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-6 text-slate-300 pointer-events-none"
                      size={16}
                    />
                  </div>
                </div>

                {/* Row: Gender */}
                <div className="grid grid-cols-3 min-h-[64px]">
                  <div className="bg-slate-50/50 p-6 flex items-center border-r border-slate-100">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {t("genderOfWorker")}
                    </label>
                  </div>
                  <div className="col-span-2 p-4 flex items-center relative">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none focus:ring-0 appearance-none cursor-pointer"
                      required
                    >
                      <option value="">{t("selectGender")}</option>
                      {genders.map((gender) => (
                        <option key={gender} value={gender}>
                          {t(gender.toLowerCase())}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-6 text-slate-300 pointer-events-none"
                      size={16}
                    />
                  </div>
                </div>

                {/* Row: Shift & Worker Type */}
                <div className="grid grid-cols-3 divide-x divide-slate-100">
                  <div className="grid grid-cols-1 divide-y divide-slate-100 border-r border-slate-100">
                    <div className="bg-slate-50/50 p-6 flex items-center h-full">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        Work Config
                      </label>
                    </div>
                  </div>
                  <div className="col-span-2 grid grid-cols-2 divide-x divide-slate-100">
                    <div className="p-4 flex flex-col gap-2">
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
                        {t("shift")}
                      </span>
                      <select
                        name="shift"
                        value={formData.shift}
                        onChange={handleChange}
                        className="w-full bg-transparent border-none text-xs font-bold text-slate-700 outline-none focus:ring-0 appearance-none cursor-pointer"
                      >
                        {shifts.map((shift) => (
                          <option key={shift} value={shift}>
                            {t(shift.toLowerCase().replace(/\s+/g, ""))}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
                        {t("workerType")}
                      </span>
                      <select
                        name="workerType"
                        value={formData.workerType}
                        onChange={handleChange}
                        className="w-full bg-transparent border-none text-xs font-bold text-slate-700 outline-none focus:ring-0 appearance-none cursor-pointer"
                      >
                        {workerTypes.map((type) => (
                          <option key={type} value={type}>
                            {t(type.toLowerCase().replace(/-/g, ""))}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Row: Dates */}
                <div className="grid grid-cols-3 min-h-[64px]">
                  <div className="bg-slate-50/50 p-6 flex items-center border-r border-slate-100">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      Request Period
                    </label>
                  </div>
                  <div className="col-span-2 grid grid-cols-2 divide-x divide-slate-100">
                    <div className="p-4 flex items-center gap-3">
                      <Calendar size={14} className="text-slate-300" />
                      <input
                        type="date"
                        name="startDate"
                        onChange={handleChange}
                        className="bg-transparent border-none text-xs font-bold text-slate-700 outline-none focus:ring-0"
                      />
                    </div>
                    <div className="p-4 flex items-center gap-3">
                      <ArrowLeft
                        size={14}
                        className="text-slate-300 rotate-180"
                      />
                      <input
                        type="date"
                        name="endDate"
                        onChange={handleChange}
                        className="bg-transparent border-none text-xs font-bold text-slate-700 outline-none focus:ring-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Row: Reason */}
                <div className="grid grid-cols-1">
                  <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-100">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {t("reason")} / Justification
                    </label>
                  </div>
                  <div className="p-6">
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm font-medium text-slate-600 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all resize-none"
                      placeholder={t("enterReason")}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Form Footer */}
              <div className="bg-slate-50 p-8 flex items-center justify-between border-t border-slate-100">
                <div className="flex items-center gap-4 text-slate-400">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white"></div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Requires 2 Approvals
                  </span>
                </div>
                <button
                  type="submit"
                  className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 transition-all flex items-center gap-3 active:scale-95 shadow-xl shadow-blue-100"
                >
                  <Send size={16} />
                  {t("submitRequest")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bot Button - Bottom Right */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Ask Request Worker Form bot"
        title="Ask Request Worker Form bot"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Bot Modal */}
      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Request Worker Form"
        />
      )}
    </div>
  );
};

export default RequestWorkerForm;
