import React, { useState, useEffect } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(true);
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    setMousePos({ x: clientX - left, y: clientY - top });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-sans">
        <div className="text-red-600 text-2xl tracking-[0.5em] animate-pulse drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
          INITIALIZING MAINFRAME...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-red-800 selection:text-white overflow-x-hidden">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Space+Mono&display=swap');
          .font-stranger { font-family: 'Cinzel', serif; }
          .font-code { font-family: 'Space Mono', monospace; }
          
          .stranger-stroke {
            color: #000; 
            -webkit-text-stroke: 3px #dc2626; 
            text-shadow: 0 0 20px rgba(220, 38, 38, 0.8), 0 0 40px rgba(220, 38, 38, 0.4);
          }

          @keyframes neon-flicker {
            0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
              opacity: 1;
              text-shadow: 0 0 20px rgba(220,38,38,0.8), 0 0 40px rgba(153,27,27,0.6);
            }
            20%, 22%, 24%, 55% {
              opacity: 0.6;
              text-shadow: none;
            }
          }
          .animate-flicker { animation: neon-flicker 5s infinite alternate; }
          
          .glitch-hover:hover { text-shadow: 2px 2px 0px #dc2626, -2px -2px 0px #000; box-shadow: 0 0 20px rgba(220,38,38,0.4); }
          
          .bg-grid { 
            background-image: linear-gradient(rgba(220,38,38,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.1) 1px, transparent 1px); 
            background-size: 40px 40px; 
          }

          @keyframes grid-forward {
            0% { background-position: 0 0; }
            100% { background-position: 0 40px; }
          }
          
          .perspective-grid {
            position: absolute;
            width: 200%;
            height: 200%;
            top: -50%;
            left: -50%;
            background-image: 
              linear-gradient(rgba(220,38,38,0.4) 2px, transparent 2px), 
              linear-gradient(90deg, rgba(220,38,38,0.4) 2px, transparent 2px);
            background-size: 40px 40px;
            transform: perspective(500px) rotateX(60deg);
            animation: grid-forward 2s linear infinite;
            -webkit-mask-image: radial-gradient(circle at center, black 10%, transparent 50%);
            mask-image: radial-gradient(circle at center, black 10%, transparent 50%);
          }
        `}
      </style>

      {/* Navigation */}
      <nav className="fixed w-full z-50 border-b border-red-900/40 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-red-600 font-stranger text-2xl font-bold tracking-widest drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">
            HA '26
          </div>
          <div className="space-x-8 hidden md:block text-sm uppercase tracking-widest font-code text-gray-400">
            <a href="#about" className="hover:text-red-500 transition-colors">About</a>
            <a href="#tracks" className="hover:text-red-500 transition-colors">Tracks</a>
            <a href="#contact" className="hover:text-red-500 transition-colors">Communicate</a>
            <button className="border border-red-600 text-red-500 px-4 py-2 hover:bg-red-900/30 transition-all">
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex flex-col items-center justify-center bg-grid"
        onMouseMove={handleMouseMove}
      >
        <div 
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(220,38,38,0.15), transparent 40%)`
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black pointer-events-none z-0"></div>
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto mt-16 w-full">
          <div className="inline-block border border-red-900 bg-red-950/30 text-red-500 px-4 py-1 rounded-full text-xs font-code uppercase tracking-widest mb-10 backdrop-blur-sm shadow-[0_0_10px_rgba(220,38,38,0.2)]">
            October 24-25, 2026 • 24 Hour Hackathon
          </div>
          
          {/* FIXED TITLE AREA */}
          <div className="relative flex flex-col items-center justify-center w-full mb-10 pointer-events-none py-10">
            
            {/* 3D Grid is now inside its own hidden-overflow container so it doesn't clip the text */}
            <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
              <div className="perspective-grid"></div>
            </div>

            <div className="h-[4px] w-full max-w-[80%] md:max-w-3xl bg-red-600 shadow-[0_0_20px_#dc2626] mb-6 relative z-10"></div>
            
            {/* Changed text size to vw (viewport width) so it scales perfectly and doesn't get cut */}
            <h1 className="font-stranger text-[11vw] sm:text-[9vw] lg:text-[8rem] leading-none tracking-normal font-extrabold stranger-stroke animate-flicker px-4 relative z-10 whitespace-nowrap drop-shadow-2xl">
              HACKATHENA
            </h1>
            
            <div className="flex items-center gap-6 w-full max-w-[80%] md:max-w-3xl mt-4 relative z-10">
              <div className="h-[4px] flex-grow bg-red-600 shadow-[0_0_20px_#dc2626]"></div>
              <span className="font-stranger text-4xl md:text-6xl text-red-600 font-bold drop-shadow-[0_0_15px_#dc2626] tracking-widest">
                2026
              </span>
              <div className="h-[4px] flex-grow bg-red-600 shadow-[0_0_20px_#dc2626]"></div>
            </div>
          </div>
          {/* END FIXED TITLE AREA */}

          <p className="text-xl md:text-2xl text-gray-300 font-code tracking-wide mb-12 max-w-2xl mx-auto mt-4 drop-shadow-md">
            HACK THE DIFFERENCE. SURVIVE THE NIGHT.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative z-20">
            <button className="bg-red-700 text-white font-code px-8 py-4 uppercase tracking-[0.2em] font-bold hover:bg-red-600 transition-all duration-300 glitch-hover">
              Apply via Devfolio
            </button>
            <button className="border border-gray-600 bg-black/50 text-gray-300 font-code px-8 py-4 uppercase tracking-[0.2em] font-bold hover:border-red-500 hover:text-red-500 hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all duration-300 backdrop-blur-sm">
              Join Discord
            </button>
          </div>
        </div>
      </section>

      {/* Hackathon Stats Bar */}
      <section className="border-y border-red-900/40 bg-black/60 backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center font-code">
          <div>
            <div className="text-4xl font-bold text-red-500 mb-2 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">₹50K+</div>
            <div className="text-sm text-gray-500 uppercase tracking-widest">In Prizes</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-red-500 mb-2 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">24</div>
            <div className="text-sm text-gray-500 uppercase tracking-widest">Hours</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-red-500 mb-2 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">500+</div>
            <div className="text-sm text-gray-500 uppercase tracking-widest">Hackers</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-red-500 mb-2 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">∞</div>
            <div className="text-sm text-gray-500 uppercase tracking-widest">Lines of Code</div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-12 justify-center">
            <div className="h-[1px] w-12 bg-red-600"></div>
            <h2 className="font-stranger text-4xl md:text-5xl text-white tracking-wider text-center drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">
              The Mission
            </h2>
            <div className="h-[1px] w-12 bg-red-600"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 text-base font-code leading-relaxed text-gray-400">
            <div className="p-8 bg-red-950/10 border border-red-900/30 hover:border-red-500/50 transition-colors group relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <p className="mb-6">
                Welcome to <span className="text-red-500 font-bold">Hackathena</span>, the flagship hackathon organized by the Computer Engineering Students Association (CESA) of Jyothi Engineering College.
              </p>
              <p>
                We are opening a portal to innovation. For 24 hours, developers, designers, and creators from around the world will converge to build technologies that defy reality.
              </p>
            </div>
            
            <div className="p-8 bg-red-950/10 border border-red-900/30 hover:border-red-500/50 transition-colors group relative">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <p className="mb-6">
                Whether you are a seasoned code-slinger or a novice venturing into the unknown, this is your proving ground. Network with mentors, unlock your potential, and survive the compile errors.
              </p>
              <p>
                Gather your party. The clock is ticking. Will you hack the difference?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tracks Teaser Section */}
      <section id="tracks" className="py-24 px-6 bg-red-950/5 border-t border-red-900/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-stranger text-4xl text-white mb-12 tracking-wider text-center">
            Choose Your Dimension
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {['Web3 & Blockchain', 'AI & Machine Learning', 'Open Innovation'].map((track, i) => (
              <div key={i} className="p-6 border border-gray-800 hover:border-red-600 bg-black transition-all group cursor-pointer hover:-translate-y-2 duration-300">
                <div className="text-red-600 font-code text-sm mb-4">TRACK_0{i+1}</div>
                <h3 className="font-stranger text-2xl text-white mb-4 group-hover:text-red-500 transition-colors">{track}</h3>
                <p className="font-code text-sm text-gray-500">Build solutions that push the boundaries of this reality.</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
             <button className="text-red-500 font-code text-sm hover:text-white transition-colors border-b border-red-500 pb-1">
               View All Tracks & Prizes ➔
             </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 border-t border-red-900/40 bg-black relative overflow-hidden">
        <div className="absolute bottom-0 w-full h-[2px] bg-gradient-to-r from-black via-red-600 to-black shadow-[0_0_15px_rgba(220,38,38,1)]"></div>
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="font-stranger text-3xl text-white mb-6 tracking-widest">Establish Connection</h3>
          <p className="font-code text-gray-500 mb-8 text-sm">
            Jyothi Engineering College • Dept of CSE
          </p>
          <div className="flex justify-center gap-6 font-code text-sm">
            <a href="mailto:contact@hackathena.com" className="text-red-600 hover:text-white transition-colors">EMAIL</a>
            <a href="#" className="text-red-600 hover:text-white transition-colors">INSTAGRAM</a>
            <a href="#" className="text-red-600 hover:text-white transition-colors">TWITTER/X</a>
          </div>
        </div>
      </footer>
    </div>
  );
}