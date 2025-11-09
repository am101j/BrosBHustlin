import React, { useEffect, useState } from 'react';

const RandomDollarSigns = () => {
  const [dollarSigns, setDollarSigns] = useState([]);

  useEffect(() => {
    const createDollarSign = () => {
      const id = Math.random().toString(36).substr(2, 9);
      const left = Math.random() * 100; // Random horizontal position
      const delay = Math.random() * 2; // Random delay
      const duration = 8 + Math.random() * 7; // Random duration between 8-15s
      const size = 20 + Math.random() * 40; // Random size between 20-60px
      const rotation = Math.random() * 360; // Random starting rotation
      const opacity = 0.3 + Math.random() * 0.5; // Random opacity between 0.3-0.8
      
      // Random color variations
      const colors = [
        'text-amber-400',
        'text-amber-500',
        'text-cyan-400',
        'text-amber-300',
        'text-yellow-400',
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];

      return {
        id,
        left,
        delay,
        duration,
        size,
        rotation,
        opacity,
        color,
      };
    };

    // Create initial dollar signs
    const initialSigns = Array.from({ length: 15 }, createDollarSign);
    setDollarSigns(initialSigns);

    // Spawn new dollar signs randomly
    const spawnInterval = setInterval(() => {
      setDollarSigns(prev => {
        // Keep max 25 signs on screen for performance
        if (prev.length < 25) {
          const newSign = createDollarSign();
          return [...prev, newSign];
        }
        // Remove oldest signs if we have too many
        return prev.slice(-24);
      });
    }, 800 + Math.random() * 1200); // Spawn every 0.8-2 seconds

    return () => clearInterval(spawnInterval);
  }, []);

  return (
    <>
      {dollarSigns.map((sign) => (
        <div
          key={sign.id}
          className={`absolute ${sign.color} font-black dollar-sign-random pointer-events-none select-none`}
          style={{
            left: `${sign.left}%`,
            top: '-50px',
            fontSize: `${sign.size}px`,
            opacity: sign.opacity,
            animationDelay: `${sign.delay}s`,
            animationDuration: `${sign.duration}s`,
            transform: `rotate(${sign.rotation}deg)`,
            filter: `drop-shadow(0 0 ${sign.size / 4}px currentColor)`,
            textShadow: `
              0 0 ${sign.size / 2}px currentColor,
              0 0 ${sign.size}px currentColor,
              0 0 ${sign.size * 1.5}px rgba(245, 158, 11, 0.3)
            `,
          }}
        >
          $
        </div>
      ))}
    </>
  );
};

export default RandomDollarSigns;

