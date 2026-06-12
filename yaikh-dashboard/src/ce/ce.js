import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";
import GeneralAIAgent from "../general-ag";
import { useTranslation } from "../translate/TranslationContext";

// Mapping function to match module titles to sub-icon image filenames
const getCEIconImage = (title) => {
  const titleToImageMap = {
    "ST Standard Time": "standard-time-analysis.png",
    "Product development": "product-development-analysis.png",
    "Garment Analysis": "garment-analysis.png",
    "Cut,Sew,Pack Productivity": "cut-sew-pack-worker-capacity.png",
    "Machine allocation": "machine-allocation.png",
    "Skill inventory": "skill-inventory.png",
    "Team Performance": "individual-team-production-record.png",
    "Learning Curve": "Learning-curve.png",
    Downtimes: "downtimes.png",
    "Cost centers ,Direct/Indirect Cost": "center-direct-indirect-cost.png",
    CPM: "cpm.png",
    "Style Costing": "style-costing.png",
  };

  return titleToImageMap[title] || null;
};

// Mapping function to match module titles to CE folder image filenames
const getCEModuleImage = (title) => {
  const titleToImageMap = {
    "ST Standard Time": "ST.png",
    "Garment Analysis": "garment-analysis.png",
  };

  return titleToImageMap[title] || null;
};

