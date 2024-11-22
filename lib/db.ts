import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  ssl: {
    rejectUnauthorized: false,
    sslmode: 'require'
  },
  // Add shorter timeouts for production
  connectionTimeoutMillis: 8000,
  idleTimeoutMillis: 8000,
  query_timeout: 8000
});

export async function getCrosswordStats() {
  let client;
  try {
    console.log('Attempting database connection...');
    client = await pool.connect();
    console.log('Connected to database');

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
    return rows;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  } finally {
    if (client) client.release();
  }
}