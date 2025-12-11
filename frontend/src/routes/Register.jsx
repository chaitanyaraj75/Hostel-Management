import { useState, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import server_url from './componenets/server_url.js';


function Register({ setUser }) {
    const navigate = useNavigate();
    const years = [
        { label: '1st', value: 1 },
        { label: '2nd', value: 2 },
        { label: '3rd', value: 3 },
        { label: '4th', value: 4 },
    ]
    const genders = ['Male', 'Female'];
    const branches = ['CSE', 'ECE', 'EE', 'ME', 'CE', 'ChE', 'IT', 'IOT', 'BBA', 'BPharma'];
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        student_id: '',
        gender: '',
        year: '',
        mobile_no: '',
        branch: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        // validate mobile number: must be exactly 10 digits
        if (!/^\d{10}$/.test(formData.mobile_no)) {
            setError('Mobile number must be 10 digits and contain only digits');
            return;
        }

        console.log(`Student register:`, formData);
        try {
            const response = await axios.post(`${server_url}/api/auth/register`, formData);
            console.log('Registered user:', response);
            setUser(response.data.user);
            navigate('/');
        }
        catch (err) {
            setError("Email, Student_id or Mobile_no already registered");
            if (axios.isAxiosError(err)) {
                console.error('axios status:', err.response?.status);
                console.error('axios response data:', err.response?.data);
                console.error('axios response headers:', err.response?.headers);
                console.error('axios request:', err.request);
                console.error('axios message:', err.message);
            }
            else
                console.error('Registration error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center ">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an Account</h2>
                    <p className="text-gray-600">Register to get started</p>
                </div>

                {/* Registration Form */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="block text-gray-700 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="block text-gray-700 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <label htmlFor="mobile_no" className="block text-sm font-medium text-gray-700 mb-2">
                                Mobile No
                            </label>
                            <input
                                type="tel"
                                id="mobile_no"
                                name="mobile_no"
                                required
                                value={formData.mobile_no}
                                onChange={handleInputChange}
                                className="block text-gray-700 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter your mobile number"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gender
                            </label>
                            <Listbox
                                value={formData.gender}
                                onChange={val => setFormData(f => ({ ...f, gender: val }))}>
                                <div className="relative">
                                    <Listbox.Button className="block text-gray-700 w-full px-3 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-left">
                                        {formData.gender || 'Select gender'}
                                    </Listbox.Button>
                                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                        <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                                            {genders.map((gender) => (
                                                <Listbox.Option
                                                    key={gender}
                                                    value={gender}
                                                    className={({ active }) =>
                                                        `cursor-pointer select-none relative py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                                                        }`
                                                    }
                                                >
                                                    {({ selected }) => (
                                                        <>
                                                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{gender}</span>
                                                            {selected ? (
                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                                    ✓
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </Listbox>
                        </div>
                        <div>
                            <label htmlFor="student_id" className="block text-sm font-medium text-gray-700 mb-2">
                                Student Id
                            </label>
                            <input
                                id="student_id"
                                name="student_id"
                                type="text"
                                required
                                value={formData.student_id}
                                onChange={handleInputChange}
                                className="block text-gray-700 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter your student id"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                            <Listbox
                                value={formData.year}
                                onChange={val => setFormData(f => ({ ...f, year: val }))}>
                                <div className="relative">
                                    <Listbox.Button className="block text-gray-700 w-full px-3 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-left">
                                        {formData.year ? years.find(y => y.value === formData.year)?.label : 'Select year'}
                                    </Listbox.Button>
                                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                        <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                                            {years.map((year) => (
                                                <Listbox.Option
                                                    key={year.label}
                                                    value={year.value}
                                                    className={({ active }) =>
                                                        `cursor-pointer select-none relative py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                                                        }`
                                                    }
                                                >
                                                    {({ selected }) => (
                                                        <>
                                                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{year.label}</span>
                                                            {selected ? (
                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                                    ✓
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </Listbox>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                            <Listbox value={formData.branch} onChange={val => setFormData(f => ({ ...f, branch: val }))}>
                                <div className="relative">
                                    <Listbox.Button className="block text-gray-700 w-full px-3 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-left">
                                        {formData.branch || 'Select branch'}
                                    </Listbox.Button>
                                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                        <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                                            {branches.map((branch) => (
                                                <Listbox.Option
                                                    key={branch}
                                                    value={branch}
                                                    className={({ active }) =>
                                                        `cursor-pointer select-none relative py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                                                        }`
                                                    }
                                                >
                                                    {({ selected }) => (
                                                        <>
                                                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{branch}</span>
                                                            {selected ? (
                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                                    ✓
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </Listbox>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="block text-gray-700 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    tabIndex={-1}
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
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="block text-gray-700 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? (
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
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        <button
                            type="submit"
                            disabled={
                                !formData.name ||
                                !formData.email ||
                                !formData.student_id ||
                                !formData.gender ||
                                !formData.year ||
                                !formData.mobile_no ||
                                !formData.branch ||
                                !formData.password ||
                                !formData.confirmPassword
                            }
                            className={`w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white 
                                transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 
                                ${(
                                    !formData.name ||
                                    !formData.email ||
                                    !formData.student_id ||
                                    !formData.gender ||
                                    !formData.year ||
                                    !formData.mobile_no ||
                                    !formData.branch ||
                                    !formData.password ||
                                    !formData.confirmPassword
                                )
                                    ? 'bg-gray-300 cursor-not-allowed opacity-70 scale-[1] border border-gray-300'
                                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:ring-blue-500 hover:scale-[1.02] border border-transparent'
                                }`}
                        >
                            Register
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <span className="text-gray-600 text-sm">Already have an account? </span>
                        <a href="/login" className="text-blue-600 hover:text-blue-500 font-medium text-sm">Sign in</a>
                    </div>
                </div>
                {/* Footer */}
                <div className="text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} Hostel Management System. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}

export default Register;