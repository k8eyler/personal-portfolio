
function getPool() {
  if (!pool) {
    console.log('Creating new connection pool...');
    pool = new Pool(config);
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      pool = null;
    });
  }
  return pool;
}

export async function getCrosswordStats() {
  const startTime = Date.now();
  let client;
  
  try {
    client = await getPool().connect();
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
    console.error('Database error:', error);
    throw error;
  } finally {
    if (client) client.release();
  }
}

export async function getDailyCrosswordStats(year: string) {
  let client;
  try {
    client = await getPool().connect();
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
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    if (client) client.release();
  }
}