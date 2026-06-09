'use client';

const FLOATERS = [
  { char: '👾', x: 7,  y: 10, size: 42, glow: '#c084fc', anim: 'arcadeFloat', dur: 11, del: 0    },
  { char: '👻', x: 82, y: 7,  size: 36, glow: '#22d3ee', anim: 'arcadeDrift', dur: 15, del: 1.5  },
  { char: '🚀', x: 22, y: 73, size: 32, glow: '#f472b6', anim: 'arcadeFloat', dur: 10, del: 3    },
  { char: '⭐', x: 91, y: 58, size: 28, glow: '#fbbf24', anim: 'arcadePulse', dur: 8,  del: 0.5  },
  { char: '🍄', x: 50, y: 87, size: 40, glow: '#4ade80', anim: 'arcadeDrift', dur: 14, del: 2    },
  { char: '💎', x: 68, y: 13, size: 30, glow: '#60a5fa', anim: 'arcadeFloat', dur: 12, del: 4    },
  { char: '🎮', x: 38, y: 4,  size: 44, glow: '#a78bfa', anim: 'arcadePulse', dur: 16, del: 1    },
  { char: '❤️', x: 12, y: 54, size: 26, glow: '#f87171', anim: 'arcadeFloat', dur: 9,  del: 2.5  },
  { char: '⚡', x: 88, y: 38, size: 32, glow: '#fde68a', anim: 'arcadeDrift', dur: 13, del: 0.7  },
  { char: '🔥', x: 60, y: 76, size: 34, glow: '#fb923c', anim: 'arcadeFloat', dur: 11, del: 3.5  },
  { char: '🏆', x: 5,  y: 82, size: 38, glow: '#fbbf24', anim: 'arcadePulse', dur: 17, del: 1.2  },
  { char: '👾', x: 45, y: 2,  size: 46, glow: '#e879f9', anim: 'arcadeFloat', dur: 14, del: 2.2  },
  { char: '🐉', x: 28, y: 34, size: 48, glow: '#86efac', anim: 'arcadePulse', dur: 19, del: 0.3  },
  { char: '🌟', x: 94, y: 71, size: 28, glow: '#fde68a', anim: 'arcadeFloat', dur: 10, del: 3.8  },
  { char: '🛡️', x: 16, y: 20, size: 32, glow: '#38bdf8', anim: 'arcadeDrift', dur: 13, del: 1.8  },
  { char: '🎯', x: 55, y: 48, size: 30, glow: '#fb7185', anim: 'arcadeFloat', dur: 11, del: 5    },
  { char: '💣', x: 35, y: 64, size: 28, glow: '#c084fc', anim: 'arcadePulse', dur: 9,  del: 0.9  },
  { char: '🪄', x: 73, y: 27, size: 34, glow: '#d8b4fe', anim: 'arcadeFloat', dur: 12, del: 4.2  },
  { char: '👻', x: 48, y: 42, size: 26, glow: '#a5f3fc', anim: 'arcadeDrift', dur: 15, del: 2.7  },
  { char: '🗡️', x: 78, y: 60, size: 30, glow: '#94a3b8', anim: 'arcadePulse', dur: 12, del: 4.5  },
  { char: '🎲', x: 3,  y: 40, size: 36, glow: '#f0abfc', anim: 'arcadeFloat', dur: 13, del: 6    },
  { char: '🌀', x: 62, y: 92, size: 32, glow: '#67e8f9', anim: 'arcadeDrift', dur: 11, del: 1.1  },
];

const SCROLLERS = [
  { char: '👾', y: 18, size: 28, glow: '#c084fc', dur: 28, del: 0,   rtl: false },
  { char: '⭐', y: 52, size: 22, glow: '#fbbf24', dur: 34, del: 6,   rtl: true  },
  { char: '💎', y: 38, size: 26, glow: '#60a5fa', dur: 24, del: 12,  rtl: false },
  { char: '🚀', y: 70, size: 24, glow: '#f472b6', dur: 30, del: 4,   rtl: true  },
];

