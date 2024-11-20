// app/page.tsx
"use client";
import { useState } from 'react';
import CrosswordStats from '@/components/charts/CrosswordStats';
import CrosswordStatsAlt from '@/components/charts/CrosswordStatsAlt';

export default function Home() {
  const [activeView, setActiveView] = useState('default');

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setActiveView('default')}
              className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${
                activeView === 'default'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-900'
              }`}
            >
              View 1
            </button>
            <button
              type="button"
              onClick={() => setActiveView('alternate')}
              className={`px-4 py-2 text-sm font-medium border rounded-r-lg ${
                activeView === 'alternate'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-900'
              }`}
            >
              View 2
            </button>
          </div>
        </div>
        
        {activeView === 'default' ? <CrosswordStats /> : <CrosswordStatsAlt />}
      </div>
    </main>
  );
}