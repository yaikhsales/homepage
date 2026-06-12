import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const IframeView = ({ onBack }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { url, title } = location.state || {};

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  if (!url) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        <p>No URL provided.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* Header bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-800 border-b border-slate-700 shrink-0">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span className="font-semibold text-sm">Back</span>
        </button>
        {title && (
          <span className="text-white font-bold text-sm ml-2 uppercase tracking-widest opacity-70">
            {title}
          </span>
        )}
      </div>

      {/* Iframe */}
      <iframe
        src={url}
        title={title || "Module"}
        className="flex-1 w-full border-0"
        allow="fullscreen"
      />
    </div>
  );
};

export default IframeView;
