import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface PuzzleTime {
  puzzle_id: number;
  print_date: string;
  solving_seconds: number;
  title?: string;
}

interface PuzzleTimeTrendProps {
  data: PuzzleTime[];
  dayName: string;
  onClose: () => void;
}

const PuzzleTimeTrend: React.FC<PuzzleTimeTrendProps> = ({ data, dayName, onClose }) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Sort data by date and calculate running average
  const chartData = data
    .sort((a, b) => new Date(a.print_date).getTime() - new Date(b.print_date).getTime())
    .map((puzzle, index, array) => {
      // Calculate running average up to this point
      const previousPuzzles = array.slice(0, index + 1);
      const averageSeconds = previousPuzzles.reduce((sum, p) => sum + p.solving_seconds, 0) / previousPuzzles.length;

      return {
        ...puzzle,
        formattedDate: formatDate(puzzle.print_date),
        averageSeconds: Math.round(averageSeconds)
      };
    });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">
            {dayName} Puzzle Completion Times
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4 h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="formattedDate"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={formatTime}
                label={{
                  value: 'Completion Time (mm:ss)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip
                formatter={(value: number) => [formatTime(value), 'Time']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Bar
                dataKey="solving_seconds"
                name="Completion Time"
                fill="#93c5fd"
                maxBarSize={50}
              />
              <Line
                type="monotone"
                dataKey="averageSeconds"
                name="Running Average"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={false}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PuzzleTimeTrend;