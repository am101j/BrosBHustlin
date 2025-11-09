import React, { useRef, useState } from 'react'
import Webcam from 'react-webcam'

const CameraScanner = ({ onComplete }) => {
  const webcamRef = useRef(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')

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
        alert(`Detected: ${result.data.items.map(i => i.name).join(', ')}\nScore: ${result.data.score}\nTier: ${result.data.tier}`)
        onComplete(result.data.score, result.data.items)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to analyze image. Make sure backend is running.')
    }

    setIsAnalyzing(false)
  }

  return (
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
            disabled={isAnalyzing}
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
  )
}

export default CameraScanner