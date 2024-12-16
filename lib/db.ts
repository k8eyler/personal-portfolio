import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 5000,
  max: 1,
  ssl: {
    rejectUnauthorized: false,
  }
});

export async function getPuzzleTimesByDay(dayIndex: number) {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`
      SELECT 
        puzzle_id,
        print_date,
        solving_seconds,
        title
      FROM public.crossword_stats
      WHERE day_of_week_integer = $1
        AND solved = true
        AND puzzle_id NOT IN (12832, 11357)
      ORDER BY print_date ASC
    `, [dayIndex]);
    return rows;
  } finally {
    client.release();
  }
}

export async function getCrosswordStats() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`
      SELECT 
        EXTRACT(YEAR FROM print_date)::integer as year,
        COUNT(CASE WHEN solved = false AND percent_filled > 0 THEN 1 END)::integer as started,
        COUNT(CASE WHEN solved = true AND (star != 'Gold' OR star IS NULL) THEN 1 END)::integer as completed,
        COUNT(CASE WHEN solved = true AND star = 'Gold' THEN 1 END)::integer as "goldStar",
        ROUND(SUM(solving_seconds) / 3600.0, 1)::float as hours_spent
      FROM public.crossword_stats
      WHERE print_date IS NOT NULL
      GROUP BY EXTRACT(YEAR FROM print_date)
      ORDER BY year;
    `);
    return rows;
  } finally {
    client.release();
  }
}

export async function getFastestTimes() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(`
      WITH RankedPuzzles AS (
        SELECT 
          puzzle_id,
          print_date,
          day_of_week_integer,
          solving_seconds,
          day_of_week_name,
          ROW_NUMBER() OVER (PARTITION BY day_of_week_integer ORDER BY solving_seconds ASC) as rn
        FROM public.crossword_stats
        WHERE solved = true
        AND puzzle_id NOT IN (12832, 11357)
      )
      SELECT 
        puzzle_id,
        print_date,
        day_of_week_integer,
        solving_seconds,
        day_of_week_name
      FROM RankedPuzzles
      WHERE rn = 1
      ORDER BY CASE 
        WHEN day_of_week_integer = 0 THEN 7 
        ELSE day_of_week_integer 
      END;
    `);
    return rows;
  } finally {
    client.release();
  }
}