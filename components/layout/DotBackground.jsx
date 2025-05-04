'use client';

import React from 'react';

export default function DotBackground({ children }) {
  return (
    <div className="relative min-h-screen w-full bg-white">
      {/* Dot pattern background - higher z-index to ensure visibility */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: `
            radial-gradient(circle, #000000 2px, transparent 2px), 
            radial-gradient(circle, #000000 2px, transparent 2px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
          opacity: 0.15
        }}
      />
      
    
      
      {/* Content container - ensure it's above the background */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}