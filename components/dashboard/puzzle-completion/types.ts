export interface PuzzleCompletionData {
    year: number;
    day_of_week_name: string;
    day_of_week_integer: number;
    completion_type: 'Gold' | 'Regular';
    count: number;
  }
  
  export interface ProcessedPuzzleData {
    name: string;
    value: number;
    children: ProcessedChildData[];
  }
  
  export interface ProcessedChildData {
    name: string;
    value: number;
    type: 'Gold' | 'Regular';
  }
  
  export interface PuzzleCompletionProps {
    data: PuzzleCompletionData[];
    className?: string;
  }