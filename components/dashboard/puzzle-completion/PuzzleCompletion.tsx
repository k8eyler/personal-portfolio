import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import {
  PuzzleCompletionData,
  PuzzleCompletionProps,
  ProcessedPuzzleData,
  ProcessedChildData
} from './types';

const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const OUTER_COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE', '#EFF6FF'];
const INNER_COLORS = {
  Gold: '#FCD34D',
  Regular: '#93C5FD'
};

const PuzzleCompletion: React.FC<PuzzleCompletionProps> = ({ data, className = '' }) => {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  
  const years = useMemo(() => {
    const uniqueYears = [...new Set(data.map(item => item.year))].sort();
    return ['all', ...uniqueYears.map(year => year.toString())];
  }, [data]);

  const processedData = useMemo(() => {
    const filteredData = selectedYear === 'all' 
      ? data 
      : data.filter(item => item.year === parseInt(selectedYear));

    // Group by day of week
    const dayGroups = DAYS_ORDER.map(day => {
      const dayData = filteredData.filter(item => item.day_of_week_name === day);
      const total = dayData.reduce((sum, item) => sum + item.count, 0);
      
      // Calculate inner rings (Gold vs Regular)
      const children = ['Gold', 'Regular'].map(type => ({
        name: `${day} - ${type}`,
        value: dayData.filter(item => item.completion_type === type)
          .reduce((sum, item) => sum + item.count, 0),
        type
      })).filter(item => item.value > 0);

      return {
        name: day,
        value: total,
        children
      };
    }).filter(item => item.value > 0);

    return dayGroups;
  }, [data, selectedYear]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-gray-600">{`Count: ${data.value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Puzzles Completed by Day</h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year === 'all' ? 'All Years' : year}
            </option>
          ))}
        </select>
      </div>

      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* Outer ring - Days of week */}
            <Pie
              data={processedData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              innerRadius={100}
              paddingAngle={2}
              label={({ name, value }) => `${name}: ${value}`}
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={OUTER_COLORS[index % OUTER_COLORS.length]} />
              ))}
            </Pie>
            
            {/* Inner ring - Gold vs Regular */}
            <Pie
              data={processedData.flatMap(item => item.children)}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={1}
            >
              {processedData.flatMap(item => item.children).map((entry, index) => (
                <Cell 
                  key={`inner-cell-${index}`} 
                  fill={INNER_COLORS[entry.type as keyof typeof INNER_COLORS]} 
                />
              ))}
            </Pie>
            
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PuzzleCompletion;