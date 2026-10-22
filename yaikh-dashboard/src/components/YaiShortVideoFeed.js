import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, ChevronUp, ChevronDown, Maximize2, X } from 'lucide-react';
import './YaiShortVideoFeed.css';

export const YAI_FEED_CLIPS = [
  { id: 'clip-1', title: 'The sewing machine mechanic' },
  { id: 'clip-2', title: 'The fabric warehouse' },
];
const asset = path => `${process.env.PUBLIC_URL}/assets/yai-feed/${path}`;

export default function YaiShortVideoFeed({ expanded = false, onExpand, onClose }) {
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);
  const video = useRef(null);
  const container = useRef(null);
  const start = useRef(null);
  const wheelAt = useRef(0);
  const clip = YAI_FEED_CLIPS[index];
  const move = delta => { setIndex(i => (i + delta + YAI_FEED_CLIPS.length) % YAI_FEED_CLIPS.length); setProgress(0); setFailed(false); };
  useEffect(() => {
    const el = container.current;
    const onWheel = event => {
      if (Math.abs(event.deltaY) < 8) return;
      event.preventDefault();
      if (Date.now() - wheelAt.current < 650) return;
      wheelAt.current = Date.now();
      move(event.deltaY > 0 ? 1 : -1);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);
  useEffect(() => {
    const element = video.current;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !document.hidden) element.play().catch(() => setPlaying(false));
      else element.pause();
    }, { threshold: 0.35 });
    observer.observe(element);
    const visibility = () => { if (document.hidden) element.pause(); };
    document.addEventListener('visibilitychange', visibility);
    const otherAudio = event => { if (event.detail !== element) { element.muted = true; setMuted(true); } };
    window.addEventListener('yai-feed-audio', otherAudio);
    return () => { observer.disconnect(); element.pause(); document.removeEventListener('visibilitychange', visibility); window.removeEventListener('yai-feed-audio', otherAudio); };
  }, [index]);
  const toggle = () => { if (video.current.paused) video.current.play().catch(() => setPlaying(false)); else video.current.pause(); };
  const sound = () => {
    const next = !muted;
    setMuted(next);
    if (!next) window.dispatchEvent(new CustomEvent('yai-feed-audio', { detail: video.current }));
  };
  return <div ref={container} className={`yai-short-feed ${expanded ? 'expanded' : ''}`} aria-label="Yai short video feed" onPointerDown={event => { start.current = { x: event.clientX, y: event.clientY }; }} onPointerUp={event => { if (!start.current) return; const dy = start.current.y - event.clientY; const dx = start.current.x - event.clientX; start.current = null; if (Math.abs(dy) > 35 && Math.abs(dy) > Math.abs(dx)) move(dy > 0 ? 1 : -1); }}>
    <video key={clip.id} ref={video} src={asset(clip.id + '.mp4')} poster={asset(clip.id + '.jpg')} autoPlay muted={muted} playsInline preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => move(1)} onError={() => { setFailed(true); setPlaying(false); }} onTimeUpdate={() => { const el = video.current; if (el.duration) setProgress(el.currentTime / el.duration * 100); }} aria-label={clip.title} />
    <div className="ysf-top">{expanded && <button aria-label="Close video feed" onClick={onClose}><X /></button>}<span>{index + 1} / {YAI_FEED_CLIPS.length}</span></div>
    <button className={`ysf-play ${playing ? 'is-playing' : ''}`} aria-label={playing ? 'Pause video' : 'Play video'} onClick={toggle}>{playing ? <Pause /> : <Play fill="currentColor" />}</button>
    <div className="ysf-actions"><button aria-label={muted ? 'Turn sound on' : 'Mute video'} onClick={sound}>{muted ? <VolumeX /> : <Volume2 />}</button>{!expanded && <button aria-label="Expand video feed" onClick={onExpand}><Maximize2 /></button>}<button aria-label="Previous video" onClick={() => move(-1)}><ChevronUp /></button><button aria-label="Next video" onClick={() => move(1)}><ChevronDown /></button></div>
    <div className="ysf-caption"><b>Yai</b><span>{clip.title}</span>{failed && <small>Video unavailable. Try the next clip.</small>}</div>
    <input className="ysf-progress" type="range" min="0" max="100" step="0.1" value={progress} aria-label="Video progress" onChange={event => { const el = video.current; if (Number.isFinite(el.duration)) { el.currentTime = el.duration * Number(event.target.value) / 100; setProgress(Number(event.target.value)); } }} />
  </div>;
}
