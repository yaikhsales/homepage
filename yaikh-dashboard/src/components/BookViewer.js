import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

const BookViewer = ({ onClose, images = [] }) => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [dragProgress, setDragProgress] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);
    const bookRef = useRef(null);
    const dragStartX = useRef(0);
    const dragCurrentX = useRef(0);
    const isDraggingRef = useRef(false);
    const pageWidth = useRef(0);

    // Use images from nav-images folder
    const defaultImages = images.length > 0 ? images : [
        'assets/nav-images/empty-factory1.jpg?v=1',
        'assets/nav-images/empty-factory2.jpg?v=1',
        'assets/nav-images/t2.jpg?v=1',
        'assets/nav-images/t1.jpg?v=1',
        'assets/nav-images/scan.jpg?v=1',
        
    ];

    const totalPages = defaultImages.length;

    // Open book animation on mount
    useEffect(() => {
        const timer = setTimeout(() => setIsOpen(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Update page width on resize
    useEffect(() => {
        const updatePageWidth = () => {
            if (bookRef.current) {
                pageWidth.current = bookRef.current.offsetWidth / 2;
            }
        };
        updatePageWidth();
        window.addEventListener('resize', updatePageWidth);
        return () => window.removeEventListener('resize', updatePageWidth);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (isDragging || isFlipping) return;
            
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                handlePreviousPage();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                handleNextPage();
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentPage, isDragging, isFlipping]);

    // Mouse drag handlers
    const handleMouseDown = (e) => {
        if (currentPage >= totalPages - 1) return;
        
        const rect = bookRef.current?.getBoundingClientRect();
        if (!rect) return;
        
        const clickX = e.clientX - rect.left;
        const bookCenter = rect.width / 2;
        
        // Only allow dragging from the right page edge area
        if (clickX > bookCenter - 100 && clickX < bookCenter + 100) {
            isDraggingRef.current = true;
            setIsDragging(true);
            dragStartX.current = e.clientX;
            dragCurrentX.current = e.clientX;
            e.preventDefault();
        }
    };

    const handleMouseMove = (e) => {
        if (!isDraggingRef.current) return;
        
        dragCurrentX.current = e.clientX;
        const deltaX = dragCurrentX.current - dragStartX.current;
        const progress = Math.max(0, Math.min(1, -deltaX / (pageWidth.current || 500)));
        setDragProgress(progress);
    };

    const handleMouseUp = () => {
        if (!isDraggingRef.current) return;
        
        isDraggingRef.current = false;
        setIsDragging(false);
        
        // If dragged more than 30%, complete the flip
        if (dragProgress > 0.3) {
            completeFlip();
        } else {
            // Snap back
            snapBack();
        }
    };

    // Touch handlers
    const handleTouchStart = (e) => {
        if (currentPage >= totalPages - 1) return;
        
        const touch = e.touches[0];
        const rect = bookRef.current?.getBoundingClientRect();
        if (!rect) return;
        
        const touchX = touch.clientX - rect.left;
        const bookCenter = rect.width / 2;
        
        if (touchX > bookCenter - 100 && touchX < bookCenter + 100) {
            isDraggingRef.current = true;
            setIsDragging(true);
            dragStartX.current = touch.clientX;
            dragCurrentX.current = touch.clientX;
            e.preventDefault();
        }
    };

    const handleTouchMove = (e) => {
        if (!isDraggingRef.current) return;
        
        const touch = e.touches[0];
        dragCurrentX.current = touch.clientX;
        const deltaX = dragCurrentX.current - dragStartX.current;
        const progress = Math.max(0, Math.min(1, -deltaX / (pageWidth.current || 500)));
        setDragProgress(progress);
        e.preventDefault();
    };

    const handleTouchEnd = () => {
        if (!isDraggingRef.current) return;
        
        isDraggingRef.current = false;
        setIsDragging(false);
        
        if (dragProgress > 0.3) {
            completeFlip();
        } else {
            snapBack();
        }
    };

    const completeFlip = () => {
        setIsFlipping(true);
        const duration = 300;
        const startProgress = dragProgress;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const t = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3); // Ease out cubic
            const progress = startProgress + (1 - startProgress) * eased;
            
            setDragProgress(progress);
            
            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
                setDragProgress(0);
                setIsFlipping(false);
            }
        };
        
        requestAnimationFrame(animate);
    };

    const snapBack = () => {
        const duration = 200;
        const startProgress = dragProgress;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const t = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            const progress = startProgress * (1 - eased);
            
            setDragProgress(progress);
            
            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                setDragProgress(0);
            }
        };
        
        requestAnimationFrame(animate);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1 && !isDragging && !isFlipping) {
            setIsFlipping(true);
            setDragProgress(0);
            
            const duration = 600;
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                
                setDragProgress(eased);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
                    setIsFlipping(false);
                    setDragProgress(0);
                }
            };
            
            requestAnimationFrame(animate);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0 && !isDragging && !isFlipping) {
            setIsFlipping(true);
            setDragProgress(0);
            
            const duration = 600;
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                
                setDragProgress(eased);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    setCurrentPage(prev => Math.max(prev - 1, 0));
                    setIsFlipping(false);
                    setDragProgress(0);
                }
            };
            
            requestAnimationFrame(animate);
        }
    };

    // Global mouse/touch event listeners
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
            window.addEventListener('touchend', handleTouchEnd);
            
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
                window.removeEventListener('touchmove', handleTouchMove);
                window.removeEventListener('touchend', handleTouchEnd);
            };
        }
    }, [isDragging]);

    const getPageImage = (pageIndex) => {
        if (pageIndex < 0 || pageIndex >= totalPages) return null;
        return defaultImages[pageIndex];
    };

    // Calculate which pages to show - like a real book with left and right pages
    // When on page 0: left = cover, right = page 0
    // When on page 1: left = page 0, right = page 1
    // When on page 2: left = page 1, right = page 2
    const leftPageIndex = currentPage > 0 ? currentPage - 1 : null;
    const rightPageIndex = currentPage < totalPages ? currentPage : null;

    // Calculate rotation for the flipping page
    const flipRotation = (isDragging || isFlipping) ? dragProgress * 180 : 0;

    return (
        <div 
            className="fixed inset-0 z-[300] bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center animate-in fade-in duration-500 overflow-hidden"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            {/* Header Controls */}
            <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-black/30 to-transparent backdrop-blur-md">
                {/* Left: Empty space for balance */}
                <div className="flex-1"></div>
                
                {/* Center: Home Button and Back Button */}
                <div className="flex items-center gap-2 sm:gap-3 justify-center flex-1">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all backdrop-blur-sm border border-white/20 shadow-lg text-xs sm:text-sm"
                    >
                        <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
                        <span className="font-medium hidden sm:inline">Back</span>
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white/30 hover:border-white/50 transition-all hover:scale-110 cursor-pointer flex-shrink-0 shadow-lg"
                        title="Home"
                    >
                        <img 
                            src="/logo.jpg" 
                            alt="Home" 
                            className="w-full h-full object-cover"
                        />
                    </button>
                </div>
                
                {/* Right: Page Counter */}
                <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-white/20">
                        <img 
                            src="/logo.jpg" 
                            alt="Yai Logo" 
                            className="w-4 h-4 sm:w-[18px] sm:h-[18px] object-contain"
                        />
                        <span className="text-white text-xs sm:text-sm font-medium">
                            {currentPage + 1} / {totalPages}
                        </span>
                    </div>
                </div>
            </div>

            {/* Book Container - Full Screen */}
            <div 
                ref={bookRef}
                className={`relative w-full h-full perspective-1000 transition-all duration-700 cursor-grab ${isDragging ? 'cursor-grabbing' : ''} ${
                    isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                style={{ userSelect: 'none' }}
            >
                {/* Book Shadow */}
                <div className="absolute inset-0 bg-black/10 rounded-lg blur-3xl transform translate-y-4 scale-95"></div>
                
                {/* Book */}
                <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Left Page - Always visible */}
                    <div 
                        className="absolute left-0 w-1/2 h-full bg-gradient-to-r from-amber-50 to-amber-100 shadow-2xl overflow-hidden rounded-l-lg"
                        style={{
                            transformStyle: 'preserve-3d',
                            transformOrigin: 'right center',
                        }}
                    >
                        {leftPageIndex !== null ? (
                            <img 
                                src={getPageImage(leftPageIndex)} 
                                alt={`Page ${leftPageIndex + 1}`}
                                className="w-full h-full object-cover"
                                draggable={false}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100">
                                <div className="text-center text-amber-800/50">
                                    <img 
                                        src="/logo.jpg" 
                                        alt="Yai Logo" 
                                        className="w-32 h-32 mx-auto mb-4 object-contain"
                                    />
                                    <p className="text-2xl font-serif italic"></p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Flipping Page - Shows when dragging or flipping */}
                    {(isDragging || isFlipping || dragProgress > 0) && (
                        <div 
                            className="absolute left-1/2 w-1/2 h-full bg-gradient-to-l from-amber-50 to-amber-100 shadow-2xl overflow-hidden rounded-r-lg z-20"
                            style={{
                                transformStyle: 'preserve-3d',
                                transformOrigin: 'left center',
                                transform: `rotateY(${-flipRotation}deg)`,
                                backfaceVisibility: 'hidden',
                                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                            }}
                        >
                            {/* Front side of flipping page (right page content) */}
                            <div 
                                className="absolute inset-0"
                                style={{
                                    transform: 'rotateY(0deg)',
                                    backfaceVisibility: 'hidden',
                                }}
                            >
                                {rightPageIndex !== null ? (
                                    <img 
                                        src={getPageImage(rightPageIndex)} 
                                        alt={`Page ${rightPageIndex + 1}`}
                                        className="w-full h-full object-cover"
                                        draggable={false}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100">
                                        <div className="text-center text-amber-800/50">
                                            <img 
                                                src="/logo.jpg" 
                                                alt="Yai Logo" 
                                                className="w-32 h-32 mx-auto mb-4 object-contain"
                                            />
                                            <p className="text-2xl font-serif italic">Page</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Back side of flipping page (left page content) */}
                            <div 
                                className="absolute inset-0 bg-gradient-to-l from-amber-50 to-amber-100"
                                style={{
                                    transform: 'rotateY(180deg)',
                                    backfaceVisibility: 'hidden',
                                }}
                            >
                                {leftPageIndex !== null ? (
                                    <img 
                                        src={getPageImage(leftPageIndex)} 
                                        alt={`Page ${leftPageIndex + 1}`}
                                        className="w-full h-full object-cover"
                                        draggable={false}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100">
                                        <div className="text-center text-amber-800/50">
                                            <img 
                                                src="/logo.jpg" 
                                                alt="Yai Logo" 
                                                className="w-32 h-32 mx-auto mb-4 object-contain"
                                            />
                                            <p className="text-2xl font-serif italic">Cover</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Right Page - Always visible when not dragging/flipping */}
                    {!isDragging && !isFlipping && dragProgress === 0 && (
                        <div 
                            className="absolute right-0 w-1/2 h-full bg-gradient-to-l from-amber-50 to-amber-100 shadow-2xl overflow-hidden rounded-r-lg"
                            style={{
                                transformStyle: 'preserve-3d',
                                transformOrigin: 'left center',
                            }}
                        >
                            {rightPageIndex !== null ? (
                                <img 
                                    src={getPageImage(rightPageIndex)} 
                                    alt={`Page ${rightPageIndex + 1}`}
                                    className="w-full h-full object-cover"
                                    draggable={false}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100">
                                    <div className="text-center text-amber-800/50">
                                        <img 
                                            src="/logo.jpg" 
                                            alt="Yai Logo" 
                                            className="w-32 h-32 mx-auto mb-4 object-contain"
                                        />
                                        <p className="text-2xl font-serif italic">Back Cover</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Book Spine */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-r from-amber-800/50 to-amber-900/50 transform -translate-x-1/2 shadow-lg z-10"></div>
                </div>

                {/* Drag Hint - Show when on first page */}
                {currentPage === 0 && !isDragging && !isFlipping && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
                        <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/40">
                            <span className="text-white text-sm font-medium">← Drag to turn page</span>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 0 || isDragging || isFlipping}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all shadow-lg z-40 ${
                        currentPage === 0 || isDragging || isFlipping
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:scale-110 cursor-pointer'
                    }`}
                    aria-label="Previous Page"
                >
                    <ChevronLeft size={24} className="text-white" />
                </button>

                <button
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages - 1 || isDragging || isFlipping}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all shadow-lg z-40 ${
                        currentPage >= totalPages - 1 || isDragging || isFlipping
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:scale-110 cursor-pointer'
                    }`}
                    aria-label="Next Page"
                >
                    <ChevronRight size={24} className="text-white" />
                </button>

                {/* Page Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-2 z-40">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (!isDragging && !isFlipping && index !== currentPage) {
                                    if (index > currentPage) {
                                        const diff = index - currentPage;
                                        for (let i = 0; i < diff; i++) {
                                            setTimeout(() => handleNextPage(), i * 100);
                                        }
                                    } else {
                                        const diff = currentPage - index;
                                        for (let i = 0; i < diff; i++) {
                                            setTimeout(() => handlePreviousPage(), i * 100);
                                        }
                                    }
                                }
                            }}
                            className={`h-2 rounded-full transition-all flex-shrink-0 ${
                                index === currentPage 
                                    ? 'bg-white w-8' 
                                    : 'bg-white/40 hover:bg-white/60 w-2'
                            }`}
                            aria-label={`Go to page ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Custom CSS for 3D transforms */}
            <style>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                @keyframes bookOpen {
                    from {
                        transform: scale(0.9) rotateY(-10deg);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1) rotateY(0deg);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default BookViewer;
