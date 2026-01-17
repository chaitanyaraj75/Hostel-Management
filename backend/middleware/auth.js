import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const protect = async (req, res, next) => {
    try{
        // Try to get token from Authorization header first (for mobile/modern clients)
        let token = null;
        const authHeader = req.headers.authorization;
        
        if(authHeader && authHeader.startsWith('Bearer ')){
            token = authHeader.slice(7); // Remove 'Bearer ' prefix
        }
        // Fallback to cookies for backward compatibility
        else if(req.cookies.token){
            token = req.cookies.token;
        }
        
        if(!token){
            return res.status(401).json({ message: "No token, authorization denied" });
        }
        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        // window.alert(decoded.id);
        const user=await pool.query('SELECT * FROM users WHERE id=$1',[decoded.id]);
        if(user.rows.length===0){
            return res.status(401).json({ message: "User not found, authorization denied" });
        }
        req.user=user.rows[0];
        next();
    }
    catch(err){
        console.error("Error in authentication middleware:", err);
        return res.status(500).json({ message: "Server error" });
    }
}