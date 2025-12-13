import axios from "axios";
import { useState, useEffect, use } from 'react';
import server_url from "./server_url.js";

function HostelApproval({ user, hostel, setShowModal }) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleRoomRequest = async (student_id, hostel_id) => {
        try {
            setLoading(true);
            const response = await axios.post(`${server_url}/api/hostel_rooms/request_room`, {
                student_id,
                hostel_id
            });
            setShowModal(false);
            console.log("Room request successful:", response.data);
        } catch (error) {
            console.error("Error requesting room:", error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Failed to request room. Please try again.");
            }
        }
        finally{
            setLoading(false);
        }
    }
    return <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/10 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Confirm Room Request
            </h2>

            <p className="text-gray-700 mb-3">
                Are you sure you want to request:
            </p>

            <div className="border rounded-md p-3 mb-4 bg-gray-50">
                <p><strong>Hostel:</strong> {hostel.hostel_name}</p>
                <p><strong>Room No:</strong> {hostel.room_no}</p>
                <p><strong>Room Type:</strong> {hostel.room_type}</p>
                <p><strong>Seats Remaining:</strong> {hostel.seats_rem}</p>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded-md bg-gray-200 hover:bg-gray-300"
                >
                    Cancel
                </button>

                <button
                    onClick={() => {
                        // You can call your API here
                        handleRoomRequest(user.student_id, hostel.id);
                    }}
                    disabled={loading}
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                    {loading ? 'Requesting...' : 'Confirm'}
                </button>
            </div>
            {error && <p className="text-red-500 mt-3">{error}</p>}
        </div>
    </div>
}

export default HostelApproval;