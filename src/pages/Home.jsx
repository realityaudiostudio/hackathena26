import React, { useState, useEffect, useRef } from 'react';
import UpsideDownParticles from '../components/UpsideDownParticles';
import hackathenaSvg from '../assets/hackathena.svg';

// ─── Vine corner decorations ───────────────────────────────────────────────
const VineTopLeft = () => (
  <svg className="fixed top-0 left-0 pointer-events-none z-20 opacity-80" width="300" height="280" viewBox="0 0 300 280">
    <defs>
      <filter id="vglow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComponentTransfer in="blur" result="glow">
          <feFuncR type="linear" slope="3" />
          <feFuncG type="linear" slope="1.5" />
          <feFuncB type="linear" slope="0.3" />
        </feComponentTransfer>
        <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    {/* thick dark-brown stems with warm gold glow */}
    <g fill="none" stroke="#3b1a0a" strokeWidth="3" filter="url(#vglow)" opacity="1">
      <path d="M0,0 Q40,80 20,160 Q0,200 30,260" />
      <path d="M0,0 Q80,40 160,20 Q200,10 260,30" />
      <path d="M20,0 Q60,30 30,90 Q10,120 40,180" />
      <path d="M0,20 Q30,60 90,40 Q130,30 170,50" />
    </g>
    {/* thinner highlight veins in warm amber */}
    <g fill="none" stroke="#7c3a12" strokeWidth="1.5" opacity="0.85">
      <path d="M10,0 C30,50 10,100 40,150" />
      <path d="M0,10 C50,30 100,10 150,40" />
      <ellipse cx="32" cy="88" rx="8" ry="4" fill="#4a1e08" opacity="0.9" transform="rotate(-30 32 88)" />
      <ellipse cx="85" cy="42" rx="8" ry="4" fill="#4a1e08" opacity="0.9" transform="rotate(45 85 42)" />
      <ellipse cx="20" cy="155" rx="7" ry="3" fill="#4a1e08" opacity="0.8" transform="rotate(-60 20 155)" />
    </g>
  </svg>
);

const VineBottomRight = () => (
  <svg className="fixed bottom-0 right-0 pointer-events-none z-20 opacity-80" width="300" height="280" viewBox="0 0 300 280">
    <defs>
      <filter id="vglow2" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComponentTransfer in="blur" result="glow">
          <feFuncR type="linear" slope="3" />
          <feFuncG type="linear" slope="1.5" />
          <feFuncB type="linear" slope="0.3" />
        </feComponentTransfer>
        <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <g fill="none" stroke="#3b1a0a" strokeWidth="3" filter="url(#vglow2)" opacity="1">
      <path d="M300,280 Q260,200 280,120 Q300,80 270,20" />
      <path d="M300,280 Q220,240 140,260 Q100,270 40,250" />
      <path d="M280,280 Q240,250 270,190 Q290,160 260,100" />
    </g>
    <g fill="none" stroke="#7c3a12" strokeWidth="1.5" opacity="0.85">
      <path d="M290,280 C270,230 290,180 260,130" />
      <ellipse cx="268" cy="192" rx="8" ry="4" fill="#4a1e08" opacity="0.9" transform="rotate(30 268 192)" />
      <ellipse cx="215" cy="258" rx="8" ry="4" fill="#4a1e08" opacity="0.9" transform="rotate(-45 215 258)" />
    </g>
  </svg>
);

// ─── Countdown helpers ──────────────────────────────────────────────────────
function getTimeLeft() {
  // March 12 2026, 00:00:00 IST (UTC+5:30)
  const target = new Date('2026-03-12T00:00:00+05:30').getTime();
  const diff = target - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const totalSec = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
    done: false,
  };
}

// ─── FlipDigit: slide new in from top, old out to bottom ────────────────────
const FLIP_DURATION = 350; // ms

function FlipDigit({ value }) {
  const str = String(value).padStart(2, '0');
  return (
    <span
      style={{
        display: 'inline-flex',
        gap: '0.04em',
        fontFamily: "'Space Mono', monospace",
        fontSize: 'clamp(2rem, 6vw, 3.75rem)', // matches text-4xl md:text-6xl
        fontWeight: 700,
        color: '#f87171',                       // text-red-400
        textShadow: '0 0 10px rgba(220,38,38,.6)',
        lineHeight: 1,
        letterSpacing: '0.02em',
      }}
    >
      {str.split('').map((ch, i) => (
        <SingleFlipChar key={i} char={ch} />
      ))}
    </span>
  );
}

