// components/charts/CrosswordStats.tsx
"use client";  // Add this line at the very top

import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const CrosswordStats = () => {
  const [data, setData] = useState([]);
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
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full h-96 p-4">
      <ResponsiveContainer>
        <ComposedChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
          <XAxis 
            dataKey="year" 
            scale="auto"
            padding={{ left: 10, right: 10 }}
          />
          <YAxis 
            yAxisId="left"
            label={{ value: 'Number of Puzzles', angle: -90, position: 'insideLeft' }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            label={{ value: 'Hours Spent', angle: 90, position: 'insideRight' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #ccc'
            }}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="completed"
            name="Completed Puzzles"
            stackId="a"
            fill="#1E40AF"  // Dark blue
          />
          <Bar
            yAxisId="left"
            dataKey="started"
            name="Started But Not Finished"
            stackId="a"
            fill="#06B6D4"  // Lighter blue
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="hours_spent"
            name="Hours Spent"
            stroke="#EC4899"  // Pink
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CrosswordStats;