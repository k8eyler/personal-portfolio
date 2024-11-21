"use client";
import { useState, useEffect } from 'react';
import CrosswordStatsAlt from '@/components/charts/CrosswordStatsAlt';

export const dynamic = 'force-dynamic';

// Define types for your data and state
type CrosswordData = {
  year: number;
  completed: number;
  started: number;
  hours_spent: number;
}

export default function Home() {
  console.log('Home component starting to render');

  const [data, setData] = useState<CrosswordData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        const response = await fetch('/api/crossword-stats');
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        const jsonData = await response.json();
        console.log('Received data:', jsonData);
        
        // Validate data structure
        if (!Array.isArray(jsonData)) {
          throw new Error('Invalid data format: expected an array');
        }
        
        // Validate data properties
        for (const item of jsonData) {
          if (typeof item.year !== 'number' || 
              typeof item.completed !== 'number' || 
              typeof item.started !== 'number' || 
              typeof item.hours_spent !== 'number') {
            throw new Error('Invalid data structure: missing or invalid properties');
          }
        }

        setData(jsonData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    console.log('Loading state...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    console.log('Error state:', error);
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
          Error: {error}
        </div>
      </div>
    );
  }

  console.log('Rendering with data:', data);
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 space-y-2 text-sm text-gray-600">
          <h2>Loading state: {loading.toString()}</h2>
          <h2>Error state: {error?.toString()}</h2>
          <h2>Data exists: {Boolean(data).toString()}</h2>
        </div>
        
        {data && <CrosswordStatsAlt data={data} />}
      </div>
    </main>
  );
}