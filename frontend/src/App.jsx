import React, { useState } from "react";
import CameraScanner from "./components/CameraScanner";
import VoiceAnalyzer from "./components/VoiceAnalyzer";
import BroScoreDisplay from "./components/BroScoreDisplay";
import SpermRace from "./components/SpermRace";
import Leaderboard from "./components/Leaderboard";

function App() {
  const [cameraScore, setCameraScore] = useState(0);
  const [voiceScore, setVoiceScore] = useState(0);
  const [detectedItems, setDetectedItems] = useState([]);
  const [buzzwords, setBuzzwords] = useState([]);
  const [currentStep, setCurrentStep] = useState("camera");

  const totalScore = cameraScore + voiceScore;

  const steps = [
    { id: "camera", name: "Visual Scan", icon: "📸" },
    { id: "voice", name: "Voice Analysis", icon: "🎤" },
    { id: "results", name: "Results", icon: "📊" },
    { id: "race", name: "Competition", icon: "🏃" },
    { id: "leaderboard", name: "Leaderboard", icon: "🏆" },
  ];

  const getCurrentStepIndex = () => steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-gray-100 font-sans overflow-hidden relative">
      {/* Subtle background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-slate-800/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-700/20 rounded-full blur-3xl"></div>
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
                  ? "text-gray-100 font-semibold" 
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
                <span className={`text-[10px] text-center ${isActive ? "text-gray-100 font-semibold" : "text-gray-500"}`}>
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
          <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-black text-gray-100 text-shadow-lg mb-3">
            BrosBHustlin
          </h1>
          <p className="text-gray-400 text-[clamp(1rem,2.5vw,1.5rem)] mt-2 font-light">
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
                  onClick={() => setCurrentStep("race")}
                  className="btn-primary text-gray-100"
                >
                  🏃 Race Your Genetics!
                </button>
              </div>
            )}

            {currentStep === "race" && (
              <div className="w-full flex items-center justify-center">
                <SpermRace broScore={totalScore} onComplete={() => setCurrentStep("leaderboard")} />
              </div>
            )}

            {currentStep === "leaderboard" && (
              <div className="w-full flex flex-col items-center justify-center space-y-8">
                <Leaderboard />
                <button
                  onClick={() => {
                    setCameraScore(0);
                    setVoiceScore(0);
                    setDetectedItems([]);
                    setBuzzwords([]);
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
