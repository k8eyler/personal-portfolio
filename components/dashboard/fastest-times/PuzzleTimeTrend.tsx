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
  star?: string;
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
    // Split the date string into parts
    const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));
    
    // Create date parts object
    const dateParts = {
      year,
      month: month - 1,  // JavaScript months are 0-based
      day
    };
    
    // Format using Intl.DateTimeFormat to avoid timezone issues
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'  // Force UTC to prevent date shifting
    }).format(new Date(Date.UTC(dateParts.year, dateParts.month, dateParts.day)));
  };

  // Calculate median of an array of numbers
  const calculateMedian = (numbers: number[]): number => {
    const sorted = numbers.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const puzzleData = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium text-gray-900">{`Date: ${label}`}</p>
          <p className="text-gray-600">{`Time: ${formatTime(puzzleData.solving_seconds)}`}</p>
          {puzzleData.star === 'Gold' && (
            <p className="text-amber-500">★ Gold Star</p>
          )}
          <p className="text-emerald-600">{`Average: ${formatTime(puzzleData.averageSeconds)}`}</p>
          <p className="text-purple-600">{`Median: ${formatTime(puzzleData.medianSeconds)}`}</p>
        </div>
      );
    }
    return null;
  };

  // Sort data by date and calculate running average and median
  const chartData = data
    .sort((a, b) => {
      // Parse dates for comparison without timezone issues
      const [aYear, aMonth, aDay] = a.print_date.split('-').map(num => parseInt(num, 10));
      const [bYear, bMonth, bDay] = b.print_date.split('-').map(num => parseInt(num, 10));
      
      // Compare year, then month, then day
      if (aYear !== bYear) return aYear - bYear;
      if (aMonth !== bMonth) return aMonth - bMonth;
      return aDay - bDay;
    })
    .map((puzzle, index, array) => {
      // Get all puzzles up to this point
      const previousPuzzles = array.slice(0, index + 1);
      
      // Calculate running average
      const averageSeconds = previousPuzzles.reduce((sum, p) => sum + p.solving_seconds, 0) / previousPuzzles.length;
      
      // Calculate running median
      const medianSeconds = calculateMedian(previousPuzzles.map(p => p.solving_seconds));

      return {
        ...puzzle,
        formattedDate: formatDate(puzzle.print_date),
        averageSeconds: Math.round(averageSeconds),
        medianSeconds: Math.round(medianSeconds)
      };
    });

  // Custom bar component to handle gold star coloring
  const CustomBar = (props: any) => {
    const { fill, x, y, width, height, payload } = props;
    const isGoldStar = payload.star === 'Gold';
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={isGoldStar ? '#FCD34D' : '#93c5fd'}
      />
    );
  };

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
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="solving_seconds"
                name="Completion Time"
                shape={<CustomBar />}
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
              <Line
                type="monotone"
                dataKey="medianSeconds"
                name="Running Median"
                stroke="#8b5cf6"
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