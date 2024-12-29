import { NextResponse } from 'next/server';
import { getDayTrends } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60;

export async function GET() {
 const startTime = Date.now();

 try {
   console.log('Day Trends API Route - Starting request...');
   
   const timeoutPromise = new Promise<never>((_, reject) => {
     setTimeout(() => {
       reject(new Error('Database query timeout'));
     }, 50000);
   });

   const data = await Promise.race([
     getDayTrends(),
     timeoutPromise
   ]);

   if (!data || data.length === 0) {
     console.log('Day Trends API Route - No data found');
     return NextResponse.json(
       { error: 'No data found' },
       { status: 404 }
     );
   }

   const duration = Date.now() - startTime;
   console.log(`Day Trends API Route - Request completed in ${duration}ms`);
   
   return NextResponse.json(data);
 } catch (error) {
   const duration = Date.now() - startTime;
   const errorMessage = error instanceof Error ? error.message : 'Unknown error';
   const errorStack = error instanceof Error ? error.stack || '' : '';

   console.error('Day Trends API Route - Error:', {
     message: errorMessage,
     duration,
     stack: errorStack
   });

   return NextResponse.json(
     {
       error: 'Failed to fetch day trends',
       details: errorMessage,
       duration
     },
     { status: 500 }
   );
 }
}