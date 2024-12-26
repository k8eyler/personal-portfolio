import React, { useMemo } from 'react';
import Card from '../shared/Card';

interface CompletionData {
  year: number;
  day_of_week_name: string;
  day_of_week_integer: number;
  completion_type: 'Gold' | 'Regular';
  count: number;
}

interface CompletionStatsProps {
  data: CompletionData[];
  className?: string;
}

const StatCard = ({ 
  label, 
  value,
  subValue,
}: { 
  label: string;
  value: number;
  subValue?: { gold: number; regular: number };
}) => {
  return (
    <Card 
      className="flex flex-col items-center justify-center text-center p-6 transition-colors"
    >
      <div className="flex flex-col items-center justify-center h-[200px] w-full relative">
        <span className="text-5xl font-light text-gray-700 mb-4">
          {value.toLocaleString()}
        </span>
        <span className="text-2xl text-gray-500">
          {label}
        </span>
        {subValue && (
          <div className="flex flex-col items-center mt-2 space-y-1">
            <span className="text-sm text-amber-500">
              ★ {subValue.gold.toLocaleString()}
            </span>
            <span className="text-sm text-blue-400">
              ○ {subValue.regular.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

const YearToDate: React.FC<CompletionStatsProps> = ({ data, className = '' }) => {
  const stats = useMemo(() => {
    const currentYear = new Date().getFullYear();
    
    // Transform and validate data
    const validatedData = data
      .map(item => ({
        ...item,
        year: Number(item.year),
        count: parseInt(item.count.toString(), 10)
      }))
      .filter(item => 
        !isNaN(item.year) && 
        !isNaN(item.count) && 
        Number.isFinite(item.count)
      );

    // Get YTD data
    const ytdData = validatedData.filter(item => item.year === currentYear);
    
    const ytdTotal = ytdData.reduce((acc, curr) => acc + curr.count, 0);
    const ytdGold = ytdData
      .filter(item => item.completion_type === 'Gold')
      .reduce((acc, curr) => acc + curr.count, 0);
    const ytdRegular = ytdData
      .filter(item => item.completion_type === 'Regular')
      .reduce((acc, curr) => acc + curr.count, 0);

    const allTimeTotal = validatedData.reduce((acc, curr) => acc + curr.count, 0);
    const allTimeGold = validatedData
      .filter(item => item.completion_type === 'Gold')
      .reduce((acc, curr) => acc + curr.count, 0);
    const allTimeRegular = validatedData
      .filter(item => item.completion_type === 'Regular')
      .reduce((acc, curr) => acc + curr.count, 0);

    console.log('YTD Data:', {
      validatedData: validatedData.slice(0, 3),
      currentYear,
      ytdTotal,
      ytdGold,
      ytdRegular,
      allTimeTotal,
      allTimeGold,
      allTimeRegular
    });

    return {
      ytdTotal,
      allTimeTotal,
      ytdGold,
      ytdRegular,
      allTimeGold,
      allTimeRegular
    };
  }, [data]);

  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Puzzles Completed</h2>
      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          label={new Date().getFullYear().toString()} 
          value={stats.ytdTotal}
          subValue={{ gold: stats.ytdGold, regular: stats.ytdRegular }}
        />
        <StatCard 
          label="All Time" 
          value={stats.allTimeTotal}
          subValue={{ gold: stats.allTimeGold, regular: stats.allTimeRegular }}
        />
      </div>
    </div>
  );
};

export default YearToDate;