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
      { name: 'You', speed: (broScore / 1500) * 2 + Math.random() * 0.5, x: 50, color: '#3B82F6' },
      { name: 'Chad', speed: 1.2 + Math.random() * 0.8, x: 50, color: '#EF4444' },
      { name: 'Brad', speed: 1.0 + Math.random() * 0.8, x: 50, color: '#10B981' },
      { name: 'Kyle', speed: 0.8 + Math.random() * 0.8, x: 50, color: '#F59E0B' }
    ]
    
    const finishLine = canvas.width - 100
    let raceFinished = false
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw finish line
      ctx.strokeStyle = '#FFF'
      ctx.lineWidth = 3
      ctx.setLineDash([10, 5])
      ctx.beginPath()
      ctx.moveTo(finishLine, 0)
      ctx.lineTo(finishLine, canvas.height)
      ctx.stroke()
      ctx.setLineDash([])
      
      // Draw and move racers
      racers.forEach((racer, index) => {
        const y = 80 + index * 80
        
        // Move racer
        if (!raceFinished) {
          racer.x += racer.speed + Math.sin(Date.now() * 0.01) * 0.2
        }
        
        // Draw racer (simple sperm shape)
        ctx.fillStyle = racer.color
        ctx.beginPath()
        ctx.arc(racer.x, y, 8, 0, Math.PI * 2)
        ctx.fill()
        
        // Tail
        ctx.strokeStyle = racer.color
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(racer.x - 8, y)
        ctx.quadraticCurveTo(racer.x - 25, y - 10, racer.x - 40, y)
        ctx.stroke()
        
        // Name
        ctx.fillStyle = '#FFF'
        ctx.font = '14px Arial'
        ctx.fillText(racer.name, racer.x - 20, y - 20)
        
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
    canvas.width = 800
    canvas.height = 400
  }, [])

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">🏃♂️ Sperm Race Championship</h2>
      
      <div className="text-center mb-6">
        <canvas
          ref={canvasRef}
          className="border border-gray-600 rounded-lg bg-gray-900 max-w-full"
        />
      </div>

      {!raceStarted ? (
        <div className="text-center">
          <p className="mb-4 text-gray-300">
            Your BrosBHustlin determines your sperm's speed in this epic race!
          </p>
          <button
            onClick={startRace}
            className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-lg text-xl font-bold"
          >
            🏁 Start Race!
          </button>
        </div>
      ) : (
        <div className="text-center">
          {commentary && (
            <div className="bg-blue-600 text-white p-4 rounded-lg mb-4">
              📢 {commentary}
            </div>
          )}
          
          {winner && (
            <div className="bg-green-600 text-white p-4 rounded-lg">
              🏆 {winner} wins the race! 
              {winner === 'You' ? ' Your BrosBHustlin paid off!' : ' Better luck next time!'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SpermRace