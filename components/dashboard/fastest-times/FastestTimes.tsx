import React, { useMemo, useState } from 'react';
import Card from '../shared/Card';
import PuzzleTimeTrend from './PuzzleTimeTrend';
import { FastestTimesProps, FastestPuzzle } from './types';

const dayColors = {
  'Monday': '#fc716b',    // Amber
  'Tuesday': '#fb9b00',   // Orange
  'Wednesday': '#fbd300', // Reddish-Pink
  'Thursday': '#b5e352',  // Purple
  'Friday': '#b2ded8',    // Indigo
  'Saturday': '#6493e6',  // Dark Blue
  'Sunday': '#b4a8ff'     // Navy
};

const DayCard = ({ 
  dayOfWeek, 
  date, 
  seconds,
  dayIndex,
  onDayClick 
}: FastestPuzzle & { 
  dayIndex: number;
  onDayClick: (day: number, dayName: string) => void;
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
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

  const bgColor = dayColors[dayOfWeek as keyof typeof dayColors];

  return (
    <Card 
      className="flex flex-col items-center justify-center text-center p-6 cursor-pointer transition-colors"
      style={{ backgroundColor: bgColor }}
      onClick={() => onDayClick(dayIndex, dayOfWeek)}
    >
      <h3 className="text-white text-lg mb-2">{dayOfWeek}</h3>
      <p className="text-4xl font-light text-white mb-4">{formatTime(seconds)}</p>
      <p className="text-white/80">{formatDate(date)}</p>
    </Card>
  );
};

const FastestTimes: React.FC<FastestTimesProps> = ({ data, className = '' }) => {
  const [selectedDay, setSelectedDay] = useState<{ index: number; name: string } | null>(null);
  const [trendData, setTrendData] = useState<any[] | null>(null);

  const fastestPuzzles = useMemo(() => {
    const fastest: { [key: number]: FastestPuzzle & { dayIndex: number } } = {};
    
    data.forEach((puzzle) => {
      const currentFastest = fastest[puzzle.day_of_week_integer];
      
      if (!currentFastest || puzzle.solving_seconds < currentFastest.seconds) {
        fastest[puzzle.day_of_week_integer] = {
          dayOfWeek: puzzle.day_of_week_name,
          date: puzzle.print_date,
          seconds: puzzle.solving_seconds,
          dayIndex: puzzle.day_of_week_integer,
          gold_star: puzzle.gold_star
        };
      }
    });

    return Object.values(fastest).sort((a, b) => {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const getDayIndex = (day: string): number => days.indexOf(day);
      return getDayIndex(a.dayOfWeek) - getDayIndex(b.dayOfWeek);
    });
  }, [data]);

  const handleDayClick = async (dayIndex: number, dayName: string) => {
    try {
      const response = await fetch(`/api/puzzle-times/${dayIndex}`);
      if (!response.ok) throw new Error('Failed to fetch puzzle times');
      const data = await response.json();
      setTrendData(data);
      setSelectedDay({ index: dayIndex, name: dayName });
    } catch (error) {
      console.error('Error fetching puzzle times:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-800">Fastest Times by Day</h2>
      <p className="text-gray-600 mb-4 -mt-1">Explore mean and median completion times within each day tile</p>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {fastestPuzzles.map((puzzle) => (
          <DayCard 
            key={puzzle.dayOfWeek} 
            {...puzzle} 
            onDayClick={handleDayClick}
          />
        ))}
      </div>

      {selectedDay && trendData && (
        <PuzzleTimeTrend
          data={trendData}
          dayName={selectedDay.name}
          onClose={() => {
            setSelectedDay(null);
            setTrendData(null);
          }}
        />
      )}
    </div>
  );
};

export default FastestTimes;