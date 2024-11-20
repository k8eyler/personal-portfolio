import { NextResponse } from 'next/server';
import { getCrosswordStats } from '@/lib/db';

export async function GET() {
  try {
    const data = await getCrosswordStats();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crossword statistics' },
      { status: 500 }
    );
  }
}