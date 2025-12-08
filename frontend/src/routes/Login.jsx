import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from "./componenets/Navbar";
import server_url from './componenets/server_url.js';

function Login({ setUser }) {
    const [user_type, setLoginType] = useState('student');
    const [formData, setFormData] = useState({
        student_id: '',
        password: '',
        user_type: user_type
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleuser_type = (type) => {
        setLoginType(type);
        setFormData(prev => ({
            ...prev,
            user_type: type
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle login logic here based on loginType
        // alert(`Logging in as ${loginType}`);
        console.log(`${user_type} login:`, formData);
        try {
            const response = await axios.post(`${server_url}/api/auth/login`, formData);
            console.log('Fetched user:', response);
            setUser(response.data);
            navigate('/');
        }
        catch (err) {
            console.error('Error during login:', err);
            // console.log(err.response.data.message)
            try {
                setError(err.response.data.message);
            }
            catch {
                setError("Login failed. Please try again.");
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full space-y-8">
                    {/* Header */}
                    <div className="text-center ">
                        <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-600">Sign in to your account</p>
                    </div>

                    {/* Login Type Selector */}
                    <div className="bg-white rounded-lg p-1 shadow-lg ">
                        <div className="flex">
                            <button
                                onClick={() => handleuser_type('student')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${user_type === 'student'
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Student
                            </button>
                            <button
                                onClick={() => handleuser_type('admin')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${user_type === 'admin'
                                    ? 'bg-purple-500 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                <svg className="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Admin
                            </button>
                        </div>
                    </div>

                    {/* Login Form */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="student_id" className="block text-sm font-medium text-gray-700 mb-2">
                                    {user_type === 'student' ? 'Student Id' : 'Admin Id'}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="student_id"
                                        name="student_id"
                                        type="text"
                                        required
                                        value={formData.student_id}
                                        onChange={handleInputChange}
                                        className="block text-gray-700 w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        // placeholder={loginType === 'student' ? 'Student Id' : 'Admin Id'}
                                        placeholder={`Enter your ${user_type === 'student' ? 'Student' : 'Admin'} Id`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="block  text-gray-700 w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                        Remember me
                                    </label>
                                </div>
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                                    Forgot password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                {user_type === 'student' ? 'Sign in as Student' : 'Sign in as Admin'}
                            </button>
                            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                        </form>

                        {/* Divider */}
                        {user_type === 'student' && (
                            <>
                                <div className="mt-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-300" />
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white text-gray-500">New to our platform?</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Register Link */}
                                <div className="mt-6 text-center">
                                    <a
                                        href="/register"
                                        className="text-blue-600 hover:text-blue-500 font-medium text-sm"
                                    >
                                        Create a new account
                                    </a>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-500">
                        <p>© {new Date().getFullYear()} Hostel Management System. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;