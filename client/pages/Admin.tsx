import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Search, LogOut, Zap, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import { soundManager } from "@/lib/sounds";

// Matches the structure from our new Google Script
interface TeamData {
  teamId: string;
  round2: string;
  round3: string;
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

  // ✅ FIXED: UPDATED TO THE NEW WORKING URL
const API_URL = "https://script.google.com/macros/s/AKfycbyfL2HPX1SBw4lkpbHN96bIxMsu8l_18YiWhl2gzr5v7kgHWN5NYf8c-7IZkxuWtBQD/exec";

  // Initialize sound manager
  useEffect(() => {
    soundManager.setEnabled(true);
  }, []);

  // Check session on load
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("codeArena_admin_auth");
    if (savedAuth) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  // --- ACTIONS ---

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Use the 'readAll' action via GET (Fixes CORS)
      const response = await fetch(`${API_URL}?action=readAll`);
      const result = await response.json();

      if (result.status === "success") {
        setData(result.data || []);
      } else {
        console.error("API Error:", result.message);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    // Simple Client-Side Lock
    setTimeout(() => {
      if (adminKey === "admin") {
        sessionStorage.setItem("codeArena_admin_auth", "true");
        setIsAuthenticated(true);
        fetchData();
      } else {
        alert("ACCESS DENIED: Invalid Security Key");
      }
      setIsVerifying(false);
    }, 800); 
  };

  const handleLogout = () => {
    sessionStorage.removeItem("codeArena_admin_auth");
    setIsAuthenticated(false);
    setData([]);
    setAdminKey("");
  };

  // Filter Logic
  const filteredData = data.filter((item) =>
    String(item.teamId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- RENDER: LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background grid-bg">
        <div className="w-full max-w-sm cyber-card p-8 space-y-6 relative overflow-hidden">
          {/* Glitch Overlay */}
          <div className="absolute top-0 left-0 w-full h-1 bg-neon-green animate-pulse" />
          
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-full border border-neon-green/30 bg-neon-green/10 mb-4">
              <Lock className="w-8 h-8 text-neon-green animate-pulse" />
            </div>
            <h2 className="text-2xl font-orbitron font-bold text-white tracking-wider">
              SYSTEM <span className="text-neon-green">LOCKED</span>
            </h2>
            <p className="text-xs font-space-mono text-gray-400">
              SECURE TERMINAL // AUTHORIZED PERSONNEL ONLY
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="ENTER SECURITY KEY..."
                className="w-full px-4 py-3 bg-black/50 border border-neon-green/50 text-neon-green placeholder-neon-green/30 font-space-mono focus:outline-none focus:border-neon-green focus:shadow-[0_0_15px_rgba(0,255,0,0.3)] transition-all text-center tracking-widest"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 bg-neon-green/10 border border-neon-green text-neon-green font-orbitron font-bold hover:bg-neon-green hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <span className="animate-spin">⚙</span>
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {isVerifying ? "DECRYPTING..." : "AUTHENTICATE"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER: DASHBOARD ---
  return (
    <div className="min-h-screen bg-background flex flex-col font-space-mono">
      
      {/* HEADER */}
      <header className="border-b border-neon-green/30 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-neon-green animate-pulse" />
            <h1 className="text-lg md:text-xl font-orbitron font-bold text-white">
              ADMIN <span className="text-neon-green glow-text">PANEL</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="p-2 text-neon-green hover:bg-neon-green/10 rounded-sm transition-colors"
              title="Refresh Data"
            >
              <RefreshCcw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 border border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500 rounded-sm transition-all text-xs font-bold"
            >
              <LogOut className="w-4 h-4" />
              LOGOUT
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            label="TOTAL TEAMS" 
            value={data.length} 
            icon="👥" 
          />
          <StatCard 
            label="ROUND 2 PLAYED" 
            value={data.filter(i => i.round2).length} 
            icon="🃏" 
            color="text-neon-green"
          />
          <StatCard 
            label="ROUND 3 PLAYED" 
            value={data.filter(i => i.round3).length} 
            icon="🏆" 
            color="text-yellow-400"
          />
           <StatCard 
            label="PENDING" 
            value={data.filter(i => !i.round2 && !i.round3).length} 
            icon="⏳" 
            color="text-gray-400"
          />
        </div>

        {/* SEARCH & TABLE SECTION */}
        <div className="space-y-4">
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-green/50" />
            <input
              type="text"
              placeholder="SEARCH TEAM ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-neon-green/30 text-white placeholder-gray-600 focus:border-neon-green focus:shadow-[0_0_10px_rgba(0,255,0,0.2)] outline-none transition-all"
            />
          </div>

          {/* Data Table */}
          <div className="cyber-card overflow-hidden min-h-[400px]">
            {isLoading && data.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-neon-green">
                <div className="text-4xl animate-spin mb-4">⚙</div>
                <p className="tracking-widest animate-pulse">ESTABLISHING UPLINK...</p>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p>NO DATA FOUND IN SECTOR</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/40 border-b border-neon-green/30 text-xs text-neon-green/70 uppercase tracking-wider">
                      <th className="p-4">Team ID</th>
                      <th className="p-4">Round 2</th>
                      <th className="p-4">Round 3</th>
                      <th className="p-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neon-green/10">
                    {filteredData.map((row) => (
                      <tr key={row.teamId} className="hover:bg-neon-green/5 transition-colors">
                        <td className="p-4 font-bold text-white text-lg">
                          #{row.teamId}
                        </td>
                        <td className="p-4">
                          {row.round2 ? (
                            <span className="text-neon-green font-bold drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]">
                              {row.round2}
                            </span>
                          ) : (
                            <span className="text-gray-600 italic text-xs">PENDING</span>
                          )}
                        </td>
                        <td className="p-4">
                          {row.round3 ? (
                            <span className="text-yellow-400 font-bold drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]">
                              {row.round3}
                            </span>
                          ) : (
                            <span className="text-gray-600 italic text-xs">PENDING</span>
                          )}
                        </td>
                        <td className="p-4 text-xs text-gray-500 font-mono">
                          {row.timestamp 
                            ? new Date(row.timestamp).toLocaleTimeString() 
                            : "-"}
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
      <footer className="border-t border-neon-green/20 bg-black/40 py-6 text-center">
        <p className="text-xs text-neon-green/40">
          SECURE CONNECTION ESTABLISHED • v2.0.4
        </p>
      </footer>
    </div>
  );
}

// Simple Helper Component for Stats
function StatCard({ label, value, icon, color = "text-white" }: { label: string, value: number, icon: string, color?: string }) {
  return (
    <div className="cyber-card p-4 flex flex-col items-center justify-center text-center hover:bg-neon-green/5 transition-all cursor-default">
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-3xl font-orbitron font-bold ${color} drop-shadow-md`}>
        {value}
      </div>
      <div className="text-[10px] text-neon-green/60 uppercase tracking-widest mt-1">
        {label}
      </div>
    </div>
  );
}
