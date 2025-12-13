import { useState, useEffect, use } from 'react';
import server_url from "./server_url.js";
import axios from "axios";

function AdminComplaintPage({ user }) {
    const [pendingComplaints, setPendingComplaints] = useState([]);
    const [resolvedComplaints, setResolvedComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchComplaints = async () => {
        try {
            const response = await axios.get(`${server_url}/api/complaints/get_complaints`);
            setPendingComplaints(response.data.pending_complaints);
            setResolvedComplaints(response.data.resolved_complaints);
            console.log('Fetched complaints:', response.data);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };

    const LoadAll=async()=>{
        setLoading(true);
        setError(null);
        try{
            await Promise.all([
                fetchComplaints()
            ])
        }
        catch(err){
            console.error("Error loading data:", err);
            setError(err?.response?.data || err.message || "Unknown error");
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        LoadAll();
    }, []);

    const handleResolve = async (complaint_id) => {
        try {
            setLoading(true);
            const response = await axios.put(`${server_url}/api/complaints/resolve_complaint`, null, {
                params: { complaint_id }
            });
            console.log('Complaint resolved:', response.data);
            LoadAll();
        } 
        catch (error) {
            console.error('Error resolving complaint:', error);
        }
        finally{
            setLoading(false);
        }
    };

    const handleDelete = async (complaint_id) => {
        try {
            setLoading(true);
            const response = await axios.delete(`${server_url}/api/complaints/delete_complaint`, {params: {complaint_id}});
            console.log('Complaint deleted:', response.data);
            LoadAll();
        } 
        catch (error) {
            console.error('Error deleting complaint:', error);
        }
        finally{
            setLoading(false);
        }
    };

    if(loading){
        return <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 mb-4 mx-auto"></div>
                <h2 className="text-xl font-semibold">Loading...</h2>
            </div>
        </div>
    }

    if(error){
        return <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-red-600">Error: {error}</h2>
            </div>
        </div>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-start justify-center p-6">
            <div className="max-w-4xl w-full space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Room Requests</h1>
                    <p className="text-gray-600 mt-1">View all the room requests</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <div className="mb-6">
                        {/* <h2 className="text-2xl font-semibold">Hello {user?.name || 'Admin'}!</h2> */}

                        <h2 className="text-xl mt-4 font-semibold">Pending Complaints</h2>
                        {pendingComplaints.length > 0 ? (
                            <div className="mt-4 space-y-4">
                                {pendingComplaints.map((complaint) => (
                                    <div key={complaint.id} className="p-4 border rounded-lg bg-blue-50">
                                        <p className="font-semibold text-gray-800">{complaint.subject}</p>
                                        <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{complaint.complaint}</p>
                                        <div className='flex justify-between'>
                                            <p className={`mt-2 text-sm font-medium text-yellow-600`}>
                                                Status: {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                                            </p>
                                            <p className={`mt-2 text-sm font-medium text-[rgb(45,61,4)]`}>
                                                Student ID: {complaint.student_id}
                                            </p>
                                        </div>
                                        <div className='mt-1.5'>
                                            <button
                                                onClick={() => handleResolve(complaint.id)}
                                                className={`
                                                    px-3 py-1 rounded bg-[rgb(194,147,53)] text-white transition mr-2
                                                    ${complaint.status === 'resolved' ? ' bg-gray-300 cursor-not-allowed opacity-70 scale-[1] border border-gray-300'
                                                        : 'opacity-100 cursor-pointer hover:shadow-lg'}
                                                `}
                                                disabled={complaint.status === 'resolved'}
                                            >
                                                Resolved
                                            </button>
                                            <button
                                                onClick={() => handleDelete(complaint.id)}
                                                className="px-3 py-1 rounded bg-[rgb(59,49,48)] text-white cursor-pointer hover:shadow-lg transition"

                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600 mt-2">No pending room requests present.</p>
                        )}
                    </div>
                    <div className="mb-6">
                        {/* <h2 className="text-2xl font-semibold">Hello {user?.name || 'Admin'}!</h2> */}

                        <h2 className="text-xl mt-4 font-semibold">Resolved Complaints</h2>
                        {resolvedComplaints.length > 0 ? (
                            <div className="mt-4 space-y-4">
                                {resolvedComplaints.map((complaint) => (
                                    <div key={complaint.id} className="p-4 border rounded-lg bg-green-50">
                                        <p className="font-semibold text-gray-800">{complaint.subject}</p>
                                        <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{complaint.complaint}</p>
                                        <div className='flex justify-between'>
                                            <p className={`mt-2 text-sm font-medium text-green-600`}>
                                                Status: {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                                            </p>
                                            <p className={`mt-2 text-sm font-medium text-[rgb(45,61,4)]`}>
                                                Student ID: {complaint.student_id}
                                            </p>
                                        </div>
                                        <div className='mt-1.5'>
                                            <button
                                                onClick={() => handleDelete(complaint.id)}
                                                className="px-3 py-1 rounded bg-[rgb(59,49,48)] text-white cursor-pointer hover:shadow-lg transition"

                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600 mt-2">No resolved room requests to show.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminComplaintPage;