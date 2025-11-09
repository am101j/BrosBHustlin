import React, { useState } from "react";
import CameraScanner from "./components/CameraScanner";
import VoiceAnalyzer from "./components/VoiceAnalyzer";
import BroScoreDisplay from "./components/BroScoreDisplay";
import SpermRace from "./components/SpermRace";
import Leaderboard from "./components/Leaderboard";
import PowerUpShop from "./components/PowerUpShop";
import RandomDollarSigns from "./components/RandomDollarSigns";

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
    if (score <= 79) return "Intern"
    if (score <= 159) return "Junior Analyst"
    if (score <= 239) return "Senior Associate"
    if (score <= 319) return "Vice President"
    return "Managing Director"
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
      {/* Enhanced animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Animated gradient orbs with movement */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/4 right-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-yellow-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Random dollar signs */}
        <RandomDollarSigns />
        
        {/* Additional floating dollar signs with different patterns */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`falling-${i}`}
            className="absolute text-amber-400/25 font-bold text-4xl dollar-sign glow-pulse"
            style={{
              left: `${(i * 8.33) % 100}%`,
              animationDelay: `${i * 0.4}s`,
              fontSize: `${24 + (i % 4) * 12}px`,
            }}
          >
            $
          </div>
        ))}
        
        {/* Sparkle particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="sparkle"
            style={{
              left: `${(i * 5) % 100}%`,
              top: `${(i * 7) % 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          ></div>
        ))}
      </div>
      
      {/* Side Progress Bar */}
      <aside className="hidden md:flex flex-col items-center py-12 w-32 glass border-r border-slate-700/50 space-y-8 z-10 relative">
        {/* Decorative dollar signs on sidebar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-amber-400/20 text-2xl font-black animate-float">$</div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-amber-400/20 text-2xl font-black animate-float-delayed">$</div>
        
        {steps.map((step, idx) => {
          const isActive = step.id === currentStep;
          const isCompleted = idx < getCurrentStepIndex();
          const isUpcoming = idx > getCurrentStepIndex();
          
          return (
            <div key={step.id} className="flex flex-col items-center space-y-2 group cursor-pointer relative" onClick={() => !isUpcoming && setCurrentStep(step.id)}>
              <div className="relative">
                {/* Dollar sign indicator for active step */}
                {isActive && (
                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 text-amber-400 text-xl font-black animate-float">$</div>
                )}
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-2xl transition-all duration-500 border relative overflow-hidden
                  ${isActive 
                    ? "bg-gradient-to-br from-cyan-600/80 to-purple-600/80 border-cyan-400/50 shadow-xl shadow-cyan-500/30 scale-110" 
                    : isCompleted 
                      ? "bg-slate-800/50 border-slate-600/50 shadow-lg scale-100 hover:border-cyan-500/30" 
                      : "bg-slate-800/20 border-slate-700/30 scale-90 opacity-50"
                  }
                  ${!isUpcoming ? "group-hover:scale-105 group-hover:bg-slate-700/50 group-hover:border-cyan-500/30" : ""}
                  `}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  )}
                  <span className={`text-3xl filter drop-shadow-lg relative z-10 ${isActive ? 'animate-pulse' : ''}`}>{step.icon}</span>
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
                <div className={`h-12 w-0.5 transition-all duration-500 relative ${
                  isCompleted ? "bg-gradient-to-b from-slate-600 to-slate-700" : "bg-slate-700/30"
                }`}>
                  {isCompleted && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-400/30 text-xs font-black">$</div>
                  )}
                </div>
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
        <header className="text-center mb-0 relative z-20">
          <h1 className="text-[clamp(3rem,9vw,6rem)] font-extrabold mb-0 relative inline-block leading-tight">
            <span className="relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-amber-300 to-cyan-300 animate-gradient classy-title">
                BrosBHustlin
              </span>
              {/* Finance ticker effect */}
              <span className="absolute -top-1 -right-2 text-amber-400 text-xs md:text-sm font-bold opacity-70 animate-pulse">📊</span>
            </span>
            <span className="absolute -top-2 -right-3 text-3xl md:text-4xl animate-float">💰</span>
            <span className="absolute -bottom-1 -left-2 text-2xl md:text-3xl animate-float-delayed">💵</span>
          </h1>
        </header>

        <div className="w-full max-w-6xl flex flex-col items-center justify-center space-y-4 flex-1 py-4">
          <div className="w-full animate-fade-in">
            {currentStep === "camera" && (
              <div className="w-full flex flex-col items-center justify-center space-y-4">
                <div className="text-center relative -mt-0.5">
                  <div className="inline-flex items-center gap-2.5 px-6 py-2.5 md:px-8 md:py-3 glass-strong rounded-full border border-cyan-500/30 relative overflow-hidden group hover:border-cyan-400/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10">
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-amber-500/8 to-cyan-500/0 group-hover:from-cyan-500/8 group-hover:via-amber-500/15 group-hover:to-cyan-500/8 transition-all duration-500"></div>
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <span className="text-xl md:text-2xl relative z-10 animate-float">💼</span>
                    <p className="text-[clamp(0.95rem,2vw,1.2rem)] md:text-[clamp(1.1rem,2.5vw,1.4rem)] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-amber-300 to-cyan-300 relative z-10 tracking-tight">
                      Discover Your Finance Bro Energy
                    </p>
                    <span className="text-xl md:text-2xl relative z-10 animate-float-delayed">📈</span>
                    
                    {/* Floating dollar signs around the badge */}
                    <span className="absolute -left-2.5 top-1/2 -translate-y-1/2 text-amber-400 text-sm md:text-base font-black opacity-50 animate-float">$</span>
                    <span className="absolute -right-2.5 top-1/2 -translate-y-1/2 text-amber-400 text-sm md:text-base font-black opacity-50 animate-float-delayed">$</span>
                  </div>
                </div>
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