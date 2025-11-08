import React from 'react'

const BroScoreDisplay = ({ cameraScore, voiceScore, totalScore, detectedItems, buzzwords }) => {
  const getTier = (score) => {
    if (score <= 199) return { name: "Peasant", color: "text-gray-400", emoji: "🥔" }
    if (score <= 399) return { name: "Analyst", color: "text-blue-400", emoji: "📊" }
    if (score <= 599) return { name: "Associate", color: "text-green-400", emoji: "💼" }
    if (score <= 799) return { name: "VP of Cringe", color: "text-yellow-400", emoji: "😬" }
    return { name: "CEO of Insufferable", color: "text-red-400", emoji: "👑" }
  }

  const tier = getTier(totalScore)

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">📊 Your BrosBHustlin Results</h2>
      
      <div className="text-center mb-8">
        <div className="text-8xl mb-4">{tier.emoji}</div>
        <div className="text-6xl font-bold mb-2">{totalScore}</div>
        <div className={`text-3xl font-bold ${tier.color}`}>
          {tier.name}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Camera Results */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            📸 Visual Analysis: {cameraScore} pts
          </h3>
          {detectedItems.length > 0 ? (
            <ul className="space-y-2">
              {detectedItems.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>{item.name}</span>
                  <span className="text-green-400">+{item.points}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No finance bro items detected</p>
          )}
        </div>

        {/* Voice Results */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            🎤 Voice Analysis: {voiceScore} pts
          </h3>
          {buzzwords.length > 0 ? (
            <ul className="space-y-2">
              {buzzwords.map((word, index) => (
                <li key={index} className="flex justify-between">
                  <span>"{word.phrase}" x{word.count}</span>
                  <span className="text-green-400">+{word.points}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No corporate buzzwords detected</p>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4">
          <div className="text-2xl font-bold">
            Total BrosBHustlin: {totalScore} / 1000
          </div>
          <div className="text-sm text-gray-300 mt-2">
            Camera: {cameraScore} + Voice: {voiceScore} = {totalScore}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BroScoreDisplay