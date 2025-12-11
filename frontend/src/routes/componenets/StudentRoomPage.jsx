import { useState, useEffect, use } from 'react';
import server_url from "./server_url.js";
import axios from "axios";
import HostelApproval from './HostelApproval.jsx';

function StudentRooms({ user }) {
    const [formData, setFormData] = useState({
        hostel_name: '',
        room_type: '',
    });

    const boys_hostel = ['Subhash', 'Raman', 'Tilak'];
    const girls_hostel = ['Saraswati', 'Kalpana'];
    const room_types = ['Single', 'Double', 'Triple'];
    const [room_detail, setRoomDetail] = useState(null);
    const [roommates, setRoommates] = useState(null);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showModal, setShowModal] = useState(false);



    useEffect(() => {
        if (!user) return;

        const fetchRoomDetails = async () => {
            try {
                const res = await axios.get(`${server_url}/api/hostel_rooms/hostel_room/${user.hostel_id}`);
                setRoomDetail(res.data);
            } catch (err) {
                console.error('Error fetching room details', err);
            }
        };

        fetchRoomDetails();
    }, [user]);

    useEffect(() => {
        if (!user || !user.hostel_id) return;
        // console.log("Fetching roommates for hostel_id:", user.hostel_id);

        const fetchRoommates = async () => {
            try {
                const res = await axios.get(`${server_url}/api/hostel_rooms/roomates`, {
                    params: { hostel_id: user.hostel_id }
                });
                setRoommates(res.data);
                console.log("Fetched Roommates:", res.data);
            } catch (err) {
                console.error('Error fetching roommates', err);
            }
        };
        fetchRoommates();
    }, [user])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // For now we just log the search criteria; can be wired to an API
        console.log('Searching rooms with', formData);
        try {
            const res = await axios.get(`${server_url}/api/hostel_rooms/rem_rooms`, {
                params: {
                    hostel_name: formData.hostel_name,
                    room_type: formData.room_type,
                    gender: user.gender,
                }
            });
            setAvailableRooms(res.data);
            console.log("Available Rooms:", res.data);
        } catch (err) {
            console.error('Error fetching available rooms', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-start justify-center p-6">
            <div className="max-w-4xl w-full space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Room Details</h1>
                    <p className="text-gray-600 mt-1">View your assigned room and search available rooms</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold">Hello {user?.name || 'Student'}!</h2>
                        {user?.hostel_id && room_detail ? (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <h3 className="font-medium text-gray-800">Your Room</h3>
                                    <p className="text-sm text-gray-600 mt-2">Hostel: <span className="font-medium">{room_detail?.hostel_name}</span></p>
                                    <p className="text-sm text-gray-600">Room No: <span className="font-medium">{room_detail?.room_no}</span></p>
                                    <p className="text-sm text-gray-600">Room Type: <span className="font-medium">{room_detail?.room_type}</span></p>
                                </div>
                                {/* <div className="p-4 bg-white rounded-lg border">
                                    <h3 className="font-medium text-gray-800">Roommates</h3>
                                    {roommates?.length ? (
                                        // <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                                        //     {roommates.map((r) => <li key={r.id || r.name}>{r.name}</li>)}
                                        // </ul>
                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {roommates.map((r) => (
                                                <div
                                                    key={r.id || r.student_id}
                                                    className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
                                                >
                                                    <h3 className="text-lg font-semibold text-gray-800">{r.name}</h3>

                                                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                                                        <p><span className="font-medium">Student ID:</span> {r.student_id}</p>
                                                        <p><span className="font-medium">Branch:</span> {r.branch}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-600 mt-2">No roommates information available.</p>
                                    )}
                                </div> */}
                                <div className="p-4 bg-white rounded-lg border">
                                    <h3 className="font-medium text-gray-800 text-sm">Roommates</h3>

                                    {roommates?.length ? (
                                        <div className={`mt-3 grid gap-3 
                                                            ${roommates.length === 1 ? "grid-cols-1" : ""} 
                                                            ${roommates.length === 2 ? "grid-cols-1 sm:grid-cols-2" : ""} 
                                                            ${roommates.length >= 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : ""}
                                                        `}>
                                            {roommates.map((r) => (
                                                <div
                                                    key={r.id || r.student_id}
                                                    className="p-3 border rounded-md shadow-sm bg-gray-50 hover:shadow transition"
                                                >
                                                    <h4 className="text-base font-semibold text-gray-800">
                                                        {r.name}
                                                    </h4>

                                                    <div className="mt-1 text-xs text-gray-600 space-y-0.5">
                                                        <p><span className="font-medium">Student ID:</span> {r.student_id}</p>
                                                        <p><span className="font-medium">Branch:</span> {r.branch}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-600 mt-2">
                                            No roommates information available.
                                        </p>
                                    )}
                                </div>

                            </div>
                        ) : (
                            <p className="text-sm text-gray-600 mt-2">You don't have a room assigned yet.</p>
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-3">Search Available Rooms</h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                            <div>
                                <label htmlFor="hostel_name" className="block text-sm font-medium text-gray-700 mb-2">Hostel</label>
                                <select
                                    id="hostel_name"
                                    name="hostel_name"
                                    value={formData.hostel_name}
                                    onChange={handleInputChange}
                                    className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">Select Hostel</option>
                                    {user?.gender === 'Male' ? boys_hostel.map(h => <option key={h} value={h}>{h}</option>) : girls_hostel.map(h => <option key={h} value={h}>{h}</option>)}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="room_type" className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                                <select
                                    id="room_type"
                                    name="room_type"
                                    value={formData.room_type}
                                    onChange={handleInputChange}
                                    className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">Select Room Type</option>
                                    {room_types.map(rt => <option key={rt} value={rt}>{rt}</option>)}
                                </select>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                >
                                    Search
                                </button>
                            </div>
                        </form>
                        {showModal && selectedRoom && (
                            <HostelApproval
                                user={user}
                                hostel={selectedRoom}
                                setShowModal={setShowModal}
                            />
                        )}
                        {availableRooms.length > 0 && (
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                {availableRooms.map((room) => (
                                    <div 
                                        key={room.id}
                                        className="p-4 max-w-fit mb-4 border rounded-lg bg-gray-50 cursor-pointer hover:shadow-lg transition"
                                        onClick={() => {
                                            setSelectedRoom(room);
                                            setShowModal(true);
                                        }}
                                    >
                                        <p className="text-base font-semibold text-gray-800">Hostel: {room.hostel_name}</p>
                                        <p className="text-sm text-gray-600">Room No: {room.room_no}</p>
                                        <p className="text-sm text-gray-600">Room Type: {room.room_type}</p>
                                        <p className="text-sm text-gray-600">Seats Remaining: {room.seats_rem}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentRooms;