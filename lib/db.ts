import { Pool } from 'pg';

// Log configuration being used
console.log('Database configuration:', {
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER ? 'Set' : 'Not set',
  ssl: true
});

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  // Reduce timeouts
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 5000,
  // Max 1 client for serverless
  max: 1,
  ssl: {
    rejectUnauthorized: false,
    sslmode: 'require'
  }
});

// Add error handler
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

export async function getCrosswordStats() {
  let client;
  
  try {
    // Get client with timeout
    const connectStart = Date.now();
    client = await Promise.race([
      pool.connect(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 4000)
      )
    ]);

    console.log(`Connected in ${Date.now() - connectStart}ms`);

    // Execute query with timeout
    const queryStart = Date.now();
    const { rows } = await Promise.race([
      client.query(`
        SELECT 
          EXTRACT(YEAR FROM print_date)::integer as year,
          COUNT(CASE WHEN solved = true THEN 1 END) as completed,
          COUNT(CASE WHEN percent_filled > 0 AND solved = false THEN 1 END) as started,
          ROUND(SUM(solving_seconds) / 3600.0, 1) as hours_spent
        FROM public.crossword_stats
        WHERE print_date IS NOT NULL
        GROUP BY EXTRACT(YEAR FROM print_date)
        ORDER BY year;
      `),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 4000)
      )
    ]);

    console.log(`Query executed in ${Date.now() - queryStart}ms`);
    return rows;
  } catch (error) {
    console.error('Database error:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw error;
  } finally {
    if (client) {
      try {
        await client.release();
        console.log('Client released');
      } catch (e) {
        console.error('Error releasing client:', e);
      }
    }
  }
}