function SingleFlipChar({ char }) {
  const [current, setCurrent] = useState(char);
  const [prev, setPrev] = useState(null);
  const [phase, setPhase] = useState('idle'); // 'idle' | 'flipping'

  useEffect(() => {
    if (char === current) return;
    setPrev(current);
    setCurrent(char);
    setPhase('flipping');
    const t = setTimeout(() => { setPrev(null); setPhase('idle'); }, FLIP_DURATION);
    return () => clearTimeout(t);
  }, [char]); // eslint-disable-line react-hooks/exhaustive-deps

  const sharedStyle = {
    display: 'block',
    width: '0.62em',
    textAlign: 'center',
    lineHeight: 1,
  };

  return (
    <span style={{ position: 'relative', display: 'inline-block', width: '0.62em', overflow: 'hidden', lineHeight: 1 }}>
      {/* Outgoing digit — slides down */}
      {phase === 'flipping' && prev !== null && (
        <span
          style={{
            ...sharedStyle,
            position: 'absolute', top: 0, left: 0,
            animation: `flip-out-down ${FLIP_DURATION}ms cubic-bezier(.4,0,.6,1) forwards`,
          }}
        >
          {prev}
        </span>
      )}
      {/* Incoming digit — slides in from top */}
      <span
        style={{
          ...sharedStyle,
          animation: phase === 'flipping'
            ? `flip-in-top ${FLIP_DURATION}ms cubic-bezier(.4,0,.6,1) forwards`
            : 'none',
        }}
      >
        {current}
      </span>
    </span>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [powerState, setPowerState] = useState(1); // 1 = on, 0 = off (for flicker effect)
  const [menuOpen, setMenuOpen] = useState(false);
  const [countdown, setCountdown] = useState(getTimeLeft);
  const [tickEnabled, setTickEnabled] = useState(true);
  const audioCtxRef = useRef(null);

  // Continue button handler: unlock audio + dismiss loading in one gesture
  const handleContinue = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    } catch (_) { }
    setLoading(false);
  };

  // Resume AudioContext on first user gesture (browser autoplay policy)
  useEffect(() => {
    const resume = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      window.removeEventListener('click', resume);
      window.removeEventListener('keydown', resume);
    };
    window.addEventListener('click', resume);
    window.addEventListener('keydown', resume);
    return () => {
      window.removeEventListener('click', resume);
      window.removeEventListener('keydown', resume);
    };
  }, []);

  // ── Countdown + doomsday clock sound ─────────────────────────────────────
  const tickPhaseRef = useRef(0); // alternates 0/1 for tick vs tock
  useEffect(() => {
    const playDoomsday = () => {
      if (!tickEnabled) return;
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        const now = ctx.currentTime;
        const isTick = tickPhaseRef.current === 0;
        tickPhaseRef.current = isTick ? 1 : 0;

        // ── 1. Deep bass thud (kick-drum style) ──────────────────────────
        const bass = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bass.type = 'sine';
        bass.frequency.setValueAtTime(isTick ? 90 : 70, now);
        bass.frequency.exponentialRampToValueAtTime(20, now + 0.25);
        bassGain.gain.setValueAtTime(1.0, now);
        bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
        bass.connect(bassGain);
        bassGain.connect(ctx.destination);
        bass.start(now);
        bass.stop(now + 0.45);

        // ── 2. Metallic clank overtone ────────────────────────────────────
        const metal = ctx.createOscillator();
        const metalGain = ctx.createGain();
        metal.type = 'sawtooth';
        metal.frequency.setValueAtTime(isTick ? 480 : 360, now);
        metalGain.gain.setValueAtTime(0.12, now);
        metalGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
        // slight distortion via waveshaper
        const wave = ctx.createWaveShaper();
        const curve = new Float32Array(256);
        for (let i = 0; i < 256; i++) {
          const x = (i * 2) / 256 - 1;
          curve[i] = (Math.PI + 80) * x / (Math.PI + 80 * Math.abs(x));
        }
        wave.curve = curve;
        metal.connect(wave);
        wave.connect(metalGain);
        metalGain.connect(ctx.destination);
        metal.start(now);
        metal.stop(now + 0.2);

        // ── 3. Noise burst (impact transient) ────────────────────────────
        const bufLen = ctx.sampleRate * 0.06;
        const noiseBuffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1);
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        const noiseGain = ctx.createGain();
        // bandpass filter for metallic texture
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = isTick ? 2200 : 1600;
        bp.Q.value = 1.5;
        noiseGain.gain.setValueAtTime(0.3, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
        noise.connect(bp);
        bp.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);

        // ── 4. Slow reverb tail (sub rumble) ─────────────────────────────
        const sub = ctx.createOscillator();
        const subGain = ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(30, now + 0.05);
        subGain.gain.setValueAtTime(0.0, now);
        subGain.gain.linearRampToValueAtTime(0.25, now + 0.08);
        subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
        sub.connect(subGain);
        subGain.connect(ctx.destination);
        sub.start(now + 0.05);
        sub.stop(now + 0.75);
      } catch (_) { }
    };

    const interval = setInterval(() => {
      setCountdown(getTimeLeft());
      playDoomsday();
    }, 1000);
    return () => clearInterval(interval);
  }, [tickEnabled]);

  // Power-surge effect: occasionally cuts all neon lights randomly
  useEffect(() => {
    const surgeCycle = () => {
      const delay = Math.random() * 8000 + 4000;
      setTimeout(() => {
        setPowerState(0);
        setTimeout(() => {
          setPowerState(1);
          setTimeout(() => {
            setPowerState(0);
            setTimeout(() => {
              setPowerState(1);
              surgeCycle();
            }, 120);
          }, 80);
        }, 200);
      }, delay);
    };
    const init = setTimeout(surgeCycle, 3000);
    return () => clearTimeout(init);
  }, []);

  const handleMouseMove = (e) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    setMousePos({ x: clientX - left, y: clientY - top });
  };

  // Trigger the same double-flicker on demand (e.g. hamburger tap)
  const triggerFlicker = () => {
    setPowerState(0);
    setTimeout(() => {
      setPowerState(1);
      setTimeout(() => {
        setPowerState(0);
        setTimeout(() => setPowerState(1), 120);
      }, 80);
    }, 200);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-sans" style={{ position: 'relative' }}>
        <UpsideDownParticles />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Space+Mono&display=swap');
          @keyframes boot-flicker {
            0%,100% { opacity: 1; }
            10% { opacity: 0; }
            15% { opacity: 1; }
            50% { opacity: 0.3; }
            55% { opacity: 1; }
          }
          @keyframes btn-appear {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .boot-text {
            font-family: 'Space Mono', monospace;
            color: #dc2626;
            font-size: 1.25rem;
            letter-spacing: 0.5em;
            text-align: center;
            padding: 0 1rem;
            animation: boot-flicker 1.5s ease-in-out forwards;
            text-shadow: 0 0 20px rgba(220,38,38,0.9), 0 0 40px rgba(220,38,38,0.5), 0 0 80px rgba(220,38,38,0.2);
          }
        `}</style>
        <div className="boot-text" style={{ position: 'relative', zIndex: 10 }}>
          INITIALIZING MAINFRAME...
        </div>
        <button
          onClick={handleContinue}
          style={{
            position: 'relative',
            zIndex: 10,
            marginTop: '2.5rem',
            fontFamily: "'Space Mono', monospace",
            color: '#dc2626',
            background: 'transparent',
            border: '1px solid #dc2626',
            padding: '0.75rem 2.5rem',
            fontSize: '0.85rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            textShadow: '0 0 10px rgba(220,38,38,0.8)',
            boxShadow: '0 0 14px rgba(220,38,38,0.35)',
            animation: 'btn-appear 0.8s ease-out 1.2s both',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(220,38,38,0.15)';
            e.currentTarget.style.boxShadow = '0 0 28px rgba(220,38,38,0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.boxShadow = '0 0 14px rgba(220,38,38,0.35)';
          }}
        >
          ▶ &nbsp;CONTINUE
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-black text-gray-300 selection:bg-red-800 selection:text-white overflow-x-hidden"
      style={{ position: 'relative' }}
    >
      {/* ── Global Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Space+Mono&display=swap');

        .font-stranger { font-family: 'Cinzel', serif; }
        .font-code     { font-family: 'Space Mono', monospace; }

        /* ── Stranger Things title stroke ── */
        .stranger-stroke {
          color: #000;
          -webkit-text-stroke: 3px #dc2626;
          text-shadow:
            0 0 10px #dc2626,
            0 0 30px rgba(220,38,38,0.8),
            0 0 60px rgba(220,38,38,0.5),
            0 0 120px rgba(180,20,20,0.3);
        }

        /* ── Neon flicker — fast random drops ── */
        @keyframes neon-flicker {
           0%       { opacity:1;   text-shadow: 0 0 10px #dc2626, 0 0 30px rgba(220,38,38,.8), 0 0 60px rgba(220,38,38,.5); }
           5%       { opacity:.4;  text-shadow: none; }
           6%       { opacity:1;   text-shadow: 0 0 10px #dc2626, 0 0 30px rgba(220,38,38,.8); }
           20%      { opacity:1; }
           21%      { opacity:.05; text-shadow: none; }
           22%      { opacity:1;   text-shadow: 0 0 20px #dc2626, 0 0 50px rgba(220,38,38,.9); }
           40%      { opacity:1; }
           41%      { opacity:.6;  text-shadow: 0 0 5px #dc2626; }
           42%      { opacity:1; }
           70%      { opacity:1; }
           71%      { opacity:.1;  text-shadow: none; }
           72%      { opacity:.8; }
           73%      { opacity:1;   text-shadow: 0 0 25px #dc2626, 0 0 60px rgba(220,38,38,.8); }
          100%      { opacity:1;   text-shadow: 0 0 10px #dc2626, 0 0 30px rgba(220,38,38,.8), 0 0 60px rgba(220,38,38,.5); }
        }
        .animate-flicker { animation: neon-flicker 7s linear infinite; }

        /* ── Neon flicker — slow hum variant for smaller labels ── */
        @keyframes neon-hum {
          0%,100%{ opacity:1; box-shadow: 0 0 8px rgba(220,38,38,.5), 0 0 15px rgba(220,38,38,.3); }
          48%    { opacity:1; }
          50%    { opacity:.5; box-shadow: 0 0 2px rgba(220,38,38,.2); }
          52%    { opacity:1; box-shadow: 0 0 12px rgba(220,38,38,.8); }
        }
        .neon-hum { animation: neon-hum 4s ease-in-out infinite; }

        /* ── Glitch on hover ── */
        .glitch-hover:hover {
          text-shadow: 2px 2px 0 #dc2626, -2px -2px 0 #000;
          box-shadow: 0 0 20px rgba(220,38,38,.5);
        }

        /* ── Red grid background ── */
        .bg-grid {
          background-image:
            linear-gradient(rgba(220,38,38,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220,38,38,.08) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        /* ── 3-D perspective floor grid ── */
        @keyframes grid-forward {
          0%   { background-position: 0 0; }
          100% { background-position: 0 40px; }
        }
        .perspective-grid {
          position: absolute; width: 200%; height: 200%;
          top: -50%; left: -50%;
          background-image:
            linear-gradient(rgba(220,38,38,.35) 2px, transparent 2px),
            linear-gradient(90deg, rgba(220,38,38,.35) 2px, transparent 2px);
          background-size: 40px 40px;
          transform: perspective(500px) rotateX(60deg);
          animation: grid-forward 2s linear infinite;
          -webkit-mask-image: radial-gradient(circle at center, black 5%, transparent 50%);
          mask-image: radial-gradient(circle at center, black 5%, transparent 50%);
        }

        /* ── Vine / tendril overlay ── */
        .vine-overlay {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            radial-gradient(ellipse 2px 60px at 10% 30%, rgba(80,10,10,.5) 0%, transparent 100%),
            radial-gradient(ellipse 2px 80px at 90% 60%, rgba(80,10,10,.4) 0%, transparent 100%),
            radial-gradient(ellipse 80px 2px at 20% 80%, rgba(80,10,10,.45) 0%, transparent 100%);
        }

        /* ── Power-surge class applied from React state ── */
        .power-off .neon-element { opacity: 0 !important; }

        /* ── Static / VHS scan-lines ── */
        .scanlines::after {
          content: '';
          position: fixed; inset: 0; pointer-events: none; z-index: 9999;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 2px,
            rgba(0,0,0,.08) 2px,
            rgba(0,0,0,.08) 4px
          );
        }

        /* ── Ambient vignette around the edges ── */
        .vignette::before {
          content: '';
          position: fixed; inset: 0; pointer-events: none; z-index: 1;
          background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,.75) 100%);
        }

        /* ── Red neon glow pulse for borders/lines ── */
        @keyframes border-pulse {
          0%,100% { box-shadow: 0 0 8px rgba(220,38,38,.6), 0 0 18px rgba(220,38,38,.3); }
          50%      { box-shadow: 0 0 20px rgba(220,38,38,.9), 0 0 40px rgba(220,38,38,.5); }
        }
        .neon-border { animation: border-pulse 3s ease-in-out infinite; }

        /* ── Button hover: 2 flickers then settle ── */
        @keyframes btn-hover-flicker {
          0%   { opacity: 1; }
          10%  { opacity: 0.1; }
          20%  { opacity: 1; }
          35%  { opacity: 0.15; }
          50%  { opacity: 1; }
          100% { opacity: 1; }
        }
        .btn-flicker:hover {
          animation: btn-hover-flicker 0.5s ease-out 1 forwards;
        }

        @keyframes stat-glow {
          0%,100% { text-shadow: 0 0 10px rgba(220,38,38,.6); }
          50%      { text-shadow: 0 0 25px rgba(220,38,38,1), 0 0 50px rgba(220,38,38,.6); }
        }
        .stat-glow { animation: stat-glow 3s ease-in-out infinite; }

        /* ── Flip clock digit transitions ── */
        @keyframes flip-in-top {
          from { transform: translateY(-110%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        @keyframes flip-out-down {
          from { transform: translateY(0);     opacity: 1; }
          to   { transform: translateY(110%);  opacity: 0; }
        }
      `}</style>

      {/* ── Scanlines + Vignette overlays ── */}
      <div className="scanlines vignette" />

      {/* ── Floating Spore Particles (fixed, full-screen) ── */}
      <UpsideDownParticles />

      {/* ── Vine decorations ── */}
      <VineTopLeft />
      <VineBottomRight />

      {/* ── Navigation ── */}
      <nav
        className={`fixed w-full z-50 border-b border-red-900/40 bg-black/80 backdrop-blur-md neon-element ${powerState === 0 ? 'power-off' : ''}`}
        style={{ transition: 'opacity 0.05s', fontFamily: "'Space Mono', monospace" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo / brand mark */}
          <img
            src={hackathenaSvg}
            alt="Hackathena"
            className="h-14 w-14"
            style={{ display: 'block' }}
          />

          {/* Desktop nav links */}
          <div className="hidden sm:flex space-x-8 items-center text-sm uppercase tracking-widest font-code text-gray-400">
            {['About', 'Tracks', 'Communicate'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-red-500 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Hamburger button — mobile only */}
          <button
            className="sm:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 focus:outline-none"
            onClick={() => { setMenuOpen((o) => !o); triggerFlicker(); }}
            aria-label="Toggle menu"
          >
            <span
              className="block w-6 h-[2px] bg-red-500 transition-all duration-300"
              style={{
                transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
                boxShadow: '0 0 6px rgba(220,38,38,.7)',
              }}
            />
            <span
              className="block w-6 h-[2px] bg-red-500 transition-all duration-300"
              style={{
                opacity: menuOpen ? 0 : 1,
                boxShadow: '0 0 6px rgba(220,38,38,.7)',
              }}
            />
            <span
              className="block w-6 h-[2px] bg-red-500 transition-all duration-300"
              style={{
                transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
                boxShadow: '0 0 6px rgba(220,38,38,.7)',
              }}
            />
          </button>
        </div>

        {/* Mobile dropdown */}
        <div
          className="sm:hidden overflow-hidden transition-all duration-300"
          style={{ maxHeight: menuOpen ? '200px' : '0px' }}
        >
          <div className="flex flex-col items-center gap-5 py-6 text-sm uppercase tracking-widest font-code text-gray-400 border-t border-red-900/30">
            {['About', 'Tracks', 'Communicate'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-red-500 transition-colors duration-200"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center bg-grid"
        onMouseMove={handleMouseMove}
        style={{ zIndex: 2 }}
      >
        {/* Mouse-follow radial spotlight */}
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(700px circle at ${mousePos.x}px ${mousePos.y}px, rgba(220,38,38,.12), transparent 40%)`,
          }}
        />

        {/* Top-to-bottom gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black pointer-events-none z-0" />

        {/* Vine tendrils */}
        <div className="vine-overlay z-0" />

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto mt-16 w-full">

          {/* Date badge */}
          <div
            className="inline-block border border-red-900 bg-red-950/30 text-red-400 px-5 py-1 rounded-full text-xs font-code uppercase tracking-widest mb-10 backdrop-blur-sm neon-hum"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            March 12–13, 2026 &nbsp;•&nbsp; 24 Hour Hackathon
          </div>

          {/* Title block */}
          <div className="relative flex flex-col items-center justify-center w-full mb-10 pointer-events-none py-10">

            {/* 3-D perspective floor grid — clipped */}
            <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
              <div className="perspective-grid" />
            </div>

            {/* Top neon line */}
            <div
              className="h-[3px] w-full max-w-[80%] md:max-w-3xl mb-6 relative z-10"
              style={{
                background: '#dc2626',
                boxShadow: powerState
                  ? '0 0 12px #dc2626, 0 0 30px rgba(220,38,38,.6)'
                  : 'none',
                transition: 'box-shadow 0.05s',
              }}
            />

            {/* HACKATHENA — main flicker title */}
            <h1
              className={`font-stranger text-[11vw] sm:text-[9vw] lg:text-[8rem] leading-none tracking-normal font-extrabold px-4 relative z-10 whitespace-nowrap drop-shadow-2xl ${powerState ? 'animate-flicker stranger-stroke' : ''}`}
              style={{
                color: powerState ? '#000' : '#1a0000',
                WebkitTextStroke: powerState ? '3px #dc2626' : '3px #330000',
                transition: 'all 0.05s',
              }}
            >
              HACKATHENA
            </h1>

            {/* 2026 line */}
            <div className="flex items-center gap-6 w-full max-w-[80%] md:max-w-3xl mt-4 relative z-10">
              <div
                className="h-[3px] flex-grow"
                style={{
                  background: '#dc2626',
                  boxShadow: powerState ? '0 0 12px #dc2626, 0 0 30px rgba(220,38,38,.6)' : 'none',
                  transition: 'box-shadow 0.05s',
                }}
              />
              <span
                className="font-stranger text-4xl md:text-6xl font-bold tracking-widest neon-element"
                style={{
                  color: powerState ? '#dc2626' : '#330000',
                  textShadow: powerState ? '0 0 15px #dc2626, 0 0 35px rgba(220,38,38,.6)' : 'none',
                  transition: 'all 0.05s',
                }}
              >
                2026
              </span>
              <div
                className="h-[3px] flex-grow"
                style={{
                  background: '#dc2626',
                  boxShadow: powerState ? '0 0 12px #dc2626, 0 0 30px rgba(220,38,38,.6)' : 'none',
                  transition: 'box-shadow 0.05s',
                }}
              />
            </div>
          </div>

          {/* Tagline */}
          <p
            className="text-xl md:text-2xl text-gray-300 font-code tracking-wide mb-12 max-w-2xl mx-auto mt-4"
            style={{
              fontFamily: "'Space Mono', monospace",
              textShadow: '0 0 8px rgba(200,200,200,.2)',
            }}
          >
            HACK THE DIFFERENCE. SURVIVE THE NIGHT.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative z-20">
            <a
              href="https://www.instagram.com/hackathena/"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-600 bg-black/50 text-gray-300 font-code px-8 py-4 uppercase tracking-[.2em] font-bold hover:border-red-500 hover:text-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,.4)] transition-all duration-300 backdrop-blur-sm btn-flicker"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Follow on Instagram
            </a>

          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section
        className="border-y border-red-900/40 bg-black/70 backdrop-blur-sm"
        style={{ position: 'relative', zIndex: 2 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center font-code">
          {[
            { value: '₹60K', label: 'Prize Pool' },
            { value: '24', label: 'Hours' },
            { value: '500+', label: 'Hackers' },
            { value: '∞', label: 'Lines of Code' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div
                className="text-4xl font-bold text-red-500 mb-2 stat-glow"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {value}
              </div>
              <div
                className="text-sm text-gray-500 uppercase tracking-widest"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Countdown Timer ── */}
      <section className="py-16 px-6 border-b border-red-900/40 bg-black/80 relative" style={{ zIndex: 2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center gap-4 mb-8 justify-center">
            <div className="h-px w-10 bg-red-600" style={{ boxShadow: '0 0 8px #dc2626' }} />
            <h2
              className="font-stranger text-2xl md:text-3xl text-white tracking-widest uppercase"
              style={{ textShadow: '0 0 8px rgba(220,38,38,.5)', fontFamily: "'Cinzel', serif" }}
            >
              Begins In
            </h2>
            <div className="h-px w-10 bg-red-600" style={{ boxShadow: '0 0 8px #dc2626' }} />
          </div>

          {countdown.done ? (
            <p
              className="text-3xl text-red-400 font-stranger tracking-widest animate-pulse"
              style={{ textShadow: '0 0 20px #dc2626', fontFamily: "'Cinzel', serif" }}
            >
              ⚡ THE HACKATHON HAS BEGUN ⚡
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-4 md:gap-8 mb-8">
              {[
                { value: countdown.days, label: 'DAYS' },
                { value: countdown.hours, label: 'HOURS' },
                { value: countdown.minutes, label: 'MINS' },
                { value: countdown.seconds, label: 'SECS' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center p-4 md:p-6 border border-red-900/50 bg-red-950/10 relative overflow-hidden"
                  style={{ boxShadow: '0 0 18px rgba(220,38,38,.12)' }}
                >
                  {/* top glow line */}
                  <div
                    className="absolute top-0 left-0 w-full h-[2px]"
                    style={{ background: 'linear-gradient(to right, transparent, #dc2626, transparent)', boxShadow: '0 0 8px #dc2626' }}
                  />
                  <FlipDigit value={value} />
                  <span
                    className="text-xs text-gray-500 uppercase tracking-widest mt-2"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tick sound toggle */}
          <button
            onClick={() => setTickEnabled((v) => !v)}
            className="mt-2 inline-flex items-center gap-2 border border-red-900/60 px-5 py-2 text-xs uppercase tracking-widest font-code text-gray-400 hover:border-red-500 hover:text-red-400 transition-all duration-300"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            <span style={{ fontSize: '1rem' }}>{tickEnabled ? '🔊' : '🔇'}</span>
            {tickEnabled ? 'Mute' : 'Enable Sound'}
          </button>
        </div>
      </section>

      {/* ── About Section ── */}
      <section id="about" className="py-24 px-6 relative" style={{ zIndex: 2 }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-12 justify-center">
            <div className="h-px w-12 bg-red-600" style={{ boxShadow: '0 0 8px #dc2626' }} />
            <h2
              className="font-stranger text-4xl md:text-5xl text-white tracking-wider text-center"
              style={{ textShadow: '0 0 8px rgba(220,38,38,.5), 0 0 20px rgba(220,38,38,.2)' }}
            >
              The Mission
            </h2>
            <div className="h-px w-12 bg-red-600" style={{ boxShadow: '0 0 8px #dc2626' }} />
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-base font-code leading-relaxed text-gray-400">
            {[
              <>
                Welcome to{' '}
                <span className="text-red-500 font-bold" style={{ textShadow: '0 0 8px rgba(220,38,38,.5)' }}>
                  Hackathena
                </span>
                , the flagship hackathon organized by the Computer Engineering Students Association (CESA) of Jyothi Engineering College.
                <br /><br />
                We are opening a portal to innovation. For 24 hours, developers, designers, and creators from around the world will converge to build technologies that defy reality.
              </>,
              <>
                Whether you are a seasoned code-slinger or a novice venturing into the unknown, this is your proving ground. Network with mentors, unlock your potential, and survive the compile errors.
                <br /><br />
                Gather your party. The clock is ticking. Will you hack the difference?
              </>,
            ].map((content, i) => (
              <div
                key={i}
                className="p-8 bg-red-950/10 border border-red-900/30 hover:border-red-500/60 transition-all duration-500 group relative overflow-hidden"
                style={{ boxShadow: '0 0 20px rgba(0,0,0,.5)' }}
              >
                <div
                  className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: '0 0 12px #dc2626' }}
                />
                <div
                  className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: '0 0 12px #dc2626' }}
                />
                <p style={{ fontFamily: "'Space Mono', monospace" }}>{content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tracks Section ── */}
      <section id="tracks" className="py-24 px-6 bg-red-950/5 border-t border-red-900/20" style={{ zIndex: 2, position: 'relative' }}>
        <div className="max-w-6xl mx-auto">
          <h2
            className="font-stranger text-4xl text-white mb-4 tracking-wider text-center"
            style={{ textShadow: '0 0 8px rgba(220,38,38,.4)' }}
          >
            Choose Your Dimension
          </h2>
          <p className="text-center font-code text-gray-500 text-sm mb-12" style={{ fontFamily: "'Space Mono', monospace" }}>
            Total Prize Pool &nbsp;—&nbsp;
            <span className="text-red-400 font-bold" style={{ textShadow: '0 0 8px rgba(220,38,38,.5)' }}>₹60,000</span>
          </p>

          {/* Prize podium */}
          {/* Mobile: 1st centered on top row, 2nd+3rd on bottom row. Desktop: single row */}
          <div className="max-w-2xl mx-auto mb-12 text-center font-code">
            {/* Mobile top row — 1st place (centered) */}
            <div className="flex justify-center mb-4 md:hidden">
              <div className="p-4 border border-red-900/40 bg-red-950/10 hover:border-yellow-500/60 transition-all duration-300 w-1/2">
                <div className="text-lg font-bold text-yellow-400" style={{ fontFamily: "'Space Mono', monospace" }}>🏆 1st</div>
                <div className="text-red-400 text-xl font-bold mt-1 stat-glow" style={{ fontFamily: "'Space Mono', monospace" }}>₹25,000</div>
              </div>
            </div>
            {/* Mobile bottom row — 2nd & 3rd */}
            <div className="flex gap-4 mb-4 md:hidden">
              <div className="flex-1 p-4 border border-red-900/40 bg-red-950/10 hover:border-red-500/60 transition-all duration-300">
                <div className="text-lg font-bold text-gray-300" style={{ fontFamily: "'Space Mono', monospace" }}>🥈 2nd</div>
                <div className="text-red-400 text-xl font-bold mt-1 stat-glow" style={{ fontFamily: "'Space Mono', monospace" }}>₹15,000</div>
              </div>
              <div className="flex-1 p-4 border border-red-900/40 bg-red-950/10 hover:border-red-500/60 transition-all duration-300">
                <div className="text-lg font-bold text-orange-400" style={{ fontFamily: "'Space Mono', monospace" }}>🥉 3rd</div>
                <div className="text-red-400 text-xl font-bold mt-1 stat-glow" style={{ fontFamily: "'Space Mono', monospace" }}>₹10,000</div>
              </div>
            </div>
            {/* Desktop — single row: 1st, 2nd, 3rd */}
            <div className="hidden md:grid grid-cols-3 gap-4">
              {[
                { place: '🏆 1st', prize: '₹25,000', color: 'text-yellow-400' },
                { place: '🥈 2nd', prize: '₹15,000', color: 'text-gray-300' },
                { place: '🥉 3rd', prize: '₹10,000', color: 'text-orange-400' },
              ].map(({ place, prize, color }) => (
                <div
                  key={place}
                  className="p-4 border border-red-900/40 bg-red-950/10 hover:border-red-500/60 transition-all duration-300"
                >
                  <div className={`text-lg font-bold ${color}`} style={{ fontFamily: "'Space Mono', monospace" }}>{place}</div>
                  <div className="text-red-400 text-xl font-bold mt-1 stat-glow" style={{ fontFamily: "'Space Mono', monospace" }}>{prize}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tracks grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                id: 'TRACK_01',
                name: 'Cyber Security',
                icon: '🔐',
                prize: '₹5,000 Special Prize',
                desc: 'Hack the hackers. Build solutions that defend, detect, and disrupt cyber threats in the real world.',
                hasPrize: true,
              },
              {
                id: 'TRACK_02',
                name: 'Cloud Computing',
                icon: '☁️',
                prize: '₹5,000 Special Prize',
                desc: 'Architect the cloud. Design scalable, efficient, and resilient cloud-native solutions.',
                hasPrize: true,
              },
              {
                id: 'TRACK_03',
                name: 'Open Innovation',
                icon: '✨',
                prize: null,
                desc: 'No limits, no boundaries. Build anything that solves a real-world problem and wows the judges.',
                hasPrize: false,
              },
            ].map(({ id, name, icon, prize, desc, hasPrize }) => (
              <div
                key={id}
                className="p-6 border border-gray-800 bg-black transition-all duration-300 group cursor-pointer hover:-translate-y-2 relative"
                style={{ boxShadow: '0 0 0 rgba(220,38,38,0)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#dc2626';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(220,38,38,.3), 0 10px 30px rgba(0,0,0,.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1f2937';
                  e.currentTarget.style.boxShadow = '0 0 0 rgba(220,38,38,0)';
                }}
              >
                {hasPrize && (
                  <div
                    className="absolute top-3 right-3 text-xs font-bold px-2 py-1 border border-yellow-500/60 text-yellow-400"
                    style={{ fontFamily: "'Space Mono', monospace", textShadow: '0 0 6px rgba(234,179,8,.4)' }}
                  >
                    PRIZE TRACK
                  </div>
                )}
                <div className="text-2xl mb-3">{icon}</div>
                <div
                  className="text-red-600 font-code text-xs mb-3 neon-hum"
                  style={{ fontFamily: "'Space Mono', monospace", textShadow: '0 0 6px rgba(220,38,38,.5)' }}
                >
                  {id}
                </div>
                <h3
                  className="font-stranger text-2xl text-white mb-2 group-hover:text-red-400 transition-colors duration-300"
                  style={{ transition: 'text-shadow .3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.textShadow = '0 0 10px rgba(220,38,38,.6)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.textShadow = 'none'; }}
                >
                  {name}
                </h3>
                {prize && (
                  <div className="text-yellow-400 font-bold text-sm mb-3" style={{ fontFamily: "'Space Mono', monospace", textShadow: '0 0 6px rgba(234,179,8,.4)' }}>
                    🎯 {prize}
                  </div>
                )}
                <p className="font-code text-sm text-gray-500" style={{ fontFamily: "'Space Mono', monospace" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center font-code text-gray-600 text-xs mt-6" style={{ fontFamily: "'Space Mono', monospace" }}>
            ⚠️ Special track prizes are available only for Cyber Security &amp; Cloud Computing tracks.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="communicate" className="py-16 border-t border-red-900/40 bg-black relative overflow-hidden" style={{ zIndex: 2 }}>
        <div
          className="absolute bottom-0 w-full h-px"
          style={{
            background: 'linear-gradient(to right, #000, #dc2626, #000)',
            boxShadow: '0 0 15px rgba(220,38,38,1)',
          }}
        />
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3
            className="font-stranger text-3xl text-white mb-3 tracking-widest"
            style={{ textShadow: '0 0 8px rgba(220,38,38,.4)' }}
          >
            Establish Connection
          </h3>
          <p className="font-code text-gray-500 mb-2 text-sm" style={{ fontFamily: "'Space Mono', monospace" }}>
            Dept of CSE &nbsp;•&nbsp; Jyothi Engineering College, Cheruthuruthy
          </p>
          <p className="font-code text-gray-600 mb-10 text-xs" style={{ fontFamily: "'Space Mono', monospace" }}>
            📍 March 12 &amp; 13, 2026 &nbsp;•&nbsp; 24 Hours
          </p>

          {/* Contact persons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-10">
            {[
              { name: 'Alan', phone: '+91 80863 50450' },
              { name: 'Antony', phone: '+91 89430 28327' },
            ].map(({ name, phone }) => (
              <a
                key={name}
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="flex flex-col items-center p-5 border border-red-900/40 bg-red-950/10 hover:border-red-500/60 transition-all duration-300 group min-w-[180px]"
              >
                <span
                  className="font-stranger text-white text-lg mb-1 group-hover:text-red-400 transition-colors"
                  style={{ textShadow: '0 0 6px rgba(220,38,38,.3)' }}
                >
                  {name}
                </span>
                <span
                  className="font-code text-red-500 text-sm neon-hum"
                  style={{ fontFamily: "'Space Mono', monospace", textShadow: '0 0 6px rgba(220,38,38,.4)' }}
                >
                  📞 {phone}
                </span>
              </a>
            ))}
          </div>

          <div className="flex justify-center gap-6 font-code text-sm">
            {[
              { label: 'EMAIL', href: 'mailto:hackathenacse@jecc.ac.in' },
              { label: 'INSTAGRAM', href: 'https://www.instagram.com/hackathena/' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-red-600 hover:text-white transition-colors"
                style={{ fontFamily: "'Space Mono', monospace", textShadow: '0 0 6px rgba(220,38,38,.4)' }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}