import { useState, useEffect, use } from 'react';
import server_url from "./server_url.js";
import axios from "axios";

function AdminComplaintPage({ user }) {
    const [pendingComplaints, setPendingComplaints] = useState([]);
    const [resolvedComplaints, setResolvedComplaints] = useState([]);
    const [newComplaint, setNewComplaint] = useState({ title: '', description: '' });

    const fetchComplaints = async () => {
        try {
            const response = await axios.get(`${server_url}/api/complaints/get_complaints`);
            setPendingComplaints(response.data.pending_complaints);
            setResolvedComplaints(response.data.resolved_complaints);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);
}

export default AdminComplaintPage;