'use client';

import { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-0 right-0 mb-2 z-50 pointer-events-none">
          <div className="max-w-sm mx-auto px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg">
            <div className="whitespace-pre-wrap leading-relaxed">
              {content}
            </div>
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  );
}