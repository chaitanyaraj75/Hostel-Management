import express from 'express';
import dotenv from 'dotenv';
import pool from '../config/db.js';

dotenv.config();

const router = express.Router();

// Get all hostel rooms
router.get('/rem_rooms', async (req, res) => {
    const { hostel_name, room_type } = req.query;
    // console.log(req.query);
    try {
        var rooms;
        if (!hostel_name && !room_type) {
            rooms = await pool.query('SELECT * FROM hostel_rooms WHERE seats_rem>0');
        }
        else if (hostel_name && !room_type) {
            rooms = await pool.query('SELECT * FROM hostel_rooms WHERE hostel_name=$1 and seats_rem>0',
                [hostel_name]
            );
        }
        else if (!hostel_name && room_type) {
            rooms = await pool.query('SELECT * FROM hostel_rooms WHERE room_type=$1 and seats_rem>0',
                [room_type]
            );
        }
        else {
            rooms = await pool.query('SELECT * FROM hostel_rooms WHERE hostel_name=$1 AND room_type=$2 and seats_rem>0',
                [hostel_name, room_type]
            );
        }
        // console.log(rooms.rows);
        res.status(200).json(rooms.rows);
    } catch (err) {
        console.error("Error fetching hostel rooms:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/req_room', async (req, res) => {
    const { student_id, hostel_id } = req.body;
    if (!student_id || !hostel_id) {
        return res.status(400).json({ message: "Please provide all details" });
    }
    try {
        const roomRequest = await pool.query(
            'INSERT INTO room_requests(student_id,hostel_id,status)VALUES($1,$2,$3) RETURNING *',
            [student_id, hostel_id, 'pending']
        )
        await pool.query(
            'UPDATE hostel_rooms SET seats_rem=seats_rem-1 WHERE id=$1',
            [hostel_id]
        )
        console.log("Room Request:", roomRequest.rows[0]);
        return res.status(201).json({ roomRequest: roomRequest.rows[0] });
    }
    catch (err) {
        console.error("Error during room request:", err);
        res.status(500).json({ message: "Room request server error" });
    }
});

router.get('/room_requests', async (req, res) => {
    try {
        const requests = await pool.query(`
            SELECT 
            rr.id AS request_id,
            rr.status,

            -- student details
            u.student_id,
            u.name AS student_name,
            u.email,
            u.mobile_no,
            u.branch,
            u.year,

            -- room details
            hr.id,
            hr.hostel_name,
            hr.room_no,
            hr.seats_rem

            FROM room_requests rr
            JOIN users u 
            ON rr.student_id = u.student_id
            JOIN hostel_rooms hr 
            ON rr.hostel_id = hr.id

            ORDER BY 
            (rr.status <> 'pending'), 
            rr.id ASC;
        `);
        res.status(200).json(requests.rows);
    }
    catch(err){
        console.error("Error fetching room requests:", err);
        res.status(500).json({ message: "Room requests loading failed" });
    }
});


export default router;

// Get a specific hostel room by ID