"use client";

import React from 'react';
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

interface CrosswordStatsProps {
  data: any[];
}

const CrosswordStats: React.FC<CrosswordStatsProps> = ({ data }) => {
  if (!data) return <div>Loading...</div>;

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
            fill="#1E40AF"
          />
          <Bar
            yAxisId="left"
            dataKey="started"
            name="Started But Not Finished"
            stackId="a"
            fill="#06B6D4"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="hours_spent"
            name="Hours Spent"
            stroke="#EC4899"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CrosswordStats;