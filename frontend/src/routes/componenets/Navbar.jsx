import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import server_url from "./server_url";
import sidebarItems from "./menu.js";

function Navbar({ user, setUser }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        try {
            await axios.post(`${server_url}/api/auth/logout`);
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    const handleLinkClick = () => setOpen(false);

    return (
        <header className="w-full bg-white border-b p-2 shadow relative">
            <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-4 h-16">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">H</div>
                    <span className="text-lg font-semibold text-gray-800">Hostel Management</span>
                </div>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center space-x-3">
                    {sidebarItems.map((item) => {
                        const path = item === "Dashboard" ? "/" : `/${item.toLowerCase().replace(/\s+/g, '-')}`;
                        return (
                            <Link
                                key={item}
                                to={path}
                                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors"
                            >
                                {item}
                            </Link>
                        )
                    })}
                    {user ? (
                        <button
                            key="Logout"
                            onClick={handleLogout}
                            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors"
                        >
                            Logout
                        </button>
                    ) : null}
                </nav>

                {/* Mobile hamburger */}
                <div className="md:hidden flex items-center">
                    <button
                        aria-label="Toggle menu"
                        onClick={() => setOpen((v) => !v)}
                        className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {open ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile dropdown */}
            {open && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-md z-40">
                    <div className="flex flex-col p-3 space-y-1">
                        {sidebarItems.map((item) => {
                            const path = item === "Dashboard" ? "/" : `/${item.toLowerCase().replace(/\s+/g, '-')}`;
                            return (
                                <Link
                                    key={`m-${item}`}
                                    to={path}
                                    onClick={handleLinkClick}
                                    className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    {item}
                                </Link>
                            )
                        })}
                        {user ? (
                            <button onClick={(e) => { handleLogout(e); setOpen(false); }} className="text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50">Logout</button>
                        ) : null}
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar;