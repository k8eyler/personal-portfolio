"use client";
import { useState, useEffect } from 'react';
import CrosswordStatsAlt from '@/components/charts/CrosswordStatsAlt';

export default function Home() {
  console.log('Home component starting to render');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        const response = await fetch('/api/crossword-stats');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        console.log('Received data:', jsonData); // Debug log
        setData(jsonData);
      } catch (err) {
        console.error('Error fetching data:', err); // Debug log
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    console.log('Loading state...'); // Debug log
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    console.log('Error state:', error); // Debug log
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  console.log('Rendering with data:', data); // Debug log
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h2>Loading state: {loading.toString()}</h2>
        <h2>Error state: {error?.toString()}</h2>
        <h2>Data exists: {Boolean(data).toString()}</h2>
        {data && <CrosswordStatsAlt data={data} />}
      </div>
    </main>
  );
}