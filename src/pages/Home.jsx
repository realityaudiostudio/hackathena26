import React, { useState, useEffect, useRef } from 'react';
import UpsideDownParticles from '../components/UpsideDownParticles';

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

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [powerState, setPowerState] = useState(1); // 1 = on, 0 = off (for flicker effect)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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
          .boot-text {
            font-family: 'Space Mono', monospace;
            color: #dc2626;
            font-size: 1.25rem;
            letter-spacing: 0.5em;
            animation: boot-flicker 1.5s ease-in-out forwards;
            text-shadow: 0 0 20px rgba(220,38,38,0.9), 0 0 40px rgba(220,38,38,0.5), 0 0 80px rgba(220,38,38,0.2);
          }
        `}</style>
        <div className="boot-text" style={{ position: 'relative', zIndex: 10 }}>
          INITIALIZING MAINFRAME...
        </div>
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
        style={{ transition: 'opacity 0.05s' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-center items-center">
          <div className="space-x-8 flex items-center text-sm uppercase tracking-widest font-code text-gray-400">
            {['About', 'Tracks', 'Communicate'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-red-500 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
            <button
              className="border border-red-600 text-red-500 px-4 py-2 hover:bg-red-900/40 transition-all duration-300 neon-border btn-flicker"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Register
            </button>
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
            <button
              className="bg-red-700 text-white font-code px-8 py-4 uppercase tracking-[.2em] font-bold hover:bg-red-600 transition-all duration-300 glitch-hover neon-border btn-flicker"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Apply via Devfolio
            </button>
            <button
              className="border border-gray-600 bg-black/50 text-gray-300 font-code px-8 py-4 uppercase tracking-[.2em] font-bold hover:border-red-500 hover:text-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,.4)] transition-all duration-300 backdrop-blur-sm btn-flicker"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Join Discord
            </button>
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
            { value: '₹50K+', label: 'In Prizes' },
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
            className="font-stranger text-4xl text-white mb-12 tracking-wider text-center"
            style={{ textShadow: '0 0 8px rgba(220,38,38,.4)' }}
          >
            Choose Your Dimension
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {['Web3 & Blockchain', 'AI & Machine Learning', 'Open Innovation'].map((track, i) => (
              <div
                key={i}
                className="p-6 border border-gray-800 bg-black transition-all duration-300 group cursor-pointer hover:-translate-y-2"
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
                <div
                  className="text-red-600 font-code text-sm mb-4 neon-hum"
                  style={{ fontFamily: "'Space Mono', monospace", textShadow: '0 0 6px rgba(220,38,38,.5)' }}
                >
                  TRACK_0{i + 1}
                </div>
                <h3
                  className="font-stranger text-2xl text-white mb-4 group-hover:text-red-400 transition-colors duration-300"
                  style={{ transition: 'text-shadow .3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.textShadow = '0 0 10px rgba(220,38,38,.6)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.textShadow = 'none'; }}
                >
                  {track}
                </h3>
                <p className="font-code text-sm text-gray-500" style={{ fontFamily: "'Space Mono', monospace" }}>
                  Build solutions that push the boundaries of this reality.
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              className="text-red-500 font-code text-sm hover:text-white transition-colors border-b border-red-500 pb-1"
              style={{
                fontFamily: "'Space Mono', monospace",
                textShadow: '0 0 6px rgba(220,38,38,.4)',
              }}
            >
              View All Tracks & Prizes ➔
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" className="py-12 border-t border-red-900/40 bg-black relative overflow-hidden" style={{ zIndex: 2 }}>
        <div
          className="absolute bottom-0 w-full h-px"
          style={{
            background: 'linear-gradient(to right, #000, #dc2626, #000)',
            boxShadow: '0 0 15px rgba(220,38,38,1)',
          }}
        />
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3
            className="font-stranger text-3xl text-white mb-6 tracking-widest"
            style={{ textShadow: '0 0 8px rgba(220,38,38,.4)' }}
          >
            Establish Connection
          </h3>
          <p className="font-code text-gray-500 mb-8 text-sm" style={{ fontFamily: "'Space Mono', monospace" }}>
            Jyothi Engineering College • Dept of CSE
          </p>
          <div className="flex justify-center gap-6 font-code text-sm">
            {['EMAIL', 'INSTAGRAM', 'TWITTER/X'].map((link) => (
              <a
                key={link}
                href={link === 'EMAIL' ? 'mailto:contact@hackathena.com' : '#'}
                className="text-red-600 hover:text-white transition-colors"
                style={{ fontFamily: "'Space Mono', monospace", textShadow: '0 0 6px rgba(220,38,38,.4)' }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}