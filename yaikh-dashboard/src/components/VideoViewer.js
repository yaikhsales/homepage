import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, AlertCircle, Video } from "lucide-react";

const VideoViewer = ({ videoPath, onClose, onSwitch, switchLabel }) => {
  const navigate = useNavigate();
  const [hasError, setHasError] = useState(false);
  const [isNormalVideo, setIsNormalVideo] = useState(false);

  const getNormalVideoPath = (originalPath) => {
    if (!originalPath) return null;
    const lowerPath = originalPath.toLowerCase();

    if (lowerPath.includes('gatepass')) return '/assets/short-video-training/normal-video-training/Gatepass-Normall.mp4';
    if (lowerPath.includes('money') || lowerPath.includes('claim')) return '/assets/short-video-training/normal-video-training/Money-Claim-Normall.mp4';
    if (lowerPath.includes('purchase')) return '/assets/short-video-training/normal-video-training/Purchase-Normall.mp4';
    if (lowerPath.includes('support') || lowerPath.includes('ticket')) return '/assets/short-video-training/normal-video-training/Support-Ticket-Normall.mp4';
    if (lowerPath.includes('y-shop')) return '/assets/short-video-training/normal-video-training/Y-Shop-Normall.mp4';
    if (lowerPath.includes('yhr')) return '/assets/short-video-training/normal-video-training/Yhr-Video-Normall.mp4';
    if (/\/training-short\.mp4$/i.test(originalPath)) {
      return '/assets/short-video-training/normal-video-training/Training-Normall.mp4';
    }

    return null;
  };

  const normalPath = getNormalVideoPath(videoPath);
  const currentPathToPlay = isNormalVideo && normalPath ? normalPath : videoPath;

  useEffect(() => {
    setHasError(false);
    setIsNormalVideo(false);
  }, [videoPath]);

  useEffect(() => {
    setHasError(false);
  }, [currentPathToPlay]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = currentPathToPlay;
    link.download = currentPathToPlay.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-md flex flex-col animate-in fade-in duration-300"
      onClick={(e) => {
        // Close when clicking on backdrop (not on video)
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
            onClick={() => navigate("/")}
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
        {/* Left: Switch Video Button (If provided or auto-detected) */}
        <div className="flex-1 flex justify-start pl-4 md:pl-0">
          {(normalPath || onSwitch) && (
            <button
              onClick={() => {
                if (onSwitch) onSwitch();
                else setIsNormalVideo(!isNormalVideo);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600/90 hover:bg-blue-500 text-white rounded-lg transition-all backdrop-blur-sm border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] hover:scale-105 active:scale-95 group"
              title="Switch Video Version"
            >
              <Video size={18} className="group-hover:animate-pulse" />
              <span className="text-sm font-bold tracking-wide">
                {onSwitch 
                  ? switchLabel 
                  : (isNormalVideo ? "Switch to Fast Video" : "Switch to Full Normal Video")
                }
              </span>
            </button>
          )}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          {/* Download */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-sm border border-white/10"
            title="Download Video"
          >
            <Download size={18} />
            <span className="text-sm font-medium">Download</span>
          </button>
        </div>
      </div>

      {/* Video Container - Full Screen */}
      <div className="flex-1 flex items-center justify-center overflow-hidden mt-[72px] mb-[64px] px-4 md:px-8">
        {hasError ? (
          <div className="flex flex-col items-center justify-center gap-4 text-center p-8 bg-white/5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md max-w-md w-full">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-2">
              <AlertCircle size={40} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Video Not Found
              </h3>
              <p className="text-white/70 mb-2 leading-relaxed">
                We couldn't load the video from this specific path. It might
                have been moved or deleted.
              </p>
              <div className="bg-black/40 p-3 rounded-lg mt-4 inline-block">
                <p className="text-white/50 text-xs font-mono break-all text-left">
                  {currentPathToPlay}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-500">
            <video
              key={currentPathToPlay}
              controls
              autoPlay
              playsInline
              className="max-w-full max-h-full object-contain shadow-2xl rounded-xl bg-black border border-white/20"
              onError={(e) => {
                // Ignore generic MEDIA_ERR_ABORTED (code: 1) firing during unmounts
                if (e.target.error && e.target.error.code !== 1) {
                  setHasError(true);
                }
              }}
            >
              <source src={`${currentPathToPlay}?v=${Date.now()}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        <div className="text-center">
          <p className="text-white/80 text-base font-semibold tracking-wide">
            Video Training Materials
          </p>
          <p className="text-white/40 text-xs mt-2 uppercase tracking-widest">
            Press ESC to close or click outside the video
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoViewer;
