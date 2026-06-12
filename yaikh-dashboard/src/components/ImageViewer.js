import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ZoomIn, ZoomOut, RefreshCw, Download, AlertCircle } from 'lucide-react';

const ImageViewer = ({ imagePath, onClose }) => {
    const navigate = useNavigate();
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        // Reset zoom and rotation when image changes
        setScale(1);
        setRotation(0);
        setIsLoading(true);
        setHasError(false);
    }, [imagePath]);

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
    const handleRotate = () => setRotation(prev => (prev + 90) % 360);
    const handleReset = () => {
        setScale(1);
        setRotation(0);
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imagePath;
        link.download = imagePath.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === '+' || e.key === '=') handleZoomIn();
            if (e.key === '-') handleZoomOut();
            if (e.key === 'r' || e.key === 'R') handleRotate();
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-sm flex flex-col animate-in fade-in duration-300"
            onClick={(e) => {
                // Close when clicking on backdrop (not on image)
                if (e.target === e.currentTarget) onClose();
            }}
        >
            {/* Header Controls */}
            <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
                {/* Left: Empty space for balance */}
                <div className="flex-1"></div>
                
                {/* Center: Home Button and Back Button */}
                <div className="flex items-center gap-3 justify-center flex-1">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-sm border border-white/10"
                    >
                        <ArrowLeft size={18} />
                        <span className="text-sm font-medium">Back</span>
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white/30 hover:border-white/50 transition-all hover:scale-110 cursor-pointer flex-shrink-0 shadow-lg"
                        title="Home"
                    >
                        <img 
                            src="/logo.jpg" 
                            alt="Home" 
                            className="w-full h-full object-cover"
                        />
                    </button>
                </div>
                
                {/* Right: Controls */}
                <div className="flex items-center gap-2 flex-1 justify-end">
                    {/* Zoom Controls */}
                    <button
                        onClick={handleZoomOut}
                        disabled={scale <= 0.5}
                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-sm border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Zoom Out (-)"
                    >
                        <ZoomOut size={18} />
                    </button>
                    <span className="px-3 py-1 bg-white/10 text-white text-sm font-medium rounded-lg backdrop-blur-sm border border-white/10">
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={handleZoomIn}
                        disabled={scale >= 3}
                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-sm border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Zoom In (+)"
                    >
                        <ZoomIn size={18} />
                    </button>
                    
                    {/* Rotate */}
                    <button
                        onClick={handleRotate}
                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-sm border border-white/10"
                        title="Rotate (R)"
                    >
                        <RefreshCw size={18} />
                    </button>
                    
                    {/* Reset */}
                    {(scale !== 1 || rotation !== 0) && (
                        <button
                            onClick={handleReset}
                            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-all backdrop-blur-sm border border-white/10"
                            title="Reset"
                        >
                            Reset
                        </button>
                    )}
                    
                    {/* Download */}
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-sm border border-white/10"
                        title="Download Image"
                    >
                        <Download size={18} />
                        <span className="text-sm font-medium">Download</span>
                    </button>
                </div>
            </div>

            {/* Image Container - Full Screen */}
            <div className="flex-1 flex items-center justify-center overflow-auto mt-16 mb-16">
                {isLoading && !hasError && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </div>
                )}
                {hasError ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-center p-8">
                        <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center">
                            <AlertCircle size={48} className="text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Image Not Found</h3>
                            <p className="text-white/70 mb-1">Unable to load the image at:</p>
                            <p className="text-white/50 text-sm font-mono break-all max-w-2xl">{imagePath}</p>
                        </div>
                    </div>
                ) : (
                    <div
                        className="relative transition-transform duration-300 ease-out w-full h-full flex items-center justify-center"
                        style={{
                            transform: `scale(${scale}) rotate(${rotation}deg)`,
                            transformOrigin: 'center center',
                        }}
                    >
                        <img
                            src={imagePath}
                            alt="Price Information"
                            onLoad={() => {
                                setIsLoading(false);
                                setHasError(false);
                            }}
                            onError={() => {
                                setIsLoading(false);
                                setHasError(true);
                            }}
                            className="w-full h-full object-contain select-none"
                            style={{
                                maxWidth: '100vw',
                                maxHeight: 'calc(100vh - 128px)', // Account for header and footer
                            }}
                            draggable={false}
                        />
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="text-center">
                    <p className="text-white/70 text-sm font-medium">Price Information</p>
                    <p className="text-white/50 text-xs mt-1">Press ESC to close • Use +/- to zoom • Press R to rotate</p>
                </div>
            </div>
        </div>
    );
};

export default ImageViewer;

