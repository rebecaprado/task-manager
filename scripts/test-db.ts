import 'dotenv/config';
import { Client } from 'pg';

(async () => {
  const c = new Client({ connectionString: process.env.DIRECT_URL });
  await c.connect();
  console.log((await c.query('select now()')).rows[0]);
  await c.end();
})();