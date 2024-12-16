import { NextResponse } from 'next/server';
import { getPuzzleTimesByDay } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60;

export async function GET(
  request: Request,
  { params }: { params: { day: string } }
) {
  const startTime = Date.now();

  try {
    console.log('Puzzle Times API Route - Starting request...');
    const dayIndex = parseInt(params.day);
    
    if (isNaN(dayIndex)) {
      return NextResponse.json(
        { error: 'Invalid day parameter' },
        { status: 400 }
      );
    }

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Database query timeout'));
      }, 50000);
    });

    const data = await Promise.race([
      getPuzzleTimesByDay(dayIndex),
      timeoutPromise
    ]);

    if (!data || data.length === 0) {
      console.log('Puzzle Times API Route - No data found');
      return NextResponse.json(
        { error: 'No data found' },
        { status: 404 }
      );
    }

    const duration = Date.now() - startTime;
    console.log(`Puzzle Times API Route - Request completed in ${duration}ms`);
    
    return NextResponse.json(data);
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack || '' : '';

    console.error('Puzzle Times API Route - Error:', {
      message: errorMessage,
      duration,
      stack: errorStack
    });

    return NextResponse.json(
      {
        error: 'Failed to fetch puzzle times',
        details: errorMessage,
        duration
      },
      { status: 500 }
    );
  }
}