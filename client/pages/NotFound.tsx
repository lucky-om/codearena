/**
 * NotFound.tsx — Code Arena 404 Page
 * Developed by: Lucky
 * Project: Code Arena — Wildcard Draw System (Inferno'26)
 * Description: Cyber-themed 404 error page matching the neon aesthetic
 *              of the rest of the application.
 */
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Zap } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen grid-bg flex flex-col items-center justify-center p-4 text-white font-space-mono">

      {/* Animated background glow blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-neon-green/5 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "20%", left: "10%" }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl"
          animate={{ x: [0, -80, 0], y: [0, 80, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "20%", right: "10%" }}
        />
      </div>

      <motion.div
        className="w-full max-w-lg text-center relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Glitchy 404 number */}
        <motion.div
          className="mb-4"
          animate={{ opacity: [1, 0.8, 1] }}
          transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3 }}
        >
          <motion.h1
            className="text-8xl sm:text-9xl font-orbitron font-black glow-text-lg tracking-widest select-none"
            animate={{
              textShadow: [
                "0 0 20px rgba(0,255,0,1), 0 0 40px rgba(0,255,0,0.6)",
                "0 0 40px rgba(0,255,0,1), 0 0 80px rgba(0,255,0,0.8)",
                "0 0 20px rgba(0,255,0,1), 0 0 40px rgba(0,255,0,0.6)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            404
          </motion.h1>
        </motion.div>

        {/* Cyber card container */}
        <motion.div
          className="cyber-card p-8 mb-8 relative overflow-hidden"
          animate={{
            boxShadow: [
              "inset 0 0 10px rgba(0,255,0,0.1), 0 0 20px rgba(0,255,0,0.2)",
              "inset 0 0 20px rgba(0,255,0,0.2), 0 0 40px rgba(0,255,0,0.3)",
              "inset 0 0 10px rgba(0,255,0,0.1), 0 0 20px rgba(0,255,0,0.2)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {/* Scan-line sweep */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-green/10 to-transparent pointer-events-none"
            animate={{ y: ["0%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative z-10 space-y-3">
            <motion.div
              className="text-4xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ⚠️
            </motion.div>

            <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-neon-cyan tracking-wider">
              SECTOR NOT FOUND
            </h2>

            <motion.p
              className="text-neon-green/70 text-sm"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              &gt; ERROR_CODE: 0x404
            </motion.p>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              The page you are looking for does not exist or has been moved.
              <br />
              <span className="text-neon-cyan/60">
                Route: <code className="text-neon-green">{location.pathname}</code>
              </span>
            </p>
          </div>
        </motion.div>

        {/* Back to home button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/"
            className="group inline-flex items-center gap-3 px-8 py-4 border-2 border-neon-cyan text-neon-cyan font-orbitron font-bold text-sm uppercase tracking-widest rounded-sm transition-all duration-300 hover:shadow-neon hover:bg-neon-cyan/10"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Return to Base
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-4 h-4" />
            </motion.span>
          </Link>
        </motion.div>

        {/* Developer credit */}
        <motion.p
          className="mt-8 text-[10px] text-neon-cyan/30 font-space-mono tracking-widest"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          CODE ARENA | INFERNO'26 | DEVELOPED BY <span className="text-neon-cyan/50 font-bold">LUCKY</span>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFound;
