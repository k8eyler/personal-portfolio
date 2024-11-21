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

const CrosswordStatsAlt = ({ data }) => {
  console.log('CrosswordStatsAlt rendering with data:', data);

  // Add basic validation
  if (!Array.isArray(data)) {
    console.error('Data is not an array:', data);
    return <div>Error: Invalid data format</div>;
  }

  return (
    <div className="space-y-4">
      <div className="h-96 w-full border border-gray-200">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year" 
              height={60}
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
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="puzzles"
              dataKey="completed"
              name="Completed Puzzles"
              fill="#2563EB"
            />
            <Bar
              yAxisId="puzzles"
              dataKey="started"
              name="Started Puzzles"
              fill="#93C5FD"
            />
            <Bar
              yAxisId="time"
              dataKey="hours_spent"
              name="Hours Spent"
              fill="#7C3AED"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CrosswordStatsAlt;