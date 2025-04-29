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

type CrosswordData = {
  year: number;
  started: number;
  completed: number;
  goldStar: number;
  hours_spent: number;
  completionPercentage?: number;
};

interface CrosswordStatsProps {
  data: CrosswordData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
        <p className="font-medium text-gray-900">{`Year: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
            {entry.name === "Hours Spent" ? " hours" : ""}
          </p>
        ))}
        {payload[0]?.payload?.completionPercentage && (
          <p className="mt-2 text-gray-600 border-t border-gray-200 pt-2">
            Yearly Completion: {payload[0].payload.completionPercentage.toFixed(1)}%
          </p>
        )}
      </div>
    );
  }
  return null;
};

const CrosswordStatsAlt: React.FC<CrosswordStatsProps> = ({ data }) => {
  useEffect(() => {
    if (!Array.isArray(data)) {
      console.error('Data is not an array:', data);
      return;
    }

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

  const validData = Array.isArray(data)
    ? data
        .map((item) => {
          const totalCompleted = Number(item.completed) + Number(item.goldStar);
          return {
            year: Number(item.year),
            started: Number(item.started),
            completed: Number(item.completed),
            goldStar: Number(item.goldStar),
            hours_spent: Number(item.hours_spent),
            completionPercentage: (totalCompleted / 365) * 100
          };
        })
        .filter(
          (item) =>
            !isNaN(item.year) &&
            !isNaN(item.started) &&
            !isNaN(item.completed) &&
            !isNaN(item.goldStar) &&
            !isNaN(item.hours_spent)
        )
    : [];

  if (validData.length === 0) {
    return (
      <div className="p-4 text-red-500">
        Error: No valid data points found. Please check the input data format.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Puzzles Completed by Year vs Hours Spent</h2>
      <p className="text-gray-600 mb-4 -mt-1">Hover for completion percentage and annual stats</p>
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
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              yAxisId="puzzles"
              dataKey="goldStar"
              name="Gold Star Puzzles"
              fill="#FCD34D"
              stackId="puzzles"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              yAxisId="puzzles"
              dataKey="completed"
              name="Completed Puzzles"
              fill="#2563EB"
              stackId="puzzles"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              yAxisId="puzzles"
              dataKey="started"
              name="Started Puzzles"
              fill="#93C5FD"
              stackId="puzzles"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              yAxisId="time"
              dataKey="hours_spent"
              name="Hours Spent"
              fill="#a8e142"
              radius={[2, 2, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CrosswordStatsAlt;