"use client";

import { useState, useEffect } from "react";
import CrosswordStatsAlt from "@/components/dashboard/crossword-stats/CrosswordStatsAlt";
import FastestTimes from "@/components/dashboard/fastest-times/FastestTimes";

interface CrosswordData {
  year: number;
  completed: number;
  started: number;
  hours_spent: number;
  goldStar: number;
}

export default function Home() {
  const [statsData, setStatsData] = useState<CrosswordData[] | null>(null);
  const [fastestData, setFastestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both datasets in parallel
        const [statsResponse, fastestResponse] = await Promise.all([
          fetch("/api/crossword-stats"),
          fetch("/api/fastest-times")
        ]);

        if (!statsResponse.ok || !fastestResponse.ok) {
          throw new Error(`HTTP error! status: ${statsResponse.status} ${fastestResponse.status}`);
        }

        const [statsJson, fastestJson] = await Promise.all([
          statsResponse.json(),
          fastestResponse.json()
        ]);

        // Transform stats data
        const transformedStats = statsJson
          .map((item: any) => ({
            year: Number(item.year),
            completed: Number(item.completed),
            started: Number(item.started),
            hours_spent: Number(item.hours_spent),
            goldStar: Number(item.goldStar),
          }))
          .filter((item: CrosswordData | null): item is CrosswordData => {
            return !Object.values(item).some(isNaN);
          });

        if (transformedStats.length === 0) {
          throw new Error("No valid statistics data found");
        }

        setStatsData(transformedStats);
        setFastestData(fastestJson);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (!statsData || !fastestData) {
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

        {/* Fastest Times Component */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <FastestTimes data={fastestData} />
        </div>

        {/* Chart component */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <CrosswordStatsAlt data={statsData} />
        </div>
      </div>
    </main>
  );
}