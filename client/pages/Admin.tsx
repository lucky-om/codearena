import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Search, LogOut, Zap, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import { soundManager } from "@/lib/sounds";

// Matches the structure from our new Google Script - 5 column structure
interface TeamData {
  teamId: string;
  round2Card: string;
  round2Target: string;
  round3Card: string;
  round3Target: string;
  timestamp: string;
}

export default function Admin() {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [data, setData] = useState<TeamData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Updated API URL from user
const API_URL = "https://script.google.com/macros/s/AKfycbzrI9o3jv-ASPia9g7tLcsijLhYn_2SgroB4iCUI5xpBFJ3QVo-KphiL8G0WZ-rcAPwIA/exec";

  // Initialize sound manager
  useEffect(() => {
    soundManager.setEnabled(true);
  }, []);

  // Check session on load
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("codeArena_admin_auth");
    if (savedAuth) {
      setIsAuthenticated(true);
      // Fetch data on mount if already authenticated
      const loadData = async () => {
        try {
          const response = await fetch(`${API_URL}?action=readAll`);
          const result = await response.json();
          if (result.status === "success") {
            setData(result.data || []);
          }
        } catch (error) {
          console.error("Fetch Error:", error);
        }
      };
      loadData();
    }
  }, []);

  // --- ACTIONS ---

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Use the 'readAll' action via GET (Fixes CORS)
      const response = await fetch(`${API_URL}?action=readAll`);
      const result = await response.json();

      console.log("[v0] API Response:", result);

      if (result.status === "success") {
        const fetchedData = result.data || [];
        console.log("[v0] Fetched data count:", fetchedData.length);
        console.log("[v0] First item structure:", fetchedData[0]);
        setData(fetchedData);
      } else {
        console.error("[v0] API Error:", result.message);
      }
    } catch (error) {
      console.error("[v0] Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    soundManager.click();

    // Simple Client-Side Lock
    setTimeout(() => {
      if (adminKey === "Lucky") {
        soundManager.approve();
        sessionStorage.setItem("codeArena_admin_auth", "true");
        setIsAuthenticated(true);
        fetchData();
      } else {
        soundManager.error();
        alert("ACCESS DENIED: Invalid Security Key");
      }
      setIsVerifying(false);
    }, 300);
  };

  const handleLogout = () => {
    soundManager.click();
    sessionStorage.removeItem("codeArena_admin_auth");
    setIsAuthenticated(false);
    setData([]);
    setAdminKey("");
  };

  // Filter Logic - search by teamId or target
  const filteredData = data.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      String(item.teamId).toLowerCase().includes(searchLower) ||
      String(item.round2Target).toLowerCase().includes(searchLower) ||
      String(item.round3Target).toLowerCase().includes(searchLower)
    );
  });

  // --- RENDER: LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background grid-bg">
        <motion.div
          className="w-full max-w-sm cyber-card p-6 sm:p-8 space-y-6 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Glitch Overlay */}
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-neon-green"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <div className="text-center space-y-2">
            <motion.div
              className="inline-flex p-3 rounded-full border border-neon-green/30 bg-neon-green/10 mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                animate={{ rotateZ: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Lock className="w-8 h-8 text-neon-green" />
              </motion.div>
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-orbitron font-bold text-white tracking-wider">
              SYSTEM <span className="text-neon-green">LOCKED</span>
            </h2>
            <p className="text-xs sm:text-sm font-space-mono text-gray-400">
              SECURE TERMINAL 
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="ENTER SECURITY KEY..."
                className="w-full px-3 sm:px-4 py-3 bg-black/50 border border-neon-green/50 text-neon-green placeholder-neon-green/30 font-space-mono focus:outline-none focus:border-neon-green focus:shadow-[0_0_15px_rgba(0,255,0,0.3)] transition-all text-center tracking-widest text-sm sm:text-base"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 bg-neon-green/10 border border-neon-green text-neon-green font-orbitron font-bold hover:bg-neon-green hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isVerifying ? (
                <span className="animate-spin">⚙</span>
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {isVerifying ? "DECRYPTING..." : "AUTHENTICATE"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  // --- RENDER: DASHBOARD ---
  return (
    <div className="min-h-screen bg-background flex flex-col font-space-mono">
      
      {/* HEADER */}
      <header className="border-b border-neon-green/30 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-5 sm:w-6 h-5 sm:h-6 text-neon-green" />
            </motion.div>
            <h1 className="text-base sm:text-lg md:text-xl font-orbitron font-bold text-white tracking-wider">
              ADMIN <span className="text-neon-green glow-text">PANEL</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button
              onClick={() => {
                soundManager.click();
                fetchData();
              }}
              disabled={isLoading}
              className="p-2 text-neon-green hover:bg-neon-green/10 rounded-sm transition-colors"
              title="Refresh Data"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCcw className={`w-4 sm:w-5 h-4 sm:h-5 ${isLoading ? "animate-spin" : ""}`} />
            </motion.button>
            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 border border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500 rounded-sm transition-all text-[10px] sm:text-xs font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-3 sm:w-4 h-3 sm:h-4" />
              <span className="hidden sm:inline">LOGOUT</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 px-3 sm:px-4 py-6 sm:py-8 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8">

        {/* STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <StatCard
            label="TOTAL TEAMS"
            value={data.length}
            icon="👥"
          />
          <StatCard
            label="ROUND 2 CARDS"
            value={data.filter(i => i.round2Card).length}
            icon="🃏"
            color="text-neon-green"
          />
          <StatCard
            label="ROUND 3 CARDS"
            value={data.filter(i => i.round3Card).length}
            icon="🏆"
            color="text-yellow-400"
          />
          <StatCard
            label="ATTACKS SENT"
            value={data.filter(i => i.round2Target || i.round3Target).length}
            icon="⚡"
            color="text-danger-red"
          />
        </div>

        {/* SEARCH & TABLE SECTION */}
        <div className="space-y-3 sm:space-y-4">

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 sm:w-4 h-3 sm:h-4 text-neon-green/50" />
            <input
              type="text"
              placeholder="SEARCH TEAM ID OR TARGET..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 bg-card border border-neon-green/30 text-white placeholder-gray-600 focus:border-neon-green focus:shadow-[0_0_10px_rgba(0,255,0,0.2)] outline-none transition-all text-sm sm:text-base"
            />
          </div>

          {/* Data Table */}
          <div className="cyber-card overflow-hidden min-h-[300px] sm:min-h-[400px]">
            {isLoading && data.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-neon-green">
                <div className="text-4xl animate-spin mb-4">⚙</div>
                <p className="tracking-widest animate-pulse">CONNECTING TO SDJIC SERVERS...</p>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p>NO DATA FOUND IN SECTOR</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-black/40 border-b border-neon-green/30 text-[9px] sm:text-xs text-neon-green/70 uppercase tracking-wider">
                      <th className="p-2 sm:p-4">Team ID</th>
                      <th className="p-2 sm:p-4">R2 Card</th>
                      <th className="p-2 sm:p-4">R2 Target</th>
                      <th className="p-2 sm:p-4">R3 Card</th>
                      <th className="p-2 sm:p-4">R3 Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neon-green/10">
                    {filteredData.map((row) => (
                      <tr key={row.teamId} className="hover:bg-neon-green/5 transition-colors text-[11px] sm:text-sm">
                        <td className="p-2 sm:p-4 font-bold text-white">
                          #{row.teamId}
                        </td>
                        <td className="p-2 sm:p-4">
                          {row.round2Card ? (
                            <span className="text-neon-green font-bold drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]">
                              {row.round2Card}
                            </span>
                          ) : (
                            <span className="text-gray-600 italic">-</span>
                          )}
                        </td>
                        <td className="p-2 sm:p-4">
                          {row.round2Target ? (
                            <span className="text-danger-red font-bold drop-shadow-[0_0_5px_rgba(255,0,60,0.5)]">
                              #{row.round2Target}
                            </span>
                          ) : (
                            <span className="text-gray-600 italic">-</span>
                          )}
                        </td>
                        <td className="p-2 sm:p-4">
                          {row.round3Card ? (
                            <span className="text-yellow-400 font-bold drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]">
                              {row.round3Card}
                            </span>
                          ) : (
                            <span className="text-gray-600 italic">-</span>
                          )}
                        </td>
                        <td className="p-2 sm:p-4">
                          {row.round3Target ? (
                            <span className="text-danger-red font-bold drop-shadow-[0_0_5px_rgba(255,0,60,0.5)]">
                              #{row.round3Target}
                            </span>
                          ) : (
                            <span className="text-gray-600 italic">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-neon-green/20 bg-black/40 py-4 sm:py-6 text-center">
        <motion.p
          className="text-xs sm:text-sm text-neon-green/40"
          animate={{
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        >
          SECURE CONNECTION ESTABLISHED • v3.0.4
        </motion.p>
      </footer>
    </div>
  );
}

// Simple Helper Component for Stats
function StatCard({ label, value, icon, color = "text-white" }: { label: string, value: number, icon: string, color?: string }) {
  return (
    <motion.div
      className="cyber-card p-3 sm:p-4 flex flex-col items-center justify-center text-center hover:bg-neon-green/5 transition-all cursor-default"
      whileHover={{ y: -3 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-xl sm:text-2xl mb-1">{icon}</div>
      <motion.div
        className={`text-2xl sm:text-3xl font-orbitron font-bold ${color} drop-shadow-md`}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: Math.random() * 0.5,
        }}
      >
        {value}
      </motion.div>
      <div className="text-[9px] sm:text-[10px] text-neon-green/60 uppercase tracking-widest mt-1">
        {label}
      </div>
    </motion.div>
  );
}
