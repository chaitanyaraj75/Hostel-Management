import express from 'express';
import dotenv from 'dotenv';
import pool from '../config/db.js';

dotenv.config();

const router = express.Router();
//Add complaint
router.post('/add_complaint', async(req,res)=>{
    const {student_id, title, description} = req.body;
    try{
        const newComplaint = await pool.query(
            "INSERT INTO complaints (student_id, subject,complaint, status) VALUES ($1, $2, $3, $4) RETURNING *",
            [student_id, title, description, 'pending']
        );
        console.log('New complaint added:', newComplaint.rows[0]);
        res.status(201).json(newComplaint.rows[0]);
    }catch(error){
        console.error('Error adding complaint:',error);
        res.status(500).json({message: 'Internal Server Error'});
    }
})

//Get all complaints
router.get('/get_complaints',async(req,res)=>{
    try{
        const pending_complaints=await pool.query('SELECT * FROM complaints WHERE status=$1 ORDER BY id ASC',['pending']);
        const resolved_complaints=await pool.query('SELECT * FROM complaints WHERE status=$1 ORDER BY id ASC',['resolved']);
        // const ordered_complaints=resolved_complaints.filter(row=>row.status==='resolved').concat(pending_complaints.filter(row=>row.status==='pending'));

        console.log('Fetched complaints:',{
            pending_complaints:pending_complaints.rows,
            resolved_complaints:resolved_complaints.rows
        });
        res.status(200).json({
            pending_complaints:pending_complaints.rows,
            resolved_complaints:resolved_complaints.rows
        });
    }
    catch(error){
        console.error('Error fetching complaints:',error);
        res.status(500).json({message:'Server Error for all complaints'});
    }
})

//Get complaints by student_id
router.get('/get_student_complaints',async(req,res)=>{
    const {student_id}=req.query;
    // console.log('Fetching complaints for student_id:',student_id);
    try{
        const complaints=await pool.query('SELECT * FROM complaints WHERE student_id=$1 ORDER BY id ASC',
            [student_id]
        )
        console.log('Complaints fetched for student_id:',student_id,complaints.rows);
        res.status(200).json(complaints.rows);
    }
    catch(err){
        console.error('Error fetching complaints by student_id:',err);
        res.status(500).json({message:'Server Error for complaints by student_id'});
    }
})

//Resolve complaint status
router.put('/resolve_complaint',async(req,res)=>{
    const {complaint_id}=req.query;
    try{
        const updateComplaint=await pool.query(
            'UPDATE complaints SET status=$1 WHERE id=$2 RETURNING *',
            ['resolved',complaint_id]
        )
        console.log('Complaint status updated:',updateComplaint.rows[0]);
        res.status(200).json(updateComplaint.rows[0]);
    }
    catch(err){
        console.error('Error updating complaint status:',err);
        res.status(500).json({message:'Server Error for updating complaint status'});
    }
})

//Edit complaint
router.put('/edit_complaint',async(req,res)=>{
    const {complaint_id, title, description}=req.body;
    try{
        const updateComplaint=await pool.query(
            'UPDATE complaints SET subject=$1, complaint=$2 WHERE id=$3 RETURNING *',
            [title, description, complaint_id]
        )
        console.log('Complaint updated:',updateComplaint.rows[0]);
        const updatedComplaint=updateComplaint.rows[0];
        res.status(200).json(updatedComplaint);
    }
    catch(err){
        console.error('Error updating complaint:',err);
        res.status(500).json({message:'Server Error for updating complaint'});
    }
})

//Delete complaint
router.delete('/delete_complaint',async(req,res)=>{
    const {complaint_id}=req.query;
    console.log('Deleting complaint with id:',complaint_id);
    try{
        await pool.query(
            'DELETE FROM complaints WHERE id=$1',
            [complaint_id]
        )
        console.log('Complaint deleted with id:',complaint_id);
        res.status(200).json({message:'Complaint deleted successfully'});
    }
    catch(err){
        console.error('Error deleting complaint:',err);
        res.status(500).json({message:'Server Error for deleting complaint'});
    }
})

export default router;