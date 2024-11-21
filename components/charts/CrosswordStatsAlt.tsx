"use client";

import React, { useState } from 'react';
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

// Main view tooltip
const MainTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
        <p className="font-bold text-gray-700 mb-2">{`Year: ${label}`}</p>
        <div className="space-y-1">
          <p className="font-semibold text-blue-700">Puzzles:</p>
          <p className="text-[#2563EB]">
            {`Completed: ${payload.find(p => p.dataKey === "completed")?.value || 0}`}
          </p>
          <p className="text-[#93C5FD]">
            {`Started: ${payload.find(p => p.dataKey === "started")?.value || 0}`}
          </p>
          <p className="font-semibold text-purple-700 mt-2">Time Spent (hours):</p>
          <p className="text-[#7C3AED]">
            {`Completed: ${Number(payload.find(p => p.dataKey === "completed_hours")?.value || 0).toFixed(1)}`}
          </p>
          <p className="text-[#C4B5FD]">
            {`In Progress: ${Number(payload.find(p => p.dataKey === "started_hours")?.value || 0).toFixed(1)}`}
          </p>
          <p className="text-xs text-gray-500 mt-2 italic">Click for daily breakdown</p>
        </div>
      </div>
    );
  }
  return null;
};

// Daily breakdown tooltip
const DailyTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
        <p className="font-bold text-gray-700 mb-2">{label.split('\n')[0]}</p>
        <div className="space-y-1">
          <p className="font-semibold text-blue-700">Puzzles:</p>
          <p className="text-[#2563EB]">
            {`Completed: ${payload.find(p => p.dataKey === "completed")?.value || 0}`}
          </p>
          <p className="text-[#93C5FD]">
            {`Started: ${payload.find(p => p.dataKey === "started")?.value || 0}`}
          </p>
          <p className="font-semibold text-purple-700 mt-2">Time Spent (hours):</p>
          <p className="text-[#7C3AED]">
            {`Completed: ${Number(payload.find(p => p.dataKey === "completed_hours")?.value || 0).toFixed(1)}`}
          </p>
          <p className="text-[#C4B5FD]">
            {`In Progress: ${Number(payload.find(p => p.dataKey === "started_hours")?.value || 0).toFixed(1)}`}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const DailyBreakdownChart = ({ data, year, onBack }) => {
  // Custom tick component for X-axis
  const CustomXAxisTick = ({ x, y, payload }) => {
    const [day, avgTime] = payload.value.split('\n');
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={5}
          textAnchor="middle"
          fill="#666"
          fontSize={14}
        >
          {day}
        </text>
        <text
          x={0}
          y={20}
          textAnchor="middle"
          fill="#666"
          fontSize={13}
        >
          {avgTime}
        </text>
      </g>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-bold text-gray-900">{year} Daily Breakdown</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Back to Years
        </button>
      </div>
      <div className="h-96">
        <ResponsiveContainer>
          <ComposedChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 65  // Increased to accommodate two lines of text
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
            <XAxis 
              dataKey="day_with_avg"
              height={60}
              tick={<CustomXAxisTick />}
              interval={0}
            />
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
            <Tooltip content={<DailyTooltip />} />
            <Legend />
            <Bar
              yAxisId="puzzles"
              dataKey="completed"
              name="Completed Puzzles"
              stackId="puzzles"
              fill="#2563EB"
            />
            <Bar
              yAxisId="puzzles"
              dataKey="started"
              name="Started Puzzles"
              stackId="puzzles"
              fill="#93C5FD"
            />
            <Bar
              yAxisId="time"
              dataKey="completed_hours"
              name="Time on Completed"
              stackId="time"
              fill="#7C3AED"
            />
            <Bar
              yAxisId="time"
              dataKey="started_hours"
              name="Time on Started"
              stackId="time"
              fill="#C4B5FD"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CrosswordStatsAlt = ({ data }) => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [dailyData, setDailyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBarClick = async (event) => {
    if (event && event.activePayload && event.activePayload[0]) {
      const year = event.activePayload[0].payload.year;
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/crossword-stats/daily/${year}`);
        if (!response.ok) throw new Error('Failed to fetch daily data');
        const dailyStats = await response.json();
        setDailyData(dailyStats);
        setSelectedYear(year);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!data) return <div>Loading...</div>;
  if (loading) return <div>Loading daily breakdown...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  if (selectedYear && dailyData) {
    return (
      <DailyBreakdownChart
        data={dailyData}
        year={selectedYear}
        onBack={() => {
          setSelectedYear(null);
          setDailyData(null);
        }}
      />
    );
  }

  return (
    <div className="h-96">
      <ResponsiveContainer>
        <ComposedChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          onClick={handleBarClick}
          style={{ cursor: 'pointer' }}
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
          <Tooltip content={<MainTooltip />} />
          <Legend />
          <Bar
            yAxisId="puzzles"
            dataKey="completed"
            name="Completed Puzzles"
            stackId="puzzles"
            fill="#2563EB"
          />
          <Bar
            yAxisId="puzzles"
            dataKey="started"
            name="Started Puzzles"
            stackId="puzzles"
            fill="#93C5FD"
          />
          <Bar
            yAxisId="time"
            dataKey="completed_hours"
            name="Time on Completed"
            stackId="time"
            fill="#7C3AED"
          />
          <Bar
            yAxisId="time"
            dataKey="started_hours"
            name="Time on Started"
            stackId="time"
            fill="#C4B5FD"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CrosswordStatsAlt;