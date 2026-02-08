import { Link } from "react-router-dom";
import { Zap, ArrowLeft, RotateCcw, Lock, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { soundManager } from "@/lib/sounds";

// --- CONFIGURATION ---
type CardType = "freeze" | "guess" | "out";
type DrawResult = {
  type: CardType;
  label: string;
};

const CARDS: DrawResult[] = [
  { type: "freeze", label: "Freeze" },
  { type: "guess", label: "Guess the point" },
  { type: "out", label: "2 Member Out" },
];

const CARD_EMOJIS: Record<CardType, string> = {
  freeze: "❄️",
  guess: "🎯",
  out: "❌",
};

// ✅ API URL (Hardcoded to prevent .env issues)
const API_URL = "https://script.google.com/macros/s/AKfycbyfL2HPX1SBw4lkpbHN96bIxMsu8l_18YiWhl2gzr5v7kgHWN5NYf8c-7IZkxuWtBQD/exec";

// ✅ Helper function to get random card, optionally excluding a type
const getRandomCard = (excludeType: CardType | null = null): DrawResult => {
  const availableCards = excludeType
    ? CARDS.filter(card => card.type !== excludeType)
    : CARDS;
  
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const resultIndex = array[0] % availableCards.length;
  return availableCards[resultIndex];
};

// ✅ Shuffle position swap logic
const generateShuffleSequence = (duration: number = 3000): number[][] => {
  const sequence: number[][] = [];
  const interval = 300;
  const steps = Math.floor(duration / interval);

  for (let i = 0; i < steps; i++) {
    // Random permutation of [0, 1, 2] positions
    const positions = [0, 1, 2];
    for (let j = positions.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [positions[j], positions[k]] = [positions[k], positions[j]];
    }
    sequence.push(positions);
  }
  return sequence;
};

export default function Wildcard() {
  const { toast } = useToast();
  
  // State
  const [teamInput, setTeamInput] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [currentRound, setCurrentRound] = useState<2 | 3 | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<DrawResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [drawnRounds, setDrawnRounds] = useState<{ round2: boolean; round3: boolean }>({
    round2: false,
    round3: false,
  });
  
  // Face-down state & position tracking for shuffle
  const [cardPositions, setCardPositions] = useState<number[]>([0, 1, 2]);
  const [round2CardType, setRound2CardType] = useState<CardType | null>(null);
  const [shuffleSequence, setShuffleSequence] = useState<number[][]>([]);
  const [currentShuffleStep, setCurrentShuffleStep] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Initialize sound manager
  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedTeam = localStorage.getItem("codeArena_teamId");
    const savedRound2 = localStorage.getItem("codeArena_round2_drawn");
    const savedRound3 = localStorage.getItem("codeArena_round3_drawn");
    const savedRound2CardType = localStorage.getItem("codeArena_round2_card_type") as CardType | null;

    if (savedTeam) {
      setTeamInput(savedTeam);
      setIsVerified(true);
    }

    // Load the round 2 card type to prevent duplicate draws
    if (savedRound2CardType) {
      setRound2CardType(savedRound2CardType);
    }

    setDrawnRounds({
      round2: !!savedRound2,
      round3: !!savedRound3,
    });

    // Determine next available round based on local storage initially
    if (!savedRound2) {
      setCurrentRound(2);
    } else if (!savedRound3) {
      setCurrentRound(3);
    }
  }, []);

  // Shuffle animation loop
  useEffect(() => {
    if (!isSpinning || shuffleSequence.length === 0) return;

    const interval = setInterval(() => {
      setCurrentShuffleStep((prev) => {
        const nextStep = prev + 1;
        if (nextStep < shuffleSequence.length) {
          setCardPositions(shuffleSequence[nextStep]);
          return nextStep;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 300); // Swap every 300ms

    return () => clearInterval(interval);
  }, [isSpinning, shuffleSequence]);

  const validateTeamInput = (input: string): boolean => {
    return /^\d+$/.test(input) && input.length > 0;
  };

  const handleVerifyTeam = async () => {
    if (!validateTeamInput(teamInput)) {
      toast({
        title: "Invalid Team Number",
        description: "Please enter a numeric team number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}?action=verify&teamId=${teamInput}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== "success") {
        toast({
          title: "Team Not Found",
          description: "Please verify your team number in the sheet.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const round2Filled = !!data.data.round2;
      const round3Filled = !!data.data.round3;

      let nextRound: 2 | 3 | null = null;
      if (!round2Filled) {
        nextRound = 2;
      } else if (!round3Filled) {
        nextRound = 3;
      }

      if (nextRound === null) {
        toast({
          title: "All Draws Completed",
          description: "Your team has already drawn for both rounds.",
          variant: "destructive",
        });
        setIsLoading(false);
        setCurrentRound(null);
      } else {
        setCurrentRound(nextRound);
        toast({
          title: "Team Verified",
          description: `Ready for Round ${nextRound}!`,
        });
      }

      localStorage.setItem("codeArena_teamId", teamInput);
      setIsVerified(true);
      setDrawnRounds({
        round2: round2Filled,
        round3: round3Filled,
      });

    } catch (error) {
      console.error("Error verifying team:", error);
      toast({
        title: "Connection Error",
        description: "Please switch to Mobile Data (College WiFi blocks this).",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const performDraw = async () => {
    if (!isVerified || currentRound === null) return;

    // Start shuffle sound
    soundManager.shuffle();

    // Generate shuffle sequence before starting
    const sequence = generateShuffleSequence(3000);
    setShuffleSequence(sequence);
    setCurrentShuffleStep(0);
    setCardPositions([0, 1, 2]);

    setIsSpinning(true);
    setResult(null);

    // Wait for shuffle animation to complete (3 seconds)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Play reveal sound
    soundManager.reveal();

    // Get random card with exclusion logic
    const selectedCard = getRandomCard(currentRound === 3 ? round2CardType : null);
    setResult(selectedCard);

    // Submit to backend
    try {
      let url = `${API_URL}?action=save&teamId=${teamInput}`;
      
      if (currentRound === 2) {
        url += `&round2=${encodeURIComponent(selectedCard.label)}`;
      } else {
        url += `&round3=${encodeURIComponent(selectedCard.label)}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== "success") {
        throw new Error(data.message || "Failed to record result");
      }

      // Update localStorage
      if (currentRound === 2) {
        localStorage.setItem("codeArena_round2_drawn", "true");
        localStorage.setItem("codeArena_round2_card_type", selectedCard.type);
        setRound2CardType(selectedCard.type);
      } else {
        localStorage.setItem("codeArena_round3_drawn", "true");
      }

      setDrawnRounds((prev) => ({
        ...prev,
        [currentRound === 2 ? "round2" : "round3"]: true,
      }));

      toast({
        title: "Result Recorded",
        description: "Your wildcard has been recorded successfully.",
      });
    } catch (error) {
      console.error("Error recording result:", error);
      toast({
        title: "Recording Error",
        description: "Could not record result. Check connection.",
        variant: "destructive",
      });
    } finally {
      setIsSpinning(false);
      setShuffleSequence([]);
      setCurrentShuffleStep(0);
      setCardPositions([0, 1, 2]);
    }
  };

  const handleReset = () => {
    setTeamInput("");
    setIsVerified(false);
    setCurrentRound(null);
    setResult(null);
    setRound2CardType(null);
    setCardPositions([0, 1, 2]);
    localStorage.removeItem("codeArena_teamId");
    localStorage.removeItem("codeArena_round2_drawn");
    localStorage.removeItem("codeArena_round3_drawn");
    localStorage.removeItem("codeArena_round2_card_type");
    window.location.reload();
  };

  return (
    <div className="min-h-screen grid-bg overflow-hidden text-white font-space-mono">
      {/* Header */}
      <header className="border-b border-neon-cyan/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" onClick={() => soundManager.click()}>
            <ArrowLeft className="w-5 h-5 text-neon-cyan" />
            <h1 className="text-lg sm:text-xl font-orbitron font-bold glow-text">
              WILDCARD DRAW
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            {isVerified && (
              <div className="text-right">
                <p className="text-xs text-neon-cyan/70 font-space-mono">TEAM</p>
                <p className="text-lg font-orbitron glow-text">{teamInput}</p>
              </div>
            )}
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
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {!isVerified ? (
            // Team Verification Form
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-orbitron font-bold glow-text mb-4">
                  Team Verification
                </h2>
                <p className="text-neon-cyan/70 text-sm sm:text-base">
                  Enter your numeric team number to begin
                </p>
              </div>

              <div className="max-w-xs mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-orbitron text-neon-cyan/70 mb-2">
                    Team Number
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={teamInput}
                    onChange={(e) => setTeamInput(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g., 101"
                    className="w-full px-4 py-3 bg-card border-2 border-neon-cyan/50 text-neon-cyan placeholder-neon-cyan/30 font-space-mono focus:outline-none focus:border-neon-cyan focus:shadow-neon transition-all duration-300"
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyTeam()}
                  />
                </div>

                <motion.button
                  onClick={() => {
                    soundManager.click();
                    handleVerifyTeam();
                  }}
                  disabled={isLoading || !validateTeamInput(teamInput)}
                  className="w-full px-6 py-3 border-2 border-neon-cyan text-neon-cyan font-orbitron font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:shadow-neon disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <span className="animate-spin">⚙️</span>
                  ) : (
                    <Zap className="w-4 h-4 group-hover:animate-pulse" />
                  )}
                  {isLoading ? "Verifying..." : "Verify Team"}
                </motion.button>
              </div>
            </div>
          ) : result ? (
            // Result Display
            <motion.div
              className="space-y-8 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div>
                <motion.h2
                  className="text-2xl font-orbitron text-neon-green mb-2"
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(0, 255, 0, 0.5), 0 0 20px rgba(0, 255, 0, 0.2)",
                      "0 0 20px rgba(0, 255, 0, 0.8), 0 0 40px rgba(0, 255, 0, 0.4)",
                      "0 0 10px rgba(0, 255, 0, 0.5), 0 0 20px rgba(0, 255, 0, 0.2)",
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  ROUND {currentRound} RESULT
                </motion.h2>

                <motion.div
                  className="cyber-card p-12 sm:p-16 relative overflow-hidden group"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(0, 255, 0, 0.3), 0 0 40px rgba(0, 255, 0, 0.2)",
                      "0 0 40px rgba(0, 255, 0, 0.5), 0 0 80px rgba(0, 255, 0, 0.3)",
                      "0 0 20px rgba(0, 255, 0, 0.3), 0 0 40px rgba(0, 255, 0, 0.2)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-transparent to-neon-cyan/20 opacity-50"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  />

                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-green/20 to-transparent"
                    animate={{
                      y: ["0%", "100%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  <div className="relative z-10">
                    <motion.div
                      className="text-7xl sm:text-8xl mb-6"
                      animate={{
                        y: [0, -20, 0],
                        rotateZ: [-5, 5, -5],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {CARD_EMOJIS[result.type]}
                    </motion.div>

                    <motion.h3
                      className="text-3xl sm:text-4xl font-orbitron font-bold glow-text mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      {result.label}
                    </motion.h3>

                    <motion.p
                      className="text-neon-cyan/70 text-xs sm:text-sm font-space-mono"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    >
                      ✓ Saved to Database
                    </motion.p>
                  </div>
                </motion.div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {currentRound === 2 && !drawnRounds.round3 && (
                  <motion.button
                    onClick={() => {
                      soundManager.click();
                      setCurrentRound(3);
                      setResult(null);
                      setCardPositions([0, 1, 2]);
                    }}
                    className="px-8 py-3 bg-neon-cyan text-black font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Zap className="w-4 h-4" />
                    Next Round
                  </motion.button>
                )}
                <motion.button
                  onClick={() => {
                    soundManager.click();
                    handleReset();
                  }}
                  className="px-8 py-3 border-2 border-neon-cyan text-neon-cyan font-orbitron font-bold uppercase tracking-wider rounded-sm transition-all duration-300 hover:shadow-neon flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw className="w-4 h-4" />
                  Logout
                </motion.button>
              </div>
            </motion.div>
          ) : currentRound ? (
            // Draw Interface
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-orbitron font-bold glow-text mb-2">
                  Round {currentRound}
                </h2>
                <p className="text-neon-cyan/70 text-sm sm:text-base">
                  Spin to reveal your fate
                </p>
              </div>

              {/* Cards Grid - Casino Style Shuffle with Visible Movement */}
              <div className="my-6 sm:my-12">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 auto-rows-max">
                  {[0, 1, 2].map((position) => {
                    const cardId = cardPositions[position];
                    const card = CARDS[cardId];

                    return (
                      <motion.div
                        key={`card-${cardId}`}
                        layout
                        layoutId={`card-${cardId}`}
                        animate={{
                          scale: isSpinning ? 0.92 : 1,
                          opacity: isSpinning ? 0.85 : 1,
                        }}
                        transition={{
                          type: "spring",
                          damping: 16,
                          stiffness: 150,
                          mass: 1.2,
                          duration: 0.25,
                        }}
                        className={`cyber-card p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden group cursor-default h-44 sm:h-56 ${
                          isSpinning ? "shadow-neon/50" : "hover:shadow-neon"
                        }`}
                      >
                        {/* Card Background Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Shuffle Pulse Effect */}
                        {isSpinning && (
                          <motion.div
                            className="absolute inset-0 bg-neon-green/5 rounded-sm"
                            animate={{
                              opacity: [0, 0.3, 0],
                            }}
                            transition={{
                              duration: 0.3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        )}

                        {/* Content */}
                        <div className="relative z-10 text-center w-full">
                          {isSpinning ? (
                            // ✅ Face-Down: Locked Cards
                            <motion.div
                              className="flex flex-col items-center justify-center h-full py-4 sm:py-8"
                              animate={{
                                y: [0, -4, 0],
                              }}
                              transition={{
                                duration: 0.4,
                                repeat: Infinity,
                                repeatDelay: 0,
                                ease: "easeInOut",
                              }}
                            >
                              <motion.div
                                animate={{ rotateZ: isSpinning ? 360 : 0 }}
                                transition={{
                                  duration: 0.5,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              >
                                <Lock className="w-10 sm:w-12 h-10 sm:h-12 text-neon-green mb-1 sm:mb-2" />
                              </motion.div>
                              <p className="text-xs sm:text-sm text-neon-green font-orbitron font-bold tracking-wider">
                                CARD {position + 1}
                              </p>
                              <p className="text-[10px] sm:text-xs text-neon-cyan/60 font-space-mono mt-1 sm:mt-2">
                                SHUFFLING
                              </p>
                            </motion.div>
                          ) : (
                            // ✅ Face-Up: Revealed Cards
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                              <div className="text-5xl mb-4 animate-float">
                                {CARD_EMOJIS[card.type]}
                              </div>
                              <h3 className="text-lg sm:text-xl font-orbitron glow-text font-bold">
                                {card.label}
                              </h3>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Shuffle Status Bar */}
                {isSpinning && (
                  <motion.div
                    className="mt-6 h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent rounded-full"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scaleX: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 0.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </div>

              {/* Draw Button */}
              <div className="flex justify-center">
                <motion.button
                  onClick={performDraw}
                  disabled={isSpinning}
                  className="relative px-12 py-4 border-2 border-neon-cyan text-neon-cyan font-orbitron font-bold text-base uppercase tracking-wider overflow-hidden rounded-sm transition-all duration-300 hover:shadow-neon disabled:opacity-70 disabled:cursor-not-allowed group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-neon-cyan opacity-0 group-hover:opacity-10 transition-all duration-300"
                    animate={isSpinning ? { opacity: [0.05, 0.15, 0.05] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                  <span className="relative flex items-center gap-2">
                    {isSpinning ? (
                      <>
                        <span className="animate-spin">⚡</span>
                        Shuffling...
                      </>
                    ) : (
                      <>
                        SPIN NOW
                        <Zap className="w-5 h-5 animate-pulse" />
                      </>
                    )}
                  </span>
                </motion.button>
              </div>

              {/* Round Info */}
              {currentRound === 3 && round2CardType && (
                <div className="text-center p-4 border border-neon-cyan/30 rounded-sm bg-neon-cyan/5">
                  <p className="text-xs text-neon-cyan/70 font-space-mono">
                    ⚠️ Round 3 Restriction: You drew <span className="text-neon-green font-bold">{CARDS.find(c => c.type === round2CardType)?.label}</span> in Round 2
                  </p>
                  <p className="text-xs text-neon-cyan/70 font-space-mono mt-1">
                    A different card will be selected in this round
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neon-cyan/30 backdrop-blur-sm text-center py-4">
        <p className="text-xs text-neon-cyan/50 font-space-mono">
          INFERNO'26  |  CODE ARENA © 2026  |  SDJ International College
        </p>
      </footer>
    </div>
  );
}
