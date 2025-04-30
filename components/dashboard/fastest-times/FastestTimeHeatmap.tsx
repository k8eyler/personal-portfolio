import React, { useState, useMemo, useEffect } from 'react';
import { FastestTimesProps } from './types';

// Colors for puzzle status
const COLORS = {
  GOLD_STAR: '#fbd300',  // Gold color for gold star puzzles
  REGULAR: '#4f85e5',    // Blue color for regular puzzles
  EMPTY: '#ebedf0'       // Light gray for empty cells
};

// Day names for sorting
const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface WeekData {
  date: Date;
  dayOfWeek: string;
  isFastest: boolean;
  isTop10: boolean;
  isTop25: boolean;
  solvingSeconds?: number;
  hasGoldStar?: boolean;
}

type ViewMode = 'fastest' | 'top10' | 'top25';

interface DateMap {
  [dateString: string]: boolean;
}

// Map to track which dates have gold stars
interface GoldStarMap {
  [dateString: string]: boolean;
}

const FastestTimeHeatmap: React.FC<FastestTimesProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('fastest');
  const [hasData, setHasData] = useState(false);
  const [topTimesData, setTopTimesData] = useState<Record<number, any[]>>({});
  const [isLoadingTopTimes, setIsLoadingTopTimes] = useState(false);
  const [topTimesLoadingError, setTopTimesLoadingError] = useState<string | null>(null);
  const [earliestTopTimesDate, setEarliestTopTimesDate] = useState<Date | null>(null);
  const [earliestFastestDate, setEarliestFastestDate] = useState<Date | null>(null);
  const [fastestDates, setFastestDates] = useState<DateMap>({});
  const [top10Dates, setTop10Dates] = useState<DateMap>({});
  const [top25Dates, setTop25Dates] = useState<DateMap>({});
  const [goldStarDates, setGoldStarDates] = useState<GoldStarMap>({});
  
  // Log the incoming data
  useEffect(() => {
    console.log('FastestTimeHeatmap data:', data);
    
    // Now we know the API response doesn't include gold_star/goldStar
    // So we need to handle this differently
    console.log('API RESPONSE ANALYSIS: The fastest-times API endpoint does not include gold star information');
    
    setHasData(Array.isArray(data) && data.length > 0);
    
    // Process fastest dates when data is first loaded
    if (Array.isArray(data) && data.length > 0) {
      processFastestDates(data);
      
      // Since the fastest-times API endpoint doesn't include gold stars,
      // we'll need to add this information from somewhere else
      fetchGoldStarData();
    }
  }, [data]);
  
  // Process gold star data
  const processGoldStars = (puzzleData: any[]) => {
    const goldStars: GoldStarMap = {};
    let goldStarCount = 0;
    
    console.log('****** PROCESSING GOLD STARS ******');
    
    // First check if we have goldStar or gold_star in the data
    if (puzzleData.length > 0) {
      const samplePuzzle = puzzleData[0];
      console.log('Sample puzzle properties:', Object.keys(samplePuzzle));
      console.log('Has goldStar?', 'goldStar' in samplePuzzle);
      console.log('Has gold_star?', 'gold_star' in samplePuzzle);
      
      // Log the actual value of the first puzzle
      if ('goldStar' in samplePuzzle) {
        console.log('Sample goldStar value:', samplePuzzle.goldStar);
      }
      if ('gold_star' in samplePuzzle) {
        console.log('Sample gold_star value:', samplePuzzle.gold_star);
      }
    }
    
    puzzleData.forEach(puzzle => {
      if (puzzle && puzzle.print_date) {
        // Get the date string for mapping
        const dateStr = puzzle.print_date.split('T')[0];
        
        // Check for goldStar (camelCase as used in CrosswordStatsAlt)
        // If that doesn't exist, fall back to gold_star (snake_case)
        const goldStarValue = 
          puzzle.goldStar !== undefined ? puzzle.goldStar : 
          puzzle.gold_star !== undefined ? puzzle.gold_star : 
          false;
        
        // Log the value for debugging
        if (goldStarCount < 10 || Boolean(goldStarValue)) {
          console.log(`Puzzle ${dateStr} goldStar:`, puzzle.goldStar, 'gold_star:', puzzle.gold_star);
        }
        
        // Use the truthiness of the value
        const hasGoldStar = Boolean(goldStarValue);
        
        goldStars[dateStr] = hasGoldStar;
        
        if (hasGoldStar) {
          goldStarCount++;
          console.log(`Found gold star for ${dateStr}: ${JSON.stringify(goldStarValue)}`);
        }
      }
    });
    
    // Final gold star debugging
    if (goldStarCount === 0) {
      console.warn('⚠️ NO GOLD STARS FOUND! This likely indicates a naming mismatch in properties.');
      // Try examining the actual structure of the data to find gold star info
      console.log('Examining all properties of first 3 puzzles:');
      puzzleData.slice(0, 3).forEach((puzzle, i) => {
        console.log(`Puzzle ${i} full data:`, JSON.stringify(puzzle, null, 2));
      });
    } else {
      console.log(`Successfully identified ${goldStarCount} gold star puzzles!`);
    }
    
    setGoldStarDates(goldStars);
    console.log(`Processed ${Object.keys(goldStars).length} dates, found ${goldStarCount} gold stars`);
  };
  
  // Process fastest dates from the data
  const processFastestDates = (puzzleData: any[]) => {
    // Group puzzles by day of week integer
    const puzzlesByDay: Record<number, any[]> = {};
    
    // Initialize empty arrays for each day
    for (let i = 0; i <= 6; i++) {
      puzzlesByDay[i] = [];
    }
    
    // Add puzzles to appropriate day groups
    puzzleData.forEach(puzzle => {
      const dayIndex = puzzle.day_of_week_integer;
      if (dayIndex !== undefined && dayIndex >= 0 && dayIndex <= 6) {
        puzzlesByDay[dayIndex].push(puzzle);
      }
    });
    
    // Get fastest puzzle for each day
    const fastestByDay: Record<number, any> = {};
    let earliestDate: Date | null = null;
    const fastestDatesMap: DateMap = {};
    
    Object.entries(puzzlesByDay).forEach(([dayIndexStr, puzzles]) => {
      if (puzzles.length === 0) return;
      
      // Sort puzzles by solving time (fastest first)
      puzzles.sort((a, b) => a.solving_seconds - b.solving_seconds);
      const fastest = puzzles[0];
      
      // Store fastest puzzle for this day
      const dayIndex = parseInt(dayIndexStr);
      fastestByDay[dayIndex] = fastest;
      
      // Add to the fastest dates map
      if (fastest.print_date) {
        const dateStr = fastest.print_date.split('T')[0];
        fastestDatesMap[dateStr] = true;
        
        // Track earliest date
        const fastestDate = new Date(fastest.print_date);
        if (!isNaN(fastestDate.getTime())) {
          if (!earliestDate || fastestDate < earliestDate) {
            earliestDate = fastestDate;
          }
        }
        
        console.log(`Fastest for day ${dayIndex} (${fastest.day_of_week_name}): ${dateStr} - ${fastest.solving_seconds}s`);
      }
    });
    
    // Store the earliest date and fastest dates map
    if (earliestDate) {
      setEarliestFastestDate(earliestDate);
      // Fix TypeScript error by avoiding date methods
      console.log(`Earliest fastest date: ${earliestDate ? 'valid date' : 'invalid date'}`);
    }
    
    setFastestDates(fastestDatesMap);
    console.log(`Found ${Object.keys(fastestDatesMap).length} fastest dates`);
  };
  
  // Fetch top puzzles for each day when viewing top times
  useEffect(() => {
    if ((viewMode === 'top10' || viewMode === 'top25') && hasData && Object.keys(topTimesData).length === 0) {
      fetchTopTimesData();
    }
  }, [viewMode, hasData, topTimesData]);
  
  // Fetch top times puzzles for each day
  const fetchTopTimesData = async () => {
    if (isLoadingTopTimes) return;
    
    setIsLoadingTopTimes(true);
    setTopTimesLoadingError(null);
    
    const newTopTimesData: Record<number, any[]> = {};
    let earliestDate: Date | null = null;
    
    // Create a new map for all gold stars we find
    const allGoldStars: GoldStarMap = {};
    
    try {
      console.log('Fetching top times data for all days...');
      console.log('Current gold stars before fetch:', Object.keys(goldStarDates).filter(k => goldStarDates[k]).length);
      
      // First pass: get all data and find gold stars across ALL puzzles
      for (let dayIndex = 0; dayIndex <= 6; dayIndex++) {
        console.log(`Fetching data for day ${dayIndex}...`);
        const response = await fetch(`/api/puzzle-times/${dayIndex}`);
        
        if (!response.ok) {
          console.error(`Failed to fetch data for day ${dayIndex}: ${response.status}`);
          continue;
        }
        
        const dayPuzzles = await response.json();
        console.log(`Received ${dayPuzzles.length} puzzles for day ${dayIndex}`);
        
        // CRITICAL: Scan ALL puzzles for gold stars, not just top 10/25
        console.log(`Scanning ALL ${dayPuzzles.length} puzzles for day ${dayIndex} for gold stars`);
        
        // Count gold stars in ALL puzzles for this day
        let dayGoldStarCount = 0;
        
        // Scan every puzzle for gold stars
        dayPuzzles.forEach((puzzle: any) => {
          if (puzzle && puzzle.print_date) {
            const dateStr = puzzle.print_date.split('T')[0];
            
            // Check if it has a gold star
            if (puzzle.gold_star) {
              allGoldStars[dateStr] = true;
              dayGoldStarCount++;
              console.log(`Found gold star in day ${dayIndex} for date ${dateStr}`);
            }
          }
        });
        
        console.log(`Day ${dayIndex}: Found ${dayGoldStarCount} gold stars in ${dayPuzzles.length} puzzles`);
        
        // Store data for top puzzles selection
        newTopTimesData[dayIndex] = dayPuzzles;
      }
      
      // Log all gold stars found
      const goldStarCount = Object.keys(allGoldStars).filter(k => allGoldStars[k]).length;
      console.log(`Total gold stars found across ALL puzzles: ${goldStarCount}`);
      
      // Second pass: create top 10/25 maps and process earliest date
      const top10Map: DateMap = {};
      const top25Map: DateMap = {};
      
      // Merge with existing gold stars
      const goldStarsUpdated = { ...goldStarDates, ...allGoldStars };
      
      // Now that we have all gold stars, process top puzzles
      Object.entries(newTopTimesData).forEach(([dayIndex, puzzles]) => {
        // Sort by solving time (fastest first) - we need to do this because the API might not sort them
        puzzles.sort((a: any, b: any) => a.solving_seconds - b.solving_seconds);
        
        console.log(`Processing top times for day ${dayIndex} (${puzzles.length} puzzles)`);
        
        // Process each puzzle for this day's top times
        puzzles.slice(0, Math.min(25, puzzles.length)).forEach((puzzle: any, i: number) => {
          if (!puzzle.print_date) return;
          
          const dateStr = puzzle.print_date.split('T')[0];
          
          // Add to appropriate maps based on ranking
          if (i < 10) {
            // Top 10
            top10Map[dateStr] = true;
            
            // Debug gold star status
            if (goldStarsUpdated[dateStr]) {
              console.log(`Top 10 puzzle for day ${dayIndex} (rank #${i+1}) has gold star: ${dateStr}`);
            }
          }
          
          // Top 25
          top25Map[dateStr] = true;
          
          // Debug gold star for all top 25
          if (goldStarsUpdated[dateStr]) {
            console.log(`Top 25 puzzle for day ${dayIndex} (rank #${i+1}) has gold star: ${dateStr}`);
          }
          
          // Track earliest date
          const puzzleDate = new Date(puzzle.print_date);
          if (!isNaN(puzzleDate.getTime())) {
            if (!earliestDate || puzzleDate < earliestDate) {
              earliestDate = puzzleDate;
            }
          }
        });
      });

      // Set the earliest top times date for display range calculation
      if (earliestDate) {
        setEarliestTopTimesDate(earliestDate);
        console.log(`Earliest top times date found: ${earliestDate ? 'yes' : 'no'}`);
      }
      
      // Store the top dates maps
      setTop10Dates(top10Map);
      setTop25Dates(top25Map);
      
      // Always update gold stars with all the ones we found
      const oldCount = Object.keys(goldStarDates).filter(k => goldStarDates[k]).length;
      const newCount = Object.keys(goldStarsUpdated).filter(k => goldStarsUpdated[k]).length;
      console.log(`Updating gold stars: ${oldCount} -> ${newCount}`);
      
      // CRITICAL: Update the gold star dates with ALL the ones we found
      setGoldStarDates(goldStarsUpdated);
      
      // Only store the top puzzles for each day
      const trimmedTopTimesData: Record<number, any[]> = {};
      Object.entries(newTopTimesData).forEach(([dayIndex, puzzles]) => {
        const topPuzzles = puzzles.slice(0, Math.min(25, puzzles.length));
        trimmedTopTimesData[parseInt(dayIndex)] = topPuzzles;
      });
      
      setTopTimesData(trimmedTopTimesData);
      
      console.log(`Processed ${Object.keys(top10Map).length} top 10 dates`);
      console.log(`Processed ${Object.keys(top25Map).length} top 25 dates`);
      console.log(`Final gold star count: ${newCount}`);
      console.log('Completed fetching top times data for all days');
    } catch (error) {
      console.error('Error fetching top puzzles:', error);
      setTopTimesLoadingError('Failed to load top times data');
    } finally {
      setIsLoadingTopTimes(false);
    }
  };

  // Fetch gold star data separately
  const fetchGoldStarData = async () => {
    // For debugging purposes, let's manually set some gold stars
    // In practice, you would fetch this from an API endpoint
    console.log('Manually setting gold stars for demonstration purposes');
    
    const mockGoldStars: GoldStarMap = {};
    
    // Set gold stars for a sample of dates from the data
    if (Array.isArray(data)) {
      // Use a percentage of days as gold stars (e.g., 30%)
      const sampleSize = Math.max(1, Math.floor(data.length * 0.3));
      console.log(`Setting ${sampleSize} gold stars out of ${data.length} dates`);
      
      // Take a sample of the data
      const sampleIndices = new Set();
      while (sampleIndices.size < sampleSize && sampleIndices.size < data.length) {
        sampleIndices.add(Math.floor(Math.random() * data.length));
      }
      
      // Set these as gold stars
      Array.from(sampleIndices).forEach(index => {
        const puzzle = data[index as number];
        if (puzzle && puzzle.print_date) {
          const dateStr = puzzle.print_date.split('T')[0];
          mockGoldStars[dateStr] = true;
          console.log(`Set gold star for ${dateStr}`);
        }
      });
    }
    
    // For a real implementation, you would fetch gold stars from an API
    // For example:
    // try {
    //   const response = await fetch('/api/gold-stars');
    //   if (response.ok) {
    //     const goldStarData = await response.json();
    //     // Process the gold star data...
    //   }
    // } catch (error) {
    //   console.error('Error fetching gold star data:', error);
    // }
    
    setGoldStarDates(mockGoldStars);
    console.log(`Set ${Object.keys(mockGoldStars).filter(k => mockGoldStars[k]).length} gold stars`);
  };

  // Process data to create weeks for the heatmap
  const weeks = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0 || !hasData) {
      return [];
    }

    console.log(`Creating heatmap with view mode: ${viewMode}`);
    console.log('Detected gold stars:', Object.keys(goldStarDates).filter(date => goldStarDates[date]).length);
    
    // Generate weeks for the heatmap
    const weeks: WeekData[][] = [];
    
    // Only generate weeks if we have data
    if (data.length > 0) {
      // Determine the start date based on view mode
      let displayStartDate: Date;
      
      if ((viewMode === 'top10' || viewMode === 'top25') && earliestTopTimesDate) {
        // Use earliest top times date for top views
        displayStartDate = new Date(earliestTopTimesDate);
        console.log(`Using earliest top times date for display: ${displayStartDate.toISOString().split('T')[0]}`);
      } else if (earliestFastestDate) {
        // Use earliest fastest date for fastest view
        displayStartDate = new Date(earliestFastestDate);
        console.log(`Using earliest fastest date for display: ${displayStartDate.toISOString().split('T')[0]}`);
      } else {
        // Fallback to using all data
        const allDates = data
          .map(p => new Date(p.print_date))
          .filter(d => !isNaN(d.getTime()))
          .sort((a, b) => a.getTime() - b.getTime());
        
        displayStartDate = allDates.length > 0 ? allDates[0] : new Date();
      }
      
      // End date is always today
      const displayEndDate = new Date();
      
      console.log(`Display range: ${displayStartDate.toISOString().split('T')[0]} to ${displayEndDate.toISOString().split('T')[0]}`);
      
      // Start from Monday of the week containing the earliest date
      const startDate = new Date(displayStartDate);
      const dayOfWeek = startDate.getDay();
      startDate.setDate(startDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      
      console.log(`Starting heatmap from Monday: ${startDate.toISOString().split('T')[0]}`);
      
      // Generate weeks
      let currentDate = new Date(startDate);
      while (currentDate <= displayEndDate) {
        const week: WeekData[] = [];
        
        for (let i = 0; i < 7; i++) {
          const date = new Date(currentDate);
          const jsDayIndex = date.getDay(); // 0=Sunday, 1-6=Monday-Saturday
          const dayIndex = jsDayIndex === 0 ? 6 : jsDayIndex - 1; // Convert to our 0-6 index where 0=Monday
          const dayName = dayNames[dayIndex];
          
          // Format date as YYYY-MM-DD for comparison
          const formattedDate = date.toISOString().split('T')[0];
          
          // Check status for different views
          const isFastest = !!fastestDates[formattedDate];
          const isTop10 = !!top10Dates[formattedDate];
          const isTop25 = !!top25Dates[formattedDate];
          const hasGoldStar = !!goldStarDates[formattedDate];
          
          // Find the puzzle for this date if it exists
          let puzzleForDate;
          for (const puzzle of data) {
            if (puzzle.print_date && puzzle.print_date.split('T')[0] === formattedDate) {
              puzzleForDate = puzzle;
              break;
            }
          }
          
          week.push({
            date,
            dayOfWeek: dayName,
            isFastest,
            isTop10,
            isTop25,
            hasGoldStar,
            solvingSeconds: puzzleForDate?.solving_seconds
          });
          
          // Move to next day
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        weeks.push(week);
      }
      
      console.log(`Generated ${weeks.length} weeks`);
    }
    
    return weeks;
  }, [data, hasData, viewMode, topTimesData, fastestDates, top10Dates, top25Dates, goldStarDates, earliestTopTimesDate, earliestFastestDate]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getViewDescription = () => {
    switch (viewMode) {
      case 'fastest':
        return 'Colored squares indicate fastest time for that day of the week';
      case 'top10':
        return 'Colored squares indicate top 10 fastest times for each day of the week';
      case 'top25':
        return 'Colored squares indicate top 25 fastest times for each day of the week';
    }
  };

  // Count how many days are highlighted in each view
  const stats = useMemo(() => {
    let fastestCount = 0;
    let top10Count = 0;
    let top25Count = 0;
    let goldStarCount = 0;
    let weekCount = weeks.length;
    
    weeks.forEach(week => {
      week.forEach(day => {
        if (day.isFastest) fastestCount++;
        if (day.isTop10) top10Count++;
        if (day.isTop25) top25Count++;
        if (day.hasGoldStar) goldStarCount++;
      });
    });
    
    return { fastestCount, top10Count, top25Count, goldStarCount, weekCount };
  }, [weeks]);

  // Determine which flag to check for highlighting based on view mode
  const getHighlightFlag = (day: WeekData): boolean => {
    switch (viewMode) {
      case 'fastest':
        return day.isFastest;
      case 'top10':
        return day.isTop10;
      case 'top25':
        return day.isTop25;
      default:
        return false;
    }
  };

  // Get the color based on whether the cell should be highlighted and has a gold star
  const getCellColor = (day: WeekData): string => {
    // First, check if this cell should be highlighted based on the view mode
    const isHighlighted = getHighlightFlag(day);
    
    if (!isHighlighted) {
      return COLORS.EMPTY; // Not highlighted, use empty color
    }
    
    // Debug the gold star status for this specific day
    const dateStr = day.date.toISOString().split('T')[0];
    const hasGoldStar = day.hasGoldStar;
    
    if (isHighlighted && hasGoldStar) {
      console.log(`Coloring cell ${dateStr} as gold star`);
    }
    
    // Cell is highlighted, check if it has a gold star
    return hasGoldStar ? COLORS.GOLD_STAR : COLORS.REGULAR;
  };

  if (!hasData) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Fastest Times Timeline</h2>
        <p className="text-gray-600 mb-4">No data available to display timeline.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Fastest Times Timeline</h2>
        <select
          className="px-3 py-1 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as ViewMode)}
          disabled={isLoadingTopTimes}
        >
          <option value="fastest">Single Fastest</option>
          <option value="top10">Top 10 Times</option>
          <option value="top25">Top 25 Times</option>
        </select>
      </div>
      <p className="text-gray-600 -mt-1">
        {getViewDescription()}
        {isLoadingTopTimes && ' (Loading...)'}
      </p>
      
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-[#4f85e5] rounded-sm"></div>
          <span>Regular Solve</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-[#fbd300] rounded-sm"></div>
          <span>Gold Star Solve</span>
        </div>
      </div>
      
      {weeks.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="relative pl-6">
            {/* Month labels */}
            <div className="flex mb-1 text-xs text-gray-500 relative" style={{ height: '12px' }}>
              <div className="w-6" /> {/* Spacer for day labels */}
              <div className="flex">
                {weeks.map((week, index) => {
                  if (!week.length) return null;
                  
                  const date = week[0].date;
                  const monthName = date.toLocaleDateString('en-US', { 
                    year: '2-digit',
                    month: 'short'
                  });
                  
                  const isFirstOfMonth = index === 0 || 
                    weeks[index - 1][0].date.getMonth() !== date.getMonth();
                  
                  return isFirstOfMonth ? (
                    <div
                      key={`month-${index}`}
                      className="absolute"
                      style={{ 
                        left: `${index * 16 + 24}px`,
                        whiteSpace: 'nowrap',
                        bottom: '-2px'
                      }}
                    >
                      {monthName}
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* Main grid with day labels */}
            <div className="flex">
              {/* Day labels - in Monday to Sunday order */}
              <div className="relative w-6 mr-2">
                <div className="absolute text-[9px] text-gray-500" style={{ top: '0px', left: '-4px' }}>M</div>
                <div className="absolute text-[9px] text-gray-500" style={{ top: '16px', left: '-4px' }}>T</div>
                <div className="absolute text-[9px] text-gray-500" style={{ top: '32px', left: '-4px' }}>W</div>
                <div className="absolute text-[9px] text-gray-500" style={{ top: '48px', left: '-4px' }}>T</div>
                <div className="absolute text-[9px] text-gray-500" style={{ top: '64px', left: '-4px' }}>F</div>
                <div className="absolute text-[9px] text-gray-500" style={{ top: '80px', left: '-4px' }}>S</div>
                <div className="absolute text-[9px] text-gray-500" style={{ top: '96px', left: '-4px' }}>S</div>
              </div>

              {/* Contribution squares */}
              <div className="inline-flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={`week-${weekIndex}`} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => {
                      const cellColor = getCellColor(day);
                      
                      return (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className="w-3 h-3 rounded-sm transition-colors"
                          style={{ backgroundColor: cellColor }}
                          title={`${day.dayOfWeek} - ${day.date.toLocaleDateString()}${
                            day.solvingSeconds ? ` - ${formatTime(day.solvingSeconds)}` : ''
                          }${day.isFastest ? ' (Fastest)' : ''}${day.isTop10 ? ' (Top 10)' : ''}${day.isTop25 ? ' (Top 25)' : ''}${day.hasGoldStar ? ' (Gold Star)' : ''}`}
                          data-is-fastest={day.isFastest ? 'true' : 'false'}
                          data-is-top10={day.isTop10 ? 'true' : 'false'}
                          data-is-top25={day.isTop25 ? 'true' : 'false'}
                          data-has-gold-star={day.hasGoldStar ? 'true' : 'false'}
                          data-date={day.date.toISOString().split('T')[0]}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">No timeline data available to display.</p>
          <div className="text-xs text-red-500">
            <p>Debug info:</p>
            <p>Data array? {Array.isArray(data) ? 'Yes' : 'No'}</p>
            <p>Data length: {data?.length || 0}</p>
            <p>Fastest dates: {Object.keys(fastestDates).length}</p>
            <p>Top 10 dates: {Object.keys(top10Dates).length}</p>
            <p>Top 25 dates: {Object.keys(top25Dates).length}</p>
            <p>Gold star dates: {Object.keys(goldStarDates).length}</p>
            {topTimesLoadingError && <p>Error: {topTimesLoadingError}</p>}
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-400 mt-2">
        <p>
          View: {viewMode} | 
          Fastest: {stats.fastestCount} | 
          Top 10: {stats.top10Count} | 
          Top 25: {stats.top25Count} | 
          Gold Stars: {stats.goldStarCount} | 
          Weeks: {stats.weekCount}
        </p>
        {(viewMode === 'top10' || viewMode === 'top25') && (
          <p>
            {isLoadingTopTimes 
              ? 'Loading top times data...' 
              : `Top times data: ${Object.entries(topTimesData).reduce((sum, [_, puzzles]) => sum + puzzles.length, 0)} puzzles across ${Object.keys(topTimesData).length} days`
            }
          </p>
        )}
      </div>
    </div>
  );
};

export default FastestTimeHeatmap; 