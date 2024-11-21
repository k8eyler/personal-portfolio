import { NextResponse } from 'next/server'
import { getCrosswordStats } from '@/lib/db'
import { DatabaseError } from 'pg' // Add this import if you want PostgreSQL specific error handling

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
  } catch (err) {
    const error = err as Error;
    
    // Enhanced PostgreSQL error logging
    if (error instanceof DatabaseError) {
      console.error('PostgreSQL error details:', {
        message: error.message,
        code: error.code,
        column: error.column,
        constraint: error.constraint,
        detail: error.detail,
        schema: error.schema,
        table: error.table
      });
    } else {
      console.error('Database connection error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        code: (error as any).code
      });
    }
    
    return NextResponse.json(
      { 
        error: error.message || 'Database connection failed',
        code: (error as any).code,
        type: error.name 
      },
      { status: 500 }
    );
  }
}