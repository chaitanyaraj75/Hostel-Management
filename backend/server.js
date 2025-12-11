import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import cors from 'cors';
import hostelRoomRoutes from './routes/hostel_rooms.js';
import complaintRoutes from './routes/complaints.js';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use("/api/hostel_rooms",hostelRoomRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/complaints",complaintRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})