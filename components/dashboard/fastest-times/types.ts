export interface PuzzleRecord {
    puzzle_id: number;
    print_date: string;
    day_of_week_integer: number;
    solving_seconds: number;
    day_of_week_name: string;
  }
  
  export interface FastestPuzzle {
    dayOfWeek: string;
    date: string;
    seconds: number;
  }
  
  export interface FastestTimesProps {
    data: PuzzleRecord[];
    className?: string;
  }
  
  export interface PuzzleTimeData {
    puzzle_id: number;
    print_date: string;
    solving_seconds: number;
    title?: string;
  }