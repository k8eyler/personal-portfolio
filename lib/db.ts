import { Pool } from 'pg';

const connectionString = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}`;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function getCrosswordStats() {
  const client = await pool.connect();
  try {
    console.log('Connected to database, executing query...');
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
    console.log('Query executed successfully');
    return rows;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    client.release();
  }
}