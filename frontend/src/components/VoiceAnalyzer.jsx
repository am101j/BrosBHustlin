import React, { useState, useRef } from 'react'

const VoiceAnalyzer = ({ onComplete }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [error, setError] = useState('')
  
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
          onComplete(result.data.score, result.data.buzzwords)
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

  const recordingProgress = ((30 - timeLeft) / 30) * 100

  return (
    <div className="card w-full max-w-3xl">
      <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-gray-100 text-shadow-lg">
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
          
          <p className="mb-8 text-gray-300 text-lg font-medium max-w-2xl mx-auto">
            {isRecording 
              ? "🎙️ Recording... Use corporate buzzwords to maximize your score!"
              : isAnalyzing
                ? "🔍 Analyzing your corporate speech..."
                : "Click to record up to 30 seconds of your most corporate speech"
            }
          </p>

          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isAnalyzing}
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
  )
}

export default VoiceAnalyzer