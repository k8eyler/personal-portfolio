import { NextResponse } from 'next/server'
import { getCrosswordStats } from '@/lib/db'  // Make sure the import path is correct

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const data = await getCrosswordStats();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error); // Add this for debugging
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}