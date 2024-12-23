import { NextResponse } from 'next/server';
import { getCrosswordStats } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60; // Explicitly set max duration

export async function GET() {
  const startTime = Date.now();

  try {
    console.log('API Route - Starting request...');
    
    // Add timeout to the database query
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Database query timeout'));
      }, 50000); // 50-second timeout
    });

    // Race between the actual query and the timeout
    const data = await Promise.race([
      getCrosswordStats(),
      timeoutPromise
    ]);

    if (!data || data.length === 0) {
      console.log('API Route - No data found');
      return NextResponse.json(
        { error: 'No data found' },
        { status: 404 }
      );
    }

    const duration = Date.now() - startTime;
    console.log(`API Route - Request completed in ${duration}ms`);
    
    return NextResponse.json(data);
  } catch (error) {
    const duration = Date.now() - startTime;

    // Type guard to safely handle the error object
    let errorMessage = 'Unknown error';
    let errorStack = '';
    if (error instanceof Error) {
      errorMessage = error.message;
      errorStack = error.stack || '';
    }

    console.error('API Route - Error:', {
      message: errorMessage,
      duration,
      stack: errorStack
    });

    return NextResponse.json(
      {
        error: 'Failed to fetch statistics',
        details: errorMessage,
        duration
      },
      { status: 500 }
    );
  }
}
