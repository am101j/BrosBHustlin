import React, { useState, useEffect } from 'react'

const BroScoreDisplay = ({ cameraScore, voiceScore, totalScore, detectedItems, buzzwords }) => {
  const [scoreDollarSigns, setScoreDollarSigns] = useState([])

  useEffect(() => {
    // Create dollar signs around the score
    const createDollarSigns = () => {
      const signs = []
      for (let i = 0; i < 8; i++) {
        const angle = (i * 45) * (Math.PI / 180)
        const radius = 120
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        signs.push({
          id: i,
          x,
          y,
          delay: i * 0.1,
        })
      }
      setScoreDollarSigns(signs)
    }
    createDollarSigns()
  }, [totalScore])
  const getTier = (score) => {
    if (score <= 79) return { name: "Peasant", color: "from-gray-400 to-gray-500", emoji: "🥔", glow: "shadow-gray-500/50" }
    if (score <= 159) return { name: "Analyst", color: "from-blue-400 to-cyan-400", emoji: "📊", glow: "shadow-blue-500/50" }
    if (score <= 239) return { name: "Associate", color: "from-amber-400 to-amber-500", emoji: "💼", glow: "shadow-amber-500/50" }
    if (score <= 319) return { name: "VP of Cringe", color: "from-yellow-400 to-orange-400", emoji: "😬", glow: "shadow-yellow-500/50" }
    return { name: "CEO of Insufferable", color: "from-red-400 to-pink-500", emoji: "👑", glow: "shadow-red-500/50" }
  }

  const tier = getTier(totalScore)
  const scorePercentage = (totalScore / 400) * 100

  const getTierColor = (score) => {
    if (score <= 79) return "text-gray-400"
    if (score <= 159) return "text-blue-400"
    if (score <= 239) return "text-cyan-400"
    if (score <= 319) return "text-pink-400"
    return "text-purple-400"
  }

  return (
    <div className="card w-full max-w-4xl">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-purple-400 relative">
        <span className="absolute -left-6 md:-left-8 top-1/2 -translate-y-1/2 text-2xl md:text-3xl animate-float">💰</span>
        📊 Your BrosBHustlin Results
        <span className="absolute -right-6 md:-right-8 top-1/2 -translate-y-1/2 text-2xl md:text-3xl animate-float-delayed">💵</span>
      </h2>
      
      <div className="text-center mb-10 relative">
        <div className="text-9xl mb-6 filter drop-shadow-2xl animate-float">{tier.emoji}</div>
        <div className="relative inline-block">
          {/* Floating dollar signs around score */}
          {scoreDollarSigns.map((sign) => (
            <span
              key={sign.id}
              className="absolute text-amber-400 font-black text-4xl score-dollar-sign"
              style={{
                left: `calc(50% + ${sign.x}px)`,
                top: `calc(50% + ${sign.y}px)`,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${sign.delay}s`,
                filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.8))',
                textShadow: '0 0 20px rgba(245, 158, 11, 0.6)',
              }}
            >
              $
            </span>
          ))}
          <div className={`text-7xl md:text-8xl font-black mb-4 ${getTierColor(totalScore)} relative z-10`}>
            {totalScore}
          </div>
        </div>
        <div className={`text-3xl md:text-4xl font-bold ${getTierColor(totalScore)}`}>
          {tier.name}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-8 max-w-2xl mx-auto relative">
          <div className="h-6 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border-2 border-slate-700/50 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-amber-500 to-purple-500 transition-all duration-1000 ease-out shadow-lg relative overflow-hidden"
              style={{ width: `${Math.min(scorePercentage, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2 flex items-center justify-center gap-2">
            <span className="text-amber-400 font-bold">${scorePercentage.toFixed(1)}%</span>
            <span>of Maximum BrosBHustlin</span>
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Camera Results */}
        <div className="glass-strong rounded-xl p-6 hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="text-3xl animate-float">📸</span>
            <span className="text-cyan-300">Visual Analysis</span>
            <span className="ml-auto text-blue-300 font-bold flex items-center gap-1">
              <span className="text-amber-400">$</span>
              {cameraScore} pts
            </span>
          </h3>
          {detectedItems.length > 0 ? (
            <ul className="space-y-3">
              {detectedItems.map((item, index) => (
                <li key={index} className="flex justify-between items-center glass rounded-lg p-3 hover:bg-slate-700/30 transition-colors">
                  <span className="font-medium text-gray-200">{item.name}</span>
                  <span className="text-cyan-300 font-semibold bg-slate-700/50 px-3 py-1 rounded-lg border border-cyan-500/30">+{item.points}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic text-center py-4">No finance bro items detected</p>
          )}
        </div>

        {/* Voice Results */}
        <div className="glass-strong rounded-xl p-6 hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="text-3xl animate-float-delayed">🎤</span>
            <span className="text-pink-300">Voice Analysis</span>
            <span className="ml-auto text-purple-300 font-bold flex items-center gap-1">
              <span className="text-amber-400">$</span>
              {voiceScore} pts
            </span>
          </h3>
          {buzzwords.length > 0 ? (
            <ul className="space-y-3">
              {buzzwords.map((word, index) => (
                <li key={index} className="flex justify-between items-center glass rounded-lg p-3 hover:bg-slate-700/30 transition-colors">
                  <span className="font-medium text-gray-200">"{word.phrase}" <span className="text-gray-400 text-sm">x{word.count}</span></span>
                  <span className="text-pink-300 font-semibold bg-slate-700/50 px-3 py-1 rounded-lg border border-pink-500/30">+{word.points}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic text-center py-4">No corporate buzzwords detected</p>
          )}
        </div>
      </div>

      <div className="text-center">
        <div className="glass-strong rounded-xl p-6 border-2 border-cyan-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 animate-pulse"></div>
          <div className="relative z-10">
            <div className="text-3xl font-bold mb-2 text-cyan-300 flex items-center justify-center gap-2">
              <span className="text-4xl animate-float">💰</span>
              <span>Total BrosBHustlin: <span className="text-amber-400">${totalScore}</span> / 400</span>
              <span className="text-4xl animate-float-delayed">💵</span>
            </div>
            <div className="text-sm text-gray-400 mt-2 font-medium">
              📸 {cameraScore} + 🎤 {voiceScore} = <span className="text-amber-400 font-bold">${totalScore}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BroScoreDisplay