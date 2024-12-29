export interface DailyTrendData {
    print_date: string;
    day_of_week_name: string;
    solving_seconds: number;
  }
  
  export interface DayTrendsProps {
    data: DailyTrendData[];
  }