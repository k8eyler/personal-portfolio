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
        EXTRACT(YEAR FROM print_date)::integer as year,
        COUNT(CASE WHEN solved = true THEN 1 END) as completed,
        COUNT(CASE WHEN percent_filled > 0 AND solved = false THEN 1 END) as started,
        ROUND(SUM(solving_seconds) / 3600.0, 1) as hours_spent,
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

export async function getDailyCrosswordStats(year: string) {
  try {
    const { rows } = await pool.query(`
      SELECT 
        EXTRACT(DOW FROM print_date) as day_number,
        CASE EXTRACT(DOW FROM print_date)
          WHEN 0 THEN 'Sunday'
          WHEN 1 THEN 'Monday'
          WHEN 2 THEN 'Tuesday'
          WHEN 3 THEN 'Wednesday'
          WHEN 4 THEN 'Thursday'
          WHEN 5 THEN 'Friday'
          WHEN 6 THEN 'Saturday'
        END as day,
        COUNT(CASE WHEN solved = true THEN 1 END) as completed,
        COUNT(CASE WHEN percent_filled > 0 AND solved = false THEN 1 END) as started,
        ROUND(SUM(CASE WHEN solved = true 
          THEN solving_seconds / 3600.0 
          ELSE 0 
        END), 1) as completed_hours,
        ROUND(SUM(CASE WHEN solved = false AND percent_filled > 0 
          THEN solving_seconds / 3600.0 
          ELSE 0 
        END), 1) as started_hours,
        ROUND(
          COALESCE(
            AVG(CASE 
              WHEN solved = true THEN solving_seconds / 60.0
              ELSE NULL 
            END),
            0
          ),
          1
        ) as avg_completion_minutes,
        COUNT(*) as total_puzzles
      FROM public.crossword_stats
      WHERE EXTRACT(YEAR FROM print_date) = $1::integer
      GROUP BY EXTRACT(DOW FROM print_date)
      ORDER BY day_number;
    `, [year]);

    // Add the formatted day label with null-safe operations
    const enhancedRows = rows.map(row => {
      const avgMinutes = row.avg_completion_minutes === null ? 0 : Number(row.avg_completion_minutes);
      return {
        ...row,
        day_with_avg: `${row.day}\n(${avgMinutes.toFixed(1)} min avg)`
      };
    });

    return enhancedRows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}