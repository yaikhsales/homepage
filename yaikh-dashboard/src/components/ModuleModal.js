import React, { useEffect } from "react";
import { X } from "lucide-react";

export const Modal = ({ onClose, title, children }) => {
  // Add body scroll lock when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-950 border border-white/10 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-white/5 bg-slate-900/60 rounded-t-3xl">
          <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-wider">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-white hover:bg-rose-500/20 rounded-full transition-all hover:rotate-90"
            aria-label="Close modal"
          >
            <X size={20} className="stroke-[3]" />
          </button>
        </div>
        {/* Content */}
        <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Button = ({ onClick, className, children, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`transition-all active:scale-[0.98] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
