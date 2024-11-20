// lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'database-1.chciwqmgal68.us-east-1.rds.amazonaws.com',
  database: 'crosswords',
  password: 'SC00ter2020',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function getCrosswordStats() {
  try {
    const { rows } = await pool.query(`
      SELECT 
        EXTRACT(YEAR FROM print_date) as year,
        COUNT(CASE WHEN solved = true THEN 1 END) as completed,
        COUNT(CASE WHEN percent_filled > 0 AND solved = false THEN 1 END) as started,
        -- Total hours for version 1
        ROUND(SUM(solving_seconds) / 3600.0, 1) as hours_spent,
        -- Split hours for version 2
        ROUND(SUM(CASE WHEN solved = true 
          THEN solving_seconds / 3600.0 
          ELSE 0 
        END), 1) as completed_hours,
        ROUND(SUM(CASE WHEN solved = false AND percent_filled > 0 
          THEN solving_seconds / 3600.0 
          ELSE 0 
        END), 1) as started_hours
      FROM public.crossword_stats
      WHERE print_date IS NOT NULL
      GROUP BY EXTRACT(YEAR FROM print_date)
      ORDER BY year;
    `);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}