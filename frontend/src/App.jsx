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
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans overflow-hidden">
      
      {/* Side Progress Bar */}
      <aside className="hidden md:flex flex-col items-center py-12 w-28 bg-gray-850 space-y-8">
        {steps.map((step, idx) => {
          const isActive = step.id === currentStep;
          const isCompleted = idx < getCurrentStepIndex();
          return (
            <div key={step.id} className="flex flex-col items-center space-y-1">
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-300
                ${isActive ? "bg-teal-500 shadow-xl scale-110 animate-pulse" : isCompleted ? "bg-teal-400" : "bg-gray-700"}
                `}
              >
                <span className="text-3xl">{step.icon}</span>
              </div>
              <span className={`text-xs text-center ${isActive ? "text-teal-300 font-semibold" : "text-gray-400"}`}>
                {step.name}
              </span>
            </div>
          );
        })}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center h-screen px-6 md:px-12">
        <header className="text-center mb-8">
          <h1 className="text-[clamp(2rem,6vw,4rem)] font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-teal-400">
            BrosBHustlin
          </h1>
          <p className="text-gray-300 text-[clamp(0.875rem,2vw,1.25rem)] mt-2">
            Discover Your Finance Bro Energy
          </p>
        </header>

        <div className="w-full max-w-5xl flex flex-col items-center justify-center space-y-6 h-full">

          {currentStep === "camera" && (
            <div className="flex-1 w-full flex items-center justify-center">
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
            <div className="flex-1 w-full flex items-center justify-center">
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
            <div className="flex-1 w-full flex flex-col items-center justify-center space-y-6">
              <BroScoreDisplay
                cameraScore={cameraScore}
                voiceScore={voiceScore}
                totalScore={totalScore}
                detectedItems={detectedItems}
                buzzwords={buzzwords}
              />
              <button
                onClick={() => setCurrentStep("race")}
                className="bg-gradient-to-r from-yellow-400 to-teal-400 text-gray-900 font-bold px-10 py-4 rounded-2xl shadow-xl transform transition hover:scale-105"
              >
                🏃 Race Your Genetics!
              </button>
            </div>
          )}

          {currentStep === "race" && (
            <div className="flex-1 w-full flex items-center justify-center">
              <SpermRace broScore={totalScore} onComplete={() => setCurrentStep("leaderboard")} />
            </div>
          )}

          {currentStep === "leaderboard" && (
            <div className="flex-1 w-full flex flex-col items-center justify-center space-y-6">
              <Leaderboard />
              <button
                onClick={() => {
                  setCameraScore(0);
                  setVoiceScore(0);
                  setDetectedItems([]);
                  setBuzzwords([]);
                  setCurrentStep("camera");
                }}
                className="bg-gray-700 hover:bg-gray-600 text-teal-400 font-semibold px-8 py-3 rounded-xl shadow-md transform transition hover:scale-105"
              >
                Start Over
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default App;
