"use client";
import { useState, useEffect } from 'react';
import CrosswordStats from '@/components/charts/CrosswordStats';
import CrosswordStatsAlt from '@/components/charts/CrosswordStatsAlt';

export default function Home() {
  const [activeView, setActiveView] = useState('default');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/crossword-stats');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

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
        
        {data && (
          activeView === 'default' ? (
            <CrosswordStats data={data} />
          ) : (
            <CrosswordStatsAlt data={data} />
          )
        )}
      </div>
    </main>
  );
}