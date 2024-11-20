"use client";

import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const CrosswordStatsAlt = () => {
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

  // Custom tooltip to show all values clearly
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Helper function to safely format numbers
      const formatValue = (value) => {
        if (value === null || value === undefined) return '0.0';
        return typeof value === 'number' ? value.toFixed(1) : '0.0';
      };
  
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
          <p className="font-bold text-gray-700 mb-2">{`Year: ${label}`}</p>
          <div className="space-y-1">
            <p className="font-semibold text-blue-700">Puzzles:</p>
            <p style={{ color: payload[0]?.color }}>
              {`Completed: ${payload[0]?.value || 0}`}
            </p>
            <p style={{ color: payload[1]?.color }}>
              {`Started: ${payload[1]?.value || 0}`}
            </p>
            <p className="font-semibold text-purple-700 mt-2">Time Spent (hours):</p>
            <p style={{ color: payload[2]?.color }}>
              {`Completed: ${formatValue(payload[2]?.value)}`}
            </p>
            <p style={{ color: payload[3]?.color }}>
              {`In Progress: ${formatValue(payload[3]?.value)}`}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

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
          <XAxis dataKey="year" />
          <YAxis 
            yAxisId="puzzles"
            label={{ 
              value: 'Number of Puzzles', 
              angle: -90, 
              position: 'insideLeft' 
            }}
          />
          <YAxis 
            yAxisId="time" 
            orientation="right"
            label={{ 
              value: 'Hours Spent', 
              angle: 90, 
              position: 'insideRight' 
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {/* Puzzle count bars */}
          <Bar
            yAxisId="puzzles"
            dataKey="completed"
            name="Completed Puzzles"
            stackId="puzzles"
            fill="#2563EB"  // Dark blue
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="puzzles"
            dataKey="started"
            name="Started Puzzles"
            stackId="puzzles"
            fill="#93C5FD"  // Light blue
            radius={[4, 4, 0, 0]}
          />
          {/* Time spent bars */}
          <Bar
            yAxisId="time"
            dataKey="completed_hours"
            name="Time on Completed"
            stackId="time"
            fill="#7C3AED"  // Dark purple
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="time"
            dataKey="started_hours"
            name="Time on Started"
            stackId="time"
            fill="#C4B5FD"  // Light purple
            radius={[4, 4, 0, 0]}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CrosswordStatsAlt;