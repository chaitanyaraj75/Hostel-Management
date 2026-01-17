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
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000 // 1 daysm 
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
    const { name,email,gender, student_id,year, mobile_no, branch,password } = req.body;
    console.log(req.body);
    if(!name || !student_id || !email || !mobile_no || !password || !branch || !year||!gender) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    try {
        const userExists = await pool.query(
            'SELECT student_id FROM users WHERE email = $1 OR mobile_no=$2 OR student_id=$3',
            [email,mobile_no,student_id]
        );
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser=await pool.query(
            'INSERT INTO users(name,student_id,email,mobile_no,password,branch,year,gender)VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id,name,student_id,email,mobile_no,branch,year,gender,user_type,created_at,hostel_id',
            [name,student_id,email,mobile_no,hashedPassword,branch,year,gender]
        )
        const token=generateToken(newUser.rows[0].id);
        res.cookie('token',token,cookieOptions); // For backward compatibility
        return res.status(201).json({user:newUser.rows[0], token:token});
    }
    catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ message: "Server error" });
    }
});

//Login
router.post('/login',async (req,res)=>{
    console.log(req.body);
    const {student_id,password,user_type}=req.body;
    if(!student_id||!password){
        return res.status(400).json({message:"Please provide all details"});
    }
    try{
        const user=await pool.query(
            'SELECT id,name,password,student_id,email,mobile_no,branch,year,gender,user_type,created_at,hostel_id FROM users WHERE student_id=$1',
            [student_id]
        )
        if(user.rows.length==0){
            return res.status(400).json({message:"Student_id not available"})
        }
        const userData=user.rows[0];
        console.log("User Data:",userData);
        if(userData.user_type!==user_type){
            return res.status(400).json({message:"Invalid user type"});
        }
        const ismatch= await bcrypt.compare(password,userData.password);
        if(!ismatch){
            return res.status(400).json({message:"Incorrect password"});
        }
        const token=generateToken(userData.id)
        res.cookie('token',token,cookieOptions); // For backward compatibility
        res.json({user:userData, token:token}); //200 ok
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

// Forgot Route
router.post('/forgot', async (req, res) => {
    const { email, student_id,password } = req.body;
    console.log(req.body);
    if( !student_id || !email ||!password ) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    try {
        const userExists = await pool.query(
            'SELECT student_id,email FROM users WHERE student_id = $1',
            [student_id]
        );
        console.log(userExists.rows);
        if (userExists.rows.length == 0) {
            return res.status(400).json({ message: "User doesn't exist" });
        }
        const user=userExists.rows[0];
        if(user.email!==email){
            return res.status(400).json({ message: "Email doesn't match" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const updateUser=await pool.query(
            'UPDATE users SET password=$1 WHERE student_id=$2 RETURNING id,name,student_id,email',
            [hashedPassword,student_id]
        )
        // const token=generateToken(updateUser.rows[0].id);
        // res.cookie('token',token,cookieOptions); // For backward compatibility
        return res.status(201).json({message:"Password updated successfully"});
    }
    catch (err) {
        console.error("Error during password update:", err);
        res.status(500).json({ message: "Server error in forgot password" });
    }
});

export default router;