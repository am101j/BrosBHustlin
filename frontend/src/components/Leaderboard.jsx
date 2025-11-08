import React, { useState, useEffect } from 'react'

const Leaderboard = () => {
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
          total_score: 0, // This would come from parent component
          camera_score: 0,
          voice_score: 0,
          tier: 'Peasant',
          detected_items: [],
          buzzwords: []
        })
      })

      if (response.ok) {
        setShowSaveModal(false)
        setUsername('')
        fetchLeaderboard()
      }
    } catch (err) {
      console.error('Failed to save score')
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

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="text-center">Loading leaderboard...</div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">🏆 BrosBHustlin Leaderboard</h2>
      
      <div className="mb-4 text-center">
        <button
          onClick={() => setShowSaveModal(true)}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg"
        >
          💾 Save My Score
        </button>
      </div>

      {scores.length === 0 ? (
        <div className="text-center text-gray-400">
          No scores yet. Be the first!
        </div>
      ) : (
        <div className="space-y-3">
          {scores.map((score, index) => (
            <div
              key={score.id || index}
              className={`flex items-center justify-between p-4 rounded-lg ${
                index === 0 ? 'bg-yellow-600' : 
                index === 1 ? 'bg-gray-600' : 
                index === 2 ? 'bg-orange-600' : 'bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold">#{score.rank}</div>
                <div className="text-2xl">{getTierEmoji(score.tier)}</div>
                <div>
                  <div className="font-bold">{score.username}</div>
                  <div className="text-sm text-gray-300">{score.tier}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{score.total_score}</div>
                <div className="text-sm text-gray-300">
                  {new Date(score.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Score Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Save Your Score</h3>
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white mb-4"
              maxLength={20}
            />
            <div className="flex space-x-4">
              <button
                onClick={saveScore}
                disabled={!username.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg"
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