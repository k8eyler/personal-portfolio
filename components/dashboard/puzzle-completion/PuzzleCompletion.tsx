import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PuzzleCompletionData {
  year: number;
  day_of_week_name: string;
  count: number;
  completion_type: 'Gold' | 'Regular';
}

interface ProcessedData {
  name: string;
  value: number;
  children?: Array<{
    name: string;
    value: number;
    type: 'Gold' | 'Regular';
  }>;
}

interface PuzzleCompletionProps {
  data: PuzzleCompletionData[];
  className?: string;
}

const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const OUTER_COLORS = ['#fc716b', '#fb9b00', '#fbd300', '#b5e352', '#b2ded8', '#6493e6', '#b4a8ff'];
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

    // Process data for both rings
    return DAYS_ORDER.map(day => {
      const dayData = filteredData.filter(item => item.day_of_week_name === day);
      
      // Calculate total for outer ring
      const total = dayData.reduce((sum, item) => {
        return sum + Number(item.count);
      }, 0);
      
      if (total === 0) return null;

      // Calculate values for inner ring (Gold vs Regular)
      const children = ['Gold', 'Regular'].map(type => ({
        name: `${day} - ${type}`,
        value: dayData
          .filter(item => item.completion_type === type)
          .reduce((sum, item) => sum + Number(item.count), 0),
        type: type as 'Gold' | 'Regular'
      })).filter(item => item.value > 0);

      return {
        name: day,
        value: total,
        children
      };
    }).filter(Boolean) as ProcessedData[];
  }, [data, selectedYear]);

  const totalCompletions = useMemo(() => 
    processedData.reduce((sum, item) => sum + item.value, 0),
    [processedData]
  );

  const CustomTooltip = ({ active, payload }: { 
    active?: boolean; 
    payload?: Array<{ payload: any }> 
  }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    const isInnerRing = 'type' in data;
    const total = isInnerRing ? 
      processedData.find(d => d.name === data.name.split(' - ')[0])?.value || 0 :
      totalCompletions;
    const percentage = ((data.value / total) * 100).toFixed(1);

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
        <p className="font-medium">
          {isInnerRing ? `${data.name.split(' - ')[0]} - ${data.type}` : data.name}
        </p>
        <p className="text-gray-600">
          {`Completed: ${data.value}`}
          <span className="ml-2 text-sm text-gray-500">
            ({percentage}%)
          </span>
        </p>
      </div>
    );
  };

  if (processedData.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Puzzles Completed by Day
            {selectedYear !== 'all' && <span className="ml-2 text-gray-600">({selectedYear})</span>}
          </h2>
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
        <div className="h-[500px] min-h-[400px] flex items-center justify-center">
          <p className="text-gray-500">No data available for the selected year</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Portion of Completed Puzzles by Day of Week
          {selectedYear !== 'all' && <span className="ml-2 text-gray-600">({selectedYear})</span>}
        </h2>
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

      <div className="h-[500px] min-h-[400px]">
        <ResponsiveContainer width="100%" height={500}>
          <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
            >
              {processedData.map((entry, index) => (
                <Cell 
                  key={`outer-cell-${entry.name}`} 
                  fill={OUTER_COLORS[index % OUTER_COLORS.length]} 
                />
              ))}
            </Pie>
            
            {/* Inner ring - Gold vs Regular */}
            <Pie
              data={processedData.flatMap(item => item.children || [])}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={1}
            >
              {processedData.flatMap(item => item.children || []).map((entry, index) => (
                <Cell 
                  key={`inner-cell-${entry.name}`} 
                  fill={INNER_COLORS[entry.type]} 
                />
              ))}
            </Pie>
            
            <Tooltip content={<CustomTooltip />} />
            <Legend
              payload={[
                ...processedData.map((entry, index) => ({
                  value: entry.name,
                  type: 'circle',
                  color: OUTER_COLORS[index % OUTER_COLORS.length],
                  id: `outer-${entry.name}`
                })),
                ...Object.entries(INNER_COLORS).map(([key, color]) => ({
                  value: key,
                  type: 'circle',
                  color,
                  id: `inner-${key}`
                }))
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        Total Completions: {totalCompletions.toLocaleString()}
      </div>
    </div>
  );
};

export default PuzzleCompletion;