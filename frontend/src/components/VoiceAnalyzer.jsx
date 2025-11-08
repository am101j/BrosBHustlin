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

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">🎤 Voice Analyzer</h2>
      
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">
            {isRecording ? '🔴' : '🎤'}
          </div>
          
          {isRecording && (
            <div className="text-4xl font-bold text-red-500 mb-4">
              {timeLeft}s
            </div>
          )}
          
          <p className="mb-6 text-gray-300 max-w-md">
            {isRecording 
              ? "Recording... Use corporate buzzwords to increase your score!"
              : "Click to record up to 30 seconds of your most corporate speech"
            }
          </p>

          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isAnalyzing}
            className={`px-8 py-4 rounded-lg text-xl font-bold ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            } disabled:bg-gray-600`}
          >
            {isAnalyzing ? '🔍 Analyzing...' : 
             isRecording ? '⏹️ Stop Recording' : '🎤 Start Recording'}
          </button>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="text-sm text-gray-400 max-w-md">
          <p className="font-semibold mb-2">Buzzwords (25 pts each):</p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div>• circle back</div>
            <div>• synergize</div>
            <div>• hop on a call</div>
            <div>• take offline</div>
            <div>• touch base</div>
            <div>• ping you</div>
            <div>• bandwidth</div>
            <div>• move needle</div>
            <div>• low-hanging fruit</div>
            <div>• deep dive</div>
            <div>• leverage</div>
            <div>• actionable</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoiceAnalyzer