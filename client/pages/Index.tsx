import { Link } from "react-router-dom";
import { Volume2, VolumeX, Zap } from "lucide-react";
import { useState } from "react";

export default function Index() {
  const [soundEnabled, setSoundEnabled] = useState(false);

  return (
    <div className="min-h-screen grid-bg overflow-hidden">
      {/* Header */}
      <header className="border-b border-neon-cyan/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-neon-cyan animate-pulse" />
            <h1 className="text-lg sm:text-xl font-orbitron font-bold glow-text">
              CODE ARENA
            </h1>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-sm border border-neon-cyan/50 hover:border-neon-cyan hover:shadow-neon transition-all duration-300 text-neon-cyan"
            aria-label="Toggle sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Title Section */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-4xl sm:text-6xl font-orbitron font-black mb-2 glow-text-lg">
                CODE ARENA
              </h2>
              <p className="text-sm sm:text-base text-neon-cyan/70 font-space-mono">
                SDJ International College
              </p>
            </div>

            <div className="space-y-2 text-neon-cyan/60 text-xs sm:text-sm font-space-mono mb-8 sm:mb-12">
              <p>⚡ WILDCARD DRAW SYSTEM ⚡</p>
              <p>Round 2 & Round 3 • 100% Random Selection</p>
            </div>
          </div>

          {/* Card Display */}
          <div className="flex items-center justify-center mb-12 sm:mb-16">
            <div className="w-full max-w-xs">
              <div className="cyber-card p-8 sm:p-12 h-64 sm:h-80 flex flex-col items-center justify-center relative overflow-hidden group cursor-default hover:shadow-neon-lg transition-all duration-300">
                {/* Card gradient bg */}
                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-transparent to-neon-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Card content */}
                <div className="relative z-10 text-center">
                  <div className="text-5xl sm:text-6xl mb-4 animate-float">⚡</div>
                  <h3 className="text-2xl sm:text-3xl font-orbitron font-bold glow-text mb-4">
                    WILDCARD
                  </h3>
                  <p className="text-xs sm:text-sm text-neon-cyan/70 font-space-mono">
                    Draw your fate
                  </p>
                </div>

                {/* Corner accents */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-neon-cyan/50" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-neon-cyan/50" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-neon-cyan/50" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-neon-cyan/50" />
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link
              to="/wildcard"
              className="group relative px-8 sm:px-12 py-3 sm:py-4 border-2 border-neon-cyan text-neon-cyan font-orbitron font-bold text-sm sm:text-base uppercase tracking-wider overflow-hidden rounded-sm transition-all duration-300 hover:shadow-neon-lg"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-neon-cyan opacity-0 group-hover:opacity-10 transition-all duration-300" />

              {/* Text */}
              <span className="relative flex items-center gap-2">
                Begin Draw
                <Zap className="w-4 h-4" />
              </span>
            </Link>
          </div>

          {/* Info Section */}
          <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-neon-cyan/20 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
              <div className="cyber-card p-4">
                <div className="text-2xl sm:text-3xl font-orbitron glow-text mb-2">2</div>
                <p className="text-xs text-neon-cyan/70 font-space-mono">Draws Per Team</p>
              </div>
              <div className="cyber-card p-4">
                <div className="text-2xl sm:text-3xl font-orbitron glow-text mb-2">3</div>
                <p className="text-xs text-neon-cyan/70 font-space-mono">Card Types</p>
              </div>
              <div className="cyber-card p-4">
                <div className="text-2xl sm:text-3xl font-orbitron glow-text mb-2">100%</div>
                <p className="text-xs text-neon-cyan/70 font-space-mono">Random</p>
              </div>
            </div>

            <div className="text-center text-xs text-neon-cyan/50 font-space-mono mt-6 space-y-1">
              <p>🔐 Secure • 📊 Tracked • 🎲 Fair</p>
              <p>Each team draws once per round</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neon-cyan/30 backdrop-blur-sm text-center py-4">
        <p className="text-xs text-neon-cyan/50 font-space-mono">
          CODE ARENA © 2026 | SDJ International College
        </p>
      </footer>
    </div>
  );
}
