import React, { useState, useEffect } from 'react'

const Leaderboard = ({ totalScore, cameraScore, voiceScore, detectedItems, buzzwords, tier }) => {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [username, setUsername] = useState('')

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/leaderboard')
      const result = await response.json()
      if (result.success) {
        setScores(result.data)
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard')
    }
    setLoading(false)
  }

  const saveScore = async () => {
    if (!username.trim()) return

    try {
      const response = await fetch('http://localhost:5000/api/save-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          total_score: totalScore || 0,
          camera_score: cameraScore || 0,
          voice_score: voiceScore || 0,
          tier: tier || 'Peasant',
          detected_items: detectedItems || [],
          buzzwords: buzzwords || []
        })
      })

      const result = await response.json()
      if (result.success) {
        setShowSaveModal(false)
        setUsername('')
        fetchLeaderboard()
      } else {
        console.error('Failed to save score:', result.error)
      }
    } catch (err) {
      console.error('Failed to save score:', err)
    }
  }

  const getTierEmoji = (tier) => {
    switch (tier) {
      case 'CEO of Insufferable': return '👑'
      case 'VP of Cringe': return '😬'
      case 'Associate': return '💼'
      case 'Analyst': return '📊'
      default: return '🥔'
    }
  }

  const getRankStyle = (index) => {
    if (index === 0) return 'bg-slate-800/60 border-slate-600/70'
    if (index === 1) return 'bg-slate-800/50 border-slate-700/60'
    if (index === 2) return 'bg-slate-800/40 border-slate-700/50'
    return 'glass-strong border-slate-700/50'
  }

  if (loading) {
    return (
      <div className="card w-full max-w-4xl">
        <div className="text-center py-12">
          <div className="text-6xl mb-4 animate-spin">⚙️</div>
          <div className="text-xl font-medium text-gray-400">Loading leaderboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="card w-full max-w-4xl">
      <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-purple-400">
        🏆 BrosBHustlin Leaderboard
      </h2>
      
      {(totalScore > 0) && (
        <div className="mb-6 text-center">
          <div className="glass-strong rounded-xl p-4 mb-4 border-cyan-500/30">
            <div className="text-2xl font-bold text-cyan-300 mb-1">Your Score: {totalScore}</div>
            <div className="text-sm text-gray-400">Tier: {tier || 'Peasant'}</div>
          </div>
          <button
            onClick={() => setShowSaveModal(true)}
            className="btn-primary text-gray-100"
          >
            💾 Save My Score
          </button>
        </div>
      )}

      {scores.length === 0 ? (
        <div className="text-center py-12 glass-strong rounded-xl">
          <div className="text-6xl mb-4">📊</div>
          <div className="text-xl font-medium text-gray-400">No scores yet. Be the first!</div>
        </div>
      ) : (
        <div className="space-y-4">
          {scores.map((score, index) => (
            <div
              key={score.id || index}
              className={`flex items-center justify-between p-6 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] shadow-lg ${getRankStyle(index)}`}
            >
              <div className="flex items-center space-x-6">
                <div className={`text-4xl font-black ${
                  index === 0 ? 'text-cyan-300' :
                  index === 1 ? 'text-blue-300' :
                  index === 2 ? 'text-pink-300' : 'text-gray-400'
                }`}>
                  #{score.rank || index + 1}
                </div>
                <div className="text-4xl filter drop-shadow-lg">{getTierEmoji(score.tier)}</div>
                <div>
                  <div className="text-2xl font-bold mb-1 text-gray-200">{score.username}</div>
                  <div className="text-sm text-gray-400 font-medium">{score.tier}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-cyan-300 mb-1">{score.total_score}</div>
                <div className="text-xs text-gray-400">
                  {new Date(score.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Score Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card-strong max-w-md w-full animate-fade-in">
            <h3 className="text-2xl font-bold mb-6 text-cyan-300 text-center">Save Your Score</h3>
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && saveScore()}
              className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent mb-6"
              maxLength={20}
              autoFocus
            />
            <div className="flex space-x-4">
              <button
                onClick={saveScore}
                disabled={!username.trim()}
                className="flex-1 btn-primary text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 btn-secondary text-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Leaderboard