import { useNavigate } from "react-router-dom";
import axios from "axios";
import server_url from "./server_url";
import { useState, useEffect } from "react";
import GenderAvatar from "./GenderAvatar";
import menu from "./menu.js"
import PageLoader from './PageLoader.jsx';

const branch = {
    CSE: 'Computer Science and Engineering',
    ECE: 'Electronics and Communication Engineering',
    EE: 'Electrical Engineering',
    ME: 'Mechanical Engineering',
    CE: 'Civil Engineering',
    ChE: 'Chemical Engineering',
    IT: 'Information Technology',
    IOT: 'Internet of Things',
    BBA: 'Bachelor of Business Administration',
    BPharma: 'Bachelor of Pharmacy'
};

function StudentDashboard({ user, setUser }) {
    const navigate = useNavigate();
    const [pendingComplaints, setPendingComplaints] = useState([]);
    const [pendingRoomRequests, setPendingRoomRequests] = useState([]);
    const [hostelDetails, setHostelDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleLogout = async () => {
        try {
            await axios.post(`${server_url}/api/auth/logout`);
            setUser(null);
            navigate('/login');
        } catch (err) {
            console.error('Error during logout:', err);
        }
    };

    const fetchComplaints = async () => {
        try {
            const response = await axios.get(`${server_url}/api/complaints/get_student_complaints`, {
                params: { student_id: user.student_id }
            });
            const complaints = response.data;
            console.log("Fetched complaints", complaints)
            const pending_complaints = complaints.filter(complaint => complaint.status === 'pending');
            // const resolved_complaints = complaints.filter(complaint => complaint.status === 'pending');
            setPendingComplaints(complaints);
        }
        catch (err) {
            console.error("Error fetching complaints:", err);
            setError("Failed to fetch complaints");
        }
    }

    const fetchRoomDetail = async () => {
        try {
            if (!user.hostel_id) {
                return;
            }
            const response = await axios.get(`${server_url}/api/hostel_rooms/hostel_room_by_hostel_id`, {
                params: { hostel_id: user.hostel_id }
            });
            const room = response.data;
            console.log("The student Room Detais", response.data);
            setHostelDetails(room);
        }
        catch (err) {
            console.error("Error fetching student room:", err);
            setError("Failed to fetch student room");
        }
    }

    const fetchRoomRequests = async () => {
        try {
            const response = await axios.get(`${server_url}/api/hostel_rooms/room_requests`);
            const requests = response.data;
            const pending_requests = requests.pending_requests
            setPendingRoomRequests(pending_requests);
        }
        catch (err) {
            console.error("Error fetching room requests:", err);
            setError("Failed to fetch room requests");
        }
    }

    const loadAll = async () => {
        try {
            await Promise.all([
                fetchComplaints(),
                fetchRoomDetail(),
                fetchRoomRequests()
            ]);
        } catch (err) {
            console.error('Error loading admin dashboard data:', err);
            setError('Failed to load data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAll();
    }, [])

    if (loading) {
        return <PageLoader />;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-start justify-center p-6">
            <div className="max-w-4xl w-full space-y-6">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
                            <p className="text-gray-600 text-sm">Your student dashboard</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => { navigate("/login") }} className="px-4 py-2 bg-blue-600 rounded-full text-sm font-semibold cursor-pointer hover:bg-blue-700 text-white">
                            Login
                        </button>
                        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 rounded-full text-sm font-semibold cursor-pointer hover:bg-red-700 text-white">
                            Logout
                        </button>
                    </div>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <section className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex items-start gap-6">
                            <GenderAvatar user={user} size={96} />
                            <div>
                                <h2 className="font-bold text-lg">{user?.name}</h2>
                                <p className="font-medium text-sm text-gray-800">{branch[user.branch]}</p>
                                <p className="text-sm font-bold text-gray-600">{user?.email}</p>
                                {/* <p className="mt-2 text-sm">Branch: <span className="font-medium text-gray-800"></span></p> */}
                                <p className="text-sm">Student ID: <span className="font-medium text-gray-800">{user?.student_id}</span></p>
                                <p className="text-sm">Hostel: <span className="font-medium text-gray-800">{hostelDetails?.hostel_name || 'Not assigned'}</span></p>
                                <p className="text-sm">Room: <span className="font-medium text-gray-800">{hostelDetails?.room_no || 'N/A'}</span></p>
                                <p className="text-sm">Room Type: <span className="font-medium text-gray-800">{hostelDetails?.room_type || 'N/A'}</span></p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                            <h3 className="font-semibold mb-3">Pending Complaints</h3>
                            <div className="space-y-2">
                                {pendingComplaints.length === 0 ? (
                                    <p className="text-sm text-gray-600">No complaints</p>
                                ) : (
                                    pendingComplaints.map((c, idx) => (
                                        <div key={idx} className="p-3 bg-gray-50 rounded">
                                            <p className="font-medium">{c.subject}</p>
                                            <p className="text-sm text-gray-600">{c.complaint || 'No additional details'}</p>
                                            <p className="text-sm text-yellow-600">Status: Pending</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                            <h3 className="font-semibold mb-3">Pending Room Request</h3>
                            <div className="space-y-2">
                                {pendingRoomRequests.length === 0 ? (
                                    <p className="text-sm text-gray-600">No pending request</p>
                                ) : (
                                    pendingRoomRequests.map((req, idx) => (
                                        <div key={idx} className="p-3 bg-gray-50 rounded">
                                            <p>Hostel: <span className="font-medium">{req.hostel_name} Hostel</span></p>
                                            <p className="text-sm">Room No: <span className="font-medium text-gray-800">{req.room_no}</span></p>
                                            <p className="text-sm">Room Type: <span className="font-medium text-gray-800">{req.room_type}</span></p>
                                            <p className="text-sm text-yellow-600">Status: Pending</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>

                    <aside className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                            <h3 className="font-semibold mb-3">Quick Actions</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {menu.map((m) => (
                                    <a key={m} href={m == 'Dashboard' ? '/' : `/${m.toLowerCase()}`} className="block px-4 py-3 rounded-lg bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 text-gray-800 font-medium">
                                        {m}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </aside>
                </main>
            </div>
        </div>
    )
}

export default StudentDashboard;