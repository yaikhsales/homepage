import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../translate/TranslationContext';

const PhoneViewer = ({ onClose }) => {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(null); // 'left' or 'right' for animation

    const allImages = [
        'screen-01.png',
        'screen-02.png',
        'screen-03.png',
        'screen-04.png',
        'screen-05.png',
        'screen-06.png',
        'screen-07.png',
        'screen-08.png',
        'screen-09.png',
        'screen-10.png',
        'screen-11.png',
        'screen-12.png',
        'screen-13.png',
        'screen-14.png',
        'screen-15.png',
        'screen-16.png',
        'screen-17.png',
        'screen-18.png',
        'screen-19.png',
        'screen-20.png',
        'screen-21.png',
    ];

    const getImagePath = (imageName) => `/assets/phone/${imageName}`;

    const goNext = () => {
        setDirection('left');
        setCurrentIndex((prev) => (prev + 1) % allImages.length);
    };

    const goPrev = () => {
        setDirection('right');
        setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    // Reset animation direction after transition
    useEffect(() => {
        if (direction) {
            const timer = setTimeout(() => setDirection(null), 350);
            return () => clearTimeout(timer);
        }
    }, [direction, currentIndex]);

    // Keyboard navigation
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'ArrowRight') goNext();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[300] flex flex-col"
            style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)',
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
                <h2
                    className="text-xl font-bold tracking-wide"
                    style={{
                        background: 'linear-gradient(90deg, #67e8f9, #a78bfa, #f472b6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    {t('phoneScreenshots') || 'App Screenshots'}
                </h2>

                <div className="flex items-center gap-3">
                    {/* Counter */}
                    <span className="text-white/60 text-sm font-medium">
                        {currentIndex + 1} / {allImages.length}
                    </span>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/10 hover:bg-red-500/80 text-white/80 hover:text-white transition-all"
                        aria-label={t('close')}
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Center: Phone + Arrows */}
            <div className="flex-1 flex items-center justify-center gap-6 px-6 overflow-hidden">
                {/* Left Arrow */}
                <button
                    onClick={goPrev}
                    className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all hover:scale-110 active:scale-95"
                    aria-label="Previous"
                >
                    <ChevronLeft size={28} strokeWidth={2.5} />
                </button>

                {/* Screenshot Image */}
                <div className="relative flex-shrink-0">
                    <div
                        className="rounded-3xl overflow-hidden shadow-2xl"
                        style={{
                            width: 380,
                            boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
                        }}
                    >
                        <img
                            key={currentIndex}
                            src={getImagePath(allImages[currentIndex])}
                            alt={`Screenshot ${currentIndex + 1}`}
                            className="w-full h-auto select-none block"
                            draggable={false}
                            loading="eager"
                            style={{
                                animation: direction
                                    ? `phone-slide-${direction} 0.35s cubic-bezier(0.4, 0, 0.2, 1)`
                                    : undefined,
                            }}
                            onError={(e) => {
                                e.target.style.background = '#e2e8f0';
                            }}
                        />
                    </div>
                </div>

                {/* Right Arrow */}
                <button
                    onClick={goNext}
                    className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all hover:scale-110 active:scale-95"
                    aria-label="Next"
                >
                    <ChevronRight size={28} strokeWidth={2.5} />
                </button>
            </div>

            {/* Dot Indicators */}
            <div className="flex items-center justify-center gap-1.5 py-5 flex-shrink-0">
                {allImages.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            setDirection(i > currentIndex ? 'left' : 'right');
                            setCurrentIndex(i);
                        }}
                        className="transition-all duration-300 rounded-full"
                        style={{
                            width: currentIndex === i ? 24 : 8,
                            height: 8,
                            background:
                                currentIndex === i
                                    ? 'linear-gradient(90deg, #67e8f9, #a78bfa)'
                                    : 'rgba(255,255,255,0.2)',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                        aria-label={`Go to screenshot ${i + 1}`}
                    />
                ))}
            </div>

            {/* Slide animations */}
            <style>{`
                @keyframes phone-slide-left {
                    from { opacity: 0; transform: translateX(60px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes phone-slide-right {
                    from { opacity: 0; transform: translateX(-60px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes phone-viewer-fadein {
                    from { opacity: 0; transform: scale(0.97); }
                    to { opacity: 1; transform: scale(1); }
                }
                .fixed.inset-0.z-\\[300\\] {
                    animation: phone-viewer-fadein 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                }
            `}</style>
        </div>
    );
};

export default PhoneViewer;
