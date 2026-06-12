import React, { useState, useEffect } from 'react';
import { Sparkles, X, Star } from 'lucide-react';
import { KHMER_NEW_YEAR } from '../thems';

const KhmerNewYearSplash = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        // Only run if the theme is active and we haven't shown it this session
        const hasSeenSplash = sessionStorage.getItem('hasSeenKhmerNewYearSplash_v2_2026');
        
        if (KHMER_NEW_YEAR.isActive && !hasSeenSplash) {
            // Slight delay before showing for dramatic effect
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            setIsClosing(false);
            sessionStorage.setItem('hasSeenKhmerNewYearSplash_v2_2026', 'true');
        }, 800); // Wait for fade out animation
    };

    if (!isVisible && !isClosing) return null;

    // Advanced 3D Petal & Sparkle Particle System
    const renderMagicalParticles = () => {
        const particles = [];
        for (let i = 0; i < 40; i++) {
            const isStar = Math.random() > 0.7;
            const left = Math.random() * 100;
            const animationDuration = 3 + Math.random() * 5;
            const animationDelay = Math.random() * 5;
            const opacity = 0.3 + Math.random() * 0.7;
            const size = isStar ? 4 + Math.random() * 6 : 8 + Math.random() * 12;
            const color = isStar ? 'bg-yellow-100' : 'bg-gradient-to-br from-yellow-300 to-orange-500';
            
            particles.push(
                <div 
                    key={i}
                    className={`absolute rounded-full ${color} shadow-[0_0_10px_rgba(250,204,21,0.8)] z-50`}
                    style={{
                        left: `${left}%`,
                        top: '-30px',
                        width: `${size}px`,
                        height: isStar ? `${size}px` : `${size * 1.2}px`,
                        opacity,
                        borderRadius: isStar ? '50%' : '50% 0 50% 50%',
                        animation: `swayFall ${animationDuration}s ease-in-out ${animationDelay}s infinite`,
                        filter: isStar ? 'blur(1px)' : 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))'
                    }}
                />
            );
        }
        return particles;
    };

    return (
        <div className={`fixed inset-0 z-[99999] flex items-center justify-center transition-all duration-700 ${isClosing ? 'opacity-0 scale-105 blur-md pointer-events-none' : 'opacity-100 scale-100 blur-0'}`}>
            {/* Immersive Deep Red/Gold Radial Backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,10,0,0.8)_0%,rgba(0,0,0,0.95)_100%)] backdrop-blur-xl" onClick={handleClose}></div>
            
            {/* Main Premium Modal Container */}
            <div className="relative w-[92%] max-w-2xl bg-black/40 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(250,204,21,0.15),0_0_30px_rgba(239,68,68,0.2)] border border-yellow-500/20 font-sans transform transition-all duration-1000 animate-floatContainer">
                
                {/* Inner Glowing Ring */}
                <div className="absolute inset-0 rounded-[2.5rem] border-[1px] border-white/10 pointer-events-none z-50 mix-blend-overlay"></div>

                {/* Magical Background Kbach Watermark */}
                <div className="absolute inset-0 opacity-20 bg-repeat bg-[length:300px_300px] animate-spin-extremely-slow pointer-events-none mix-blend-color-dodge z-0" 
                     style={{ backgroundImage: 'url(/assets/theme/kbach-pattern.png)' }}></div>

                {/* Close Button - Glassmorphic */}
                <button 
                    onClick={handleClose}
                    className="absolute top-5 right-5 z-50 p-2.5 bg-white/5 hover:bg-white/20 hover:scale-110 hover:rotate-90 text-white/70 hover:text-white rounded-full transition-all duration-300 backdrop-blur-md border border-white/10 shadow-lg"
                >
                    <X size={20} strokeWidth={2.5} />
                </button>

                {/* Hero Stage Container */}
                <div className="relative h-72 md:h-80 w-full overflow-hidden bg-gradient-to-b from-orange-950/60 to-transparent">
                    
                    {/* Particles System */}
                    <div className="absolute inset-0 z-40 overflow-hidden pointer-events-none mask-fade-out">
                        {renderMagicalParticles()}
                    </div>
                    
                    {/* Glowing Sun behind Angkor Wat */}
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-tr from-yellow-500 via-orange-400 to-red-500 rounded-full blur-[80px] opacity-70 animate-pulse-slow z-10"></div>

                    {/* Angkor Wat Majestic Image w/ Masking */}
                    <div className="absolute inset-0 z-20 w-[110%] -left-[5%] h-[120%] -top-[10%]">
                         <img 
                            src="/assets/theme/angkor-wat.png" 
                            alt="Angkor Wat Sunrise" 
                            className="w-full h-full object-cover mix-blend-screen opacity-90 animate-ken-burns transition-transform duration-[20s]"
                            style={{ WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)' }}
                        />
                    </div>
                </div>

                {/* Rich Content Section */}
                <div className="relative z-30 px-6 md:px-12 pb-12 pt-0 text-center flex flex-col items-center">
                    
                    {/* Floating Badge */}
                    <div className="inline-flex items-center justify-center gap-2 px-5 py-2 mb-6 rounded-full bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs md:text-sm font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(250,204,21,0.2)] backdrop-blur-sm animate-float">
                        <Star size={14} className="text-yellow-400 animate-pulse" fill="currentColor" />
                        Khmer New Year 2026
                        <Star size={14} className="text-yellow-400 animate-pulse" fill="currentColor" />
                    </div>
                    
                    {/* Majestic Title w/ Metallic Gold FX */}
                    <h2 className="text-5xl md:text-6xl font-black mb-5 tracking-tight font-khmer relative">
                        {/* Shadow layer for depth */}
                        <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-b from-orange-900 to-red-950 translate-y-[3px] blur-[2px] z-0">
                            សួស្តីឆ្នាំថ្មី
                        </span>
                        {/* Metallic shining layer */}
                        <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-[#FFF7D6] via-[#FCE38A] to-[#F38181] animate-shine bg-[length:200%_auto] drop-shadow-[0_2px_10px_rgba(250,204,21,0.5)]">
                            សួស្តីឆ្នាំថ្មី
                        </span>
                    </h2>
                    
                    {/* Elegant Message body */}
                    <p className="max-w-[420px] text-zinc-300 text-sm md:text-base leading-relaxed mb-10 font-medium drop-shadow-md">
                        May the celestial blessings bring you and your enterprise immense prosperity, infinite joy, and roaring success forward.
                    </p>
                    
                    {/* Premium Enter Button */}
                    <div className="w-full max-w-[320px] relative group">
                        {/* Button Glow behind */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse-slow"></div>
                        
                        <button 
                            onClick={handleClose}
                            className="relative w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 border border-white/20 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transition-all transform hover:-translate-y-1 active:scale-95 overflow-hidden flex items-center justify-center gap-3"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <Sparkles size={20} className="w-5 h-5" />
                                ENTER WORKSPACE
                            </span>
                            {/* Sweeping Shine Effect inside Button */}
                            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-sweep"></div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Advanced UI Injectable Animations */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes swayFall {
                    0% { transform: translate(0, -20px) rotate(0deg) scale(0.8); opacity: 0; }
                    10% { opacity: 1; }
                    50% { transform: translate(30px, 150px) rotate(180deg) scale(1.1); }
                    80% { opacity: 0.8; }
                    100% { transform: translate(-20px, 350px) rotate(360deg) scale(0.9); opacity: 0; }
                }
                @keyframes floatContainer {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes shine {
                    to { background-position: 200% center; }
                }
                @keyframes sweep {
                    100% { left: 200%; }
                }
                @keyframes ken-burns {
                    0% { transform: scale(1) translate(0, 0); }
                    100% { transform: scale(1.15) translate(-2%, -2%); }
                }
                .mask-fade-out {
                    mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%);
                    -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%);
                }
                .animate-spin-extremely-slow {
                    animation: spin 120s linear infinite;
                }
                .animate-pulse-slow {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}}></style>
        </div>
    );
};

export default KhmerNewYearSplash;
