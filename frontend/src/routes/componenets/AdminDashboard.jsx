import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import server_url from "./server_url";
import { useState, useEffect } from "react";
import menu from "./menu.js"

const hostels = ['Subhash', 'Raman', 'Tilak', 'Saraswati', 'Kalpana'];
const hostel_colors = ['#2563EB', '#FACC15', '#EC4899', '#10B981', '#8B5CF6'];
const hostel_types = {
    'Single': 1,
    'Double': 2,
    'Triple': 3
}


function AdminDashboard({ user, setUser }) {
    const [occupancyData, setOccupancyData] = useState([]);
    const [complaintsData, setComplaintsData] = useState(null);
    const [hostel_requests, sethostel_requests] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await axios.post(`${server_url}/api/auth/logout`);
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const fetchOccupancyData = async () => {
        try {
            const rooms = await axios.get(`${server_url}/api/hostel_rooms/all_rooms`);
            const newData = hostels.map((hostel, index) => {
                const totalRooms = rooms.data.filter(room => room.hostel_name === hostel);
                const totalSeats = totalRooms.reduce((sum, room) => sum + hostel_types[room.room_type], 0);
                const remainingSeats = totalRooms.reduce((sum, room) => sum + room.seats_rem, 0);
                const occupancyRate = totalSeats === 0 ? 0 : Math.round(((totalSeats - remainingSeats) / totalSeats) * 100);
                console.log('Hostel:', hostel, 'Total Seats:', totalSeats, 'Remaining Seats:', remainingSeats);
                return { name: hostel, value: occupancyRate, color: hostel_colors[index] };
            });
            setOccupancyData(newData);
        } catch (error) {
            console.error('Error fetching occupancy data:', error);
        }
    };

    const fetchcomplaintsData = async () => {
        try {
            const response = await axios.get(`${server_url}/api/complaints/get_complaints`);
            const allComplaints = response.data;
            console.log('All Complaints:', allComplaints);
            const resolvedCount = allComplaints.resolved_complaints.length;
            const pendingCount = allComplaints.pending_complaints.length;
            setComplaintsData([
                { name: "Resolved", value: resolvedCount },
                { name: "Pending", value: pendingCount },
            ]);
        }
        catch (error) {
            console.error('Error fetching complaints data:', error);
        }
    }

    const fetchHostelRequests = async () => {
        try {
            const response = await axios.get(`${server_url}/api/hostel_rooms/room_requests`);
            console.log('Hostel Requests Data:', response.data);
            const pending_request = response.data.pending_requests.length;
            const otherRequests = response.data.other_requests;
            const approved_request = otherRequests.filter(r => r.status === 'approved').length;
            const declined_request = otherRequests.filter(r => r.status === 'declined').length;
            console.log('Approved:', approved_request, 'Pending:', pending_request, 'Declined:', declined_request);
            sethostel_requests([
                { name: "Approved", value: approved_request },
                { name: "Pending", value: pending_request },
                { name: "Declined", value: declined_request },
            ]);
        }
        catch (error) {
            console.error('Error fetching hostel requests data:', error);
        }
    }

    useEffect(() => {
        setLoading(true);
        setError(null);
        const loadAll = async () => {
            try {
                await Promise.all([
                    fetchOccupancyData(),
                    fetchcomplaintsData(),
                    fetchHostelRequests(),
                ]);
            } catch (err) {
                console.error('Error loading admin dashboard data:', err);
                setError('Failed to load data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        loadAll();
    }, []);

    if(loading){
        return <div>Loading Admin Page...</div>;
    }

    if(error){
        return <div>{error}</div>;
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-start justify-center p-6">
            <div className="max-w-6xl w-full space-y-6">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
                            <p className="text-gray-600 text-sm">Here's what's happening in your hostels</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={()=>{navigate("/login")}} className="px-4 py-2 bg-blue-600 rounded-full text-sm font-semibold cursor-pointer hover:bg-blue-700 text-white">
                            Login
                        </button>
                        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 rounded-full text-sm font-semibold cursor-pointer hover:bg-red-700 text-white">
                            Logout
                        </button>
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <section className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                            <h2 className="font-bold mb-4">Occupancy</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {occupancyData.map((hostel, i) => (
                                    <div key={i} className="bg-gray-50 rounded-lg p-4 flex flex-col items-center shadow-sm">
                                        <div className="w-full h-28">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={[{ value: hostel.value }, { value: 100 - hostel.value }]}
                                                        dataKey="value"
                                                        innerRadius={30}
                                                        outerRadius={50}
                                                    >
                                                        <Cell fill={hostel.color} />
                                                        <Cell fill="#E6E6E6" />
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <p className="mt-2 font-semibold">{hostel.name} Hostel</p>
                                        <p className="text-lg font-bold" style={{ color: hostel.color }}>{hostel.value}%</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                            <h2 className="font-bold mb-4">Hostel Requests</h2>
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                                <div className="w-40 h-24 sm:w-1/3">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={hostel_requests} dataKey="value" outerRadius={40}>
                                                <Cell fill="#2563EB" />
                                                <Cell fill="#FACC15" />
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="space-y-2 text-sm">
                                    {hostel_requests && hostel_requests.map((req, index) => (
                                        <p key={index}>{req.name}: <span className={req.name === 'Approved' ? "text-blue-600" : req.name === 'Declined' ? "text-red-600" : "text-yellow-500"}>{req.value}</span></p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <aside className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                            <h3 className="font-semibold mb-3">Quick Actions</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {menu.map((m) => (
                                    <a key={m} href={m=='Dashboard'?'/':`/${m.toLowerCase()}`} className="block px-4 py-3 rounded-lg bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 text-gray-800 font-medium">
                                        {m}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                            <h3 className="font-semibold mb-3">Complaints</h3>
                            <div className="flex flex-col gap-3">
                                <div className="p-3 bg-gray-50 rounded">
                                    <p className="font-medium">Total: <span className="text-gray-700">{complaintsData?.reduce((sum, item) => sum + item.value, 0)}</span></p>
                                    {complaintsData && complaintsData.map((data, index) => (
                                        <p key={index} className="text-sm">{data.name}: <span className={data.name === 'Resolved' ? "text-blue-600" : "text-yellow-500"}>{data.value}</span></p>
                                    ))}
                                </div>
                                <div className="w-full h-24">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={complaintsData} dataKey="value" outerRadius={40}>
                                                <Cell fill="#2563EB" />
                                                <Cell fill="#FACC15" />
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </aside>
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;