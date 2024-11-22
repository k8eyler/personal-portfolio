import { Pool } from 'pg';

// Initialize pool immediately
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 5000
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export async function getCrosswordStats() {
  const client = await pool.connect();
  try {
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