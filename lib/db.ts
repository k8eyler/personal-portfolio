import { Pool } from 'pg';

console.log('Configuring database connection...', {
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  // Don't log the password!
});

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  ssl: {
    rejectUnauthorized: false
  }
});

// Existing function for overall stats
export async function getCrosswordStats() {
  try {
    console.log('DB: Attempting to connect to pool...');
    const client = await pool.connect();
    console.log('DB: Successfully connected to pool');
    
    try {
      console.log('DB: Starting query execution...');
      const { rows } = await client.query(`
        SELECT 
          EXTRACT(YEAR FROM print_date)::integer as year,
          COUNT(CASE WHEN solved = true THEN 1 END) as completed,
          COUNT(CASE WHEN percent_filled > 0 AND solved = false THEN 1 END) as started,
          ROUND(SUM(solving_seconds) / 3600.0, 1) as hours_spent
        FROM public.crossword_stats
        WHERE print_date IS NOT NULL
        GROUP BY EXTRACT(YEAR FROM print_date)
        ORDER BY year;
      `);
      console.log('DB: Query executed successfully, row count:', rows.length);
      return rows;
    } finally {
      client.release();
      console.log('DB: Client released back to pool');
    }
  } catch (error) {
    console.error('DB Error:', error);
    throw error;
  }
}

// New function for daily stats by year
export async function getDailyCrosswordStats(year: string) {
  try {
    console.log('DB: Attempting to connect to pool for daily stats...');
    const client = await pool.connect();
    console.log('DB: Successfully connected to pool');
    
    try {
      console.log('DB: Starting daily stats query execution for year:', year);
      const { rows } = await client.query(`
        SELECT 
          print_date,
          solved as completed,
          CASE WHEN percent_filled > 0 AND solved = false THEN true ELSE false END as started,
          solving_seconds / 3600.0 as hours_spent
        FROM public.crossword_stats
        WHERE EXTRACT(YEAR FROM print_date)::text = $1
        ORDER BY print_date;
      `, [year]);
      
      console.log('DB: Daily stats query executed successfully, row count:', rows.length);
      return rows;
    } finally {
      client.release();
      console.log('DB: Client released back to pool');
    }
  } catch (error) {
    console.error('DB Error:', error);
    throw error;
  }
}