const CE = ({ onBack }) => {
  const navigate = useNavigate();
  const { translateModuleTitle } = useTranslation();
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleSubModuleClick = (moduleTitle) => {
    console.log("CE Sub-module clicked:", moduleTitle);

    const titleToPathMap = {
      "ST Standard Time": "/dashboard/standard-time",
      "Product development": "/dashboard/product-development",
      "Garment Analysis": "/dashboard/garment-analysis",
      "Cut,Sew,Pack Productivity": "/dashboard/productivity",
      "Machine allocation": "/dashboard/machine-allocation",
      "Skill inventory": "/dashboard/skill-inventory",
      "Team Performance": "/dashboard/team-performance",
      "Learning Curve": "/dashboard/learning-curve",
      Downtimes: "/dashboard/downtimes",
      "Cost centers ,Direct/Indirect Cost": "/dashboard/cost-centers",
      CPM: "/dashboard/cpm",
      "Style Costing": "/dashboard/style-costing",
    };

    const path = titleToPathMap[moduleTitle];
    if (path) {
      navigate(path);
    } else {
      // Fallback for images
      const imageName = getCEModuleImage(moduleTitle);
      if (imageName) {
        setSelectedImage(`/assets/ce/${imageName}`);
      }
    }
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  // Reset zoom and position when image changes
  useEffect(() => {
    if (selectedImage) {
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  }, [selectedImage]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prev) => Math.max(0.5, Math.min(5, prev + delta)));
  };

  // Mouse drag to pan
  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyPress = (e) => {
      if (e.key === "Escape") handleCloseImage();
      if (e.key === "+" || e.key === "=") handleZoomIn();
      if (e.key === "-") handleZoomOut();
      if (e.key === "r" || e.key === "R") handleRotate();
      if (e.key === "0") handleReset();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedImage, scale]);

  const ceModules = [
    {
      title: "ST Standard Time",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      shadow: "shadow-blue-200",
    },
    {
      title: "Product development",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      shadow: "shadow-green-200",
    },
    {
      title: "Garment Analysis",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      shadow: "shadow-purple-200",
    },
    {
      title: "Cut,Sew,Pack Productivity",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      shadow: "shadow-orange-200",
    },
    {
      title: "Machine allocation",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      shadow: "shadow-indigo-200",
    },
    {
      title: "Skill inventory",
      color: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      shadow: "shadow-yellow-200",
    },
    {
      title: "Team Performance",
      color: "bg-gradient-to-br from-teal-500 to-teal-600",
      shadow: "shadow-teal-200",
    },
    {
      title: "Learning Curve",
      color: "bg-gradient-to-br from-pink-500 to-pink-600",
      shadow: "shadow-pink-200",
    },
    {
      title: "Downtimes",
      color: "bg-gradient-to-br from-red-500 to-red-600",
      shadow: "shadow-red-200",
    },
    {
      title: "Cost centers ,Direct/Indirect Cost",
      color: "bg-gradient-to-br from-cyan-500 to-cyan-600",
      shadow: "shadow-cyan-200",
    },
    {
      title: "CPM",
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-200",
    },
    {
      title: "Style Costing",
      color: "bg-gradient-to-br from-violet-500 to-violet-600",
      shadow: "shadow-violet-200",
    },
  ];

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
              <span className="font-medium hidden sm:inline">Back</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 px-2 sm:px-4">
              CE
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

          {/* Right: Empty space for balance */}
          <div className="flex-1"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
            {ceModules.map((module, idx) => {
              const iconImage = getCEIconImage(module.title);
              return (
                <button
                  key={idx}
                  onClick={() => handleSubModuleClick(module.title)}
                  className={`
                                        ${module.color} 
                                        text-white 
                                        p-6 sm:p-8 
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
                                        min-h-[160px] 
                                        sm:min-h-[180px]
                                        relative
                                        overflow-hidden
                                        group
                                    `}
                >
                  {/* Subtle overlay for depth */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Icon Container */}
                  <div className="relative z-10 flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-2 bg-white rounded-lg p-2 sm:p-3 shadow-lg">
                    {iconImage ? (
                      <img
                        src={`/assets/icons/sub-icons/${iconImage}`}
                        alt={module.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.error("Failed to load CE icon:", iconImage);
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-white/20 rounded-lg flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/30 rounded"></div>
                      </div>
                    )}
                  </div>

                  {/* Text Label */}
                  <span className="relative z-10 font-bold text-sm sm:text-base text-center leading-tight drop-shadow-md">
                    {translateModuleTitle(module.title)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bot Button - Bottom Right */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Ask CE bot"
        title="Ask CE bot"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Bot Modal */}
      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="CE"
        />
      )}

      {/* Image Viewer Modal - Full Screen with Zoom */}
      {selectedImage && (
        <div
          ref={containerRef}
          className="fixed inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden"
          onClick={handleCloseImage}
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            width: "100vw",
            height: "100vh",
            cursor: isDragging ? "grabbing" : scale > 1 ? "grab" : "default",
          }}
        >
          {/* Control Buttons - Top Right */}
          <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
            {/* Zoom In */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
              className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all backdrop-blur-sm border border-white/20 shadow-lg"
              aria-label="Zoom In"
              title="Zoom In (+)"
            >
              <ZoomIn size={20} />
            </button>

            {/* Zoom Out */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all backdrop-blur-sm border border-white/20 shadow-lg"
              aria-label="Zoom Out"
              title="Zoom Out (-)"
            >
              <ZoomOut size={20} />
            </button>

            {/* Rotate */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRotate();
              }}
              className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all backdrop-blur-sm border border-white/20 shadow-lg"
              aria-label="Rotate"
              title="Rotate (R)"
            >
              <RotateCw size={20} />
            </button>

            {/* Reset */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all backdrop-blur-sm border border-white/20 shadow-lg text-xs font-semibold"
              aria-label="Reset"
              title="Reset (0)"
            >
              1:1
            </button>

            {/* Close Button */}
            <button
              onClick={handleCloseImage}
              className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all backdrop-blur-sm border border-white/20 shadow-lg"
              aria-label="Close"
              title="Close (ESC)"
            >
              <X size={20} />
            </button>
          </div>

          {/* Zoom Indicator - Top Left */}
          <div className="absolute top-4 left-4 z-50 px-4 py-2 bg-black/50 text-white rounded-lg backdrop-blur-sm border border-white/20 shadow-lg text-sm font-medium">
            {Math.round(scale * 100)}%
          </div>

          {/* Image Container - Full Screen with proper scaling */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100vw", height: "100vh" }}
          >
            <div
              ref={imageRef}
              className="relative transition-transform duration-200 ease-out"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                transformOrigin: "center center",
                cursor: isDragging
                  ? "grabbing"
                  : scale > 1
                    ? "grab"
                    : "default",
              }}
              onMouseDown={handleMouseDown}
            >
              <img
                src={selectedImage}
                alt="CE Module"
                className="w-auto h-auto max-w-full max-h-full object-contain select-none"
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "100vw",
                  maxHeight: "100vh",
                  objectFit: "contain",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
                draggable={false}
                onError={(e) => {
                  console.error("Failed to load image:", selectedImage);
                  e.target.style.display = "none";
                }}
              />
            </div>
          </div>

          {/* Instructions - Bottom */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 bg-black/50 text-white rounded-lg backdrop-blur-sm border border-white/20 shadow-lg text-xs text-center">
            <div>
              Use mouse wheel to zoom â€?Drag to pan when zoomed â€?Press ESC to
              close
            </div>
            <div className="mt-1">+ / - to zoom â€?R to rotate â€?0 to reset</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CE;
