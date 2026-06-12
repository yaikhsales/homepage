import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

const PdfViewer = ({ pdfPath, onClose }) => {
    const navigate = useNavigate();
    const [scale, setScale] = useState(1);
    const [pdfZoom, setPdfZoom] = useState(150); // PDF native zoom (percentage)
    const [pdfError, setPdfError] = useState(false);

    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 0.25, 3));
        setPdfZoom(prev => Math.min(prev + 25, 300));
    };
    const handleZoomOut = () => {
        setScale(prev => Math.max(prev - 0.25, 0.5));
        setPdfZoom(prev => Math.max(prev - 25, 50));
    };
    const handleReset = () => {
        setScale(1);
        setPdfZoom(150);
    };
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = pdfPath;
        link.download = pdfPath.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Escape') onClose();
        if (e.key === '+' || e.key === '=') handleZoomIn();
        if (e.key === '-') handleZoomOut();
        if (e.key === 'r' || e.key === 'R') handleReset();
    };

    React.useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    // Reset error state when PDF path changes
    React.useEffect(() => {
        setPdfError(false);
    }, [pdfPath]);

    return (
        <div 
            className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-sm flex flex-col animate-in fade-in duration-300"
            onClick={(e) => {
                // Close when clicking on backdrop (not on PDF)
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
                    
                    {/* Reset */}
                    {(scale !== 1) && (
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
                        title="Download PDF"
                    >
                        <Download size={18} />
                        <span className="text-sm font-medium">Download</span>
                    </button>
                </div>
            </div>

            {/* PDF Container */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-auto mt-16">
                <div
                    className="relative transition-all duration-300 ease-out"
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: 'center center',
                        willChange: 'transform',
                    }}
                >
                    {pdfError ? (
                        <div className="bg-white/10 rounded-lg p-8 text-center backdrop-blur-sm border border-white/20">
                            <p className="text-white text-lg font-semibold mb-2">Unable to load PDF</p>
                            <p className="text-white/70 text-sm mb-4">The PDF file may not exist or cannot be accessed.</p>
                            <p className="text-white/50 text-xs mb-4">Path: {pdfPath}</p>
                            <button
                                onClick={() => {
                                    setPdfError(false);
                                    // Try to reload
                                    const iframe = document.querySelector('iframe[title="PDF Viewer"]');
                                    if (iframe) {
                                        iframe.src = iframe.src;
                                    }
                                }}
                                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <iframe
                            src={`${pdfPath}#toolbar=0&zoom=${pdfZoom}&navpanes=0&scrollbar=0`}
                            className="rounded-lg shadow-2xl border-0"
                            title="PDF Viewer"
                            style={{
                                width: `${2000 * (pdfZoom / 150)}px`,
                                height: `${1400 * (pdfZoom / 150)}px`,
                                maxWidth: '95vw',
                                maxHeight: '95vh',
                                imageRendering: 'auto',
                                WebkitImageRendering: 'auto',
                            }}
                            onError={() => setPdfError(true)}
                            onLoad={(e) => {
                                // Check if iframe loaded successfully
                                try {
                                    const iframeDoc = e.target.contentDocument || e.target.contentWindow.document;
                                    if (!iframeDoc || iframeDoc.body.innerHTML.includes('404') || iframeDoc.body.innerHTML.includes('Not Found')) {
                                        setPdfError(true);
                                    }
                                } catch (err) {
                                    // Cross-origin or other error - assume it's loading
                                    console.log('PDF loading...');
                                }
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Footer Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="text-center">
                    <p className="text-white/70 text-sm font-medium">Vendor Information</p>
                    <p className="text-white/50 text-xs mt-1">Press ESC to close • Use +/- to zoom • Press R to reset</p>
                </div>
            </div>
        </div>
    );
};

export default PdfViewer;

