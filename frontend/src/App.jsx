import React, { useState } from 'react'
import CameraScanner from './components/CameraScanner'
import VoiceAnalyzer from './components/VoiceAnalyzer'
import BroScoreDisplay from './components/BroScoreDisplay'
import SpermRace from './components/SpermRace'
import Leaderboard from './components/Leaderboard'

function App() {
  const [cameraScore, setCameraScore] = useState(0)
  const [voiceScore, setVoiceScore] = useState(0)
  const [detectedItems, setDetectedItems] = useState([])
  const [buzzwords, setBuzzwords] = useState([])
  const [currentStep, setCurrentStep] = useState('camera')

  const totalScore = cameraScore + voiceScore

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-6xl font-bold text-center mb-4">
          🏦 BrosBHustlin 🏦
        </h1>
        <p className="text-xl text-center mb-8 text-gray-300">
          Measure Your Finance Bro Energy
        </p>

        <div className="max-w-4xl mx-auto">
          {currentStep === 'camera' && (
            <CameraScanner 
              onComplete={(score, items) => {
                setCameraScore(score)
                setDetectedItems(items)
                setCurrentStep('voice')
              }}
            />
          )}

          {currentStep === 'voice' && (
            <VoiceAnalyzer 
              onComplete={(score, words) => {
                setVoiceScore(score)
                setBuzzwords(words)
                setCurrentStep('results')
              }}
            />
          )}

          {currentStep === 'results' && (
            <div className="space-y-8">
              <BroScoreDisplay 
                cameraScore={cameraScore}
                voiceScore={voiceScore}
                totalScore={totalScore}
                detectedItems={detectedItems}
                buzzwords={buzzwords}
              />
              
              <div className="text-center">
                <button
                  onClick={() => setCurrentStep('race')}
                  className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-lg text-xl font-bold"
                >
                  🏃‍♂️ Race Your Genetics! 🏃‍♂️
                </button>
              </div>
            </div>
          )}

          {currentStep === 'race' && (
            <SpermRace 
              broScore={totalScore}
              onComplete={() => setCurrentStep('leaderboard')}
            />
          )}

          {currentStep === 'leaderboard' && (
            <div className="space-y-8">
              <Leaderboard />
              <div className="text-center">
                <button
                  onClick={() => {
                    setCameraScore(0)
                    setVoiceScore(0)
                    setDetectedItems([])
                    setBuzzwords([])
                    setCurrentStep('camera')
                  }}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App