const ARCADE_CSS = `
  @keyframes arcadeFloat {
    0%, 100% { transform: translateY(0px)   rotate(-4deg); }
    50%       { transform: translateY(-24px) rotate( 4deg); }
  }
  @keyframes arcadeDrift {
    0%, 100% { transform: translateX(  0px) rotate(  0deg); }
    33%      { transform: translateX( 18px) rotate(  8deg); }
    66%      { transform: translateX(-14px) rotate( -6deg); }
  }
  @keyframes arcadePulse {
    0%, 100% { transform: scale(1);    opacity: 0.5; }
    50%      { transform: scale(1.22); opacity: 0.75; }
  }
  @keyframes scrollLTR {
    from { transform: translateX(-90px); }
    to   { transform: translateX(calc(100vw + 90px)); }
  }
  @keyframes scrollRTL {
    from { transform: translateX(calc(100vw + 90px)); }
    to   { transform: translateX(-90px); }
  }
  @keyframes coinBlink {
    0%,  48% { opacity: 1; }
    50%, 98% { opacity: 0; }
    100%     { opacity: 1; }
  }
  @keyframes xpFloat {
    0%   { opacity: 1; transform: translateY(0px)   scale(1);   }
    15%  { opacity: 1; transform: translateY(-12px) scale(1.15);}
    100% { opacity: 0; transform: translateY(-80px) scale(0.9); }
  }
  @keyframes stageClear {
    0%   { opacity: 0; transform: scale(0.3)  translateY(24px);  letter-spacing: 0.05em; }
    25%  { opacity: 1; transform: scale(1.12) translateY(0);     letter-spacing: 0.5em;  }
    75%  { opacity: 1; transform: scale(1)    translateY(0);     letter-spacing: 0.4em;  }
    100% { opacity: 0; transform: scale(0.95) translateY(-12px); letter-spacing: 0.4em;  }
  }
  @keyframes comboAppear {
    0%   { opacity: 0; transform: scale(0.4) rotate(-12deg); }
    35%  { opacity: 1; transform: scale(1.3) rotate(  4deg); }
    80%  { opacity: 1; transform: scale(1.1) rotate(  0deg); }
    100% { opacity: 0; transform: scale(0.9) rotate( -2deg); }
  }
  @keyframes scanMove {
    from { transform: translateY(-100%); }
    to   { transform: translateY(100vh); }
  }
`;

export default function ArcadeBackground() {
  return (
    <>
      <style>{ARCADE_CSS}</style>

      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        {/* Pixel grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139,92,246,0.055) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139,92,246,0.055) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Scanlines */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 3px,
              rgba(0,0,0,0.18) 3px,
              rgba(0,0,0,0.18) 4px
            )`,
          }}
        />

        {/* Ambient blobs (kept from original) */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[120px] animate-pulse" />

        {/* Floating characters */}
        {FLOATERS.map((el, i) => (
          <div
            key={i}
            className="absolute select-none"
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              fontSize: `${el.size}px`,
              filter: `drop-shadow(0 0 8px ${el.glow}) drop-shadow(0 0 18px ${el.glow}55)`,
              animation: `${el.anim} ${el.dur}s ${el.del}s infinite ease-in-out`,
              opacity: 0.55,
            }}
          >
            {el.char}
          </div>
        ))}

        {/* Scrolling characters */}
        {SCROLLERS.map((el, i) => (
          <div
            key={`s-${i}`}
            className="absolute select-none"
            style={{
              top: `${el.y}%`,
              fontSize: `${el.size}px`,
              filter: `drop-shadow(0 0 7px ${el.glow})`,
              animation: `${el.rtl ? 'scrollRTL' : 'scrollLTR'} ${el.dur}s ${el.del}s infinite linear`,
              opacity: 0.35,
            }}
          >
            {el.char}
          </div>
        ))}

        {/* Corner P1/P2 labels */}
        <div className="absolute top-4 left-5 font-mono text-xs text-violet-500/40 tracking-widest">P1</div>
        <div className="absolute top-4 right-5 font-mono text-xs text-violet-500/40 tracking-widest">P2</div>

        {/* INSERT COIN */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.35em] uppercase"
          style={{
            color: '#fbbf24',
            textShadow: '0 0 8px #fbbf24, 0 0 18px #fbbf2480',
            animation: 'coinBlink 1.3s infinite',
          }}
        >
          ★ INSERT COIN ★
        </div>

        {/* Top & bottom neon lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />
      </div>
    </>
  );
}
