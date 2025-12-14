import { useNavigate } from "react-router-dom";
import axios from "axios";
import server_url from "./server_url";
import sidebarItems from "./menu.js";

function Navbar({ user, setUser }) {
    // const sidebarItems = ["Dashboard", "Rooms", "Accounts", "Complaints", "Staffs"];
    const handleLogout = async () => {
        try {
            await axios.post(`${server_url}/api/auth/logout`);
            setUser(null);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }
    return (
        <header className="w-full h-16 bg-white border-b p-2 flex items-center shadow">
            <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-4">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">H</div>
                    <span className="text-lg font-semibold text-gray-800">Hostel Management</span>
                </div>
                <nav className="flex items-center space-x-3">
                    {sidebarItems.map((item) => {
                        const path = item === "Dashboard" ? "/" : `/${item.toLowerCase().replace(/\s+/g, '-')}`;
                        return (
                            <a
                                key={item}
                                href={path}
                                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors"
                            >
                                {item}
                            </a>
                        )
                    })}
                    {user ?
                        <a
                            key="Logout"
                            href="/login"
                            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors"
                            onClick={handleLogout}
                        >
                            Logout
                        </a>
                        : null}
                </nav>
            </div>
        </header>
    )
}

export default Navbar;