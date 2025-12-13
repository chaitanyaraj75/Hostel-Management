import { useState, useEffect } from 'react';
import server_url from "./server_url.js";
import axios from "axios";
//Error handling and loading states to be added
function AdminRoomPage({ user }) {
    const [pendingRoomRequests, setPendingRoomRequests] = useState([]);
    const [otherRoomRequests, setOtherRoomRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const reqmap = {
        'pending': 'Pending',
        'approved': 'Approved',
        'declined': 'Declined'
    }

    const handleApprove = async (requestId, student_id, hostel_id) => {
        try {
            setLoading(true);
            console.log("Approving request:", requestId, student_id, hostel_id);
            await axios.post(`${server_url}/api/hostel_rooms/approve_request`, { request_id: requestId, student_id: student_id, hostel_id: hostel_id });
            fetchRoomRequests();
        } catch (err) {
            console.error("Approve failed:", err);
            alert("Approve failed: " + (err?.response?.data || err.message));
        }
        finally{
            setLoading(false);
        }
    };

    const handleDecline = async (requestId, student_id, hostel_id) => {
        try {
            setLoading(true);
            await axios.post(`${server_url}/api/hostel_rooms/decline_request`, { request_id: requestId, student_id: student_id, hostel_id: hostel_id });
            fetchRoomRequests();
        } catch (err) {
            console.error("Decline failed:", err);
            alert("Decline failed: " + (err?.response?.data || err.message));
        }
        finally{
            setLoading(false);
        }
    };

    const fetchRoomRequests = async () => {
        try {
            const url = `${server_url}/api/hostel_rooms/room_requests`;
            console.log("Requesting:", url);
            const response = await axios.get(url);
            // Expecting { pending_requests: [...], other_requests: [...] }
            setPendingRoomRequests(response.data.pending_requests || []);
            setOtherRoomRequests(response.data.other_requests || []);
            console.log("Fetched Room Requests:", response.data);
        } catch (err) {
            console.error("Error fetching room requests:", err);
        }
    };

    const LoadAll=async()=>{
        setLoading(true);
        setError(null);
        try{
            await Promise.all([
                fetchRoomRequests()
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

    if (loading) return <p className="p-6">Loading room requests...</p>;
    if (error) return <p className="p-6 text-red-600">Error: {String(error)}</p>;

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
                        <h3 className="text-lg font-medium mb-2">Pending requests</h3>
                        {pendingRoomRequests.length > 0 ? (
                            <div className="mt-4 space-y-4">
                                {pendingRoomRequests.map((req) => (
                                    <div key={req.id} className="p-4 bg-blue-50 rounded-lg">
                                        <h3 className="font-medium text-gray-800">Student Detail</h3>
                                        <div className="flex flex-col md:flex-row md:justify-between mt-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600 mt-2">
                                                    Name: <span className="font-medium">{req.student_name}</span>
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Branch: <span className="font-medium">{req.branch}</span>
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Email: <span className="font-medium">{req.email}</span>
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Student ID: <span className="font-medium">{req.student_id}</span>
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-600 mt-2">
                                                    Hostel: <span className="font-medium">{req.hostel_name}</span>
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Room No: <span className="font-medium">{req.room_no}</span>
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Room Type: <span className="font-medium">{req.room_type}</span>
                                                </p>
                                            </div>

                                            <div className="flex flex-col items-start gap-2">
                                                <p className="text-sm text-gray-600 mt-2">
                                                    Request Status: <span className="font-medium">{reqmap[req.status]}</span>
                                                </p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleApprove(req.request_id, req.student_id, req.id)}
                                                        className="px-3 py-1 rounded bg-green-600 text-white cursor-pointer hover:shadow-lg transition"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleDecline(req.request_id, req.student_id, req.id)}
                                                        className="px-3 py-1 rounded bg-red-600 text-white cursor-pointer hover:shadow-lg transition"
                                                    >
                                                        Decline
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600 mt-2">No pending room requests present.</p>
                        )}
                    </div>

                    {otherRoomRequests.length > 0 ? (
                        <div>
                            <h3 className="text-lg font-medium mb-2">Other requests</h3>
                            <div className='mt-4 space-y-4'>
                                {otherRoomRequests.map((req) => (
                                    <div key={req.id} className={`p-4 rounded-lg ${req.status === "approved"
                                        ? "bg-green-100"
                                        : req.status === "declined"
                                            ? "bg-red-200"
                                            : "bg-yellow-100"
                                        }`}>
                                        <h3 className="font-medium text-gray-800">Student Detail</h3>
                                        <div className="flex flex-col md:flex-row md:justify-between mt-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600 mt-2">
                                                    Name: <span className="font-medium">{req.student_name}</span>
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Branch: <span className="font-medium">{req.branch}</span>
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Email: <span className="font-medium">{req.email}</span>
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Student ID: <span className="font-medium">{req.student_id}</span>
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-600 mt-2">
                                                    Hostel: <span className="font-medium">{req.hostel_name}</span>
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Room No: <span className="font-medium">{req.room_no}</span>
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Room Type: <span className="font-medium">{req.room_type}</span>
                                                </p>
                                            </div>

                                            <div className="flex flex-col items-start gap-2">
                                                <p className="text-sm text-gray-600 mt-2">
                                                    Request Status
                                                </p>
                                                <p className={`px-3 py-1 rounded ${req.status == 'approved' ? 'bg-[#5eb67db6]' : 'bg-[#d5ae20e3]'} text-gray-600 font-medium`}>
                                                    {reqmap[req.status]}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-600 mt-2">No other room requests present.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminRoomPage;
