import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import _ from 'lodash';

interface DailyTrendData {
  print_date: string;
  day_of_week_name: string;
  solving_seconds: number;
}

interface DayTrendsProps {
  data: DailyTrendData[];
}

interface WeeklyDataPoint {
  weekStart: string;
  weekLabel: string;
  value: number | null;
}

interface DaySeriesMap {
  [key: string]: WeeklyDataPoint[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

const DayTrends: React.FC<DayTrendsProps> = ({ data }) => {
  // Initialize date range to cover all data
  const [startDate, setStartDate] = React.useState(() => {
    const dates = data.map(item => new Date(item.print_date));
    const earliest = new Date(Math.min(...dates.map(d => d.getTime())));
    return earliest.toISOString().split('T')[0];
  });
  
  const [endDate, setEndDate] = React.useState(() => {
    const dates = data.map(item => new Date(item.print_date));
    const latest = new Date(Math.max(...dates.map(d => d.getTime())));
    return latest.toISOString().split('T')[0];
  });

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const dayColors = {
    'Monday': '#fc716b',    // Amber
    'Tuesday': '#fb9b00',   // Orange
    'Wednesday': '#fbd300', // Reddish-Pink
    'Thursday': '#b5e352',  // Purple
    'Friday': '#b2ded8',    // Indigo
    'Saturday': '#6493e6',  // Dark Blue
    'Sunday': '#b4a8ff'     // Navy
  };

  const getWeekStart = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = date.getUTCDay();
    // Adjust for Monday start: Sunday (0) becomes 6, Monday (1) becomes 0, etc.
    const mondayAdjustedDay = day === 0 ? 6 : day - 1;
    const diff = date.getUTCDate() - mondayAdjustedDay;
    const weekStart = new Date(date.setUTCDate(diff));
    return weekStart.toISOString().split('T')[0];
  };

  const formatWeekLabel = (weekStart: string): string => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    
    const formatShortDate = (date: Date): string => {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear().toString().slice(2);
      return `${month}/${day}/${year}`;
    };

    return `${formatShortDate(start)} - ${formatShortDate(end)}`;
  };

  const groupedData = React.useMemo((): DaySeriesMap => {
    // Filter data based on selected date range
    const filteredData = data.filter(item => {
      const itemDate = item.print_date.split('T')[0];
      return itemDate >= startDate && itemDate <= endDate;
    });

    const sortedData = [...filteredData].sort((a, b) => 
      new Date(a.print_date).getTime() - new Date(b.print_date).getTime()
    );

    const weeklyGroups: Record<string, Record<string, number>> = {};
    
    sortedData.forEach(item => {
      const weekStart = getWeekStart(item.print_date);
      const day = item.day_of_week_name;
      
      if (!weeklyGroups[weekStart]) {
        weeklyGroups[weekStart] = {};
      }
      
      weeklyGroups[weekStart][day] = item.solving_seconds;
    });

    const allWeeks = Object.keys(weeklyGroups).sort();

    const daySeries: DaySeriesMap = {};
    Object.keys(dayColors).forEach(day => {
      daySeries[day] = allWeeks.map(weekStart => ({
        weekStart,
        weekLabel: formatWeekLabel(weekStart),
        value: weeklyGroups[weekStart]?.[day] ?? null
      }));
    });

    const rollingAverages: DaySeriesMap = {};
    Object.entries(daySeries).forEach(([day, weekData]) => {
      rollingAverages[day] = weekData.map((point, index) => {
        const lookbackStart = Math.max(0, index - 7); // Changed from 3 to 7 for 8-week average
        const window = weekData
          .slice(lookbackStart, index + 1)
          .map(p => p.value);
        
        const validValues = window.filter((v): v is number => v !== null);
        const avg = validValues.length >= 2 ? _.mean(validValues) : null;
        
        return {
          weekStart: point.weekStart,
          weekLabel: point.weekLabel,
          value: avg
        };
      });
    });

    return rollingAverages;
  }, [data, startDate, endDate]);

  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const weekLabel = groupedData[payload[0]?.name ?? '']?.find(p => p.weekStart === label)?.weekLabel;
      
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium text-gray-900">{weekLabel}</p>
          {payload.map((entry) => (
            entry.value && (
              <p
                key={entry.name}
                style={{ color: entry.color }}
              >
                {`${entry.name}: ${formatTime(entry.value)}`}
              </p>
            )
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Solve Time Trend (8-Week Rolling Average)
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
        </div>
      </div>

      <div className="relative w-full pb-[100%]">
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              margin={{ top: 10, right: 30, left: 40, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} stroke="#808080" />
              <XAxis
                dataKey="weekStart"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(2)}`;
                }}
                type="category"
                allowDuplicatedCategory={false}
              />
              <YAxis
                tickFormatter={formatTime}
                domain={[0, 100]}
                label={{
                  value: 'Solve Time (mm:ss)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {Object.entries(dayColors).map(([day, color]) => (
                <Line
                  key={day}
                  type="monotoneX"
                  data={groupedData[day]}
                  dataKey="value"
                  name={day}
                  stroke={color}
                  strokeWidth={1.5}
                  dot={false}
                  connectNulls={true}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DayTrends;