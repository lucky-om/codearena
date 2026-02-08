import { Link } from "react-router-dom";
import { Volume2, VolumeX, Zap, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { soundManager } from "@/lib/sounds";

export default function Index() {
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen grid-bg overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-neon-green rounded-full opacity-30"
            animate={{
              y: [0, -300, 0],
              x: [0, Math.cos(i) * 100, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: `${(i / 12) * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="border-b border-neon-cyan/30 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-7 h-7 text-neon-cyan" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl font-orbitron font-black glow-text-lg tracking-wider">
              CODE ARENA
            </h1>
          </motion.div>

          <motion.button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              soundManager.click();
            }}
            className="p-2 rounded-sm border border-neon-cyan/50 hover:border-neon-cyan hover:shadow-neon transition-all duration-300 text-neon-cyan hover:bg-neon-cyan/10"
            aria-label="Toggle sound"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div
          className="w-full max-w-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Title Section */}
          <motion.div className="text-center mb-12 sm:mb-16" variants={itemVariants}>
            <div className="mb-6 sm:mb-8">
              {/* Animated title with gradient effect */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h2 className="text-5xl sm:text-7xl font-orbitron font-black mb-2 glow-text-lg tracking-wider">
                  CODE ARENA
                </h2>
              </motion.div>

              <motion.p
                className="text-xs sm:text-sm text-neon-cyan/70 font-space-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                INFERNO'26 | SDJ International College
              </motion.p>
            </div>

            {/* Animated tagline */}
            <motion.div
              className="space-y-2 text-neon-cyan/60 text-xs sm:text-sm font-space-mono mb-8 sm:mb-12"
              variants={itemVariants}
            >
              <motion.div
                className="flex items-center justify-center gap-2"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-neon-purple" />
                <p className="tracking-widest">WILDCARD DRAW SYSTEM</p>
                <Sparkles className="w-4 h-4 text-neon-purple" />
              </motion.div>
              <p className="text-neon-purple/70">Round 2 & Round 3 • 100% Random Selection</p>
            </motion.div>
          </motion.div>

          {/* Card Display - Premium Animation */}
          <motion.div
            className="flex items-center justify-center mb-8 sm:mb-16"
            variants={itemVariants}
          >
            <motion.div
              className="w-full max-w-xs sm:max-w-sm relative"
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => soundManager.hover()}
            >
              {/* Card glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-neon-purple via-neon-cyan to-neon-green opacity-0 rounded-sm blur-xl"
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Main card */}
              <div className="cyber-card p-8 sm:p-12 h-64 sm:h-80 flex flex-col items-center justify-center relative overflow-hidden group cursor-default hover:shadow-neon-lg transition-all duration-300">
                {/* Animated card bg gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-neon-purple/15 via-transparent to-neon-cyan/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />

                {/* Scan line effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-green/10 to-transparent"
                  animate={{
                    y: ["0%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* Card content */}
                <div className="relative z-10 text-center">
                  <motion.div
                    className="text-6xl sm:text-7xl mb-4"
                    animate={{
                      y: [0, -15, 0],
                      rotateZ: [-3, 3, -3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    ⚡
                  </motion.div>

                  <motion.h3
                    className="text-2xl sm:text-3xl font-orbitron font-black glow-text mb-4 tracking-wider"
                    animate={{
                      textShadow: [
                        "0 0 10px rgba(0, 255, 0, 0.5), 0 0 20px rgba(0, 255, 0, 0.2)",
                        "0 0 20px rgba(0, 255, 0, 0.8), 0 0 40px rgba(0, 255, 0, 0.4)",
                        "0 0 10px rgba(0, 255, 0, 0.5), 0 0 20px rgba(0, 255, 0, 0.2)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    WILDCARD
                  </motion.h3>

                  <motion.p
                    className="text-xs sm:text-sm text-neon-cyan/70 font-space-mono"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    Draw Your Destiny
                  </motion.p>
                </div>

                {/* Animated corner accents */}
                {[
                  "top-2 left-2 border-t-2 border-l-2",
                  "top-2 right-2 border-t-2 border-r-2",
                  "bottom-2 left-2 border-b-2 border-l-2",
                  "bottom-2 right-2 border-b-2 border-r-2",
                ].map((pos, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-4 h-4 border-neon-cyan/50 ${pos}`}
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* CTA Button - Premium Style */}
          <motion.div className="flex justify-center" variants={itemVariants}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/wildcard"
                onClick={() => soundManager.success()}
                className="group relative px-8 sm:px-16 py-4 sm:py-5 border-2 border-neon-cyan text-neon-cyan font-orbitron font-bold text-sm sm:text-lg uppercase tracking-widest overflow-hidden rounded-sm transition-all duration-300 hover:shadow-neon-lg inline-block"
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 via-neon-purple/20 to-neon-cyan/20"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ filter: "blur(2px)" }}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-neon-cyan opacity-0 group-hover:opacity-15 transition-all duration-300" />

                {/* Text */}
                <motion.span
                  className="relative flex items-center gap-3 justify-center"
                  animate={{ x: 0 }}
                  whileHover={{ x: [0, 5, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  Begin Draw
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-5 h-5" />
                  </motion.span>
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Info Section - Enhanced Cards */}
          <motion.div
            className="mt-8 sm:mt-16 pt-6 sm:pt-12 border-t border-neon-cyan/20 space-y-4"
            variants={containerVariants}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-center">
              {[
                { number: "2", label: "Draws Per Team" },
                { number: "3", label: "Card Types" },
                { number: "100%", label: "Random" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="cyber-card p-3 sm:p-4 group cursor-default hover:shadow-neon transition-all duration-300"
                  whileHover={{ y: -5 }}
                  variants={itemVariants}
                >
                  <motion.div
                    className="text-xl sm:text-3xl font-orbitron glow-text mb-1 sm:mb-2 tracking-wider"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  >
                    {stat.number}
                  </motion.div>
                  <p className="text-[10px] sm:text-xs text-neon-cyan/70 font-space-mono">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Bottom info */}
            <motion.div
              className="text-center text-xs text-neon-cyan/50 font-space-mono mt-6 space-y-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <motion.p
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                🔐 Secure • 📊 Tracked • 🎲 Fair
              </motion.p>
              <p>Each team draws once per round</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neon-cyan/30 backdrop-blur-sm text-center py-4 relative z-10">
        <motion.p
          className="text-xs text-neon-cyan/50 font-space-mono"
          animate={{
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        >
          INFERNO'26 | CODE ARENA © 2026 | SDJ International College
        </motion.p>
      </footer>
    </div>
  );
}
