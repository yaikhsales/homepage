import React, { useEffect, useState, useRef } from 'react';

const DragonAnimation = ({ 
    onComplete, 
    targetElement, 
    mode = 'initial', // 'initial' or 'back'
    onFireComplete,
    onClose // Callback to close the bot when in 'back' mode
}) => {
    const [animationPhase, setAnimationPhase] = useState('flying');
    const [dragonPosition, setDragonPosition] = useState({ x: -100, y: 50 });
    const [fireActive, setFireActive] = useState(false);
    const [dragonRotation, setDragonRotation] = useState(0);
    const [previousPosition, setPreviousPosition] = useState({ x: -100, y: 50 });
    const dragonRef = useRef(null);
    const animationFrameRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (mode === 'initial') {
            startInitialAnimation();
        } else if (mode === 'back') {
            startBackAnimation();
        } else if (mode === 'yai1' || mode === 'yai2') {
            startTargetAnimation();
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, targetElement]);

    // Green screen removal using canvas
    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        if (!video || !canvas) return;
        
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        let animationId = null;
        
        const processFrame = () => {
            if (video.readyState >= video.HAVE_CURRENT_DATA) {
                // Use larger canvas for better quality
                const displayWidth = 350;
                const displayHeight = 350;
                
                // Set canvas to video dimensions for processing
                canvas.width = video.videoWidth || displayWidth;
                canvas.height = video.videoHeight || displayHeight;
                
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                // Remove green screen (chroma key) - improved algorithm
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    
                    // Enhanced green screen detection
                    const greenThreshold = 100;
                    const greenDominance = g > r + 25 && g > b + 25;
                    const greenBrightness = g > greenThreshold;
                    
                    // Calculate green intensity
                    const greenIntensity = (g - Math.max(r, b)) / 255;
                    
                    if (greenDominance && greenBrightness && greenIntensity > 0.2) {
                        // Smooth transparency based on green intensity
                        const transparency = Math.min(1, greenIntensity * 2);
                        data[i + 3] = Math.floor(data[i + 3] * (1 - transparency));
                    }
                }
                
                ctx.putImageData(imageData, 0, 0);
            }
            animationId = requestAnimationFrame(processFrame);
        };
        
        const handleLoadedMetadata = () => {
            if (video.videoWidth && video.videoHeight) {
                // Set canvas to video dimensions
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                processFrame();
            }
        };
        
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        if (video.readyState >= video.HAVE_METADATA) {
            handleLoadedMetadata();
        }
        
        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, []);

    const flyOut = () => {
        const exitX = window.innerWidth + 200;
        const exitY = -100;
        animateToPosition(exitX, exitY, 2000, () => {
            if (onComplete) {
                onComplete();
            }
        });
    };

    const startInitialAnimation = () => {
        // Start from outside the screen (top-left)
        const startX = -100;
        const startY = -100;
        setDragonPosition({ x: startX, y: startY });
        setPreviousPosition({ x: startX, y: startY });
        setAnimationPhase('targeting');

        const flyToTarget = () => {
            if (!targetElement) {
                // Fallback: fly to top-left where Yai Data button is
                const targetX = 100;
                const targetY = 100;
                animateToPosition(targetX, targetY, 1500, () => {
                    setAnimationPhase('stopped');
                    // Stop for 3 seconds
                    setTimeout(() => {
                        setAnimationPhase('exiting');
                        flyOut();
                    }, 3000);
                });
                return;
            }

            const rect = targetElement.getBoundingClientRect();
            const targetX = rect.left + rect.width / 2;
            const targetY = rect.top + rect.height / 2;

            animateToPosition(targetX, targetY, 1500, () => {
                setAnimationPhase('stopped');
                // Stop for 3 seconds
                setTimeout(() => {
                    setAnimationPhase('exiting');
                    flyOut();
                }, 3000);
            });
        };

        // Wait a bit to ensure target element is available
        setTimeout(() => {
            flyToTarget();
        }, 300);
    };

    const startBackAnimation = () => {
        // Start from outside the screen (right side)
        const startX = window.innerWidth + 200;
        const startY = window.innerHeight / 2;
        setDragonPosition({ x: startX, y: startY });
        setPreviousPosition({ x: startX, y: startY });
        setDragonRotation(180); // Facing left when entering
        setAnimationPhase('targeting');

        // Wait a bit to ensure target element is available
        const findTarget = () => {
            // Target is the back button - typically top-left area
            const targetX = 50;
            const targetY = 50;

            animateToPosition(targetX, targetY, 1500, () => {
                setAnimationPhase('stopped');
                setFireActive(true);
                // Stop for 3 seconds, then close and exit
                setTimeout(() => {
                    if (onClose) {
                        onClose();
                    }
                    setTimeout(() => {
                        setAnimationPhase('exiting');
                        flyOutBack();
                    }, 500);
                }, 3000);
            });
        };

        setTimeout(findTarget, 300);
    };

    const startTargetAnimation = () => {
        // Start from outside the screen (top-left)
        const startX = -100;
        const startY = -100;
        setDragonPosition({ x: startX, y: startY });
        setPreviousPosition({ x: startX, y: startY });
        setAnimationPhase('targeting');

        const findTarget = () => {
            if (!targetElement) {
                // Fallback position
                const targetX = window.innerWidth / 2;
                const targetY = window.innerHeight / 2;
                animateToPosition(targetX, targetY, 1500, () => {
                    setAnimationPhase('stopped');
                    setTimeout(() => {
                        setAnimationPhase('exiting');
                        flyOut();
                    }, 3000);
                });
                return;
            }

            const rect = targetElement.getBoundingClientRect();
            const targetX = rect.left + rect.width / 2;
            const targetY = rect.top + rect.height / 2;

            animateToPosition(targetX, targetY, 1500, () => {
                setAnimationPhase('stopped');
                // Stop for 3 seconds
                setTimeout(() => {
                    setAnimationPhase('exiting');
                    flyOut();
                }, 3000);
            });
        };

        setTimeout(findTarget, 300);
    };

    const flyOutBack = () => {
        const exitX = -200;
        const exitY = window.innerHeight / 2;
        // Set rotation to face left when exiting
        setDragonRotation(180);
        animateToPosition(exitX, exitY, 1500, () => {
            if (onComplete) {
                onComplete();
            }
        });
    };

    const animateToPosition = (targetX, targetY, duration, onComplete) => {
        const startX = dragonPosition.x;
        const startY = dragonPosition.y;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeInOutCubic = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            const currentX = startX + (targetX - startX) * easeInOutCubic;
            const currentY = startY + (targetY - startY) * easeInOutCubic;

            // Calculate rotation based on movement direction
            const deltaX = currentX - previousPosition.x;
            const deltaY = currentY - previousPosition.y;
            
            if (Math.abs(deltaX) > 0.1 || Math.abs(deltaY) > 0.1) {
                // Calculate angle in degrees (0 = right, 90 = down, -90 = up, 180/-180 = left)
                const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
                setDragonRotation(angle);
            }

            setPreviousPosition({ x: currentX, y: currentY });
            setDragonPosition({ x: currentX, y: currentY });

            if (progress < 1) {
                animationFrameRef.current = requestAnimationFrame(animate);
            } else {
                if (onComplete) {
                    onComplete();
                }
            }
        };

        animate();
    };

    // Calculate dragon rotation based on movement direction
    const getDragonRotation = () => {
        // Use the calculated rotation from movement direction
        // Add 90 degrees because atan2 gives 0 for right, but we want 0 for up
        return dragonRotation + 90;
    };

    return (
        <>
            <style>{`
                @keyframes dragonflyHover {
                    0%, 100% { 
                        transform: translateY(0px) scale(1);
                    }
                    25% { 
                        transform: translateY(-8px) scale(1.03);
                    }
                    50% { 
                        transform: translateY(-12px) scale(1.05);
                    }
                    75% { 
                        transform: translateY(-8px) scale(1.03);
                    }
                }
                @keyframes dragonflyWingFlap {
                    0%, 100% { 
                        transform: scaleY(1);
                    }
                    25% { 
                        transform: scaleY(0.88);
                    }
                    50% { 
                        transform: scaleY(0.92);
                    }
                    75% { 
                        transform: scaleY(0.88);
                    }
                }
                @keyframes dragonflyPulse {
                    0%, 100% { 
                        filter: brightness(1) drop-shadow(0 0 20px rgba(255, 0, 0, 0.8)) drop-shadow(0 0 30px rgba(0, 255, 0, 0.6));
                    }
                    50% { 
                        filter: brightness(1.3) drop-shadow(0 0 40px rgba(255, 0, 0, 1)) drop-shadow(0 0 50px rgba(0, 255, 0, 0.9));
                    }
                }
                @keyframes christmasColorShift {
                    0% { 
                        filter: hue-rotate(0deg) drop-shadow(0 0 30px rgba(255, 0, 0, 0.9));
                    }
                    33% { 
                        filter: hue-rotate(120deg) drop-shadow(0 0 30px rgba(0, 255, 0, 0.9));
                    }
                    66% { 
                        filter: hue-rotate(240deg) drop-shadow(0 0 30px rgba(255, 215, 0, 0.9));
                    }
                    100% { 
                        filter: hue-rotate(360deg) drop-shadow(0 0 30px rgba(255, 0, 0, 0.9));
                    }
                }
                @keyframes snowflake {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
                @keyframes christmasSparkle {
                    0%, 100% {
                        opacity: 0;
                        transform: scale(0) rotate(0deg);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.5) rotate(180deg);
                    }
                }
                @keyframes dragonflyBodyBob {
                    0%, 100% { 
                        transform: translateY(0px);
                    }
                    50% { 
                        transform: translateY(-3px);
                    }
                }
                @keyframes orbPulse {
                    0%, 100% { 
                        transform: scale(1);
                        opacity: 0.9;
                    }
                    50% { 
                        transform: scale(1.2);
                        opacity: 1;
                    }
                }
                @keyframes orbRotate {
                    0% { 
                        transform: rotate(0deg);
                    }
                    100% { 
                        transform: rotate(360deg);
                    }
                }
                @keyframes ringRotate {
                    0% { 
                        transform: rotate(0deg) scale(1);
                    }
                    50% { 
                        transform: rotate(180deg) scale(1.1);
                    }
                    100% { 
                        transform: rotate(360deg) scale(1);
                    }
                }
                @keyframes particleFloat {
                    0%, 100% { 
                        transform: translate(0, 0) scale(1);
                        opacity: 0.8;
                    }
                    25% { 
                        transform: translate(10px, -15px) scale(1.2);
                        opacity: 1;
                    }
                    50% { 
                        transform: translate(-10px, -20px) scale(0.9);
                        opacity: 0.9;
                    }
                    75% { 
                        transform: translate(-15px, -10px) scale(1.1);
                        opacity: 1;
                    }
                }
                @keyframes sparkleRotate {
                    0% { 
                        transform: rotate(0deg) scale(0.8);
                        opacity: 0.6;
                    }
                    50% { 
                        transform: rotate(180deg) scale(1.2);
                        opacity: 1;
                    }
                    100% { 
                        transform: rotate(360deg) scale(0.8);
                        opacity: 0.6;
                    }
                }
                @keyframes sparkleLine {
                    0%, 100% { 
                        opacity: 0;
                        transform: scale(0);
                    }
                    50% { 
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                @keyframes sparkleFloat {
                    0%, 100% { 
                        opacity: 0;
                        transform: translateY(0) scale(0);
                    }
                    50% { 
                        opacity: 1;
                        transform: translateY(-20px) scale(1);
                    }
                }
                @keyframes magicalPulse {
                    0%, 100% { 
                        opacity: 0.6;
                        transform: scale(1);
                    }
                    50% { 
                        opacity: 0.9;
                        transform: scale(1.1);
                    }
                }
                @keyframes fireGlow {
                    0%, 100% { 
                        opacity: 0.8;
                        transform: scale(1);
                    }
                    50% { 
                        opacity: 1;
                        transform: scale(1.2);
                    }
                }
                @keyframes fireParticles {
                    0% {
                        transform: translateY(0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-30px) scale(0.5);
                        opacity: 0;
                    }
                }
                .dragon-container {
                    position: fixed;
                    z-index: 10000;
                    pointer-events: none;
                    animation: dragonflyHover 1.2s ease-in-out infinite, dragonflyPulse 2.5s ease-in-out infinite;
                }
                .dragonfly-body {
                    animation: dragonflyBodyBob 0.8s ease-in-out infinite;
                }
                .missile-container {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100px;
                    height: 200px;
                }
                .missile-body {
                    position: relative;
                    width: 30px;
                    height: 140px;
                    z-index: 2;
                    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
                }
                .missile-exhaust {
                    position: absolute;
                    bottom: -60px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 50px;
                    height: 120px;
                    z-index: 1;
                }
                .exhaust-core {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 20px;
                    height: 60px;
                    background: radial-gradient(ellipse at center bottom,
                        rgba(255, 255, 255, 1) 0%,
                        rgba(255, 255, 200, 1) 10%,
                        rgba(255, 200, 0, 1) 25%,
                        rgba(255, 150, 0, 1) 50%,
                        rgba(255, 100, 0, 0.9) 75%,
                        rgba(255, 0, 0, 0.7) 100%);
                    border-radius: 50% 50% 50% 50% / 70% 70% 30% 30%;
                    animation: exhaustCore 0.08s ease-in-out infinite;
                    filter: blur(1px);
                    box-shadow: 0 0 20px rgba(255, 200, 0, 0.8);
                }
                .exhaust-flame {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 35px;
                    height: 80px;
                    background: radial-gradient(ellipse at center bottom,
                        rgba(255, 200, 0, 0.9) 0%,
                        rgba(255, 100, 0, 0.8) 30%,
                        rgba(255, 0, 0, 0.7) 60%,
                        rgba(200, 0, 0, 0.5) 90%,
                        transparent 100%);
                    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                    animation: exhaustFlicker 0.12s ease-in-out infinite;
                    filter: blur(3px);
                }
                .exhaust-outer {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 45px;
                    height: 100px;
                    background: radial-gradient(ellipse at center bottom,
                        rgba(255, 150, 0, 0.6) 0%,
                        rgba(255, 50, 0, 0.5) 40%,
                        rgba(150, 0, 0, 0.3) 80%,
                        transparent 100%);
                    border-radius: 50% 50% 50% 50% / 65% 65% 35% 35%;
                    animation: exhaustOuter 0.15s ease-in-out infinite;
                    filter: blur(5px);
                }
                .exhaust-smoke {
                    position: absolute;
                    bottom: -30px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 70px;
                    height: 120px;
                    background: radial-gradient(ellipse at center,
                        rgba(120, 120, 120, 0.5) 0%,
                        rgba(80, 80, 80, 0.4) 30%,
                        rgba(50, 50, 50, 0.3) 60%,
                        transparent 100%);
                    border-radius: 50%;
                    animation: smokeDrift 0.6s ease-out infinite;
                    filter: blur(10px);
                }
                .exhaust-particle {
                    position: absolute;
                    width: 3px;
                    height: 3px;
                    background: #FFD700;
                    border-radius: 50%;
                    box-shadow: 0 0 6px rgba(255, 200, 0, 1), 0 0 12px rgba(255, 150, 0, 0.8);
                    animation: particleTrail 0.4s ease-out infinite;
                }
                @keyframes exhaustCore {
                    0%, 100% {
                        transform: translateX(-50%) scaleY(1) scaleX(1);
                        opacity: 1;
                    }
                    50% {
                        transform: translateX(-50%) scaleY(1.15) scaleX(0.9);
                        opacity: 0.95;
                    }
                }
                @keyframes exhaustFlicker {
                    0%, 100% {
                        transform: translateX(-50%) scaleY(1) scaleX(1);
                        opacity: 0.85;
                    }
                    25% {
                        transform: translateX(-50%) scaleY(1.2) scaleX(0.92);
                        opacity: 0.9;
                    }
                    50% {
                        transform: translateX(-50%) scaleY(0.9) scaleX(1.08);
                        opacity: 0.8;
                    }
                    75% {
                        transform: translateX(-50%) scaleY(1.1) scaleX(0.95);
                        opacity: 0.9;
                    }
                }
                @keyframes exhaustOuter {
                    0%, 100% {
                        transform: translateX(-50%) scaleY(1) scaleX(1);
                        opacity: 0.6;
                    }
                    50% {
                        transform: translateX(-50%) scaleY(1.3) scaleX(0.88);
                        opacity: 0.7;
                    }
                }
                @keyframes smokeDrift {
                    0% {
                        transform: translateX(-50%) translateY(0) scale(1);
                        opacity: 0.5;
                    }
                    100% {
                        transform: translateX(-50%) translateY(-40px) scale(1.5);
                        opacity: 0;
                    }
                }
                @keyframes particleTrail {
                    0% {
                        transform: translateY(0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100px) scale(0.2);
                        opacity: 0;
                    }
                }
                @keyframes missileShimmer {
                    0%, 100% {
                        filter: brightness(1) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
                    }
                    50% {
                        filter: brightness(1.1) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));
                    }
                }
                .sparkle-line:nth-child(1) {
                    transform: translate(-50%, -50%) rotate(0deg);
                }
                .sparkle-line:nth-child(2) {
                    transform: translate(-50%, -50%) rotate(90deg);
                    animation-delay: 0.2s;
                }
                .sparkle-line:nth-child(3) {
                    transform: translate(-50%, -50%) rotate(45deg);
                    animation-delay: 0.4s;
                }
                .sparkle-line:nth-child(4) {
                    transform: translate(-50%, -50%) rotate(135deg);
                    animation-delay: 0.6s;
                }
                .dragonfly-video {
                    position: relative;
                    /* Green screen removal using CSS filters and blend modes */
                    mix-blend-mode: screen;
                    /* Christmas party effects - red, green, gold colors */
                    filter: 
                        drop-shadow(0 0 30px rgba(255, 0, 0, 0.9))
                        drop-shadow(0 0 60px rgba(0, 255, 0, 0.8))
                        drop-shadow(0 0 90px rgba(255, 215, 0, 0.7))
                        brightness(1.3)
                        contrast(1.2)
                        saturate(1.4)
                        hue-rotate(0deg);
                    -webkit-filter: 
                        drop-shadow(0 0 30px rgba(255, 0, 0, 0.9))
                        drop-shadow(0 0 60px rgba(0, 255, 0, 0.8))
                        drop-shadow(0 0 90px rgba(255, 215, 0, 0.7))
                        brightness(1.3)
                        contrast(1.2)
                        saturate(1.4)
                        hue-rotate(0deg);
                    /* Wing flapping animation - faster for more realistic movement */
                    animation: dragonflyWingFlap 0.15s ease-in-out infinite, christmasColorShift 3s ease-in-out infinite;
                    /* Add subtle body movement */
                    transform-origin: center center;
                }
                /* Green screen removal mask */
                .dragonfly-video::after {
                    content: '';
                    position: absolute;
                    inset: -5px;
                    background: 
                        radial-gradient(circle at center,
                            transparent 30%,
                            rgba(0, 255, 0, 0.1) 50%,
                            transparent 70%);
                    mix-blend-mode: multiply;
                    pointer-events: none;
                    border-radius: 50%;
                    z-index: -1;
                }
                .magical-glow {
                    background: radial-gradient(circle at center, 
                        rgba(255, 0, 0, 0.4) 0%,
                        rgba(0, 255, 0, 0.3) 25%,
                        rgba(255, 215, 0, 0.3) 50%,
                        rgba(255, 192, 203, 0.2) 75%,
                        transparent 90%);
                    animation: magicalPulse 1.5s ease-in-out infinite, christmasColorShift 4s ease-in-out infinite;
                    pointer-events: none;
                    border-radius: 50%;
                    width: 120%;
                    height: 120%;
                    left: -10%;
                    top: -10%;
                }
                .sparkles-container {
                    pointer-events: none;
                }
                .sparkle-particle {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    background: radial-gradient(circle, #FF0000 0%, #00FF00 50%, #FFD700 100%);
                    border-radius: 50%;
                    animation: sparkleFloat 2s ease-in-out infinite, christmasSparkle 1.5s ease-in-out infinite;
                    box-shadow: 
                        0 0 10px rgba(255, 0, 0, 1),
                        0 0 20px rgba(0, 255, 0, 0.9),
                        0 0 30px rgba(255, 215, 0, 0.8);
                }
                .snowflake {
                    position: absolute;
                    color: white;
                    font-size: 20px;
                    pointer-events: none;
                    animation: snowflake linear infinite;
                    text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
                }
                .fire-effect {
                    animation: fireGlow 0.3s ease-in-out infinite;
                }
            `}</style>
            
            <div
                ref={dragonRef}
                className="dragon-container"
                style={{
                    left: `${dragonPosition.x}px`,
                    top: `${dragonPosition.y}px`,
                    transform: `translate(-50%, -50%) rotate(${getDragonRotation()}deg)`,
                    transition: 'transform 0.2s ease-out',
                }}
            >
                {/* Realistic Missile Animation */}
                <div className="missile-container">
                    {/* Missile Body */}
                    <svg className="missile-body" viewBox="0 0 30 140" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'missileShimmer 3s ease-in-out infinite' }}>
                        <defs>
                            <linearGradient id="missileBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#F5F5F5" stopOpacity="1" />
                                <stop offset="20%" stopColor="#E8E8E8" stopOpacity="1" />
                                <stop offset="50%" stopColor="#D0D0D0" stopOpacity="1" />
                                <stop offset="80%" stopColor="#B8B8B8" stopOpacity="1" />
                                <stop offset="100%" stopColor="#A0A0A0" stopOpacity="1" />
                            </linearGradient>
                            <linearGradient id="noseConeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                                <stop offset="50%" stopColor="#E0E0E0" stopOpacity="1" />
                                <stop offset="100%" stopColor="#C0C0C0" stopOpacity="1" />
                            </linearGradient>
                            <linearGradient id="finGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#888888" stopOpacity="1" />
                                <stop offset="100%" stopColor="#555555" stopOpacity="1" />
                            </linearGradient>
                            <radialGradient id="bodyShine" cx="50%" cy="30%" r="50%">
                                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                        {/* Main Body Cylinder */}
                        <ellipse cx="15" cy="90" rx="12" ry="50" fill="url(#missileBodyGradient)" />
                        {/* Body Shine/Highlight */}
                        <ellipse cx="15" cy="70" rx="10" ry="45" fill="url(#bodyShine)" />
                        {/* Nose Cone - More Realistic Shape */}
                        <path d="M 15 0 L 8 18 L 22 18 Z" fill="url(#noseConeGradient)" />
                        <path d="M 15 0 L 9 16 L 21 16 Z" fill="#F0F0F0" opacity="0.6" />
                        {/* Body Sections/Markings */}
                        <line x1="15" y1="25" x2="15" y2="130" stroke="#999" strokeWidth="0.5" opacity="0.6" />
                        <line x1="8" y1="40" x2="22" y2="40" stroke="#999" strokeWidth="0.5" opacity="0.4" />
                        <line x1="8" y1="60" x2="22" y2="60" stroke="#999" strokeWidth="0.5" opacity="0.4" />
                        <line x1="8" y1="80" x2="22" y2="80" stroke="#999" strokeWidth="0.5" opacity="0.4" />
                        {/* Fins - 4 Fins in Cross Pattern (More Realistic) */}
                        <path d="M 3 110 L 3 130 L 8 125 L 8 115 Z" fill="url(#finGradient)" />
                        <path d="M 27 110 L 27 130 L 22 125 L 22 115 Z" fill="url(#finGradient)" />
                        <path d="M 12 110 L 12 130 L 15 125 L 15 115 Z" fill="url(#finGradient)" />
                        <path d="M 18 110 L 18 130 L 15 125 L 15 115 Z" fill="url(#finGradient)" />
                        {/* Fin Details */}
                        <line x1="3" y1="120" x2="8" y2="120" stroke="#666" strokeWidth="0.5" />
                        <line x1="27" y1="120" x2="22" y2="120" stroke="#666" strokeWidth="0.5" />
                        {/* Warning Markings */}
                        <rect x="10" y="45" width="10" height="3" fill="#FF0000" opacity="0.8" />
                        <rect x="10" y="50" width="10" height="3" fill="#FFFF00" opacity="0.8" />
                        {/* Nose Tip */}
                        <circle cx="15" cy="2" r="1.5" fill="#FFD700" />
                    </svg>
                    
                    {/* Realistic Exhaust Trail */}
                    <div className="missile-exhaust">
                        {/* Core Exhaust (Brightest) */}
                        <div className="exhaust-core"></div>
                        {/* Main Flame */}
                        <div className="exhaust-flame"></div>
                        {/* Outer Flame Layer */}
                        <div className="exhaust-outer"></div>
                        {/* Smoke Trail */}
                        <div className="exhaust-smoke"></div>
                        {/* Exhaust Particles */}
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={`exhaust-particle-${i}`}
                                className="exhaust-particle"
                                style={{
                                    left: `${45 + (i % 5 - 2) * 8}%`,
                                    bottom: '0px',
                                    animationDelay: `${i * 0.02}s`,
                                    animationDuration: `${0.3 + Math.random() * 0.3}s`,
                                    width: `${2 + Math.random() * 2}px`,
                                    height: `${2 + Math.random() * 2}px`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Fire/Explosion Effect */}
                {fireActive && (
                    <div
                        className="fire-effect absolute top-full left-1/2 -translate-x-1/2"
                        style={{
                            width: '80px',
                            height: '100px',
                        }}
                    >
                        <svg
                            width="80"
                            height="100"
                            viewBox="0 0 80 100"
                            className="absolute"
                        >
                            <defs>
                                <linearGradient id="fireGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                                    <stop offset="20%" stopColor="#FFD700" stopOpacity="1" />
                                    <stop offset="50%" stopColor="#FF6600" stopOpacity="0.9" />
                                    <stop offset="80%" stopColor="#FF0000" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#660000" stopOpacity="0.6" />
                                </linearGradient>
                                <filter id="fireGlow">
                                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                                    <feMerge>
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                            
                            {/* Fire Flames */}
                            <path
                                d="M 40 100 Q 25 70 30 45 Q 40 55 50 45 Q 55 70 40 100"
                                fill="url(#fireGradient)"
                                filter="url(#fireGlow)"
                            />
                            <path
                                d="M 40 100 Q 20 65 25 40 Q 40 50 55 40 Q 60 65 40 100"
                                fill="url(#fireGradient)"
                                filter="url(#fireGlow)"
                                opacity="0.8"
                            />
                            
                            {/* Fire Particles */}
                            {[...Array(12)].map((_, i) => {
                                const colors = ['#FFFFFF', '#FFD700', '#FF6600', '#FF0000', '#FFAA00'];
                                return (
                                    <circle
                                        key={i}
                                        cx={20 + (i % 4) * 15}
                                        cy={70 - i * 4}
                                        r={4 + Math.random() * 3}
                                        fill={colors[i % colors.length]}
                                        opacity="0.8"
                                        style={{
                                            animation: `fireParticles ${0.4 + Math.random() * 0.4}s ease-out infinite`,
                                            animationDelay: `${i * 0.08}s`,
                                        }}
                                    />
                                );
                            })}
                        </svg>
                    </div>
                )}
            </div>
        </>
    );
};

export default DragonAnimation;

