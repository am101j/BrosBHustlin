import React from 'react'

const BroScoreDisplay = ({ cameraScore, voiceScore, totalScore, detectedItems, buzzwords }) => {
  const getTier = (score) => {
    if (score <= 199) return { name: "Peasant", color: "from-gray-400 to-gray-500", emoji: "🥔", glow: "shadow-gray-500/50" }
    if (score <= 399) return { name: "Analyst", color: "from-blue-400 to-cyan-400", emoji: "📊", glow: "shadow-blue-500/50" }
    if (score <= 599) return { name: "Associate", color: "from-green-400 to-emerald-400", emoji: "💼", glow: "shadow-green-500/50" }
    if (score <= 799) return { name: "VP of Cringe", color: "from-yellow-400 to-orange-400", emoji: "😬", glow: "shadow-yellow-500/50" }
    return { name: "CEO of Insufferable", color: "from-red-400 to-pink-500", emoji: "👑", glow: "shadow-red-500/50" }
  }

  const tier = getTier(totalScore)
  const scorePercentage = (totalScore / 1000) * 100

  return (
    <div className="card w-full max-w-4xl">
      <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-gray-100 text-shadow-lg">
        📊 Your BrosBHustlin Results
      </h2>
      
      <div className="text-center mb-10">
        <div className="text-9xl mb-6 filter drop-shadow-2xl">{tier.emoji}</div>
        <div className="text-7xl md:text-8xl font-black mb-4 text-gray-100 text-shadow-lg">
          {totalScore}
        </div>
        <div className={`text-3xl md:text-4xl font-bold text-gray-200 text-shadow`}>
          {tier.name}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="h-4 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-700/50">
            <div 
              className="h-full bg-gradient-to-r from-slate-600 to-slate-500 transition-all duration-1000 ease-out shadow-lg"
              style={{ width: `${Math.min(scorePercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400 mt-2">{scorePercentage.toFixed(1)}% of Maximum BrosBHustlin</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Camera Results */}
        <div className="glass-strong rounded-xl p-6 hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="text-3xl">📸</span>
            <span>Visual Analysis</span>
            <span className="ml-auto text-gray-300 font-bold">{cameraScore} pts</span>
          </h3>
          {detectedItems.length > 0 ? (
            <ul className="space-y-3">
              {detectedItems.map((item, index) => (
                <li key={index} className="flex justify-between items-center glass rounded-lg p-3 hover:bg-slate-700/30 transition-colors">
                  <span className="font-medium text-gray-200">{item.name}</span>
                  <span className="text-gray-300 font-semibold bg-slate-700/50 px-3 py-1 rounded-lg border border-slate-600/50">+{item.points}</span>
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
            <span className="text-3xl">🎤</span>
            <span>Voice Analysis</span>
            <span className="ml-auto text-gray-300 font-bold">{voiceScore} pts</span>
          </h3>
          {buzzwords.length > 0 ? (
            <ul className="space-y-3">
              {buzzwords.map((word, index) => (
                <li key={index} className="flex justify-between items-center glass rounded-lg p-3 hover:bg-slate-700/30 transition-colors">
                  <span className="font-medium text-gray-200">"{word.phrase}" <span className="text-gray-400 text-sm">x{word.count}</span></span>
                  <span className="text-gray-300 font-semibold bg-slate-700/50 px-3 py-1 rounded-lg border border-slate-600/50">+{word.points}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic text-center py-4">No corporate buzzwords detected</p>
          )}
        </div>
      </div>

      <div className="text-center">
        <div className="glass-strong rounded-xl p-6 border-2 border-slate-600/50">
          <div className="text-3xl font-bold mb-2 text-gray-100">
            Total BrosBHustlin: {totalScore} / 1000
          </div>
          <div className="text-sm text-gray-400 mt-2 font-medium">
            📸 {cameraScore} + 🎤 {voiceScore} = {totalScore}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BroScoreDisplay