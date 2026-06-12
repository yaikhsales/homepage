import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import GeneralAIAgent from "../general-ag";
import PWIP1 from "./pwip1";
import PWIP2 from "./pwip2";
import PWIP3 from "./pwip3";

const PWIP = ({ onBack }) => {
  const navigate = useNavigate();
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 3;

  const handleBack = useCallback(() => {
    if (onBack) onBack();
    else navigate(-1);
  }, [onBack, navigate]);

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev > 1 ? prev - 1 : totalSlides));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev < totalSlides ? prev + 1 : 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape") {
        handleBack();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleBack]);

  const renderDashboard = () => {
    switch (currentSlide) {
      case 1:
        return <PWIP1 />;
      case 2:
        return <PWIP2 />;
      case 3:
        return <PWIP3 />;
      default:
        return <PWIP1 />;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 flex flex-col overflow-auto z-[100]">
      {/* Header mimics standard window/app header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-1 hover:bg-gray-100 rounded text-black text-sm font-bold border border-black px-3 bg-[#0d1e35] text-white"
          >
            ← Back
          </button>
          <div className="text-sm text-gray-500">
            <span className="font-bold text-black">PWIP</span> [{currentSlide} / {totalSlides}]
          </div>
        </div>
        <div className="flex bg-gray-100 rounded p-1 gap-2">
          <span className="text-xs px-2">100%</span>
        </div>
        <button
          onClick={handleBack}
          className="text-red-500 hover:bg-gray-100 p-1"
        >
          ✕
        </button>
      </div>

      {/* Dashboard Container - Full Screen No Scroll */}
      <div className="flex-1 bg-gray-50 overflow-hidden relative">
        {/* Navigation Arrows - Smaller and positioned on edges */}
        <button
          onClick={handlePrevious}
          className="fixed left-2 top-1/2 -translate-y-1/2 z-[150] p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-300 text-gray-700 hover:bg-white hover:text-gray-900 transition-all transform hover:scale-105 active:scale-95"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={handleNext}
          className="fixed right-2 top-1/2 -translate-y-1/2 z-[150] p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-300 text-gray-700 hover:bg-white hover:text-gray-900 transition-all transform hover:scale-105 active:scale-95"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dashboard Content - Full Screen with padding for navigation */}
        <div className="w-full h-full transition-opacity duration-300 px-4 overflow-hidden">
          {renderDashboard()}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[150] flex gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg border border-gray-200">
        {Array.from({ length: totalSlides }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentSlide(i + 1)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === i + 1
                ? "w-8 bg-[#0d1e35]"
                : "w-2 bg-gray-400 hover:bg-gray-600"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* AI Bot Integration */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-24 right-6 z-[102] w-14 h-14 bg-gradient-to-tr from-[#002f4b] to-[#2083b8] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group overflow-hidden"
      >
        <MessageCircle className="relative z-10" size={24} />
      </button>

      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="PWIP Dashboard"
        />
      )}
    </div>
  );
};

export default PWIP;
