// import {Pool} from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();

// const pool=new Pool({
//     host:process.env.DB_HOST,
//     user:process.env.DB_USER,
//     port:process.env.DB_PORT,
//     password:process.env.DB_PASSWORD,
//     database:process.env.DB_NAME
// });



// export default pool;

import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.NEON_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// OPTIONAL: log first successful connection
pool.query("SELECT 1")
  .then(() => console.log("Connected to the database successfully"))
  .catch(err => console.error("Initial DB connection error:", err.message));

// 🔥 VERY IMPORTANT: prevent app crash
pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err.message);
  // DO NOT throw
});

export default pool;
