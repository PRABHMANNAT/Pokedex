import React from "react";

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="stars">
          {[...Array(20)].map((_, i) => (
            <div 
              key={`star-${i}`} 
              className="star"
              style={{
                '--fall-delay': `${i * 0.5}s`,
                '--top-offset': `${Math.random() * 100}vh`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 animate-gradient" />
    </div>
  );
};