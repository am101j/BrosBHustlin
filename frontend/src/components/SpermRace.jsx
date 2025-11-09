import React, { useEffect, useRef, useState } from 'react'

const SpermRace = ({ broScore, purchasedPowerUps, onComplete }) => {
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)
  const [raceStarted, setRaceStarted] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const [winner, setWinner] = useState(null)
  const [commentary, setCommentary] = useState('')
  const [raceProgress, setRaceProgress] = useState({})
  const racersRef = useRef([])
  const raceFinishedRef = useRef(false)
  const obstaclesRef = useRef([])
  const boostersRef = useRef([])
  const particlesRef = useRef([])
  const playerInputRef = useRef({ up: false, down: false })
  const playerYRef = useRef(null)
  const [availablePowerUps, setAvailablePowerUps] = useState({})
  const [activePowerUps, setActivePowerUps] = useState({})
  const playerRacerRef = useRef(null)

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!raceStarted || raceFinishedRef.current) return
      
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault()
        playerInputRef.current.up = true
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault()
        playerInputRef.current.down = true
      }
    }

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault()
        playerInputRef.current.up = false
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault()
        playerInputRef.current.down = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [raceStarted])

  // Generate obstacles and boosters
  useEffect(() => {
    if (raceStarted && !raceFinishedRef.current) {
      const canvas = canvasRef.current
      if (!canvas) return

      // Create more obstacles for gameplay (slow down racers)
      obstaclesRef.current = Array.from({ length: 8 }, (_, i) => ({
        x: 200 + (i * 100) + Math.random() * 80,
        y: 80 + Math.random() * (canvas.height - 160),
        width: 30,
        height: 30,
        type: 'obstacle',
        collected: false
      }))

      // Create more boosters for gameplay (speed up racers)
      boostersRef.current = Array.from({ length: 5 }, (_, i) => ({
        x: 250 + (i * 150) + Math.random() * 100,
        y: 80 + Math.random() * (canvas.height - 160),
        width: 25,
        height: 25,
        type: 'booster',
        collected: false
      }))
    }
  }, [raceStarted])

  const getCommentary = (leader, progress) => {
    const commentaries = [
      `${leader} is taking an early lead!`,
      `Look at ${leader} go! Pure finance bro energy!`,
      `${leader} is CRUSHING it!`,
      `Wow! ${leader} is unstoppable!`,
      `${leader} is in the lead!`,
      `This is intense! ${leader} pushing forward!`,
      `${leader} is almost there!`
    ]
    return commentaries[Math.min(Math.floor(progress / 15), commentaries.length - 1)]
  }

  const drawStartingPositions = (ctx, canvas, score) => {
    // Clear with gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#0f172a')
    gradient.addColorStop(1, '#1e1b4b')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw start line
    ctx.strokeStyle = '#4ade80'
    ctx.lineWidth = 3
    ctx.setLineDash([10, 5])
    ctx.beginPath()
    ctx.moveTo(50, 0)
    ctx.lineTo(50, canvas.height)
    ctx.stroke()
    ctx.setLineDash([])
    
    // Draw start text
    ctx.fillStyle = '#4ade80'
    ctx.font = 'bold 20px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('START', 50, 30)
    
    // Draw finish line
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 3
    ctx.setLineDash([10, 5])
    ctx.beginPath()
    ctx.moveTo(canvas.width - 100, 0)
    ctx.lineTo(canvas.width - 100, canvas.height)
    ctx.stroke()
    ctx.setLineDash([])
    
    // Draw finish text
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 20px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('FINISH', canvas.width - 100, 30)
    
    // Calculate suitability based on score (max 400)
    const suitability = Math.min((score / 400) * 100, 100)
    const racers = [
      { name: 'You', x: 50, y: 80, color: '#06b6d4', suitability: suitability },
      { name: 'Chad', x: 50, y: 180, color: '#ef4444', suitability: 85 },
      { name: 'Brad', x: 50, y: 280, color: '#f59e0b', suitability: 70 },
      { name: 'Kyle', x: 50, y: 380, color: '#f59e0b', suitability: 45 }
    ]
    
    // Draw racers at starting position
    racers.forEach((racer) => {
      // Draw racer
      ctx.shadowBlur = 10
      ctx.shadowColor = racer.color
      
      // Head
      ctx.fillStyle = racer.color
      ctx.beginPath()
      ctx.arc(racer.x, racer.y, 10, 0, Math.PI * 2)
      ctx.fill()
      
      // Tail
      ctx.strokeStyle = racer.color
      ctx.lineWidth = 4
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(racer.x - 10, racer.y)
      ctx.quadraticCurveTo(racer.x - 30, racer.y - 15, racer.x - 50, racer.y - 5)
      ctx.quadraticCurveTo(racer.x - 40, racer.y + 5, racer.x - 30, racer.y)
      ctx.stroke()
      
      ctx.shadowBlur = 0
      
      // Name with background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
      ctx.fillRect(racer.x - 35, racer.y - 40, 70, 25)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(racer.name, racer.x, racer.y - 22)
      
      // Suitability indicator
      ctx.fillStyle = racer.color
      ctx.font = '12px Arial'
      ctx.textAlign = 'left'
      ctx.fillText(`${racer.suitability.toFixed(0)}%`, racer.x + 20, racer.y + 5)
    })
    
    // Draw suitability label
    ctx.fillStyle = '#94a3b8'
    ctx.font = 'bold 18px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Starting Positions - Suitability %', canvas.width / 2, canvas.height - 20)
  }

  const createParticles = (x, y, color) => {
    const newParticles = Array.from({ length: 20 }, () => ({
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 1.0,
      color
    }))
    particlesRef.current = [...particlesRef.current, ...newParticles]
  }

  const startCountdown = () => {
    let count = 3
    setCountdown(count)
    
    const countdownInterval = setInterval(() => {
      count--
      if (count > 0) {
        setCountdown(count)
      } else if (count === 0) {
        setCountdown('GO!')
        setTimeout(() => {
          setCountdown(null)
          startRace()
        }, 500)
        clearInterval(countdownInterval)
      }
    }, 1000)
  }

  // Initialize power-ups from purchases
  useEffect(() => {
    if (purchasedPowerUps && Object.keys(purchasedPowerUps).length > 0) {
      setAvailablePowerUps({ ...purchasedPowerUps })
    }
  }, [purchasedPowerUps])

  const activatePowerUp = (powerUpId) => {
    if (!availablePowerUps[powerUpId] || availablePowerUps[powerUpId] <= 0) return
    if (raceFinishedRef.current || !raceStarted) return

    const playerRacer = racersRef.current.find(r => r.isPlayer)
    if (!playerRacer) return

    // Update available count
    setAvailablePowerUps(prev => ({
      ...prev,
      [powerUpId]: prev[powerUpId] - 1
    }))

    // Activate power-up effect
    switch (powerUpId) {
      case 'doubleSpeed':
        playerRacer.speed = playerRacer.baseSpeed * 2
        playerRacer.powerUpTimer = 120 // 2 seconds at 60fps
        playerRacer.activePowerUp = 'doubleSpeed'
        setActivePowerUps(prev => ({ ...prev, doubleSpeed: 120 }))
        setTimeout(() => {
          if (playerRacer.powerUpTimer <= 0) {
            playerRacer.speed = playerRacer.baseSpeed
            playerRacer.activePowerUp = null
            setActivePowerUps(prev => {
              const newState = { ...prev }
              delete newState.doubleSpeed
              return newState
            })
          }
        }, 2000)
        break

      case 'speedBoost':
        playerRacer.speed = playerRacer.baseSpeed * 1.5
        playerRacer.powerUpTimer = 90 // 1.5 seconds
        playerRacer.activePowerUp = 'speedBoost'
        setActivePowerUps(prev => ({ ...prev, speedBoost: 90 }))
        setTimeout(() => {
          if (playerRacer.powerUpTimer <= 0) {
            playerRacer.speed = playerRacer.baseSpeed
            playerRacer.activePowerUp = null
            setActivePowerUps(prev => {
              const newState = { ...prev }
              delete newState.speedBoost
              return newState
            })
          }
        }, 1500)
        break

      case 'shield':
        playerRacer.shield = true
        playerRacer.activePowerUp = 'shield'
        setActivePowerUps(prev => ({ ...prev, shield: true }))
        break

      case 'slowEnemies':
        racersRef.current.forEach(racer => {
          if (!racer.isPlayer) {
            racer.speed = racer.baseSpeed * 0.3
            racer.powerUpTimer = 120
          }
        })
        setActivePowerUps(prev => ({ ...prev, slowEnemies: 120 }))
        setTimeout(() => {
          racersRef.current.forEach(racer => {
            if (!racer.isPlayer && racer.powerUpTimer <= 0) {
              racer.speed = racer.baseSpeed
            }
          })
          setActivePowerUps(prev => {
            const newState = { ...prev }
            delete newState.slowEnemies
            return newState
          })
        }, 2000)
        break

      case 'instantBoost':
        playerRacer.x += 50 // Instant forward movement
        createParticles(playerRacer.x, playerRacer.y, '#f59e0b')
        break

      case 'magnet':
        playerRacer.magnet = true
        playerRacer.magnetTimer = 180 // 3 seconds
        playerRacer.activePowerUp = 'magnet'
        setActivePowerUps(prev => ({ ...prev, magnet: 180 }))
        setTimeout(() => {
          playerRacer.magnet = false
          playerRacer.activePowerUp = null
          setActivePowerUps(prev => {
            const newState = { ...prev }
            delete newState.magnet
            return newState
          })
        }, 3000)
        break
    }
  }

  const startRace = () => {
    setRaceStarted(true)
    raceFinishedRef.current = false
    setWinner(null)
    particlesRef.current = []
    setActivePowerUps({})
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Race setup with proper Y positions
    const finishLine = canvas.width - 100
    const lanes = [80, 180, 280, 380]
    
    // Initialize player Y position
    playerYRef.current = lanes[0]
    
    racersRef.current = [
      { 
        name: 'You', 
        speed: Math.max(0.5, (broScore / 400) * 2 + Math.random() * 0.5),
        baseSpeed: Math.max(0.5, (broScore / 400) * 2),
        x: 50, 
        y: lanes[0],
        color: '#06b6d4', 
        glow: '#22d3ee',
        lane: 0,
        boostTimer: 0,
        obstacleTimer: 0,
        isPlayer: true,
        powerUpTimer: 0,
        activePowerUp: null,
        shield: false,
        magnet: false,
        magnetTimer: 0
      },
      { 
        name: 'Chad', 
        speed: 1.5 + Math.random() * 0.8, 
        baseSpeed: 1.5,
        x: 50, 
        y: lanes[1],
        color: '#ef4444', 
        glow: '#f87171',
        lane: 1,
        boostTimer: 0,
        obstacleTimer: 0,
        isPlayer: false
      },
      { 
        name: 'Brad', 
        speed: 1.2 + Math.random() * 0.8, 
        baseSpeed: 1.2,
        x: 50, 
        y: lanes[2],
        color: '#f59e0b', 
        glow: '#fbbf24',
        lane: 2,
        boostTimer: 0,
        obstacleTimer: 0,
        isPlayer: false
      },
      { 
        name: 'Kyle', 
        speed: 1.0 + Math.random() * 0.8, 
        baseSpeed: 1.0,
        x: 50, 
        y: lanes[3],
        color: '#f59e0b', 
        glow: '#fbbf24',
        lane: 3,
        boostTimer: 0,
        obstacleTimer: 0,
        isPlayer: false
      }
    ]
    
    let lastCommentaryUpdate = Date.now()
    let commentaryIndex = 0
    
    const animate = () => {
      if (raceFinishedRef.current) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        return
      }

      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
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
      
      // Draw obstacles (only uncollected ones, positioned on track)
      obstaclesRef.current.forEach(obstacle => {
        if (obstacle.collected) return
        
        // Skip if racers have passed it
        const firstRacerX = Math.min(...racersRef.current.map(r => r.x))
        if (obstacle.x < firstRacerX - 100) return
        
        // Only draw if visible on screen
        if (obstacle.x < -50 || obstacle.x > canvas.width + 50) return
        
        ctx.fillStyle = 'rgba(239, 68, 68, 0.7)'
        ctx.beginPath()
        ctx.arc(obstacle.x, obstacle.y, obstacle.width / 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 2
        ctx.stroke()
        // Warning symbol
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 16px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('⚠', obstacle.x, obstacle.y + 5)
      })
      
      // Draw boosters (only uncollected ones, positioned on track)
      boostersRef.current.forEach(booster => {
        if (booster.collected) return
        
        // Skip if racers have passed it
        const firstRacerX = Math.min(...racersRef.current.map(r => r.x))
        if (booster.x < firstRacerX - 100) return
        
        // Only draw if visible on screen
        if (booster.x < -50 || booster.x > canvas.width + 50) return
        
        ctx.fillStyle = 'rgba(245, 158, 11, 0.7)'
        ctx.beginPath()
        ctx.arc(booster.x, booster.y, booster.width / 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 2
        ctx.stroke()
        // Draw animated sparkle
        const sparkleTime = Date.now() * 0.005
        ctx.fillStyle = '#fbbf24'
        ctx.fillRect(booster.x - 2 + Math.sin(sparkleTime) * 2, booster.y - 8, 4, 4)
        ctx.fillRect(booster.x + 4, booster.y - 4 + Math.cos(sparkleTime) * 2, 4, 4)
        ctx.fillRect(booster.x - 4, booster.y + 4, 4, 4)
        ctx.fillRect(booster.x + 6, booster.y + 2 - Math.sin(sparkleTime) * 2, 4, 4)
      })
      
      // Update and draw racers
      let leader = null
      let maxX = 0
      let leaderProgress = 0
      const playerRacer = racersRef.current[0] // Player is always first
      const moveSpeed = 3 // Vertical movement speed
      const minY = 60
      const maxY = canvas.height - 60
      
      racersRef.current.forEach((racer, index) => {
        // Update timers
        if (racer.boostTimer > 0) {
          racer.boostTimer--
          if (racer.boostTimer === 0 && !racer.activePowerUp) {
            racer.speed = racer.baseSpeed
          }
        }
        
        if (racer.obstacleTimer > 0) {
          racer.obstacleTimer--
          if (racer.obstacleTimer === 0 && !racer.activePowerUp) {
            racer.speed = racer.baseSpeed
          }
        }

        // Update power-up timers
        if (racer.powerUpTimer > 0) {
          racer.powerUpTimer--
          if (racer.powerUpTimer === 0 && racer.activePowerUp && racer.isPlayer) {
            if (racer.activePowerUp === 'doubleSpeed' || racer.activePowerUp === 'speedBoost') {
              racer.speed = racer.baseSpeed
              racer.activePowerUp = null
            }
          }
        }

        // Update magnet timer
        if (racer.magnet && racer.magnetTimer > 0) {
          racer.magnetTimer--
          if (racer.magnetTimer === 0) {
            racer.magnet = false
          }
        }
        
        // Player controls - vertical movement
        if (racer.isPlayer) {
          if (playerInputRef.current.up && playerYRef.current > minY) {
            playerYRef.current -= moveSpeed
          }
          if (playerInputRef.current.down && playerYRef.current < maxY) {
            playerYRef.current += moveSpeed
          }
          racer.y = playerYRef.current
        } else {
          // AI racers - slight vertical movement for natural swimming
          const variation = Math.sin(Date.now() * 0.01 + index) * 0.3
          racer.y = Math.max(minY, Math.min(maxY, racer.y + variation))
        }
        
        // Check obstacle collisions
        obstaclesRef.current.forEach((obstacle, obsIdx) => {
          if (obstacle.collected) return
          
          const dx = racer.x - obstacle.x
          const dy = racer.y - obstacle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 25) {
            obstacle.collected = true
            // Shield protects from obstacle
            if (racer.shield && racer.isPlayer) {
              racer.shield = false
              racer.activePowerUp = null
              setActivePowerUps(prev => {
                const newState = { ...prev }
                delete newState.shield
                return newState
              })
              createParticles(obstacle.x, obstacle.y, '#a855f7') // Purple shield particles
            } else if (racer.obstacleTimer === 0) {
              racer.speed = racer.baseSpeed * 0.3
              racer.obstacleTimer = 60 // Slow for 60 frames
              createParticles(obstacle.x, obstacle.y, '#ef4444')
            }
          }
        })
        
        // Check booster collisions (with magnet effect for player)
        boostersRef.current.forEach((booster, boostIdx) => {
          if (booster.collected) return
          
          const dx = racer.x - booster.x
          const dy = racer.y - booster.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          // Magnet effect: attract boosters from further away
          const magnetRange = racer.isPlayer && racer.magnet ? 60 : 20
          
          if (distance < magnetRange) {
            // If magnet is active, slowly pull booster towards player
            if (racer.magnet && racer.isPlayer && distance > 15) {
              const pullStrength = 0.5
              booster.x += (dx / distance) * pullStrength
              booster.y += (dy / distance) * pullStrength
            } else if (distance < 20) {
              booster.collected = true
              if (racer.boostTimer === 0 && !racer.activePowerUp) {
                racer.speed = racer.baseSpeed * 2.5
                racer.boostTimer = 90 // Boost for 90 frames
                createParticles(booster.x, booster.y, '#f59e0b')
              }
            }
          }
        })
        
        // Move racer horizontally with natural variation
        if (!raceFinishedRef.current) {
          const variation = racer.isPlayer ? 0 : Math.sin(Date.now() * 0.01 + index) * 0.2
          racer.x += racer.speed + variation
        }
        
        // Track leader
        if (racer.x > maxX) {
          maxX = racer.x
          leader = racer
          leaderProgress = ((racer.x - 50) / (finishLine - 50)) * 100
        }
        
        // Draw racer with glow effect
        ctx.shadowBlur = racer.isPlayer ? 20 : 15
        ctx.shadowColor = racer.color
        
        // Player indicator
        if (racer.isPlayer) {
          ctx.strokeStyle = '#fff'
          ctx.lineWidth = 2
          ctx.setLineDash([5, 5])
          ctx.beginPath()
          ctx.arc(racer.x, racer.y, 25, 0, Math.PI * 2)
          ctx.stroke()
          ctx.setLineDash([])

          // Shield visual effect
          if (racer.shield) {
            ctx.strokeStyle = '#a855f7'
            ctx.lineWidth = 3
            ctx.setLineDash([3, 3])
            ctx.beginPath()
            ctx.arc(racer.x, racer.y, 30, 0, Math.PI * 2)
            ctx.stroke()
            ctx.setLineDash([])
          }

          // Magnet visual effect
          if (racer.magnet) {
            ctx.strokeStyle = '#3b82f6'
            ctx.lineWidth = 2
            ctx.setLineDash([2, 2])
            ctx.beginPath()
            ctx.arc(racer.x, racer.y, 50, 0, Math.PI * 2)
            ctx.stroke()
            ctx.setLineDash([])
          }
        }
        
        // Head
        ctx.fillStyle = racer.color
        ctx.beginPath()
        ctx.arc(racer.x, racer.y, 10, 0, Math.PI * 2)
        ctx.fill()
        
        // Tail with gradient (animated for player)
        const tailOffset = racer.isPlayer ? Math.sin(Date.now() * 0.01) * 3 : 0
        ctx.strokeStyle = racer.color
        ctx.lineWidth = 4
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(racer.x - 10, racer.y)
        ctx.quadraticCurveTo(racer.x - 30, racer.y - 15 + tailOffset, racer.x - 50, racer.y - 5)
        ctx.quadraticCurveTo(racer.x - 40, racer.y + 5 - tailOffset, racer.x - 30, racer.y)
        ctx.stroke()
        
        // Boost effect
        if (racer.boostTimer > 0) {
          ctx.strokeStyle = '#f59e0b'
          ctx.lineWidth = 2
          ctx.setLineDash([5, 5])
          ctx.beginPath()
          ctx.arc(racer.x, racer.y, 20, 0, Math.PI * 2)
          ctx.stroke()
          ctx.setLineDash([])
          // Speed lines
          for (let i = 0; i < 5; i++) {
            ctx.strokeStyle = `rgba(245, 158, 11, ${0.5 - i * 0.1})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(racer.x - 15 - i * 5, racer.y - 5)
            ctx.lineTo(racer.x - 20 - i * 5, racer.y)
            ctx.moveTo(racer.x - 15 - i * 5, racer.y + 5)
            ctx.lineTo(racer.x - 20 - i * 5, racer.y)
            ctx.stroke()
          }
        }
        
        // Obstacle effect
        if (racer.obstacleTimer > 0) {
          ctx.strokeStyle = '#ef4444'
          ctx.lineWidth = 2
          ctx.setLineDash([3, 3])
          ctx.beginPath()
          ctx.arc(racer.x, racer.y, 18, 0, Math.PI * 2)
          ctx.stroke()
          ctx.setLineDash([])
          // Slow effect
          ctx.fillStyle = 'rgba(239, 68, 68, 0.3)'
          ctx.beginPath()
          ctx.arc(racer.x, racer.y, 15, 0, Math.PI * 2)
          ctx.fill()
        }
        
        ctx.shadowBlur = 0
        
        // Name with background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
        ctx.fillRect(racer.x - 35, racer.y - 40, 70, 25)
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 16px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(racer.name, racer.x, racer.y - 22)
        
        // Progress percentage
        const progress = ((racer.x - 50) / (finishLine - 50)) * 100
        ctx.fillStyle = racer.color
        ctx.font = '12px Arial'
        ctx.textAlign = 'left'
        ctx.fillText(`${Math.min(100, Math.max(0, Math.round(progress)))}%`, racer.x + 20, racer.y + 5)
        
        // Check for winner
        if (racer.x >= finishLine && !raceFinishedRef.current) {
          raceFinishedRef.current = true
          setWinner(racer.name)
          createParticles(racer.x, racer.y, racer.color)
          
          // Play win sound
          try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)()
            const now = audioContext.currentTime
            const osc = audioContext.createOscillator()
            const gain = audioContext.createGain()
            osc.connect(gain)
            gain.connect(audioContext.destination)
            
            osc.frequency.setValueAtTime(400, now)
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.3)
            osc.type = 'sine'
            gain.gain.setValueAtTime(0.3, now)
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
            osc.start(now)
            osc.stop(now + 0.3)
          } catch (err) {
            console.log('Audio not available')
          }
          
          setTimeout(() => {
            onComplete()
          }, 3000)
        }
      })
      
      // Update commentary
      if (leader && Date.now() - lastCommentaryUpdate > 2000) {
        const newCommentary = getCommentary(leader.name, leaderProgress)
        if (newCommentary !== commentary) {
          setCommentary(newCommentary)
        }
        lastCommentaryUpdate = Date.now()
      }
      
      // Update progress for display
      const progress = {}
      racersRef.current.forEach(racer => {
        progress[racer.name] = ((racer.x - 50) / (finishLine - 50)) * 100
      })
      setRaceProgress(progress)
      
      // Update particles
      particlesRef.current = particlesRef.current.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        life: p.life - 0.02
      })).filter(p => p.life > 0)
      
      // Draw particles
      particlesRef.current.forEach(particle => {
        ctx.globalAlpha = particle.life
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1.0
      
      if (!raceFinishedRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }
    
    animate()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    canvas.width = 900
    canvas.height = 500
    
    // Draw initial starting positions if race hasn't started
    if (!raceStarted && !countdown) {
      const ctx = canvas.getContext('2d')
      drawStartingPositions(ctx, canvas, broScore)
    }
  }, [raceStarted, broScore, countdown])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div className="card w-full max-w-4xl">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-cyan-300">
        🏃 Sperm Race Championship
      </h2>
      
      {/* Countdown overlay */}
      {countdown && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="text-9xl md:text-[12rem] font-black text-cyan-300 animate-pulse drop-shadow-2xl">
              {countdown}
            </div>
          </div>
        </div>
      )}
      
      <div className="text-center mb-8">
        <div className="relative inline-block group">
          <canvas
            ref={canvasRef}
            className="relative border-2 border-slate-700/50 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 max-w-full shadow-2xl"
          />
        </div>
      </div>

      {/* Power-Up Controls */}
      {raceStarted && !raceFinishedRef.current && Object.keys(availablePowerUps).some(key => availablePowerUps[key] > 0) && (
        <div className="mb-4 glass-strong rounded-xl p-4 border-2 border-cyan-500/30">
          <div className="text-sm font-bold text-cyan-300 mb-3 text-center">
            🎮 Power-Ups (Click to Activate)
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {availablePowerUps.doubleSpeed > 0 && (
              <button
                onClick={() => activatePowerUp('doubleSpeed')}
                disabled={availablePowerUps.doubleSpeed <= 0}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-semibold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⚡ Double Speed ({availablePowerUps.doubleSpeed})
              </button>
            )}
            {availablePowerUps.speedBoost > 0 && (
              <button
                onClick={() => activatePowerUp('speedBoost')}
                disabled={availablePowerUps.speedBoost <= 0}
                className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🚀 Speed Boost ({availablePowerUps.speedBoost})
              </button>
            )}
            {availablePowerUps.shield > 0 && (
              <button
                onClick={() => activatePowerUp('shield')}
                disabled={availablePowerUps.shield <= 0}
                className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-lg font-semibold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🛡️ Shield ({availablePowerUps.shield})
              </button>
            )}
            {availablePowerUps.slowEnemies > 0 && (
              <button
                onClick={() => activatePowerUp('slowEnemies')}
                disabled={availablePowerUps.slowEnemies <= 0}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-lg font-semibold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🐌 Slow Enemies ({availablePowerUps.slowEnemies})
              </button>
            )}
            {availablePowerUps.instantBoost > 0 && (
              <button
                onClick={() => activatePowerUp('instantBoost')}
                disabled={availablePowerUps.instantBoost <= 0}
                className="px-4 py-2 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-lg font-semibold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                💨 Instant Boost ({availablePowerUps.instantBoost})
              </button>
            )}
            {availablePowerUps.magnet > 0 && (
              <button
                onClick={() => activatePowerUp('magnet')}
                disabled={availablePowerUps.magnet <= 0}
                className="px-4 py-2 bg-gradient-to-r from-indigo-400 to-blue-500 text-white rounded-lg font-semibold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🧲 Magnet ({availablePowerUps.magnet})
              </button>
            )}
          </div>
          {Object.keys(activePowerUps).length > 0 && (
            <div className="mt-3 text-center text-sm text-amber-400 font-semibold">
              Active: {Object.keys(activePowerUps).map(key => {
                const icons = {
                  doubleSpeed: '⚡',
                  speedBoost: '🚀',
                  shield: '🛡️',
                  slowEnemies: '🐌',
                  magnet: '🧲'
                }
                return icons[key] || ''
              }).filter(Boolean).join(' ')}
            </div>
          )}
        </div>
      )}

      {/* Progress bars */}
      {raceStarted && Object.keys(raceProgress).length > 0 && racersRef.current.length > 0 && (
        <div className="mb-6 space-y-2">
          {racersRef.current.map((racer) => (
            <div key={racer.name} className="flex items-center gap-3">
              <div className="w-20 text-sm font-bold text-gray-300">{racer.name}:</div>
              <div className="flex-1 h-4 bg-slate-800/50 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-100 rounded-full"
                  style={{
                    width: `${Math.min(100, Math.max(0, raceProgress[racer.name] || 0))}%`,
                    backgroundColor: racer.color
                  }}
                />
              </div>
              <div className="w-12 text-sm font-bold text-gray-400">
                {Math.min(100, Math.max(0, Math.round(raceProgress[racer.name] || 0)))}%
              </div>
            </div>
          ))}
        </div>
      )}

      {!raceStarted ? (
        <div className="text-center space-y-6">
          <p className="text-gray-200 text-lg font-medium max-w-2xl mx-auto">
            Your BrosBHustlin score determines your sperm's speed in this epic race! 
            <span className="block mt-2 text-cyan-300 font-bold">Score: {broScore}</span>
            <span className="block mt-4 text-cyan-400 font-bold text-xl">🎮 Controls:</span>
            <span className="block mt-2 text-sm text-gray-300">
              <span className="text-cyan-300">↑ Arrow Up / W</span> - Move Up
            </span>
            <span className="block text-sm text-gray-300">
              <span className="text-cyan-300">↓ Arrow Down / S</span> - Move Down
            </span>
            <span className="block mt-4 text-sm text-gray-400">
              ⚠️ Avoid obstacles (red) and grab boosters (amber) to gain an edge!
            </span>
          </p>
          <button
            onClick={startCountdown}
            className="btn-primary text-gray-100"
          >
            🏁 Start Race!
          </button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          {!winner && (
            <div className="glass-strong border-cyan-500/30 text-gray-200 p-3 rounded-xl mb-2">
              <span className="text-sm text-cyan-300 font-semibold">
                🎮 Use ↑/↓ or W/S to control your racer!
              </span>
            </div>
          )}
          {commentary && !winner && (
            <div className="glass-strong border-slate-600/50 text-gray-200 p-4 rounded-xl animate-pulse">
              <span className="text-2xl">📢</span> <span className="font-semibold">{commentary}</span>
            </div>
          )}
          
          {winner && (
            <div className="space-y-4">
              <div className={`glass-strong p-6 rounded-xl border-2 animate-fade-in ${
                winner === 'You' 
                  ? 'border-cyan-500/50 text-cyan-300' 
                  : 'border-slate-600/50 text-gray-300'
              }`}>
                <div className="text-5xl mb-3">🏆</div>
                <div className={`text-3xl font-black mb-2 ${winner === 'You' ? 'text-cyan-300' : 'text-gray-300'}`}>{winner} Wins!</div>
                <div className={`text-lg ${winner === 'You' ? 'text-gray-200' : 'text-gray-300'}`}>
                  {winner === 'You' 
                    ? '🎉 Your BrosBHustlin paid off! 🎉' 
                    : 'Better luck next time! Keep grinding!'}
                </div>
              </div>
              <button
                onClick={() => {
                  setRaceStarted(false)
                  setWinner(null)
                  setCommentary('')
                  setRaceProgress({})
                  raceFinishedRef.current = false
                  particlesRef.current = []
                  racersRef.current = []
                }}
                className="btn-secondary text-gray-100"
              >
                🔄 Race Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SpermRace
