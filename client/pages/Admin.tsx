import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Search, LogOut, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeamResult {
  team: string;
  round2: string;
  round3: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [results, setResults] = useState<TeamResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Check if already authenticated
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("codeArena_admin_auth");
    if (savedAuth) {
      setIsAuthenticated(true);
      loadResults();
    }
  }, []);

  const loadResults = async () => {
    setIsLoading(true);
    try {
      // Check if API URL is configured
      if (!import.meta.env.VITE_SHEET_API_URL) {
        throw new Error("API configuration missing");
      }

      const savedKey = sessionStorage.getItem("codeArena_admin_key");
      const response = await fetch(
        `${import.meta.env.VITE_SHEET_API_URL}?action=admin&key=${savedKey}`
      );

      // Check if response is valid
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error("Invalid response from server");
      }

      if (!data.success) {
        throw new Error("Failed to load results");
      }

      setResults(data.results || []);
    } catch (error) {
      console.error("Error loading results:", error);
      toast({
        title: "Error Loading Data",
        description: "Could not fetch results from the database.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminKey.trim()) {
      toast({
        title: "Invalid Key",
        description: "Please enter the admin key.",
        variant: "destructive",
      });
      return;
    }

    // Check if API URL is configured
    if (!import.meta.env.VITE_SHEET_API_URL) {
      toast({
        title: "Configuration Error",
        description: "Google Apps Script API URL not configured.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SHEET_API_URL}?action=admin&key=${adminKey}`
      );

      // Check if response is valid
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error("Invalid response from server");
      }

      if (!data.success) {
        throw new Error("Invalid key");
      }

      // Store auth in session storage
      sessionStorage.setItem("codeArena_admin_auth", "true");
      sessionStorage.setItem("codeArena_admin_key", adminKey);
      setAdminKey("");
      setIsAuthenticated(true);
      setResults(data.results || []);

      toast({
        title: "Authenticated",
        description: "Welcome to the admin dashboard.",
      });
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Authentication Failed",
        description: "Invalid admin key. Access denied.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("codeArena_admin_auth");
    sessionStorage.removeItem("codeArena_admin_key");
    setIsAuthenticated(false);
    setResults([]);
    navigate("/");
  };

  const filteredResults = results.filter((result) =>
    result.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen grid-bg overflow-hidden">
        {/* Header */}
        <header className="border-b border-neon-cyan/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 flex items-center gap-2">
            <Lock className="w-6 h-6 text-neon-pink" />
            <h1 className="text-lg sm:text-xl font-orbitron font-bold">
              <span className="glow-text">ADMIN</span>
              <span className="text-neon-pink/70"> DASHBOARD</span>
            </h1>
          </div>
        </header>

        {/* Login Section */}
        <main className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-sm">
            <div className="cyber-card p-8 sm:p-10 space-y-6">
              <div className="text-center">
                <div className="text-4xl mb-4">🔐</div>
                <h2 className="text-2xl sm:text-3xl font-orbitron font-bold glow-text mb-2">
                  Access Required
                </h2>
                <p className="text-neon-cyan/70 text-sm">
                  Enter your admin key to continue
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-orbitron text-neon-cyan/70 mb-2">
                    Admin Key
                  </label>
                  <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-card border-2 border-neon-cyan/50 text-neon-cyan placeholder-neon-cyan/30 font-space-mono focus:outline-none focus:border-neon-cyan focus:shadow-neon transition-all duration-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full px-6 py-3 border-2 border-neon-cyan text-neon-cyan font-orbitron font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:shadow-neon disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {isVerifying ? (
                    <span className="animate-spin">⚙️</span>
                  ) : (
                    <Lock className="w-4 h-4 group-hover:animate-pulse" />
                  )}
                  {isVerifying ? "Verifying..." : "Unlock Dashboard"}
                </button>
              </form>

              <div className="pt-4 border-t border-neon-cyan/20 text-center text-xs text-neon-cyan/50">
                <p>🔐 Secure access only</p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-neon-cyan/30 backdrop-blur-sm text-center py-4">
          <p className="text-xs text-neon-cyan/50 font-space-mono">
            CODE ARENA © 2024 | SDJ International College
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg overflow-hidden flex flex-col">
      {/* Header */}
      <header className="border-b border-neon-cyan/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-neon-cyan animate-pulse" />
            <h1 className="text-lg sm:text-xl font-orbitron font-bold">
              <span className="glow-text">ADMIN</span>
              <span className="text-neon-pink/70"> DASHBOARD</span>
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-neon-cyan/50 text-neon-cyan/70 hover:text-neon-cyan hover:border-neon-cyan rounded-sm transition-all duration-300 text-sm font-space-mono"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neon-cyan/50" />
              <input
                type="text"
                placeholder="Search team number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-neon-cyan/50 text-neon-cyan placeholder-neon-cyan/30 font-space-mono text-sm focus:outline-none focus:border-neon-cyan transition-all duration-300"
              />
            </div>
          </div>

          {/* Results Table */}
          <div className="cyber-card overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="text-2xl mb-2 animate-spin">⚙️</div>
                  <p className="text-neon-cyan/70 text-sm font-space-mono">
                    Loading results...
                  </p>
                </div>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-neon-cyan/70 text-sm font-space-mono">
                    {results.length === 0
                      ? "No results yet"
                      : "No teams match your search"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neon-cyan/30 bg-card sticky top-0">
                      <th className="px-4 sm:px-6 py-4 text-left font-orbitron text-neon-cyan/80">
                        Team
                      </th>
                      <th className="px-4 sm:px-6 py-4 text-left font-orbitron text-neon-cyan/80">
                        Round 2
                      </th>
                      <th className="px-4 sm:px-6 py-4 text-left font-orbitron text-neon-cyan/80">
                        Round 3
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map((result, index) => (
                      <tr
                        key={index}
                        className="border-b border-neon-cyan/20 hover:bg-neon-cyan/5 transition-colors duration-200"
                      >
                        <td className="px-4 sm:px-6 py-4 font-space-mono text-neon-cyan font-bold">
                          {result.team}
                        </td>
                        <td className="px-4 sm:px-6 py-4 font-space-mono text-neon-cyan/80">
                          {result.round2 || "-"}
                        </td>
                        <td className="px-4 sm:px-6 py-4 font-space-mono text-neon-cyan/80">
                          {result.round3 || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="cyber-card p-4">
              <div className="text-2xl sm:text-3xl font-orbitron glow-text mb-2">
                {results.length}
              </div>
              <p className="text-xs text-neon-cyan/70 font-space-mono">Total Teams</p>
            </div>
            <div className="cyber-card p-4">
              <div className="text-2xl sm:text-3xl font-orbitron glow-text mb-2">
                {results.filter((r) => r.round2).length}
              </div>
              <p className="text-xs text-neon-cyan/70 font-space-mono">Round 2 Drawn</p>
            </div>
            <div className="cyber-card p-4">
              <div className="text-2xl sm:text-3xl font-orbitron glow-text mb-2">
                {results.filter((r) => r.round3).length}
              </div>
              <p className="text-xs text-neon-cyan/70 font-space-mono">Round 3 Drawn</p>
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
