import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, Video, FileText } from "lucide-react";
import GeneralAIAgent from "../general-ag";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";
import { useTranslation } from "../translate/TranslationContext";

// Mapping function to match module titles to sub-icon image filenames
const getYHRIconImage = (title) => {
  const titleToImageMap = {
    Recruitment: "recruitment.png",
    Interview: "arrange-interview.jpg",
    Onboarding: "onboarding.png",
    Attendant: "attendant.png",
    "Benefit Profile": "benefit-profile.png",
    Payroll: "payroll.png",
    NSSF: "NSSF.webp",
    "Visa and Work Permit": "visa-work-permit.png",
    FWCMS: "FWCMS.png",
    Canteen: "food-canteen.png",
  };

  return titleToImageMap[title] || null;
};

const YHR = ({ onBack }) => {
  const navigate = useNavigate();
  const { t, translateModuleTitle } = useTranslation();
  const [showAttendantSubMenu, setShowAttendantSubMenu] = useState(false);
  const [showFWCMSSubMenu, setShowFWCMSSubMenu] = useState(false);
  const [showBenefitSubMenu, setShowBenefitSubMenu] = useState(false);
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleBack = () => {
    if (showAttendantSubMenu) {
      setShowAttendantSubMenu(false);
    } else if (showFWCMSSubMenu) {
      setShowFWCMSSubMenu(false);
    } else if (showBenefitSubMenu) {
      setShowBenefitSubMenu(false);
    } else if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleAttendantClick = () => {
    setShowAttendantSubMenu(true);
  };

  const handleAttendantSubModule = (module) => {
    if (module === "Checklist Attendant") {
      navigate("/dashboard/checklist-attendance");
    } else if (module === "My Attendant") {
      navigate("/dashboard/my-attendance");
    }
  };

  const handleFWCMSClick = () => {
    setShowFWCMSSubMenu(true);
  };

  const handleFWCMSSubModule = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const yhrModules = [
    {
      title: "Recruitment",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      shadow: "shadow-blue-200",
      hasWhiteBg: true,
    },
    {
      title: "Interview",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      shadow: "shadow-green-200",
      hasWhiteBg: true,
    },
    {
      title: "Onboarding",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      shadow: "shadow-purple-200",
    },
    {
      title: "Benefit Profile",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      shadow: "shadow-indigo-200",
      hasSubMenu: true,
    },
    {
      title: "Payroll",
      color: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      shadow: "shadow-yellow-200",
    },
    {
      title: "FWCMS",
      color: "bg-gradient-to-br from-pink-500 to-pink-600",
      shadow: "shadow-pink-200",
      hasSubMenu: true,
      hasWhiteBg: true,
    },
    {
      title: "Visa and Work Permit",
      color: "bg-gradient-to-br from-red-500 to-red-600",
      shadow: "shadow-red-200",
    },
    {
      title: "NSSF",
      color: "bg-gradient-to-br from-teal-500 to-teal-600",
      shadow: "shadow-teal-200",
      hasWhiteBg: true,
    },
  ];

  const salaryBillModules = [
    {
      title: "Attendant",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      shadow: "shadow-orange-200",
      hasSubMenu: true,
    },
    {
      title: "Monthly Salary",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      shadow: "shadow-blue-200",
    },
    {
      title: "Incentive",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      shadow: "shadow-green-200",
    },
    {
      title: "Permit Fee",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      shadow: "shadow-purple-200",
    },
    {
      title: "Resign Payment",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      shadow: "shadow-orange-200",
    },
  ];

  const getSalaryBillIconImage = (title) => {
    const titleToImageMap = {
      Attendant: "attendant.png",
      "Monthly Salary": "monthly-salary.png",
      Incentive: "weekly-incentive.png",
      "Permit Fee": "permit-fee.png",
      "Resign Payment": "resign-payment.png",
    };
    return titleToImageMap[title] || null;
  };

  const handleSalaryBillClick = (module) => {
    if (module.hasSubMenu && module.title === "Attendant") {
      handleAttendantClick();
      return;
    }

    const routeMap = {
      "Monthly Salary": "/dashboard/monthly-salary",
      Incentive: "/dashboard/weekly-incentive",
      "Permit Fee": "/dashboard/permit-fee",
      "Resign Payment": "/dashboard/resign-payment",
    };
    const route = routeMap[module.title];
    if (route) {
      navigate(route);
    } else {
      console.log(`${module.title} clicked - no route defined`);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 flex flex-col overflow-hidden z-[100]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-[101]">
        <div className="px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0 relative">
          {/* Left: Empty space for balance */}
          <div className="flex-1"></div>

          {/* Center: Back Button, Title, and Home Button */}
          <div className="flex items-center gap-3 sm:gap-4 justify-center flex-1">
            <button
              onClick={handleBack}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
              aria-label="Back"
            >
              <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
              <span className="font-medium hidden sm:inline">{t("back")}</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 px-2 sm:px-4">
              {t("yhr")}
            </h1>
            <button
              onClick={() => navigate("/")}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-gray-300 hover:border-gray-400 transition-all hover:scale-110 cursor-pointer flex-shrink-0"
              title="Home"
            >
              <img
                src="/logo.jpg"
                alt="Home"
                className="w-full h-full object-cover"
              />
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex-1 flex justify-end gap-3 px-4">
            <button
              onClick={() =>
                setSelectedVideo(
                  "/assets/short-video-training/new-updated-vd/YHR.mp4",
                )
              }
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300 bg-white"
              title="Video Training"
            >
              <Video size={18} className="text-blue-600" />
            </button>
            <button
              onClick={() =>
                setSelectedDocument("/assets/report-training/yhr-report.xlsx")
              }
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300 bg-white"
              title="Report Training"
            >
              <FileText size={18} className="text-blue-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gradient-to-b from-gray-50 to-gray-100">
        {!showAttendantSubMenu && !showFWCMSSubMenu && !showBenefitSubMenu ? (
          <div className="max-w-7xl mx-auto">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 relative">
              {/* Left Column - YHR Modules */}
              <div className="flex flex-col pr-0 lg:pr-12 pb-8 lg:pb-0">
                <h2 className="text-2xl font-bold text-black mb-6">
                  {t("yhr")}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 auto-rows-fr">
                  {yhrModules.map((module, idx) => {
                    const iconImage = getYHRIconImage(module.title);
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (module.hasSubMenu) {
                            if (module.title === "Attendant") {
                              handleAttendantClick();
                            } else if (module.title === "FWCMS") {
                              handleFWCMSClick();
                            } else if (module.title === "Benefit Profile") {
                              setShowBenefitSubMenu(true);
                            }
                          } else {
                            // Navigate to respective module pages
                            const routeMap = {
                              Recruitment: "/dashboard/recruitment",
                              Interview: "/dashboard/interview",
                              Onboarding: "/dashboard/onboarding",
                              "Benefit Profile": "/dashboard/benefit-profile",
                              Payroll: "/dashboard/payroll",
                              "Visa and Work Permit":
                                "/dashboard/visa-work-permit",
                              Canteen: "/dashboard/canteen",
                            };

                            if (module.title === "NSSF") {
                              window.open(
                                "https://enterprise.nssf.gov.kh/auth/login",
                                "_blank",
                                "noopener,noreferrer",
                              );
                              return;
                            }

                            const route = routeMap[module.title];
                            if (route) {
                              navigate(route);
                            } else {
                              console.log(
                                `${module.title} clicked - no route defined`,
                              );
                            }
                          }
                        }}
                        className={`
                          ${module.color} 
                          text-white 
                          p-6 
                          rounded-xl 
                          shadow-lg 
                          ${module.shadow}
                          hover:shadow-2xl 
                          transition-all 
                          duration-300
                          hover:scale-105 
                          active:scale-95
                          flex 
                          flex-col 
                          items-center 
                          justify-center 
                          gap-4
                          h-[180px]
                          w-full
                          relative
                          overflow-hidden
                          group
                        `}
                      >
                        {/* Subtle overlay for depth */}
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Icon Container */}
                        <div
                          className={`relative z-10 flex items-center justify-center w-20 h-20 mb-2 ${module.hasWhiteBg ? "bg-white rounded-lg p-2 shadow-lg" : ""}`}
                        >
                          {iconImage ? (
                            <img
                              src={`/assets/icons/sub-icons/${iconImage}`}
                              alt={module.title}
                              className={`w-full h-full object-contain ${module.hasWhiteBg ? "" : "drop-shadow-2xl"}`}
                            />
                          ) : (
                            <div className="w-full h-full bg-white/20 rounded-lg flex items-center justify-center">
                              <div className="w-12 h-12 bg-white/30 rounded"></div>
                            </div>
                          )}
                        </div>

                        {/* Text Label */}
                        <span className="relative z-10 font-bold text-sm text-center leading-tight drop-shadow-md">
                          {translateModuleTitle(module.title)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-black transform -translate-x-1/2"></div>

              {/* Right Column - Salary Bill Modules */}
              <div className="flex flex-col pl-0 lg:pl-12">
                <h2 className="text-2xl font-bold text-black mb-6">
                  {t("salaryBill")}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 auto-rows-fr">
                  {salaryBillModules.map((module, idx) => {
                    const iconImage = getSalaryBillIconImage(module.title);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSalaryBillClick(module)}
                        className={`
                          ${module.color} 
                          text-white 
                          p-6 
                          rounded-xl 
                          shadow-lg 
                          ${module.shadow}
                          hover:shadow-2xl 
                          transition-all 
                          duration-300
                          hover:scale-105 
                          active:scale-95
                          flex 
                          flex-col 
                          items-center 
                          justify-center 
                          gap-4
                          h-[180px]
                          w-full
                          relative
                          overflow-hidden
                          group
                        `}
                      >
                        {/* Subtle overlay for depth */}
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Icon Container */}
                        <div className="relative z-10 flex items-center justify-center w-20 h-20 mb-2">
                          {iconImage ? (
                            <img
                              src={`/assets/icons/sub-icons/${iconImage}`}
                              alt={module.title}
                              className="w-full h-full object-contain drop-shadow-2xl"
                            />
                          ) : (
                            <div className="w-full h-full bg-white/20 rounded-lg flex items-center justify-center">
                              <div className="w-12 h-12 bg-white/30 rounded"></div>
                            </div>
                          )}
                        </div>

                        {/* Text Label */}
                        <span className="relative z-10 font-bold text-sm text-center leading-tight drop-shadow-md">
                          {translateModuleTitle(module.title)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : showAttendantSubMenu ? (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setShowAttendantSubMenu(false)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
              >
                <ArrowLeft size={20} />
                <span>{t("back")} </span>
              </button>
              <h2 className="text-xl font-bold text-gray-800">
                {t("attendant")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => handleAttendantSubModule("Checklist Attendant")}
                className="bg-gradient-to-br from-sky-400 to-sky-500 text-white p-10 rounded-xl shadow-lg shadow-sky-200 hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-5 min-h-[200px] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                  <img
                    src="/assets/icons/sub-icons/checklist-attendant.jpg"
                    alt="Checklist Attendant"
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
                <span className="relative z-10 font-bold text-lg sm:text-xl drop-shadow-md">
                  {translateModuleTitle("Checklist Attendant")}
                </span>
              </button>
              <button
                onClick={() => handleAttendantSubModule("My Attendant")}
                className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-10 rounded-xl shadow-lg shadow-teal-200 hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-5 min-h-[200px] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                  <img
                    src="/assets/icons/sub-icons/my-attendant.jpg"
                    alt={translateModuleTitle("My Attendant")}
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
                <span className="relative z-10 font-bold text-lg sm:text-xl drop-shadow-md">
                  {translateModuleTitle("My Attendant")}
                </span>
              </button>
            </div>
          </div>
        ) : showFWCMSSubMenu ? (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setShowFWCMSSubMenu(false)}
                className="flex items-center gap-2 text-black-600 hover:text-gray-800 mb-4"
              >
                <ArrowLeft size={20} />
                <span>{t("back")} </span>
              </button>
              <h2 className="text-xl font-bold text-gray-800">{t("fwcms")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => handleFWCMSSubModule("https://fwcms.cppkr.com/")}
                className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-10 rounded-xl shadow-lg shadow-pink-200 hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-5 min-h-[200px] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 flex items-center justify-center bg-white rounded-xl p-4 sm:p-5 shadow-xl">
                  <img
                    src="/assets/icons/sub-icons/FWCMS.png"
                    alt="FWCMS Portal"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="relative z-10 font-bold text-lg sm:text-xl drop-shadow-md">
                  FWCMS Portal
                </span>
              </button>
              <button
                onClick={() => handleFWCMSSubModule("https://www.mlvt.gov.kh/")}
                className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-10 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-5 min-h-[200px] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 flex items-center justify-center bg-white rounded-xl p-4 sm:p-5 shadow-xl">
                  <img
                    src="/assets/icons/sub-icons/FWCMS.png"
                    alt="Ministry of Labour"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="relative z-10 font-bold text-lg sm:text-xl drop-shadow-md">
                  MLVT
                </span>
              </button>
            </div>
          </div>
        ) : showBenefitSubMenu ? (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setShowBenefitSubMenu(false)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 font-bold"
              >
                <ArrowLeft size={20} />
                <span>{t("back")} </span>
              </button>
              <h2 className="text-xl font-bold text-gray-800">
                {t("benefit_profile")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => navigate("/dashboard/benefit-profile")}
                className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-10 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-5 min-h-[200px] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-white rounded-xl p-3 shadow-lg">
                  <img
                    src="/assets/icons/sub-icons/benefit-profile.png"
                    alt="Benefit Profile"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="relative z-10 font-bold text-lg sm:text-xl drop-shadow-md text-center">
                  Benefit
                </span>
              </button>
              <button
                onClick={() => navigate("/dashboard/canteen")}
                className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white p-10 rounded-xl shadow-lg shadow-cyan-200 hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-5 min-h-[200px] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-white rounded-xl p-3 shadow-lg">
                  <img
                    src="/assets/icons/sub-icons/food-canteen.png"
                    alt="Canteen"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="relative z-10 font-bold text-lg sm:text-xl drop-shadow-md">
                  Canteen
                </span>
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Bot Button - Bottom Right */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Ask YHR bot"
        title="Ask YHR bot"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Bot Modal */}
      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="YHR"
        />
      )}
      {selectedVideo && (
        <VideoViewer
          videoPath={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
      {selectedDocument && (
        <DocumentViewer
          documentUrl={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
};

export default YHR;
