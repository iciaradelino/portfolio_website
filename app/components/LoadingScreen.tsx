"use client";

import React from 'react';

const LoadingScreen = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFF', // Or your desired background color
      zIndex: 9999,
    }}>
      <svg 
        width="200" 
        height="100" 
        viewBox="0 0 200 100" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <clipPath id="wave-clip-path">
            <rect x="0" y="0" width="200" height="100" />
          </clipPath>
        </defs>
        <path 
          clipPath="url(#wave-clip-path)"
          d="M 0 50 Q 25 25, 50 50 T 100 50 T 150 50 T 200 50 T 250 50 T 300 50" // Path is 3 cycles long (each cycle 100 units)
          stroke="#D81159" // Your primary color
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        >
          <animateTransform 
            attributeName="transform"
            type="translate"
            values="0 0; -100 0" // Move one cycle (100 units) to the left
            dur="1.5s" // Duration for one cycle to pass
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
};

export default LoadingScreen; 