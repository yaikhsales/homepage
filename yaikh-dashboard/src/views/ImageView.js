import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from "lucide-react";

/**
 * ImageView component to display images or galleries.
 * Handles single images from URL and full galleries from navigation state.
 */
const ImageView = ({ onBack }) => {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Extract image path and gallery data
    const imagePathFromUrl = params["*"] ? decodeURIComponent(params["*"]) : "";
    const gallery = location.state?.gallery || [imagePathFromUrl];
    const title = location.state?.title || "Image Preview";

    const [currentIndex, setCurrentIndex] = useState(
        gallery.indexOf(imagePathFromUrl) !== -1 ? gallery.indexOf(imagePathFromUrl) : 0
    );
    const [zoom, setZoom] = useState(1);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % gallery.length);
        setZoom(1);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
        setZoom(1);
    };

    return (
        <div className="fixed inset-0 bg-slate-950 flex flex-col z-[9999] overflow-hidden font-sans select-none">
            {/* Premium Blur Header */}
            <header className="flex items-center justify-between px-8 py-5 bg-slate-900/60 backdrop-blur-2xl border-b border-white/5 relative z-20">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onBack || (() => navigate(-1))}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all active:scale-95 group"
                        title="Go back"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black text-white tracking-tight leading-none">{title}</h1>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">
                            {gallery.length > 1 ? `Image ${currentIndex + 1} of ${gallery.length}` : 'High Resolution View'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/5">
                        <button
                            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.25))}
                            className="p-2.5 text-slate-400 hover:text-white transition-colors"
                        >
                            <ZoomOut className="w-5 h-5" />
                        </button>
                        <div className="w-16 text-center text-[11px] font-black text-white/40 uppercase tracking-widest leading-none">
                            {Math.round(zoom * 100)}%
                        </div>
                        <button
                            onClick={() => setZoom(prev => Math.min(3, prev + 0.25))}
                            className="p-2.5 text-slate-400 hover:text-white transition-colors"
                        >
                            <ZoomIn className="w-5 h-5" />
                        </button>
                    </div>
                    <button className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition-all shadow-2xl shadow-indigo-600/20 active:scale-95">
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Viewport */}
            <main className="flex-1 relative flex items-center justify-center p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">
                {/* Gallery Navigation Controls */}
                {gallery.length > 1 && (
                    <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-30">
                        <button
                            onClick={handlePrev}
                            className="pointer-events-auto p-5 bg-white/5 hover:bg-white/10 text-white rounded-[2rem] backdrop-blur-2xl border border-white/5 transition-all hover:scale-110 active:scale-90"
                        >
                            <ChevronLeft className="w-10 h-10" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="pointer-events-auto p-5 bg-white/5 hover:bg-white/10 text-white rounded-[2rem] backdrop-blur-2xl border border-white/5 transition-all hover:scale-110 active:scale-90"
                        >
                            <ChevronRight className="w-10 h-10" />
                        </button>
                    </div>
                )}

                {/* Image Display Area */}
                <div
                    className="w-full h-full flex items-center justify-center transition-transform duration-500 ease-out"
                    style={{ transform: `scale(${zoom})` }}
                >
                   
                </div>

                {/* Subtle Bottom Ambient Glow */}
                <div className="absolute bottom-0 inset-x-0 h-1/4 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
            </main>

            {/* Gallery Strip */}
            {gallery.length > 1 && (
                <footer className="px-10 py-8 bg-slate-900/40 backdrop-blur-3xl border-t border-white/5 relative z-20">
                    <div className="flex items-center justify-center gap-4">
                        {gallery.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setCurrentIndex(idx);
                                    setZoom(1);
                                }}
                                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${currentIndex === idx
                                        ? "border-indigo-500 scale-125 shadow-2xl shadow-indigo-500/40 z-10"
                                        : "border-transparent opacity-30 hover:opacity-100 hover:scale-110"
                                    }`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </footer>
            )}
        </div>
    );
};

export default ImageView;
