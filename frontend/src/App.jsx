import React, { useState } from "react";
import CameraScanner from "./components/CameraScanner";
import VoiceAnalyzer from "./components/VoiceAnalyzer";
import BroScoreDisplay from "./components/BroScoreDisplay";
import SpermRace from "./components/SpermRace";
import Leaderboard from "./components/Leaderboard";
import PowerUpShop from "./components/PowerUpShop";

function App() {
  const [cameraScore, setCameraScore] = useState(0);
  const [voiceScore, setVoiceScore] = useState(0);
  const [detectedItems, setDetectedItems] = useState([]);
  const [buzzwords, setBuzzwords] = useState([]);
  const [currentStep, setCurrentStep] = useState("camera");
  const [purchasedPowerUps, setPurchasedPowerUps] = useState({});
  const [shopPoints, setShopPoints] = useState(0);

  const totalScore = cameraScore + voiceScore;

  const getTier = (score) => {
    if (score <= 79) return "Peasant"
    if (score <= 159) return "Analyst"
    if (score <= 239) return "Associate"
    if (score <= 319) return "VP of Cringe"
    return "CEO of Insufferable"
  }

  const tier = getTier(totalScore)

  const steps = [
    { id: "camera", name: "Visual Scan", icon: "📸" },
    { id: "voice", name: "Voice Analysis", icon: "🎤" },
    { id: "results", name: "Results", icon: "📊" },
    { id: "shop", name: "Shop", icon: "🛒" },
    { id: "race", name: "Competition", icon: "🏃" },
    { id: "leaderboard", name: "Leaderboard", icon: "🏆" },
  ];

  const getCurrentStepIndex = () => steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-gray-100 font-sans overflow-hidden relative">
      {/* Flowing dollar signs background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Static gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
        
        {/* Flowing dollar signs */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-green-400/30 font-bold text-4xl dollar-sign"
            style={{
              left: `${(i * 5) % 100}%`,
              animationDelay: `${i * 0.5}s`,
              fontSize: `${20 + (i % 5) * 8}px`,
            }}
          >
            $
          </div>
        ))}
      </div>
      
      {/* Side Progress Bar */}
      <aside className="hidden md:flex flex-col items-center py-12 w-32 glass border-r border-slate-700/50 space-y-8 z-10">
        {steps.map((step, idx) => {
          const isActive = step.id === currentStep;
          const isCompleted = idx < getCurrentStepIndex();
          const isUpcoming = idx > getCurrentStepIndex();
          
          return (
            <div key={step.id} className="flex flex-col items-center space-y-2 group cursor-pointer" onClick={() => !isUpcoming && setCurrentStep(step.id)}>
              <div className="relative">
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-2xl transition-all duration-500 border
                  ${isActive 
                    ? "bg-slate-700 border-slate-500 shadow-xl scale-110" 
                    : isCompleted 
                      ? "bg-slate-800/50 border-slate-600/50 shadow-lg scale-100" 
                      : "bg-slate-800/20 border-slate-700/30 scale-90 opacity-50"
                  }
                  ${!isUpcoming ? "group-hover:scale-105 group-hover:bg-slate-700/50" : ""}
                  `}
                >
                  <span className="text-3xl filter drop-shadow-lg">{step.icon}</span>
                </div>
              </div>
              <span className={`text-xs text-center font-medium transition-all duration-300 ${
                isActive 
                  ? "text-cyan-300 font-semibold" 
                  : isCompleted 
                    ? "text-gray-300" 
                    : "text-gray-500"
              }`}>
                {step.name}
              </span>
              {idx < steps.length - 1 && (
                <div className={`h-12 w-0.5 transition-all duration-500 ${
                  isCompleted ? "bg-slate-600" : "bg-slate-700/30"
                }`}></div>
              )}
            </div>
          );
        })}
      </aside>

      {/* Mobile Progress Bar */}
      <div className="md:hidden w-full glass border-b border-slate-700/50 py-4 px-4 z-10">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => {
            const isActive = step.id === currentStep;
            const isCompleted = idx < getCurrentStepIndex();
            return (
              <div key={step.id} className="flex flex-col items-center space-y-1 flex-1">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 border
                  ${isActive 
                    ? "bg-slate-700 border-slate-500 shadow-lg scale-110" 
                    : isCompleted 
                      ? "bg-slate-800/50 border-slate-600/50" 
                      : "bg-slate-800/20 border-slate-700/30"
                  }`}
                >
                  <span className="text-xl">{step.icon}</span>
                </div>
                <span className={`text-[10px] text-center ${isActive ? "text-cyan-300 font-semibold" : "text-gray-500"}`}>
                  {step.name.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center min-h-screen px-4 md:px-12 py-8 md:py-0 relative z-10">
        <header className="text-center mb-6 md:mb-8">
          <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-black text-cyan-300 mb-3">
            BrosBHustlin
          </h1>
          <p className="text-gray-300 text-[clamp(1rem,2.5vw,1.5rem)] mt-2 font-light">
            Discover Your Finance Bro Energy
          </p>
        </header>

        <div className="w-full max-w-6xl flex flex-col items-center justify-center space-y-6 flex-1 py-4">
          <div className="w-full animate-fade-in">
            {currentStep === "camera" && (
              <div className="w-full flex items-center justify-center">
                <CameraScanner
                  onComplete={(score, items) => {
                    setCameraScore(score);
                    setDetectedItems(items);
                    setCurrentStep("voice");
                  }}
                />
              </div>
            )}

            {currentStep === "voice" && (
              <div className="w-full flex items-center justify-center">
                <VoiceAnalyzer
                  onComplete={(score, words) => {
                    setVoiceScore(score);
                    setBuzzwords(words);
                    setCurrentStep("results");
                  }}
                />
              </div>
            )}

            {currentStep === "results" && (
              <div className="w-full flex flex-col items-center justify-center space-y-8">
                <BroScoreDisplay
                  cameraScore={cameraScore}
                  voiceScore={voiceScore}
                  totalScore={totalScore}
                  detectedItems={detectedItems}
                  buzzwords={buzzwords}
                />
                <button
                  onClick={() => {
                    setShopPoints(totalScore);
                    setCurrentStep("shop");
                  }}
                  className="btn-primary text-gray-100"
                >
                  🛒 Buy Power-Ups
                </button>
                <button
                  onClick={() => setCurrentStep("race")}
                  className="btn-secondary text-gray-100"
                >
                  🏃 Skip to Race
                </button>
              </div>
            )}

            {currentStep === "shop" && (
              <div className="w-full flex flex-col items-center justify-center space-y-6">
                <PowerUpShop
                  availablePoints={shopPoints}
                  purchasedPowerUps={purchasedPowerUps}
                  onPurchase={(powerUpId, cost) => {
                    setPurchasedPowerUps(prev => ({
                      ...prev,
                      [powerUpId]: (prev[powerUpId] || 0) + 1
                    }));
                    setShopPoints(prev => prev - cost);
                  }}
                />
                <button
                  onClick={() => setCurrentStep("race")}
                  className="btn-primary text-gray-100"
                >
                  🏁 Start Race!
                </button>
              </div>
            )}

            {currentStep === "race" && (
              <div className="w-full flex items-center justify-center">
                <SpermRace 
                  broScore={totalScore} 
                  purchasedPowerUps={purchasedPowerUps}
                  onComplete={() => setCurrentStep("leaderboard")} 
                />
              </div>
            )}

            {currentStep === "leaderboard" && (
              <div className="w-full flex flex-col items-center justify-center space-y-8">
                <Leaderboard 
                  totalScore={totalScore}
                  cameraScore={cameraScore}
                  voiceScore={voiceScore}
                  detectedItems={detectedItems}
                  buzzwords={buzzwords}
                  tier={tier}
                />
                <button
                  onClick={() => {
                    setCameraScore(0);
                    setVoiceScore(0);
                    setDetectedItems([]);
                    setBuzzwords([]);
                    setPurchasedPowerUps({});
                    setShopPoints(0);
                    setCurrentStep("camera");
                  }}
                  className="btn-secondary text-gray-100"
                >
                  ↻ Start Over
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
