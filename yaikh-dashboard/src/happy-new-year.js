import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Sparkles, Gift, PartyPopper } from 'lucide-react';

const HappyNewYear = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const confettiRef = useRef(null);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isNewYear, setIsNewYear] = useState(false);
    const [fireworks, setFireworks] = useState([]);
    const [confetti, setConfetti] = useState([]);

    // Calculate time until New Year 2026
    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const newYear = new Date('January 1, 2026 00:00:00');
            const difference = newYear - now;

            if (difference <= 0) {
                setIsNewYear(true);
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            }

            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / (1000 * 60)) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        };

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Fireworks animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.vx = (Math.random() - 0.5) * 10;
                this.vy = (Math.random() - 0.5) * 10;
                this.life = 1;
                this.decay = Math.random() * 0.02 + 0.01;
                this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
                this.size = Math.random() * 3 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.1; // gravity
                this.life -= this.decay;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.life;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        const createFirework = (x, y) => {
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle(x, y));
            }
        };

        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].update();
                particles[i].draw();

                if (particles[i].life <= 0) {
                    particles.splice(i, 1);
                }
            }

            requestAnimationFrame(animate);
        };

        animate();

        // Create fireworks periodically
        const fireworkInterval = setInterval(() => {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height * 0.5;
            createFirework(x, y);
        }, 2000);

        // Create initial fireworks
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height * 0.5;
                createFirework(x, y);
            }, i * 500);
        }

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(fireworkInterval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Confetti animation
    useEffect(() => {
        const canvas = confettiRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const confettiParticles = [];

        class ConfettiParticle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = -10;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = Math.random() * 3 + 2;
                this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
                this.size = Math.random() * 8 + 4;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = (Math.random() - 0.5) * 10;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.rotation += this.rotationSpeed;
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate((this.rotation * Math.PI) / 180);
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                ctx.restore();
            }
        }

        const createConfetti = () => {
            for (let i = 0; i < 20; i++) {
                confettiParticles.push(new ConfettiParticle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = confettiParticles.length - 1; i >= 0; i--) {
                confettiParticles[i].update();
                confettiParticles[i].draw();

                if (confettiParticles[i].y > canvas.height) {
                    confettiParticles.splice(i, 1);
                }
            }

            requestAnimationFrame(animate);
        };

        animate();

        // Create confetti periodically
        const confettiInterval = setInterval(createConfetti, 300);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(confettiInterval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
            {/* Fireworks Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-10 pointer-events-none"
            />

            {/* Confetti Canvas */}
            <canvas
                ref={confettiRef}
                className="absolute inset-0 z-20 pointer-events-none"
            />

            {/* Content */}
            <div className="relative z-30 flex flex-col items-center justify-center min-h-screen p-8">
                {/* Home Button */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-6 right-6 z-40 bg-white/20 backdrop-blur-md rounded-full p-3 hover:bg-white/30 transition-all duration-300 hover:scale-110 border-2 border-white/30"
                    aria-label="Go to home"
                >
                    <Home className="w-6 h-6 text-white" />
                </button>

                {/* Main Content */}
                <div className="text-center space-y-8 animate-fade-in">
                    {/* Title */}
                    <div className="space-y-4">
                        <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-2xl animate-pulse">
                            {isNewYear ? (
                                <>
                                    <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-bounce">
                                        Happy
                                    </span>
                                    <br />
                                    <span className="bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500 bg-clip-text text-transparent animate-bounce" style={{ animationDelay: '0.2s' }}>
                                        New Year
                                    </span>
                                    <br />
                                    <span className="bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent animate-bounce" style={{ animationDelay: '0.4s' }}>
                                        2026!
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                                        Happy
                                    </span>
                                    <br />
                                    <span className="bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                                        New Year
                                    </span>
                                    <br />
                                    <span className="bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                                        2026
                                    </span>
                                </>
                            )}
                        </h1>
                        <p className="text-2xl md:text-3xl text-white/90 font-light">
                            {isNewYear ? '🎉 Welcome to 2026! 🎉' : 'Countdown to Celebration'}
                        </p>
                    </div>

                    {/* Countdown Timer */}
                    {!isNewYear && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
                            {[
                                { label: 'Days', value: timeLeft.days },
                                { label: 'Hours', value: timeLeft.hours },
                                { label: 'Minutes', value: timeLeft.minutes },
                                { label: 'Seconds', value: timeLeft.seconds }
                            ].map((item, index) => (
                                <div
                                    key={item.label}
                                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border-2 border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-300"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="text-4xl md:text-6xl font-bold text-white mb-2">
                                        {String(item.value).padStart(2, '0')}
                                    </div>
                                    <div className="text-sm md:text-lg text-white/80 uppercase tracking-wider">
                                        {item.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Celebration Message */}
                    {isNewYear && (
                        <div className="space-y-6 animate-bounce">
                            <div className="flex justify-center gap-4 text-6xl">
                                <Sparkles className="text-yellow-400 animate-spin" style={{ animationDuration: '2s' }} />
                                <Gift className="text-pink-400 animate-bounce" />
                                <PartyPopper className="text-purple-400 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
                            </div>
                            <p className="text-3xl md:text-4xl text-white font-semibold">
                                May this year bring you joy, success, and happiness! 🎊
                            </p>
                        </div>
                    )}

                    {/* Decorative Elements */}
                    <div className="flex justify-center gap-4 mt-12">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="w-3 h-3 bg-white rounded-full animate-ping"
                                style={{ animationDelay: `${i * 0.2}s` }}
                            />
                        ))}
                    </div>
                </div>

                {/* Floating Stars */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${Math.random() * 2 + 1}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Custom Styles */}
            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes twinkle {
                    0%, 100% {
                        opacity: 0.3;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.5);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }

                .animate-twinkle {
                    animation: twinkle 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default HappyNewYear;

