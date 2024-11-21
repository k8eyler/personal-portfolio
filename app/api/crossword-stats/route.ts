import { NextResponse } from 'next/server'
import { getCrosswordStats } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    console.log('Attempting database connection...');
    const data = await getCrosswordStats();
    console.log('Database connection successful', data);
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No data found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { error: error.message || 'Database connection failed' },
      { status: 500 }
    );
  }
}