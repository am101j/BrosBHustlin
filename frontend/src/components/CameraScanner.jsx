import React, { useRef, useState, useEffect } from 'react'
import Webcam from 'react-webcam'

// Point Notification Component
const PointNotification = ({ points, itemName, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Play sound
    const playSound = () => {
      try {
        // Create a simple coin/ding sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        // Higher pitch for higher points
        const frequency = 400 + (points * 2)
        oscillator.frequency.value = frequency
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
      } catch (err) {
        console.log('Audio not available:', err)
      }
    }

    // Show notification
    setIsVisible(true)
    playSound()

    // Hide after animation
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onComplete(), 300) // Wait for fade out
    }, 2000)

    return () => clearTimeout(timer)
  }, [points, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className="animate-point-popup">
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-500 rounded-2xl px-8 py-6 shadow-2xl">
          <div className="text-center">
            <div className="text-5xl mb-2">✨</div>
            <div className="text-6xl font-black text-green-400 mb-1">
              +{points}
            </div>
            <div className="text-lg text-gray-300 font-semibold">
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
          // No items detected, complete immediately
          onComplete(0, [])
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

  return (
    <>
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
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-gray-100 text-shadow-lg">
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
                    <div className="text-2xl font-bold text-white">Analyzing...</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center w-full">
            <p className="mb-6 text-gray-300 text-lg font-medium max-w-2xl mx-auto">
              Position yourself in frame and click capture to detect your finance bro items!
            </p>
            
            <button
              onClick={capture}
              disabled={isAnalyzing || notifications.length > 0}
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