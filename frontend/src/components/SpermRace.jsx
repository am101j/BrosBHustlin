import React, { useEffect, useRef, useState } from 'react'

const SpermRace = ({ broScore, onComplete }) => {
  const canvasRef = useRef(null)
  const [raceStarted, setRaceStarted] = useState(false)
  const [winner, setWinner] = useState(null)
  const [commentary, setCommentary] = useState('')

  const getCommentary = (score) => {
    if (score >= 800) return "Chad's alpha swimmer is GRINDING! Look at that 4am energy!"
    if (score >= 400) return "Mike's hustler sperm is trying really hard!"
    return "Kyle's peasant sperm stopped to 'circle back'"
  }

  const startRace = () => {
    setRaceStarted(true)
    setCommentary(getCommentary(broScore))
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Race setup
    const racers = [
      { name: 'You', speed: (broScore / 1500) * 2 + Math.random() * 0.5, x: 50, color: '#06b6d4', glow: '#22d3ee' },
      { name: 'Chad', speed: 1.2 + Math.random() * 0.8, x: 50, color: '#ef4444', glow: '#f87171' },
      { name: 'Brad', speed: 1.0 + Math.random() * 0.8, x: 50, color: '#10b981', glow: '#34d399' },
      { name: 'Kyle', speed: 0.8 + Math.random() * 0.8, x: 50, color: '#f59e0b', glow: '#fbbf24' }
    ]
    
    const finishLine = canvas.width - 100
    let raceFinished = false
    
    const animate = () => {
      // Clear with gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#0f172a')
      gradient.addColorStop(1, '#1e1b4b')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw finish line with glow
      ctx.shadowBlur = 20
      ctx.shadowColor = '#fff'
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 4
      ctx.setLineDash([15, 10])
      ctx.beginPath()
      ctx.moveTo(finishLine, 0)
      ctx.lineTo(finishLine, canvas.height)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.shadowBlur = 0
      
      // Draw finish text
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 20px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('FINISH', finishLine, 30)
      
      // Draw and move racers
      racers.forEach((racer, index) => {
        const y = 80 + index * 100
        
        // Move racer
        if (!raceFinished) {
          racer.x += racer.speed + Math.sin(Date.now() * 0.01 + index) * 0.3
        }
        
        // Draw racer with glow effect
        ctx.shadowBlur = 15
        ctx.shadowColor = racer.color
        
        // Head
        ctx.fillStyle = racer.color
        ctx.beginPath()
        ctx.arc(racer.x, y, 10, 0, Math.PI * 2)
        ctx.fill()
        
        // Tail with gradient
        const tailGradient = ctx.createLinearGradient(racer.x - 50, y, racer.x - 10, y)
        tailGradient.addColorStop(0, 'transparent')
        tailGradient.addColorStop(1, racer.color)
        
        ctx.strokeStyle = racer.color
        ctx.lineWidth = 4
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(racer.x - 10, y)
        ctx.quadraticCurveTo(racer.x - 30, y - 15, racer.x - 50, y - 5)
        ctx.quadraticCurveTo(racer.x - 40, y + 5, racer.x - 30, y)
        ctx.stroke()
        
        ctx.shadowBlur = 0
        
        // Name with background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
        ctx.fillRect(racer.x - 35, y - 40, 70, 25)
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 16px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(racer.name, racer.x, y - 22)
        
        // Check for winner
        if (racer.x >= finishLine && !raceFinished) {
          setWinner(racer.name)
          raceFinished = true
          setTimeout(() => onComplete(), 3000)
        }
      })
      
      if (!raceFinished) {
        requestAnimationFrame(animate)
      }
    }
    
    animate()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    canvas.width = 900
    canvas.height = 500
  }, [])

  return (
    <div className="card w-full max-w-4xl">
      <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-glow-cyan">
        🏃 Sperm Race Championship
      </h2>
      
      <div className="text-center mb-8">
        <div className="relative inline-block group">
          <canvas
            ref={canvasRef}
            className="relative border-2 border-slate-700/50 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 max-w-full shadow-2xl"
          />
        </div>
      </div>

      {!raceStarted ? (
        <div className="text-center space-y-6">
          <p className="text-glow-body text-lg font-medium max-w-2xl mx-auto">
            Your BrosBHustlin score determines your sperm's speed in this epic race! 
            <span className="block mt-2 text-glow-cyan font-bold">Score: {broScore}</span>
          </p>
          <button
            onClick={startRace}
            className="btn-primary text-glow-body"
          >
            🏁 Start Race!
          </button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          {commentary && !winner && (
            <div className="glass-strong border-slate-600/50 text-glow-body p-4 rounded-xl">
              <span className="text-2xl">📢</span> <span className="font-semibold">{commentary}</span>
            </div>
          )}
          
          {winner && (
            <div className={`glass-strong p-6 rounded-xl border-2 ${
              winner === 'You' 
                ? 'border-cyan-500/50 text-glow-cyan' 
                : 'border-slate-600/50 text-glow-subtle'
            }`}>
              <div className="text-5xl mb-3">🏆</div>
              <div className={`text-3xl font-black mb-2 ${winner === 'You' ? 'text-glow-cyan' : 'text-glow-subtle'}`}>{winner} Wins!</div>
              <div className={`text-lg ${winner === 'You' ? 'text-glow-body' : 'text-glow-subtle'}`}>
                {winner === 'You' 
                  ? '🎉 Your BrosBHustlin paid off! 🎉' 
                  : 'Better luck next time! Keep grinding!'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SpermRace