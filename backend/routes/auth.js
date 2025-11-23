import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import pool from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {protect} from '../middleware/auth.js';

dotenv.config();

const router = express.Router();

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 24 * 60 * 60 * 1000 // 1 days
};

const generateToken = (id) => {
    return jwt.sign
        (
            {id},
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
}

// Register Route
router.post('/register', async (req, res) => {
    const { name,email, student_id,year, mobile_no, branch,password } = req.body;
    console.log(req.body);
    if(!name || !student_id || !email || !mobile_no || !password || !branch || !year) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    try {
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR mobile_no=$2 OR student_id=$3',
            [email,mobile_no,student_id]
        );
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser=await pool.query(
            'INSERT INTO users(name,student_id,email,mobile_no,password,branch,year)VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [name,student_id,email,mobile_no,hashedPassword,branch,year]
        )
        const token=generateToken(newUser.rows[0].id);
        res.cookie('token',token,cookieOptions)
        return res.status(201).json({user:newUser.rows[0]});
    }
    catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ message: "Server error" });
    }
});

//Login
router.post('/login',async (req,res)=>{
    console.log(req.body);
    const {student_id,password}=req.body;
    if(!student_id||!password){
        return res.status(400).json({message:"Please provide all details"});
    }
    try{
        const user=await pool.query(
            'SELECT * FROM users WHERE student_id=$1',
            [student_id]
        )
        if(user.rows.length==0){
            return res.status(400).json({message:"Student_id not available"})
        }
        const userData=user.rows[0];
        const ismatch= await bcrypt.compare(password,userData.password);
        if(!ismatch){
            return res.status(400).json({message:"Incorrect password"});
        }
        const token=generateToken(userData.id)
        res.cookie('token',token,cookieOptions);
        res.json({user:userData}); //200 ok
    }
    catch(err){
        console.error("Error during Logging in:", err);
        res.status(500).json({ message: "Server error" });
    }
})

//me
router.get('/me',protect,async (req,res)=>{
    res.json({user:req.user});
});

//logout
router.post('/logout',(req,res)=>{
    res.cookie('token','',{ ...cookieOptions,maxAge:0});
    res.json({message:"Logged out successfully"});
});

export default router;