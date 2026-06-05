import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";

// Feature Toggle for Khmer New Year Elements
export const KHMER_NEW_YEAR = {
  isActive: false,
  palette: {
    gold: '#EAB308',
    red: '#DC2626',
    pink: '#F472B6',
    slate: '#1E293B',
  }
};

// ===========================================================
// ZONE-BASED ANIMATED CANVAS
// Zone 1 (TOP 30%):    Stars twinkling + drifting clouds
// Zone 2 (MID 40%):    Rising golden lanterns + Apsara silhouettes
// Zone 3 (LOWER 30%):  Falling lotus petals swaying down
// ===========================================================
const KhmerAnimatedCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    // ── ZONE 1: STARS ──────────────────────────────────────
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.40,     // top 40% only
      radius: 1 + Math.random() * 3,
      alpha: 0.5 + Math.random() * 0.9,
      twinkleSpeed: 0.005 + Math.random() * 0.02,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    // ── ZONE 1: CLOUDS ─────────────────────────────────────
    const clouds = Array.from({ length: 7 }, (_, i) => ({
      x: Math.random(),
      y: 0.02 + Math.random() * 0.20,  // top 22%
      width: 0.18 + Math.random() * 0.25,
      height: 0.05 + Math.random() * 0.06,
      speed: 0.00006 + Math.random() * 0.0001,
      alpha: 0.18 + Math.random() * 0.22,
    }));

    // ── ZONE 2: LANTERNS (rising) ──────────────────────────
    const lanterns = Array.from({ length: 28 }, (_, i) => ({
      x: 0.03 + Math.random() * 0.94,
      y: 0.2 + Math.random() * 0.65,    // mid zone, float up from there
      radius: 10 + Math.random() * 16,
      glowColor: Math.random() > 0.5
        ? [234, 179, 8]    // gold
        : [251, 100, 30],  // orange
      speed: 0.0004 + Math.random() * 0.0006,
      sway: (Math.random() - 0.5) * 0.002,
      swayOffset: Math.random() * Math.PI * 2,
      alpha: 0.75 + Math.random() * 0.25,
      life: Math.random() * 1000,
    }));

    // ── ZONE 2: MAGICAL FIREFLIES (replacing apsaras) ──────
    const fireflies = Array.from({ length: 25 }, () => ({
      x: Math.random(),
      y: 0.4 + Math.random() * 0.4, // float in mid area
      radius: 1.5 + Math.random() * 2.5,
      alphaBase: 0.4 + Math.random() * 0.4,
      pulseSpeed: 0.02 + Math.random() * 0.03,
      pulseOffset: Math.random() * Math.PI * 2,
      speedX: (Math.random() - 0.5) * 0.0008,
      speedY: (Math.random() - 0.5) * 0.0008,
    }));

    // ── ZONE 3: PETALS (falling) ───────────────────────────
    const petals = Array.from({ length: 55 }, () => {
      const colors = [[234, 179, 8], [251, 146, 60], [220, 38, 38], [253, 224, 71], [255, 180, 180], [255, 140, 200]];
      return {
        x: Math.random(),
        y: 0.3 + Math.random() * 0.7,  // lower 70%
        radius: 6 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.45 + Math.random() * 0.55,
        speedY: 0.00040 + Math.random() * 0.0007,
        drift: (Math.random() - 0.5) * 0.0015,
        driftFreq: 0.01 + Math.random() * 0.02,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.03,
        life: Math.random() * 800,
        maxLife: 600 + Math.random() * 1000,
      };
    });

    let tick = 0;
    let animFrame;

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());
      tick++;

      // ── DRAW STARS ─────────────────────────────────────
      stars.forEach(s => {
        const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(tick * s.twinkleSpeed + s.twinkleOffset));
        ctx.save();
        ctx.globalAlpha = s.alpha * twinkle;
        const grd = ctx.createRadialGradient(s.x * W(), s.y * H(), 0, s.x * W(), s.y * H(), s.radius * 3);
        grd.addColorStop(0, 'rgba(255,255,230,1)');
        grd.addColorStop(1, 'rgba(255,240,150,0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(s.x * W(), s.y * H(), s.radius * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // ── DRAW CLOUDS ─────────────────────────────────────
      clouds.forEach(c => {
        c.x += c.speed;
        if (c.x > 1.3) c.x = -0.3;

        ctx.save();
        ctx.globalAlpha = c.alpha;
        const cW = c.width * W();
        const cH = c.height * H();
        const cx = c.x * W();
        const cy = c.y * H();

        const cloudGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cW * 0.6);
        cloudGrad.addColorStop(0, 'rgba(255,220,150,0.9)');
        cloudGrad.addColorStop(0.5, 'rgba(200,160,100,0.4)');
        cloudGrad.addColorStop(1, 'rgba(150,100,60,0)');
        ctx.fillStyle = cloudGrad;

        // Draw fluffy cloud as overlapping ellipses
        const drawBump = (ox, oy, rx, ry) => {
          ctx.beginPath();
          ctx.ellipse(cx + ox, cy + oy, rx, ry, 0, 0, Math.PI * 2);
          ctx.fill();
        };
        ctx.filter = 'blur(12px)';
        drawBump(0, 0, cW * 0.5, cH * 0.6);
        drawBump(cW * 0.3, -cH * 0.2, cW * 0.35, cH * 0.5);
        drawBump(-cW * 0.3, -cH * 0.1, cW * 0.3, cH * 0.45);
        drawBump(cW * 0.5, cH * 0.1, cW * 0.25, cH * 0.35);
        ctx.filter = 'none';
        ctx.restore();
      });

      // ── DRAW LANTERNS ───────────────────────────────────
      lanterns.forEach(l => {
        l.life++;
        l.y -= l.speed;
        l.x += Math.sin(l.life * 0.01 + l.swayOffset) * l.sway;

        // Reset when it floats above the sky
        if (l.y < -0.05) {
          l.y = 0.85 + Math.random() * 0.15;
          l.x = 0.05 + Math.random() * 0.9;
        }

        const lx = l.x * W();
        const ly = l.y * H();
        const r = l.radius;
        const [lr, lg, lb] = l.glowColor;

        ctx.save();
        ctx.globalAlpha = l.alpha * 0.8;

        // Outer aura
        const aura = ctx.createRadialGradient(lx, ly, 0, lx, ly, r * 4);
        aura.addColorStop(0, `rgba(${lr},${lg},${lb},0.4)`);
        aura.addColorStop(1, `rgba(${lr},${lg},${lb},0)`);
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(lx, ly, r * 4, 0, Math.PI * 2);
        ctx.fill();

        // Lantern body (oval)
        ctx.globalAlpha = l.alpha;
        const bodyGrad = ctx.createRadialGradient(lx, ly - r * 0.2, r * 0.1, lx, ly, r);
        bodyGrad.addColorStop(0, `rgba(255,250,200,1)`);
        bodyGrad.addColorStop(0.4, `rgba(${lr},${lg},${lb},0.95)`);
        bodyGrad.addColorStop(1, `rgba(${Math.max(0, lr - 50)},${Math.max(0, lg - 60)},0,0.6)`);
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.ellipse(lx, ly, r * 0.65, r, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tassel
        ctx.strokeStyle = `rgba(${lr},${lg},${lb},0.6)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(lx, ly + r);
        ctx.lineTo(lx, ly + r + r * 0.8);
        ctx.stroke();

        ctx.restore();
      });

      // ── DRAW FIREFLIES ──────────────────────────────────
      fireflies.forEach(f => {
        // Drifting movement
        f.x += f.speedX;
        f.y += f.speedY;

        // Bounce off invisible walls to keep them in mid zone
        if (f.x < 0 || f.x > 1) f.speedX *= -1;
        if (f.y < 0.2 || f.y > 0.8) f.speedY *= -1;

        const pulse = Math.abs(Math.sin(tick * f.pulseSpeed + f.pulseOffset));
        const currentAlpha = f.alphaBase + (0.5 * pulse);
        const radius = f.radius + (pulse * 2);

        ctx.save();
        ctx.globalAlpha = currentAlpha;

        // Glow gradient
        const fg = ctx.createRadialGradient(f.x * W(), f.y * H(), 0, f.x * W(), f.y * H(), radius * 4);
        fg.addColorStop(0, 'rgba(255,255,180,1)');
        fg.addColorStop(0.3, 'rgba(250,204,21,0.8)'); // gold glow
        fg.addColorStop(1, 'rgba(251,146,60,0)');     // fade to orange

        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.arc(f.x * W(), f.y * H(), radius * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // ── DRAW PETALS ─────────────────────────────────────
      petals.forEach(p => {
        p.life++;
        if (p.life > p.maxLife || p.y > 1.05) {
          p.x = Math.random();
          p.y = 0.4 + Math.random() * 0.1;
          p.life = 0;
          p.alpha = 0.2 + Math.random() * 0.6;
        }

        p.x += Math.sin(p.life * p.driftFreq) * p.drift;
        p.y += p.speedY;
        p.angle += p.spin;

        const fadeFactor = Math.min(1, Math.min(p.life / 60, (p.maxLife - p.life) / 80));
        const [r, g, b] = p.color;

        ctx.save();
        ctx.translate(p.x * W(), p.y * H());
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.alpha * fadeFactor;

        // Gradient petal
        const pg = ctx.createRadialGradient(0, -p.radius * 0.3, 0, 0, 0, p.radius * 1.5);
        pg.addColorStop(0, `rgba(255,245,200,0.95)`);
        pg.addColorStop(0.5, `rgba(${r},${g},${b},0.85)`);
        pg.addColorStop(1, `rgba(${r},${Math.max(0, g - 50)},0,0)`);
        ctx.fillStyle = pg;
        ctx.shadowColor = `rgba(${r},${g},${b},0.4)`;
        ctx.shadowBlur = 6;

        ctx.beginPath();
        ctx.moveTo(0, -p.radius * 1.5);
        ctx.bezierCurveTo(p.radius * 0.85, -p.radius * 0.4, p.radius * 0.85, p.radius * 0.4, 0, p.radius * 1.5);
        ctx.bezierCurveTo(-p.radius * 0.85, p.radius * 0.4, -p.radius * 0.85, -p.radius * 0.4, 0, -p.radius * 1.5);
        ctx.fill();
        ctx.restore();
      });

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 4 }}
    />
  );
};

// ===========================================================
// MAIN THEME BACKGROUND COMPONENT
// ===========================================================
export const ThemeBackground = () => {
  const location = useLocation();

  if (
    location.pathname !== "/" &&
    !location.pathname.startsWith("/dashboard")
  ) {
    return null;
  }

  if (KHMER_NEW_YEAR.isActive) {
    return createPortal(
      <div
        id="background"
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: -1, width: "100vw", height: "100vh" }}
      >
        {/* === LAYER 1: Main Khmer New Year scene === */}
        <img
          src="/assets/background/bg-khmer.jpg"
          alt="Khmer New Year Background"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center center',
            zIndex: 0, opacity: 1,
            imageRendering: 'high-quality',
            transform: 'translateZ(0)', filter: 'none',
          }}
          onError={(e) => { e.target.style.display = "none"; }}
        />

        {/* === LAYER 2: Readability dark gradient === */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(180deg, rgba(2,4,18,0.50) 0%, rgba(3,2,8,0.32) 50%, rgba(0,0,0,0.60) 100%)',
        }} />

        {/* === LAYER 3: Kbach pattern watermark === */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          backgroundImage: "url('/assets/theme/kbach-pattern.png')",
          backgroundRepeat: "repeat", backgroundSize: "500px",
          opacity: 0.07, mixBlendMode: "screen",
        }} />

        {/* === LAYER 4: Warm sunrise glow from bottom === */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3,
          background: 'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(180,60,0,0.20) 0%, transparent 70%)',
        }} />

        {/* === LAYER 5: Zone-based animated canvas (REMOVED FOR PERFORMANCE) === */}
        {/* <KhmerAnimatedCanvas /> */}

        {/* === LAYER 6: Edge vignette === */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 5,
          background: 'radial-gradient(ellipse 130% 130% at 50% 50%, transparent 45%, rgba(0,0,0,0.65) 100%)',
          pointerEvents: 'none',
        }} />

        {/* === LAYER 7: Top header warm glow === */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '120px', zIndex: 5,
          background: 'linear-gradient(180deg, rgba(180,100,0,0.13) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />
      </div>,
      document.body,
    );
  }

  return createPortal(
    <div
      id="background"
      className="fixed inset-0 overflow-hidden pointer-events-none bg-slate-900"
      style={{ zIndex: -1, width: "100vw", height: "100vh" }}
    >
      <img
        src="/assets/circuit-bg.jpg"
        alt="Theme Background"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: -2 }}
        onError={(e) => { e.target.style.display = "none"; }}
      />
      
      {/* Very light overlay to ensure some text readability if needed */}
      <div className="absolute inset-0 bg-slate-900/10" style={{ zIndex: 0 }}></div>
    </div>,
    document.body,
  );
};
