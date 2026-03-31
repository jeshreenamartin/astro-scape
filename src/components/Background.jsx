import React, { useMemo } from 'react';

const Background = ({ speed }) => {
  // Generate random stars once
  const stars = useMemo(() => {
    const s = [];
    for (let i = 0; i < 50; i++) {
      s.push({
        id: i,
        x: Math.random() * 100, // percentage
        y: Math.random() * 100, // percentage
        size: Math.random() * 2 + 1, // 1 to 3px
        opacity: Math.random() * 0.5 + 0.3
      });
    }
    return s;
  }, []);

  return (
    <>
      {/* Stars layer */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        {stars.map(star => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity
            }}
          />
        ))}
      </div>
      
      {/* Moving Ground layer */}
      <div 
        className="ground-layer" 
        style={{
          // Use CSS animation to loop the background instead of passing speed 60fps via react props
          // We can adjust animation duration based on speed
          animation: `slideLeft ${5 / speed}s linear infinite`
        }} 
      />
      <style>
        {`
          @keyframes slideLeft {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}
      </style>
    </>
  );
};

export default Background;
