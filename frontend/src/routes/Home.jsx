import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Header from "./componenets/Header";
import Navbar from "./componenets/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import server_url from "./componenets/server_url";
import Redirect from "./componenets/Redirect";
import AdminDashboard from "./componenets/AdminDashboard";
import StudentDashboard from "./componenets/StudentDashboard";


function Dashboard({ user, setUser }) {
    

    if (!user) return <Redirect />;

    if (user.user_type === 'student') return <StudentDashboard user={user} setUser={setUser} />;

    return <AdminDashboard user={user} setUser={setUser} />;
}

export default Dashboard;