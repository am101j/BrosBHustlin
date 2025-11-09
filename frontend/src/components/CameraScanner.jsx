import React, { useRef, useState, useEffect } from 'react'
import Webcam from 'react-webcam'

// Boo Notification Component for 0 points
const BooNotification = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Play negative boo sound
    const playBooSound = () => {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const now = audioContext.currentTime
        
        // Create a descending "boo" sound - low, descending pitch
        const booOsc = audioContext.createOscillator()
        const booGain = audioContext.createGain()
        booOsc.connect(booGain)
        booGain.connect(audioContext.destination)
        
        // Start high and descend to low (disappointed sound)
        booOsc.frequency.setValueAtTime(200, now)
        booOsc.frequency.exponentialRampToValueAtTime(80, now + 0.5)
        booOsc.type = 'sawtooth' // More harsh/negative
        
        booGain.gain.setValueAtTime(0, now)
        booGain.gain.linearRampToValueAtTime(0.3, now + 0.05)
        booGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5)
        
        booOsc.start(now)
        booOsc.stop(now + 0.5)
        
        // Add a second layer for more "boo" effect
        const booOsc2 = audioContext.createOscillator()
        const booGain2 = audioContext.createGain()
        booOsc2.connect(booGain2)
        booGain2.connect(audioContext.destination)
        
        booOsc2.frequency.setValueAtTime(150, now + 0.1)
        booOsc2.frequency.exponentialRampToValueAtTime(60, now + 0.5)
        booOsc2.type = 'square'
        
        booGain2.gain.setValueAtTime(0, now + 0.1)
        booGain2.gain.linearRampToValueAtTime(0.2, now + 0.15)
        booGain2.gain.exponentialRampToValueAtTime(0.01, now + 0.5)
        
        booOsc2.start(now + 0.1)
        booOsc2.stop(now + 0.5)
      } catch (err) {
        console.log('Audio not available:', err)
      }
    }

    // Show notification
    setIsVisible(true)
    playBooSound()

    // Hide after animation
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onComplete(), 300)
    }, 2500)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className="animate-boo-popup">
        <div className="bg-gradient-to-br from-red-900/90 via-red-800/90 to-red-900/90 border-4 border-red-500/80 rounded-2xl px-10 py-8 shadow-2xl shadow-red-500/50">
          <div className="text-center animate-shake">
            <div className="text-6xl mb-3">😢</div>
            <div className="text-7xl font-gaming text-red-400 mb-2 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
              0
            </div>
            <div className="text-3xl font-gaming text-red-500 mb-2">
              BOO!
            </div>
            <div className="text-xl text-gray-300 font-gaming-sub tracking-wider uppercase">
              No Items Detected
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Point Notification Component
const PointNotification = ({ points, itemName, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Play energetic game-like sound
    const playGameSound = () => {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        
        // Create a more complex, energetic coin collection sound
        // Multiple oscillators for richer sound
        const duration = 0.4
        const now = audioContext.currentTime
        
        // Main coin sound - ascending pitch
        const mainOsc = audioContext.createOscillator()
        const mainGain = audioContext.createGain()
        mainOsc.connect(mainGain)
        mainGain.connect(audioContext.destination)
        
        // Base frequency scales with points (higher points = higher pitch)
        const baseFreq = 300 + (points * 3)
        mainOsc.frequency.setValueAtTime(baseFreq, now)
        mainOsc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + duration)
        mainOsc.type = 'square' // More game-like
        
        mainGain.gain.setValueAtTime(0, now)
        mainGain.gain.linearRampToValueAtTime(0.4, now + 0.01)
        mainGain.gain.exponentialRampToValueAtTime(0.01, now + duration)
        
        mainOsc.start(now)
        mainOsc.stop(now + duration)
        
        // Add a sparkle/high frequency layer for extra energy
        const sparkleOsc = audioContext.createOscillator()
        const sparkleGain = audioContext.createGain()
        sparkleOsc.connect(sparkleGain)
        sparkleGain.connect(audioContext.destination)
        
        sparkleOsc.frequency.setValueAtTime(baseFreq * 3, now)
        sparkleOsc.frequency.exponentialRampToValueAtTime(baseFreq * 5, now + duration * 0.5)
        sparkleOsc.type = 'sine'
        
        sparkleGain.gain.setValueAtTime(0, now)
        sparkleGain.gain.linearRampToValueAtTime(0.2, now + 0.01)
        sparkleGain.gain.exponentialRampToValueAtTime(0.01, now + duration * 0.5)
        
        sparkleOsc.start(now)
        sparkleOsc.stop(now + duration * 0.5)
        
        // Add a low frequency "thump" for impact
        if (points >= 50) {
          const thumpOsc = audioContext.createOscillator()
          const thumpGain = audioContext.createGain()
          thumpOsc.connect(thumpGain)
          thumpGain.connect(audioContext.destination)
          
          thumpOsc.frequency.setValueAtTime(80, now)
          thumpOsc.type = 'sawtooth'
          
          thumpGain.gain.setValueAtTime(0.15, now)
          thumpGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
          
          thumpOsc.start(now)
          thumpOsc.stop(now + 0.2)
        }
      } catch (err) {
        console.log('Audio not available:', err)
      }
    }

    // Show notification
    setIsVisible(true)
    playGameSound()

    // Hide after animation
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onComplete(), 300) // Wait for fade out
    }, 2500)

    return () => clearTimeout(timer)
  }, [points, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className="animate-point-popup">
        <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 border-4 border-yellow-400/80 rounded-2xl px-10 py-8 shadow-2xl shadow-yellow-500/50">
          <div className="text-center">
            <div className="text-6xl mb-3 animate-bounce">✨</div>
            <div className="text-7xl font-gaming text-yellow-400 mb-2 animate-flicker drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">
              +{points}
            </div>
            <div className="text-xl text-gray-200 font-gaming-sub tracking-wider uppercase">
              {itemName}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CameraScanner = ({ onComplete }) => {
  const webcamRef = useRef(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [notifications, setNotifications] = useState([])
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0)
  const [detectedItems, setDetectedItems] = useState([])
  const [showBoo, setShowBoo] = useState(false)

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot()
    if (!imageSrc) return

    setIsAnalyzing(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5000/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageSrc })
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('Camera Analysis Results:', result.data)
        
        // Remove alert - instead show gamified notifications
        if (result.data.items && result.data.items.length > 0) {
          setDetectedItems(result.data.items)
          setCurrentNotificationIndex(0)
        } else {
          // No items detected, show boo notification
          setShowBoo(true)
        }
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to analyze image. Make sure backend is running.')
    }

    setIsAnalyzing(false)
  }

  // Show notification when index changes
  useEffect(() => {
    if (detectedItems.length > 0 && currentNotificationIndex < detectedItems.length) {
      const item = detectedItems[currentNotificationIndex]
      
      const showNextNotification = () => {
        if (currentNotificationIndex < detectedItems.length - 1) {
          setCurrentNotificationIndex(prev => prev + 1)
        } else {
          // All notifications shown, complete the flow
          const totalScore = detectedItems.reduce((sum, item) => sum + item.points, 0)
          onComplete(totalScore, detectedItems)
          setNotifications([])
          setCurrentNotificationIndex(0)
          setDetectedItems([])
        }
      }
      
      setNotifications([{
        id: Date.now() + currentNotificationIndex,
        points: item.points,
        itemName: item.name,
        onComplete: showNextNotification
      }])
    }
  }, [currentNotificationIndex, detectedItems, onComplete])

  const handleBooComplete = () => {
    setShowBoo(false)
    onComplete(0, [])
  }

  return (
    <>
      {/* Boo Notification for 0 points */}
      {showBoo && <BooNotification onComplete={handleBooComplete} />}

      {/* Point Notifications */}
      {notifications.map((notification) => (
        <PointNotification
          key={notification.id}
          points={notification.points}
          itemName={notification.itemName}
          onComplete={notification.onComplete}
        />
      ))}

      <div className="card w-full max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-cyan-300">
          📸 Visual Scanner
        </h2>
        
        <div className="flex flex-col items-center space-y-8">
          <div className="relative group">
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700/50">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="rounded-2xl max-w-full h-auto"
                videoConstraints={{
                  width: 640,
                  height: 480,
                  facingMode: "user"
                }}
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-6xl mb-4 animate-pulse">🔍</div>
                    <div className="text-2xl font-bold text-blue-300">Analyzing...</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center w-full">
            <p className="mb-6 text-gray-200 text-lg font-medium max-w-2xl mx-auto">
              Position yourself in frame and click capture to detect your finance bro items!
            </p>
            
            <button
              onClick={capture}
              disabled={isAnalyzing || notifications.length > 0 || showBoo}
              className="btn-primary text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⚙️</span>
                  <span>Analyzing...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>📸</span>
                  <span>Capture & Analyze</span>
                </span>
              )}
            </button>
          </div>

          {error && (
            <div className="glass-strong bg-red-500/20 border-red-500/50 text-red-200 p-4 rounded-xl w-full max-w-md text-center">
              <span className="font-bold">⚠️</span> {error}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default CameraScanner