import React, { useEffect } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Define the type for crossword data
type CrosswordData = {
  year: number;
  started: number; // solved = false & percent_filled > 0
  completed: number; // solved = true & star != 'Gold'
  goldStar: number; // solved = true & star = 'Gold'
  hours_spent: number; // Total hours spent
};

// Props for the component
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

    // Log data points for debugging
    data.forEach((item, index) => {
      console.log(`Data point ${index}:`, {
        year: typeof item.year === 'number' ? item.year : 'invalid',
        started: typeof item.started === 'number' ? item.started : 'invalid',
        completed: typeof item.completed === 'number' ? item.completed : 'invalid',
        goldStar: typeof item.goldStar === 'number' ? item.goldStar : 'invalid',
        hours_spent: typeof item.hours_spent === 'number' ? item.hours_spent : 'invalid',
      });
    });
  }, [data]);

  // Validate and transform data
  const validData = Array.isArray(data)
    ? data
        .map((item) => ({
          year: Number(item.year),
          started: Number(item.started),
          completed: Number(item.completed),
          goldStar: Number(item.goldStar),
          hours_spent: Number(item.hours_spent),
        }))
        .filter(
          (item) =>
            !isNaN(item.year) &&
            !isNaN(item.started) &&
            !isNaN(item.completed) &&
            !isNaN(item.goldStar) &&
            !isNaN(item.hours_spent)
        )
    : [];

  // Handle invalid data scenarios
  if (validData.length === 0) {
    return (
      <div className="p-4 text-red-500">
        Error: No valid data points found. Please check the input data format.
      </div>
    );
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
              label={{
                value: 'Year',
                position: 'insideBottom',
                style: { fill: '#4B5563' },
              }}
            />
            <YAxis
              yAxisId="puzzles"
              label={{
                value: 'Number of Puzzles',
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#4B5563' },
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
                style: { fill: '#4B5563' },
              }}
              tick={{ fill: '#4B5563' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
              }}
            />
            <Legend />
            <Bar
              yAxisId="puzzles"
              dataKey="started"
              name="Started Puzzles"
              fill="#93C5FD"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="puzzles"
              dataKey="completed"
              name="Completed Puzzles"
              fill="#2563EB"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="puzzles"
              dataKey="goldStar"
              name="Gold Star Puzzles"
              fill="#FCD34D"
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
