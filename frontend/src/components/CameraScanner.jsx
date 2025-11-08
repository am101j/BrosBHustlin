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
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">📸 Camera Scanner</h2>
      
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-lg max-w-md"
            videoConstraints={{
              width: 640,
              height: 480,
              facingMode: "user"
            }}
          />
        </div>

        <div className="text-center">
          <p className="mb-4 text-gray-300">
            Position yourself in frame and click capture to detect your finance bro items!
          </p>
          
          <button
            onClick={capture}
            disabled={isAnalyzing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-8 py-4 rounded-lg text-xl font-bold"
          >
            {isAnalyzing ? '🔍 Analyzing...' : '📸 Capture & Analyze'}
          </button>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="text-sm text-gray-400 max-w-md">
          <p className="font-semibold mb-2">Looking for:</p>
          <ul className="space-y-1">
            <li>• Patagonia vest/fleece (50 pts)</li>
            <li>• Quarter-zip sweater (40 pts)</li>
            <li>• Luxury watch (100 pts)</li>
            <li>• AirPods (45 pts)</li>
            <li>• Allbirds shoes (30 pts)</li>
            <li>• Business casual attire (25 pts)</li>
            <li>• MacBook Pro (20 pts)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CameraScanner