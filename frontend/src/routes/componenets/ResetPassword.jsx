import axios from "axios";
import { useState, useEffect, use } from 'react';
import server_url from "./server_url.js";
import ButtonLoader from "./ButtonLoader.jsx";

function ResetPassword({ setForgotPassword, setLoginError }) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form,setForm]=useState({
        student_id:"",
        email:"",
        password:""
    })
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetPassword = async (student_id, email, password) => {
        try {
            setLoading(true);
            const response = await axios.post(`${server_url}/api/auth/forgot`, {
                student_id,
                email,
                password
            });
            setLoginError("Password Updated Successfully.")
            setForgotPassword(false);
            console.log("Room request successful:", response.data);
        } catch (error) {
            console.error("Error requesting room:", error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Failed to request room. Please try again.");
            }
        }
        finally {
            setLoading(false);
        }
    }
    return <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/10 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Password Reset
            </h2>
            <p className="text-gray-700 mb-3">
                Please enter the details:
            </p>
            <form
                onSubmit={resetPassword}
                className="bg-white rounded-xl"
            >
                <input
                    name="student_id"
                    value={form.student_id}
                    onChange={handleInputChange}
                    placeholder="Student Id"
                    required
                    className="w-full mb-3 p-2 border rounded"
                />

                <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                    className="w-full mb-3 p-2 border rounded"
                />

                <input
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                    placeholder="New Password"
                    required
                    className="w-full mb-3 p-2 border rounded"
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setForgotPassword(false)}
                        className="px-4 py-2 border rounded-md bg-gray-200 hover:bg-gray-300"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {
                            resetPassword(
                                form.student_id,
                                form.email,
                                form.password
                            );
                        }}
                        disabled={loading}
                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {loading ? <ButtonLoader /> : 'Confirm'}
                    </button>
                </div>
                {error && <p className="text-red-500 mt-3">{error}</p>}
            </form>
        </div>
    </div>
}

export default ResetPassword;