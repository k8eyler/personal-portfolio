import { Pool } from 'pg';

// Log configuration attempt
console.log('Initializing database configuration...');

// Create connection configuration
const config = {
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  // Optimize connection settings
  ssl: {
    rejectUnauthorized: false,
    sslmode: 'require'
  },
  // Reduce timeouts
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 5000,
  statement_timeout: 5000,
  // Add connection pool settings
  max: 1, // Reduce max connections for serverless
  min: 0  // Allow pool to drain completely
};

// Create pool instance
let pool: Pool;

function getPool() {
  if (!pool) {
    console.log('Creating new connection pool...');
    pool = new Pool(config);
    
    // Add error handler
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      pool = null; // Reset pool on error
    });
  }
  return pool;
}

export async function getCrosswordStats() {
  const startTime = Date.now();
  let client;
  
  try {
    console.log('Attempting to connect to database...');
    client = await getPool().connect();
    
    console.log('Connected successfully, executing query...');
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
    
    const duration = Date.now() - startTime;
    console.log(`Query completed in ${duration}ms with ${rows.length} rows`);
    
    return rows;
  } catch (error) {
    console.error('Database error:', {
      message: error.message,
      code: error.code,
      duration: Date.now() - startTime
    });
    throw error;
  } finally {
    if (client) {
      client.release();
      console.log('Database client released');
    }
  }
}