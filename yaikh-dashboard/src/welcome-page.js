import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from './translate/TranslationContext';

const WelcomePage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [currentVideoIndex, setCurrentVideoIndex] = useState(null); // No video selected initially
    const [isPlaying, setIsPlaying] = useState(false);
    const [videoPlayingStates, setVideoPlayingStates] = useState([false, false, false, false]); // Track playing state for each video
    const [videoLoadedStates, setVideoLoadedStates] = useState([false, false, false, false]); // Track if videos are loaded
    const [audioEnabled, setAudioEnabled] = useState(true); // Audio enabled by default
    const [volume, setVolume] = useState(0.7); // Default volume (70%)
    const [videoMuted, setVideoMuted] = useState([false, false, false, false]); // Individual mute state for each video
    const [videoLanguage, setVideoLanguage] = useState('en'); // 'en' for English, 'zh' for Chinese
    const videoRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null)
    ];

    // English video filenames
    const englishVideoFilenames = [
        'ot-cost.mp4',
        'Support-Ticket-System.mp4',
        'Yai-Purhcase.mp4',
        'production-record.mp4'
    ];

    // Chinese video filenames (different naming convention)
    const chineseVideoFilenames = [
        'ot-cost-chinese.mp4',
        'support-ticket-chinese.mp4',
        'purchase-request-chinese.mp4',
        'production-chinese.mp4'
    ];

    // Get video paths based on selected language
    const getVideoPaths = () => {
        if (videoLanguage === 'zh') {
            const basePath = '/assets/videos/chinese/';
            return chineseVideoFilenames.map(filename => `${basePath}${filename}`);
        } else {
            const basePath = '/assets/videos/';
            return englishVideoFilenames.map(filename => `${basePath}${filename}`);
        }
    };

    const videos = getVideoPaths();

    const videoTitles = [
        'OT Cost',
        'Support Ticket System',
        'Yai Purchase',
        'Production'
    ];

    // Panel images (static preview images for each video)
    const panelImages = [
        '/assets/videos/ot-cost-preview.jpg', // Factory floor scene
        '/assets/videos/support-ticket-preview.jpg', // Account Department
        '/assets/videos/purchase-preview.jpg', // Planning Department
        '/assets/videos/production-preview.jpg' // Industrial/warehouse scene
    ];

    const enableAudioAndPlay = async () => {
        setAudioEnabled(true);
        // Enable audio on all videos
        videoRefs.forEach(ref => {
            if (ref.current) {
                ref.current.muted = false;
                ref.current.volume = volume;
            }
        });
        // If current video is paused, play it
        if (videoRefs[currentVideoIndex].current) {
            try {
                if (videoRefs[currentVideoIndex].current.paused) {
                    await videoRefs[currentVideoIndex].current.play();
                }
                setIsPlaying(true);
            } catch (error) {
                console.log('Play error:', error);
            }
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        // Enable audio when user adjusts volume
        if (newVolume > 0 && !audioEnabled) {
            setAudioEnabled(true);
        }
        // Update volume on all videos (only if not individually muted)
        videoRefs.forEach((ref, index) => {
            if (ref.current) {
                ref.current.volume = newVolume;
                // Only mute if volume is 0 OR video is individually muted
                ref.current.muted = newVolume === 0 || videoMuted[index];
            }
        });
    };

    const toggleVideoMute = (index, e) => {
        e.stopPropagation(); // Prevent panel click
        const newMuted = [...videoMuted];
        newMuted[index] = !newMuted[index];
        setVideoMuted(newMuted);
        
        if (videoRefs[index].current) {
            videoRefs[index].current.muted = newMuted[index] || volume === 0;
        }
    };

    // No autoplay - videos will only play when clicked

    // Update muted state and volume when audioEnabled, volume, or videoMuted changes
    useEffect(() => {
        videoRefs.forEach((ref, index) => {
            if (ref.current) {
                // Mute if: volume is 0, audio not enabled, OR video is individually muted
                ref.current.muted = !audioEnabled || volume === 0 || videoMuted[index];
                ref.current.volume = audioEnabled ? volume : 0;
            }
        });
    }, [audioEnabled, volume, videoMuted]);

    const handleVideoEnd = () => {
        // When video ends, just stop playing - no automatic navigation
        setIsPlaying(false);
    };

    // Update video when currentVideoIndex changes (when user clicks a video)
    useEffect(() => {
        // Stop all videos except the current one
        videoRefs.forEach((ref, idx) => {
            if (ref.current && idx !== currentVideoIndex && currentVideoIndex !== null) {
                ref.current.pause();
                ref.current.currentTime = 0;
            }
        });
        
        // Play current video when index changes (triggered by user click)
        if (currentVideoIndex !== null && videoRefs[currentVideoIndex].current) {
            const video = videoRefs[currentVideoIndex].current;
            video.muted = volume === 0 || videoMuted[currentVideoIndex];
            video.volume = volume;
            // Play with sound enabled
            video.play().then(() => {
                setIsPlaying(true);
            }).catch(console.error);
        }
    }, [currentVideoIndex]);

    // Update videos when language changes
    useEffect(() => {
        // Stop all videos and reset when language changes
        videoRefs.forEach((ref, index) => {
            if (ref.current) {
                ref.current.pause();
                ref.current.currentTime = 0;
            }
        });
        setCurrentVideoIndex(null);
        setIsPlaying(false);
        setVideoPlayingStates([false, false, false, false]);
        setVideoLoadedStates([false, false, false, false]); // Reset loaded states when language changes
    }, [videoLanguage]);

    const toggleVideoLanguage = () => {
        setVideoLanguage(prev => prev === 'en' ? 'zh' : 'en');
    };

    const handleBack = () => {
        // Stop all videos
        videoRefs.forEach(ref => {
            if (ref.current) {
                ref.current.pause();
            }
        });
        // Navigate back to dashboard
        navigate('/', { replace: true });
    };

    // Background color based on video language
    const backgroundClass = videoLanguage === 'zh' 
        ? 'bg-gradient-to-br from-red-600 via-red-500 to-pink-500' 
        : 'bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500';

    return (
        <div className={`fixed inset-0 ${backgroundClass} flex items-center justify-center overflow-hidden p-6 transition-colors duration-500`}>
            {/* Home and Back Buttons - Centered at Top */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-4">
                
                    {/* Back Button */}
                <button
                    onClick={handleBack}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 border border-white/20"
                >
                    <span>Back</span>
                    <span>←</span>
                </button>
                 {/* Home Button */}
                 <button
                    onClick={() => navigate('/')}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-white/30 hover:border-white/50 transition-all hover:scale-110 cursor-pointer flex-shrink-0 shadow-lg"
                    title="Home"
                >
                    <img 
                        src="/logo.jpg" 
                        alt="Home" 
                        className="w-full h-full object-cover"
                    />
                </button>
                
                {/* Video Language Switcher Button */}
                <button
                    onClick={toggleVideoLanguage}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 border border-white/20"
                    title={videoLanguage === 'en' ? t('switchToChinese') : t('switchToEnglish')}
                >
                    <span>{videoLanguage === 'en' ? t('english') : t('chinese')}</span>
                </button>
             
                
               
            </div>

            {/* Welcome Header - Centered with effects */}
            {/* <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30 text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-2 animate-fade-in-up">
                    <span className="bg-gradient-to-r from-yellow-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient drop-shadow-2xl">
                        Welcome
                    </span>
                </h1>
                <p className="text-white/70 text-sm animate-fade-in-up-delay">Explore our comprehensive business management system</p>
            </div> */}

            {/* 4 Panel Grid Layout - Matching Image */}
            <div className="w-full max-w-[95vw] h-full grid grid-cols-2 grid-rows-2 gap-4 mt-20">


                {/* Panel 1 - Top Left: Production/Factory Floor */}
                {videos.map((video, index) => {
                    const isActive = index === currentVideoIndex && isPlaying;
                    const departmentInfo = [
                        { name: 'Production', icon: '🏭', color: 'from-green-500/20 to-emerald-500/20', border: 'border-green-400/30' },
                        { name: 'Account Department', icon: '📊', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-400/30' },
                        { name: 'Planning Department', icon: '📅', color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-400/30' },
                        { name: 'Warehouse', icon: '📦', color: 'from-orange-500/20 to-amber-500/20', border: 'border-orange-400/30' }
                    ];
                    
                    return (
                        <div
                            key={index}
                            className={`relative rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ${
                                isActive ? 'ring-4 ring-yellow-400 scale-105 z-20' : 'hover:scale-102'
                            }`}
                            style={{
                                background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)'
                            }}
                        >
                            {/* Preview Image Background - Show as fallback when video not playing */}
                            {!videoPlayingStates[index] && (
                                <img
                                    src={panelImages[index] || video}
                                    alt={videoTitles[index]}
                                    className="absolute inset-0 w-full h-full transition-opacity duration-500 opacity-100 z-0"
                                    style={{
                                        objectFit: 'cover',
                                        width: '100%',
                                        height: '100%'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            )}
                            
                            {/* Video - All videos visible, only active one plays */}
                            <video
                                ref={videoRefs[index]}
                                src={video}
                                poster={panelImages[index]}
                                className={`absolute inset-0 w-full h-full transition-opacity duration-500 opacity-100 ${
                                    isActive && videoPlayingStates[index] ? 'z-10' : 'z-5'
                                } ${videoPlayingStates[index] ? 'cursor-pointer' : ''}`}
                                onEnded={handleVideoEnd}
                                onPlay={() => {
                                    const newStates = [...videoPlayingStates];
                                    newStates[index] = true;
                                    setVideoPlayingStates(newStates);
                                    setIsPlaying(true);
                                }}
                                onPause={() => {
                                    const newStates = [...videoPlayingStates];
                                    newStates[index] = false;
                                    setVideoPlayingStates(newStates);
                                    setIsPlaying(false);
                                }}
                                onClick={() => {
                                    // Click to pause when video is playing
                                    if (videoPlayingStates[index] && videoRefs[index].current) {
                                        videoRefs[index].current.pause();
                                    }
                                }}
                                onLoadedData={() => {
                                    // Set up video properties when loaded
                                    const newLoadedStates = [...videoLoadedStates];
                                    newLoadedStates[index] = true;
                                    setVideoLoadedStates(newLoadedStates);
                                    if (videoRefs[index].current) {
                                        videoRefs[index].current.muted = volume === 0 || videoMuted[index];
                                        videoRefs[index].current.volume = volume;
                                    }
                                }}
                                onLoadedMetadata={() => {
                                    // Mark video as loaded when metadata is available
                                    const newLoadedStates = [...videoLoadedStates];
                                    newLoadedStates[index] = true;
                                    setVideoLoadedStates(newLoadedStates);
                                }}
                                onError={(e) => {
                                    console.error(`Error loading video: ${video}`, e);
                                    // Even if video fails to load, mark it as "loaded" so UI doesn't break
                                    const newLoadedStates = [...videoLoadedStates];
                                    newLoadedStates[index] = true;
                                    setVideoLoadedStates(newLoadedStates);
                                }}
                                controls={false}
                                muted={volume === 0 || videoMuted[index]}
                                autoPlay={false}
                                loop={false}
                                playsInline
                                preload="auto"
                                key={`video-${index}-${videoLanguage}`}
                                style={{
                                    objectFit: 'contain',
                                    width: '100%',
                                    height: '100%',
                                    display: 'block'
                                }}
                            />



                            {/* Play Button Overlay - Show when video is not playing */}
                            {!videoPlayingStates[index] && (
                                <div 
                                    className="absolute inset-0 bg-black/30 hover:bg-black/20 transition-colors flex items-center justify-center cursor-pointer z-30"
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        setCurrentVideoIndex(index);
                                        setAudioEnabled(true); // Enable audio when user clicks
                                        if (videoRefs[index].current) {
                                            try {
                                                // Ensure video is loaded
                                                if (videoRefs[index].current.readyState < 2) {
                                                    await videoRefs[index].current.load();
                                                }
                                                videoRefs[index].current.muted = volume === 0 || videoMuted[index];
                                                videoRefs[index].current.volume = volume;
                                                await videoRefs[index].current.play();
                                                setIsPlaying(true);
                                            } catch (error) {
                                                console.error(`Error playing video ${video}:`, error);
                                            }
                                        }
                                    }}
                                >
                                    <div className="text-white text-6xl opacity-70 hover:opacity-100 transition-opacity">
                                        ▶
                                    </div>
                                </div>
                            )}

                            {/* Progress Indicator - Top Right Corner (small, minimal) */}
                            {currentVideoIndex !== null && (
                                <div className="absolute top-2 right-2 z-20 flex gap-1 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1">
                                    {videos.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1 rounded-full transition-all duration-300 ${
                                                idx === currentVideoIndex && isPlaying
                                                    ? 'bg-yellow-400 w-5'
                                                    : 'bg-white/30 w-2'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>



            {/* Custom Animations */}
            <style>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes gradient {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }

                @keyframes sparkle {
                    0%, 100% {
                        opacity: 0;
                        transform: scale(0) rotate(0deg);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1) rotate(180deg);
                    }
                }

                @keyframes magic-glow {
                    0%, 100% {
                        box-shadow: 0 0 20px rgba(255, 215, 0, 0.5),
                                    0 0 40px rgba(255, 215, 0, 0.3),
                                    0 0 60px rgba(255, 215, 0, 0.2);
                    }
                    50% {
                        box-shadow: 0 0 30px rgba(255, 215, 0, 0.8),
                                    0 0 60px rgba(255, 215, 0, 0.5),
                                    0 0 90px rgba(255, 215, 0, 0.3);
                    }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 1s ease-out forwards;
                }

                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }

                .animate-sparkle {
                    animation: sparkle 2s ease-in-out infinite;
                }

                .animate-fade-in-up-delay {
                    animation: fade-in-up 1s ease-out 0.3s forwards;
                    opacity: 0;
                }

                /* Custom slider styling */
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: rgba(255, 215, 0, 1);
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                }

                .slider::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: rgba(255, 215, 0, 1);
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                }
            `}</style>
        </div>
    );
};

export default WelcomePage;

