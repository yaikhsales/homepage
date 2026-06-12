import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import GeneralAIAgent from "../general-ag";
import { useTranslation } from "../translate/TranslationContext";

// Mapping function to match module titles to sub-icon image filenames
const getYTMIconImage = (title) => {
  const titleToImageMap = {
    "System Setup": "system-setup.png",
    "Machine Location": "machine-location.png",
    "Setup and Repair": "setup-repair.png",
    "Routine Maintenance": "routine-maintenance.png",
    Data: "data.png",
    "Machine Layout": "TV.png",
    Transfers: "transfer.png",
    // Download: "download.png",
    Analysis: "analysis.png",
    Report: "report.png",
  };

  return titleToImageMap[title] || null;
};

const YTM = ({ onBack }) => {
  const navigate = useNavigate();
  const { t, translateModuleTitle } = useTranslation();
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBotOpen, setIsBotOpen] = useState(false);

  const reportImages = ["/assets/ytm/report1.jpg", "/assets/ytm/report2.jpg"];
  const systemSetupImages = [
    "/assets/ytm/system-setup1.jpg",
    "/assets/ytm/system-setup.jpg",
  ];

  const handleBack = () => {
    if (selectedImage) {
      setSelectedImage(null);
    } else if (selectedModule) {
      setSelectedModule(null);
    } else if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const getYTMDashboardImage = (title) => {
    const map = {
      "System Setup": "system-setup.jpg",
      "Setup and Repair": "setup-and-repair.png",
      "Routine Maintenance": "routine-maintenance.jpg",
      "Machine Layout": "TV.png",
      Transfers: "transfer.png",
      // Download: "download.jpg",
      Analysis: "analysis.jpg",
      Report: "report1.jpg",
    };
    return map[title] || null;
  };

  const handleSubModuleClick = (module) => {
    if (module.subModules && module.subModules.length > 0) {
      setSelectedModule(module);
    } else {
      const imageName = getYTMDashboardImage(module.title);
      if (imageName) {
        setSelectedImage(`/assets/ytm/${imageName}`);
        setCurrentTitle(module.title);
        setCurrentImageIndex(0);
      } else {
        console.log("No dashboard image found for:", module.title);
      }
    }
  };

  const handleNestedSubModuleClick = (nestedModule) => {
    const imageName = getYTMDashboardImage(nestedModule.title);
    if (imageName) {
      setSelectedImage(`/assets/ytm/${imageName}`);
      setCurrentTitle(nestedModule.title);
      setCurrentImageIndex(0);
    } else {
      console.log("No dashboard image found for:", nestedModule.title);
    }
  };

  const ytmModules = [
    {
      title: "System Setup",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      shadow: "shadow-orange-200",
    },
    {
      title: "Machine Location",
      hasSubModules: true,
      subModules: [{ title: "Machine Layout" }, { title: "Transfers" }],
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      shadow: "shadow-blue-200",
    },
    {
      title: "Setup and Repair",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      shadow: "shadow-green-200",
    },
    {
      title: "Routine Maintenance",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      shadow: "shadow-purple-200",
    },
    {
      title: "Data",
      hasSubModules: true,
      subModules: [
        { title: "Analysis" },
        { title: "Report" },
        // { title: "Download" },
      ],
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      shadow: "shadow-indigo-200",
    },
  ];

  // --- Full Screen Image Viewer View ---
  if (selectedImage) {
    const isMultiImage = ["Report", "System Setup"].includes(currentTitle);
    const multiImages =
      currentTitle === "Report" ? reportImages : systemSetupImages;

    return (
      <div className="fixed inset-0 bg-black flex flex-col overflow-hidden z-[150]">
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4 flex items-center justify-between sticky top-0 z-[151]">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors font-bold"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">{t("back")}</span>
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-black text-white uppercase tracking-tight">
              {currentTitle === "Routine Maintenance"
                ? "Routine Maintenance Dashboard"
                : currentTitle}
            </h1>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 hover:border-white/50 transition-all hover:scale-110 cursor-pointer"
          >
            <img
              src="/logo.jpg"
              alt="Home"
              className="w-full h-full object-cover"
            />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex items-center justify-center p-4 bg-slate-900 relative">
          {isMultiImage && (
            <>
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) => (prev === 0 ? 1 : 0))
                }
                className="absolute left-10 z-[160] p-4 rounded-full bg-slate-900/90 hover:bg-black shadow-2xl text-white transition-all hover:scale-110 active:scale-95 border border-white/20"
                title="Previous"
              >
                <ArrowLeft size={24} />
              </button>

              <button
                onClick={() =>
                  setCurrentImageIndex((prev) => (prev === 0 ? 1 : 0))
                }
                className="absolute right-10 z-[160] p-4 rounded-full bg-slate-900/90 hover:bg-black shadow-2xl text-white transition-all hover:scale-110 active:scale-95 rotate-180 border border-white/20"
                title="Next"
              >
                <ArrowLeft size={24} />
              </button>

              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-[160]">
                {multiImages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? "w-8 bg-orange-500" : "w-2 bg-white/20"}`}
                  />
                ))}
              </div>
            </>
          )}

          <img
            src={isMultiImage ? multiImages[currentImageIndex] : selectedImage}
            alt="Dashboard View"
            className="max-w-full max-h-full object-contain shadow-2xl rounded-lg transition-all duration-500"
            key={
              isMultiImage
                ? `${currentTitle}-${currentImageIndex}`
                : selectedImage
            }
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070";
            }}
          />
        </div>

        <button
          onClick={() => setIsBotOpen(true)}
          className="fixed bottom-6 right-6 z-[160] w-14 h-14 bg-gradient-to-tr from-orange-500 to-amber-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all"
        >
          <MessageCircle size={24} />
        </button>

        {isBotOpen && (
          <GeneralAIAgent
            onClose={() => setIsBotOpen(false)}
            moduleContext={`${currentTitle} Dashboard View`}
          />
        )}
      </div>
    );
  }

  // --- Category Menu View ---
  if (selectedModule) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex flex-col overflow-hidden z-[100]">
        <div className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-[101]">
          <div className="px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0 relative">
            <div className="flex-1"></div>
            <div className="flex items-center gap-3 sm:gap-4 justify-center flex-1">
              <button
                onClick={handleBack}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
              >
                <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
                <span className="font-medium hidden sm:inline">
                  {t("back")}
                </span>
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 px-2 sm:px-4">
                {translateModuleTitle(selectedModule.title)}
              </h1>
              <button
                onClick={() => navigate("/")}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-gray-300 hover:border-gray-400 transition-all hover:scale-110 cursor-pointer flex-shrink-0"
              >
                <img
                  src="/logo.jpg"
                  alt="Home"
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
            <div className="flex-1"></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
              {selectedModule.subModules.map((nestedModule, idx) => {
                const iconImage = getYTMIconImage(nestedModule.title);
                return (
                  <button
                    key={idx}
                    onClick={() => handleNestedSubModuleClick(nestedModule)}
                    className={`${selectedModule.color} text-white p-6 sm:p-8 rounded-xl shadow-lg ${selectedModule.shadow} hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-4 min-h-[160px] sm:min-h-[180px] relative overflow-hidden group`}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-2 bg-white rounded-lg p-2 sm:p-3 shadow-lg">
                      {iconImage ? (
                        <img
                          src={`/assets/icons/sub-icons/${iconImage}`}
                          alt={nestedModule.title}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/20 rounded-lg flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/30 rounded"></div>
                        </div>
                      )}
                    </div>
                    <span className="relative z-10 font-bold text-sm sm:text-base text-center leading-tight drop-shadow-md">
                      {translateModuleTitle(nestedModule.title)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Main YTM Modules ---
  return (
    <div className="fixed inset-0 bg-gray-100 flex flex-col overflow-hidden z-[100]">
      <div className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-[101]">
        <div className="px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0 relative">
          <div className="flex-1"></div>
          <div className="flex items-center gap-3 sm:gap-4 justify-center flex-1">
            <button
              onClick={handleBack}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
            >
              <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
              <span className="font-medium hidden sm:inline">{t("back")}</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 px-2 sm:px-4">
              {t("ytm")}
            </h1>
            <button
              onClick={() => navigate("/")}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-gray-300 hover:border-gray-400 transition-all hover:scale-110 cursor-pointer flex-shrink-0"
            >
              <img
                src="/logo.jpg"
                alt="Home"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
          <div className="flex-1"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
            {ytmModules.map((module, idx) => {
              const iconImage = getYTMIconImage(module.title);
              return (
                <button
                  key={idx}
                  onClick={() => handleSubModuleClick(module)}
                  className={`${module.color} text-white p-6 sm:p-8 rounded-xl shadow-lg ${module.shadow} hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-4 min-h-[160px] sm:min-h-[180px] relative overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-2 bg-white rounded-lg p-2 sm:p-3 shadow-lg">
                    {iconImage ? (
                      <img
                        src={`/assets/icons/sub-icons/${iconImage}`}
                        alt={module.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/20 rounded-lg flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/30 rounded"></div>
                      </div>
                    )}
                  </div>
                  <span className="relative z-10 font-bold text-sm sm:text-base text-center leading-tight drop-shadow-md">
                    {translateModuleTitle(module.title)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>

      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="YTM"
        />
      )}
    </div>
  );
};

export default YTM;
