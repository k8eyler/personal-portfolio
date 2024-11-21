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
    // Validate data on component mount
    if (!Array.isArray(data)) {
      console.error('Data is not an array:', data);
      return;
    }

    // Log each data point for debugging
    data.forEach((item, index) => {
      console.log(`Data point ${index}:`, {
        year: typeof item.year === 'number' ? item.year : 'invalid',
        completed: typeof item.completed === 'number' ? item.completed : 'invalid',
        started: typeof item.started === 'number' ? item.started : 'invalid',
        hours_spent: typeof item.hours_spent === 'number' ? item.hours_spent : 'invalid'
      });
    });
  }, [data]);

  // Early return if data is invalid
  if (!Array.isArray(data)) {
    return <div className="p-4 text-red-500">Error: Invalid data format</div>;
  }

  // Validate and transform data
  const validData = data.filter(item => (
    typeof item.year === 'number' &&
    typeof item.completed === 'number' &&
    typeof item.started === 'number' &&
    typeof item.hours_spent === 'number'
  ));

  if (validData.length === 0) {
    return <div className="p-4 text-red-500">Error: No valid data points found</div>;
  }

  return (
    <div className="space-y-4">
      <div className="h-96 w-full border border-gray-200 rounded-lg overflow-hidden bg-white">
        <ResponsiveContainer>
          <ComposedChart
            data={validData}
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
              height={60}
              tick={{ fill: '#4B5563' }}
            />
            <YAxis 
              yAxisId="puzzles"
              label={{ 
                value: 'Number of Puzzles', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: '#4B5563' }
              }}
              tick={{ fill: '#4B5563' }}
            />
            <YAxis 
              yAxisId="time" 
              orientation="right"
              label={{ 
                value: 'Hours Spent', 
                angle: 90, 
                position: 'insideRight',
                style: { fill: '#4B5563' }
              }}
              tick={{ fill: '#4B5563' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #E5E7EB',
                borderRadius: '6px'
              }}
            />
            <Legend />
            <Bar
              yAxisId="puzzles"
              dataKey="completed"
              name="Completed Puzzles"
              fill="#2563EB"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="puzzles"
              dataKey="started"
              name="Started Puzzles"
              fill="#93C5FD"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="time"
              dataKey="hours_spent"
              name="Hours Spent"
              fill="#7C3AED"
              radius={[4, 4, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CrosswordStatsAlt;