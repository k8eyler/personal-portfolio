import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  ssl: {
    rejectUnauthorized: false
  },
  // Extended timeouts
  connectionTimeoutMillis: 20000,
  idleTimeoutMillis: 20000,
  // Add statement timeout
  statement_timeout: 20000,
  query_timeout: 20000
});

// Log connection attempts
pool.on('connect', () => {
  console.log('Database connection established');
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

export async function getCrosswordStats() {
  const client = await pool.connect();
  try {
    console.log('Executing query...');
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
    console.log('Query completed successfully');
    return rows;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getDailyCrosswordStats(year: string) {
  const client = await pool.connect();
  try {
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
    return rows;
  } finally {
    client.release();
  }
}