import { useState, useEffect } from 'react';
import server_url from "./server_url.js";
import axios from "axios";
import PageLoader from './PageLoader.jsx';
import ButtonLoader from './ButtonLoader.jsx';

function StudentComplaintPage({ user }) {
    const [complaints, setComplaints] = useState(null);
    const [newComplaint, setNewComplaint] = useState({
        title: '',
        description: ''
    });
    const [loading, setLoading] = useState(true);
    const [buttonloading, setButtonLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchComplaints = async () => {
        try {
            const response = await axios.get(`${server_url}/api/complaints/get_student_complaints`, {
                params: { student_id: user.student_id }
            });
            setComplaints(response.data);
            console.log('Complaints fetched:', response.data);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    }

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
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewComplaint((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleResolve = async (complaint_id) => {
        try {
            const response = await axios.put(`${server_url}/api/complaints/resolve_complaint`, null, {
                params: { complaint_id }
            });
            console.log('Complaint resolved:', response.data);
            fetchComplaints();
        } 
        catch (error) {
            console.error('Error resolving complaint:', error);
        }
    };

    const handleDelete = async (complaint_id) => {
        try {
            const response = await axios.delete(`${server_url}/api/complaints/delete_complaint`, {params: {complaint_id}});
            console.log('Complaint deleted:', response.data);
            fetchComplaints();
        } 
        catch (error) {
            console.error('Error deleting complaint:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            setButtonLoading(true);
            const response = await axios.post(`${server_url}/api/complaints/add_complaint`, {
                student_id: user.student_id,
                title: newComplaint.title,
                description: newComplaint.description
            });
            console.log('Complaint submitted:', response.data);
            setNewComplaint({ title: '', description: '' });
            fetchComplaints();
        }
        catch(error){
            console.error('Error submitting complaint:', error);
        }
        finally{
            setButtonLoading(false);
        }
    };

    if(loading){
        return <PageLoader />
    }

    if(error){
        return <div className="flex items-center justify-center min-h-screen">
            <div className="text-red-600 text-lg">Error: {error}</div>
        </div>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-start justify-center p-6">
            <div className="max-w-4xl w-full space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Complaint Details</h1>
                    <p className="text-gray-600 mt-1">Add any new complaint and see previous complaints.</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl mb-2 font-semibold">Add New Complaint</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4 bg-white rounded-xl shadow-md border">

                            <div className="flex flex-col">
                                <label htmlFor="title" className="text-sm font-semibold text-gray-700 mb-2">
                                    Title
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    value={newComplaint.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter complaint title"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="description" className="text-sm font-semibold text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={newComplaint.description}
                                    onChange={handleInputChange}
                                    placeholder="Brief description..."
                                    rows="5"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition resize-none overflow-y-scroll scrollbar-hide"
                                    style={{
                                        scrollbarWidth: 'none',
                                        msOverflowStyle: 'none'
                                    }}
                                />
                                <style>{`
                                    textarea.scrollbar-hide::-webkit-scrollbar {
                                        display: none;
                                    }
                                `}</style>
                            </div>

                            <div className="flex">
                                <button
                                    type="submit"
                                    disabled={buttonloading}
                                    className="w-full cursor-pointer py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transition"
                                >
                                    {buttonloading ? <ButtonLoader /> : 'Submit Complaint'}
                                </button>
                            </div>

                        </form>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-3">Previous Complaints</h3>
                        {complaints && complaints.length > 0 ? (
                            <div className="space-y-3">
                                {complaints.map((complaint) => (
                                    <div key={complaint.id} className="p-4 border rounded-lg bg-gray-50">
                                        <p className="font-semibold text-gray-800">{complaint.subject}</p>
                                        <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{complaint.complaint}</p>
                                        <p className={`mt-2 text-sm font-medium ${complaint.status === 'resolved' ? 'text-green-600' : 'text-yellow-600'}`}>
                                            Status: {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                                        </p>
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
                                                onClick={() => handleDelete (complaint.id)}
                                                className="px-3 py-1 rounded bg-[rgb(59,49,48)] text-white cursor-pointer hover:shadow-lg transition"

                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No complaints yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentComplaintPage;