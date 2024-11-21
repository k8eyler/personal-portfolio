import { NextResponse } from 'next/server';
import { getDailyCrosswordStats } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { year: string } }
) {
  try {
    // Add debug logging
    console.log('API Route - Received params:', params);
    
    if (!params?.year) {
      console.log('API Route - Missing year parameter');
      return NextResponse.json(
        { error: 'Year parameter is required' },
        { status: 400 }
      );
    }

    // Add more debug logging
    console.log('API Route - Fetching stats for year:', params.year);
    
    const rows = await getDailyCrosswordStats(params.year);
    
    // Log the results
    console.log('API Route - Query results:', rows);
    
    return NextResponse.json(rows);
  } catch (error) {
    // Log the full error
    console.error('API Route - Error details:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch daily statistics' },
      { status: 500 }
    );
  }
}