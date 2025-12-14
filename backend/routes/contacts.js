import express, { response } from 'express';
import dotenv from 'dotenv';
import pool from '../config/db.js';

dotenv.config();

const router = express.Router();

router.get('/contact_details', async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM contacts ORDER BY category, id"
        );
        const members=result.rows;
        const administration=members.filter((member)=>{return member.category=='administration'});
        const student=members.filter((member)=>{return member.category=='student'});
        const staff=members.filter((member)=>{return member.category=='staff'});
        res.status(200).json({
            administration:administration,
            student:student,
            staff:staff,
        });
        console.log("Administration",administration,"Student",student,"Staff",staff);
    }
    catch(err){
        console.error("Error in contact",err);
        res.status(500).json({message:'Error in contact fetching'});

    }
})

router.delete('/delete/:id', async (req,res)=>{
    const {id}=req.params;
    try{
        await pool.query(
            'DELETE FROM contacts WHERE id=$1',
            [id]
        )
        console.log('Contact deleted with id:',id);
        res.status(200).json({message:'Contact deleted successfully'});
    }
    catch(err){
        res.status(500).json({message:"Error while deleting"})
        console.log(err);
    }
})

router.put('/edit/:id',async(req,res)=>{
    const {id}=req.params;
    const {name,post,contact,email,category}=req.body;

    try{
        const contacts=await pool.query(
            'UPDATE contacts SET name=$1, post=$2, contact=$3,email=$4,category=$5 WHERE id=$6',
            [name,post,contact,email,category,id]
        )
        console.log("Edited contact",contacts.rows)
        res.status(200).json(contacts.rows);
    }
    catch(err){
        res.status(500).json({message:"Error in editing"})
        console.error("Error in contact edit",err);
    }
})

router.post('/add',async(req,res)=>{
    const {name,post,contact,email,category}=req.body;
    try{
        const response=await pool.query(
            'INSERT INTO contacts (name,post,contact,email,category) VALUES ($1,$2,$3,$4,$5) RETURNING *',
            [name,post,contact,email,category]
        )
        res.status(200).json(response.rows);
        console.log("Added contact:",response)
    }
    catch(err){
        console.error("Error in adding",err)
        res.status(500).json({message:"Error in adding contact"});
    }
})

export default router;