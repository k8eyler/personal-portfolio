"use client";

import React, { useEffect } from 'react';
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

type CrosswordData = {
  year: number;
  completed: number;
  started: number;
  hours_spent: number;
}

interface CrosswordStatsProps {
  data: CrosswordData[];
}

const CrosswordStatsAlt: React.FC<CrosswordStatsProps> = ({ data }) => {
  useEffect(() => {
    console.log('CrosswordStatsAlt mounted');
    console.log('Data structure:', {
      isArray: Array.isArray(data),
      length: data?.length,
      firstItem: data?.[0],
      keys: data?.[0] ? Object.keys(data[0]) : 'no data'
    });
  }, [data]);

  if (!Array.isArray(data)) {
    console.error('Data is not an array:', data);
    return <div>Error: Invalid data format</div>;
  }

  console.log('Rendering chart with dimensions:', {
    containerClass: 'h-96 w-full',
    dataPoints: data?.length,
    dataExample: data?.[0]
  });

  return (
    <div className="space-y-4">
      <div 
        className="h-96 w-full border border-gray-200 relative"
        ref={(el) => {
          if (el) {
            console.log('Chart container dimensions:', {
              width: el.clientWidth,
              height: el.clientHeight
            });
          }
        }}
      >
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
            <XAxis dataKey="year" height={60} />
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