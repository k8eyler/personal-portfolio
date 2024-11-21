"use client";

import { useState, useEffect } from 'react';
import CrosswordStatsAlt from '@/components/charts/CrosswordStatsAlt';

interface CrosswordData {
  year: number;
  completed: number;
  started: number;
  hours_spent: number;
}

export default function Home() {
  const [data, setData] = useState<CrosswordData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Initiating data fetch...');
        setLoading(true);
        setError(null);

        const response = await fetch('/api/crossword-stats');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        console.log('Raw API response:', jsonData);

        // Validate that we received an array
        if (!Array.isArray(jsonData)) {
          throw new Error('Invalid data format: expected an array');
        }

        // Transform and validate each data point
        const transformedData = jsonData.map((item, index) => {
          // Ensure each field is a number
          const transformedItem = {
            year: Number(item.year),
            completed: Number(item.completed),
            started: Number(item.started),
            hours_spent: Number(item.hours_spent)
          };

          // Validate the transformed item
          if (
            isNaN(transformedItem.year) ||
            isNaN(transformedItem.completed) ||
            isNaN(transformedItem.started) ||
            isNaN(transformedItem.hours_spent)
          ) {
            console.error(`Invalid data at index ${index}:`, item);
            return null;
          }

          return transformedItem;
        }).filter((item): item is CrosswordData => item !== null);

        // Check if we have any valid data points
        if (transformedData.length === 0) {
          throw new Error('No valid data points found in the response');
        }

        console.log('Transformed data:', transformedData);
        setData(transformedData);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-12 rounded-full bg-blue-400"></div>
          <div className="space-y-4">
            <div className="h-4 w-36 bg-blue-400 rounded"></div>
            <div className="h-4 w-24 bg-blue-400 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <h5 className="font-medium">Error Loading Data</h5>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data) {
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <h5 className="font-medium">No Data Available</h5>
          <p className="text-sm">No crossword statistics are currently available.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Crossword Statistics</h1>
          <p className="text-gray-600">
            Yearly overview of crossword puzzle completion rates and time spent
          </p>
        </div>

        {/* Debug info (consider removing in production) */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-2 text-sm text-gray-600">
          <h2>Debug Information:</h2>
          <p>Data points: {data.length}</p>
          <p>Years covered: {data.map(d => d.year).join(', ')}</p>
        </div>

        {/* Chart component */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <CrosswordStatsAlt data={data} />
        </div>
      </div>
    </main>
  );
}