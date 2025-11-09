import React, { useState } from 'react'

const PowerUpShop = ({ availablePoints, onPurchase, purchasedPowerUps }) => {
  const [selectedPowerUp, setSelectedPowerUp] = useState(null)

  const powerUps = [
    {
      id: 'doubleSpeed',
      name: 'Double Speed',
      description: '2x speed for 2 seconds',
      cost: 50,
      icon: '⚡',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'speedBoost',
      name: 'Speed Boost',
      description: '1.5x speed for 1.5 seconds',
      cost: 30,
      icon: '🚀',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      id: 'shield',
      name: 'Shield',
      description: 'Ignore next obstacle hit',
      cost: 40,
      icon: '🛡️',
      color: 'from-purple-400 to-pink-500'
    },
    {
      id: 'slowEnemies',
      name: 'Slow Enemies',
      description: 'Slow all enemies for 2 seconds',
      cost: 60,
      icon: '🐌',
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: 'instantBoost',
      name: 'Instant Boost',
      description: 'Instant speed burst',
      cost: 25,
      icon: '💨',
      color: 'from-red-400 to-pink-500'
    },
    {
      id: 'magnet',
      name: 'Magnet',
      description: 'Attract boosters from distance',
      cost: 35,
      icon: '🧲',
      color: 'from-indigo-400 to-blue-500'
    }
  ]

  const canAfford = (cost) => availablePoints >= cost
  const quantityOwned = (id) => purchasedPowerUps[id] || 0

  const handlePurchase = (powerUp) => {
    if (canAfford(powerUp.cost)) {
      onPurchase(powerUp.id, powerUp.cost)
      setSelectedPowerUp(powerUp.id)
      setTimeout(() => setSelectedPowerUp(null), 500)
    }
  }

  return (
    <div className="card w-full max-w-4xl">
      <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center text-cyan-300">
        🛒 Power-Up Shop
      </h2>
      
      <div className="mb-6 text-center">
        <div className="glass-strong rounded-xl p-4 border-2 border-cyan-500/30 inline-block">
          <div className="text-2xl font-bold text-cyan-300 mb-1">
            💰 Available Points: {availablePoints}
          </div>
          <div className="text-sm text-gray-400">
            Spend your BrosBHustlin points on power-ups!
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {powerUps.map((powerUp) => {
          const affordable = canAfford(powerUp.cost)
          const owned = quantityOwned(powerUp.id)
          const isSelected = selectedPowerUp === powerUp.id

          return (
            <div
              key={powerUp.id}
              className={`glass-strong rounded-xl p-4 border-2 transition-all duration-300 ${
                affordable
                  ? 'border-slate-600/50 hover:border-cyan-500/50 hover:scale-105 cursor-pointer'
                  : 'border-slate-700/30 opacity-60 cursor-not-allowed'
              } ${isSelected ? 'animate-pulse border-cyan-500' : ''}`}
              onClick={() => affordable && handlePurchase(powerUp)}
            >
              <div className="text-center">
                <div className="text-5xl mb-2">{powerUp.icon}</div>
                <div className="text-xl font-bold text-gray-200 mb-1">
                  {powerUp.name}
                </div>
                <div className="text-sm text-gray-400 mb-3">
                  {powerUp.description}
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-cyan-300 font-bold">
                    {powerUp.cost} pts
                  </span>
                  {owned > 0 && (
                    <span className="text-green-400 font-bold">
                      Owned: {owned}
                    </span>
                  )}
                </div>
                <button
                  disabled={!affordable}
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
                    affordable
                      ? `bg-gradient-to-r ${powerUp.color} text-white hover:shadow-lg hover:scale-105 active:scale-95`
                      : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {affordable ? 'Purchase' : 'Not Enough Points'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {Object.keys(purchasedPowerUps).length > 0 && (
        <div className="glass-strong rounded-xl p-4 border-2 border-green-500/30">
          <div className="text-lg font-bold text-green-400 mb-2">
            ✅ Purchased Power-Ups:
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(purchasedPowerUps).map(([id, quantity]) => {
              const powerUp = powerUps.find(p => p.id === id)
              if (!powerUp || quantity === 0) return null
              return (
                <div
                  key={id}
                  className="bg-slate-700/50 px-3 py-1 rounded-lg border border-green-500/30"
                >
                  <span className="text-gray-200">
                    {powerUp.icon} {powerUp.name} x{quantity}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default PowerUpShop

