import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool=new Pool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    port:process.env.DB_PORT,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
});

pool.connect()
.then(()=>{
    console.log("Connected to the database successfully");
})
.catch((err)=>{
    console.error("Error connecting to the database:",err);
});

export default pool;