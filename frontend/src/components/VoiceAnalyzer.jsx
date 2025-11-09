import React, { useState, useRef, useEffect } from 'react'

// Point Notification Component (reused from CameraScanner)
const PointNotification = ({ points, itemName, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Play energetic game-like sound
    const playGameSound = () => {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        
        // Create a more complex, energetic coin collection sound
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

const VoiceAnalyzer = ({ onComplete }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [error, setError] = useState('')
  const [notifications, setNotifications] = useState([])
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0)
  const [detectedBuzzwords, setDetectedBuzzwords] = useState([])
  
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = analyzeAudio

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setTimeLeft(30)

      // Start countdown
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording()
            return 0
          }
          return prev - 1
        })
      }, 1000)

    } catch (err) {
      setError('Microphone access denied')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      clearInterval(timerRef.current)
    }
  }

  const analyzeAudio = async () => {
    setIsAnalyzing(true)
    
    try {
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' })
      const reader = new FileReader()
      
      reader.onloadend = async () => {
        const base64Audio = reader.result
        
        const response = await fetch('http://localhost:5000/api/analyze-voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: base64Audio })
        })

        const result = await response.json()
        
        if (result.success) {
          // Show gamified notifications for each buzzword
          if (result.data.buzzwords && result.data.buzzwords.length > 0) {
            setDetectedBuzzwords(result.data.buzzwords)
            setCurrentNotificationIndex(0)
          } else {
            // No buzzwords detected, complete immediately
            onComplete(0, [])
          }
        } else {
          setError(result.error)
        }
        
        setIsAnalyzing(false)
      }
      
      reader.readAsDataURL(audioBlob)
    } catch (err) {
      setError('Failed to analyze audio')
      setIsAnalyzing(false)
    }
  }

  // Show notification when index changes
  useEffect(() => {
    if (detectedBuzzwords.length > 0 && currentNotificationIndex < detectedBuzzwords.length) {
      const buzzword = detectedBuzzwords[currentNotificationIndex]
      
      const showNextNotification = () => {
        if (currentNotificationIndex < detectedBuzzwords.length - 1) {
          setCurrentNotificationIndex(prev => prev + 1)
        } else {
          // All notifications shown, complete the flow
          const totalScore = detectedBuzzwords.reduce((sum, bw) => sum + bw.points, 0)
          onComplete(Math.min(totalScore, 200), detectedBuzzwords) // Cap at 200 as per backend
          setNotifications([])
          setCurrentNotificationIndex(0)
          setDetectedBuzzwords([])
        }
      }
      
      // Format buzzword name for display
      const displayName = buzzword.count > 1 
        ? `"${buzzword.phrase}" x${buzzword.count}`
        : `"${buzzword.phrase}"`
      
      setNotifications([{
        id: Date.now() + currentNotificationIndex,
        points: buzzword.points,
        itemName: displayName,
        onComplete: showNextNotification
      }])
    }
  }, [currentNotificationIndex, detectedBuzzwords, onComplete])

  const recordingProgress = ((30 - timeLeft) / 30) * 100

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
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-pink-300">
          🎤 Voice Analyzer
        </h2>
        
        <div className="flex flex-col items-center space-y-8">
          <div className="text-center w-full">
            <div className="relative inline-block mb-6">
              <div className={`text-8xl md:text-9xl transition-all duration-300 ${
                isRecording ? 'animate-pulse scale-110' : 'scale-100'
              }`}>
                {isRecording ? '🔴' : '🎤'}
              </div>
              {isRecording && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border-4 border-red-500 rounded-full animate-ping opacity-75"></div>
                </div>
              )}
            </div>
            
            {isRecording && (
              <div className="mb-6">
                <div className="text-6xl md:text-7xl font-black text-red-400 mb-4 text-shadow-lg animate-pulse">
                  {timeLeft}s
                </div>
                <div className="w-full max-w-md mx-auto h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-1000 ease-linear shadow-lg shadow-red-500/50"
                    style={{ width: `${recordingProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <p className="mb-8 text-gray-200 text-lg font-medium max-w-2xl mx-auto">
              {isRecording 
                ? "🎙️ Recording... Use corporate buzzwords to maximize your score!"
                : isAnalyzing
                  ? "🔍 Analyzing your corporate speech..."
                  : "Click to record up to 30 seconds of your most corporate speech"
              }
            </p>

            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isAnalyzing || notifications.length > 0}
              className={`min-w-[250px] px-8 py-4 rounded-xl text-xl font-semibold text-gray-100 border transform transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                isRecording 
                  ? 'bg-slate-700 border-slate-600 hover:bg-slate-600 shadow-lg' 
                  : isAnalyzing
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-slate-700 border-slate-600 hover:bg-slate-600 shadow-lg'
              }`}
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚙️</span>
                  <span>Analyzing...</span>
                </span>
              ) : isRecording ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-pulse">⏹️</span>
                  <span>Stop Recording</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>🎤</span>
                  <span>Start Recording</span>
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

export default VoiceAnalyzer