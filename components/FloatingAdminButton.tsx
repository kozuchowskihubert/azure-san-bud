'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FloatingAdminButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href="/admin/login"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-40 group"
      title="Panel Administracyjny"
    >
      <div className="relative">
        {/* Tooltip */}
        <div className={`absolute bottom-full right-0 mb-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}>
          <div className="bg-gray-900 text-white text-sm font-medium px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
            Panel Administracyjny
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>

        {/* Button */}
        <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer border-2 border-gray-700 hover:border-gray-600">
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
        </div>

        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full bg-gray-800 animate-ping opacity-20"></div>
      </div>
    </Link>
  );
}
