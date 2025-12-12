import express from 'express';
import dotenv from 'dotenv';
import pool from '../config/db.js';

dotenv.config();

const router = express.Router();

//Get specific hostel room by ID
router.get('/hostel_room/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const room = await pool.query('SELECT * FROM hostel_rooms WHERE id=$1', [id]);
        if (room.rows.length === 0) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.status(200).json(room.rows[0]);
    } catch (err) {
        console.log("Error fetching hostel room:", err);
        res.status(500).json({ message: "Spcific Room fetching error" });
    }
});

//Roomate details
router.get('/roomates', async (req, res) => {
    const { hostel_id } = req.query;
    try {
        const roommates = await pool.query('SELECT name, student_id, branch FROM users WHERE hostel_id=$1', [hostel_id]);
        res.status(200).json(roommates.rows);
        console.log("Roommates:", roommates.rows);
    } catch (err) {
        console.error("Error fetching roommates:", err);
        res.status(500).json({ message: "Roommates fetching error" });
    }
});

//Get all hostel rooms everything
router.get('/all_rooms', async (req, res) => {
    try {
        const rooms = await pool.query('SELECT * FROM hostel_rooms');
        res.status(200).json(rooms.rows)
        console.log("All Rooms:", rooms.rows);
    }
    catch (err) {
        console.error("Error fetching all rooms:", err);
        res.status(500).json({ message: "All Rooms fetching error" });
    }
})

// Get all hostel rooms
router.get('/rem_rooms', async (req, res) => {
    const { hostel_name, room_type, gender } = req.query;
    // console.log(req.query);
    try {
        var rooms;
        if (!hostel_name && !room_type) {
            rooms = await pool.query('SELECT * FROM hostel_rooms WHERE seats_rem>0 AND members=$1 ORDER BY id ASC',
                [gender]
            );
        }
        else if (hostel_name && !room_type) {
            rooms = await pool.query('SELECT * FROM hostel_rooms WHERE hostel_name=$1 and seats_rem>0 AND members=$2 ORDER BY id ASC',
                [hostel_name, gender]
            );
        }
        else if (!hostel_name && room_type) {
            rooms = await pool.query('SELECT * FROM hostel_rooms WHERE room_type=$1 and seats_rem>0 AND members=$2 ORDER BY id ASC',
                [room_type, gender]
            );
        }
        else {
            rooms = await pool.query('SELECT * FROM hostel_rooms WHERE hostel_name=$1 AND room_type=$2 and seats_rem>0 AND members=$3 ORDER BY id ASC',
                [hostel_name, room_type, gender]
            );
        }
        // console.log(rooms.rows);
        res.status(200).json(rooms.rows);
    } catch (err) {
        console.error("Error fetching hostel rooms:", err);
        res.status(500).json({ message: "Server error" });
    }
});

//Request a room
router.post('/request_room', async (req, res) => {
    const { student_id, hostel_id } = req.body;
    if (!student_id || !hostel_id) {
        return res.status(400).json({ message: "Please provide all details" });
    }
    try {
        const existingRequest = await pool.query(
            'SELECT * FROM room_requests WHERE student_id=$1 AND status=$2',
            [student_id, 'pending']
        );
        if (existingRequest.rows.length > 0) {
            return res.status(400).json({ message: "You already have a pending room request" });
        }
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
        const pending_requests = await pool.query(`
            SELECT 
            rr.id AS request_id,
            rr.status,

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
            hr.seats_rem,
            hr.room_type

            FROM room_requests rr
            JOIN users u 
            ON rr.student_id = u.student_id
            JOIN hostel_rooms hr 
            ON rr.hostel_id = hr.id

            WHERE rr.status = 'pending'

            ORDER BY 
            rr.id ASC;
        `);
        const other_requests = await pool.query(`
            SELECT 
            rr.id AS request_id,
            rr.status,

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
            hr.seats_rem,
            hr.room_type

            FROM room_requests rr
            JOIN users u 
            ON rr.student_id = u.student_id
            JOIN hostel_rooms hr 
            ON rr.hostel_id = hr.id

            WHERE rr.status <> 'pending'

            ORDER BY 
            rr.id ASC;
        `);
        console.log("Fetched Room Requests:", pending_requests.rows, other_requests.rows);
        res.status(200).json({
            pending_requests: pending_requests.rows,
            other_requests: other_requests.rows
        });
    }
    catch (err) {
        console.error("Error fetching room requests:", err);
        res.status(500).json({ message: "Room requests loading failed" });
    }
});

router.post('/approve_request', async (req, res) => {
    const { request_id, student_id, hostel_id } = req.body;
    console.log("Approve Request Data:", req.body);
    if (!request_id || !student_id || !hostel_id) {
        return res.status(400).json({ message: "Please provide all details" });
    }
    try {
        const user = await pool.query(
            'SELECT hostel_id FROM users WHERE student_id=$1',
            [student_id]
        );
        if (user?.rows[0]?.hostel_id) {
            await pool.query(
                'UPDATE hostel_rooms SET seats_rem=seats_rem+1 WHERE id=$1 RETURNING *',
                [user.rows[0].hostel_id]
            )
        }
        const approveRequest = await pool.query(
            'UPDATE room_requests SET status=$1 WHERE id=$2 RETURNING *',
            ['approved', request_id]
        );
        console.log("Approved Request:", approveRequest.rows[0]);
        const studentUpdate = await pool.query(
            'UPDATE users SET hostel_id=$1 WHERE student_id=$2 RETURNING *',
            [hostel_id, student_id]
        );
        return res.status(200).json({ approveRequest: approveRequest.rows[0], studentUpdate: studentUpdate.rows[0] });
    }
    catch (err) {
        console.error("Error during approving request:", err);
        res.status(500).json({ message: "Approving request server error" });
    }
});

router.post('/decline_request', async (req, res) => {
    const { request_id, student_id, hostel_id } = req.body;
    if (!request_id || !student_id || !hostel_id) {
        return res.status(400).json({ message: "Please provide all details" });
    }
    try {
        const declineRequest = await pool.query(
            'UPDATE room_requests SET status=$1 WHERE id=$2 RETURNING *',
            ['declined', request_id]
        );
        console.log("Approved Request:", declineRequest.rows[0]);
        const roomUpdate = await pool.query(
            'UPDATE hostel_rooms SET seats_rem=seats_rem+1 WHERE id=$1 RETURNING *',
            [hostel_id]
        );
        return res.status(200).json({ declineRequest: declineRequest.rows[0], roomUpdate: roomUpdate.rows[0] });
    }
    catch (err) {
        console.error("Error during approving request:", err);
        res.status(500).json({ message: "Approving request server error" });
    }
});


export default router;