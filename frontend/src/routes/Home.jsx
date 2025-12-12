import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Header from "./componenets/Header";
import Navbar from "./componenets/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import server_url from "./componenets/server_url";
import Redirect from "./componenets/Redirect";
import AdminDashboard from "./componenets/AdminDashboard";


function Dashboard({ user, setUser }) {
    

    if (!user) return <Redirect />;

    return <AdminDashboard user={user} setUser={setUser} />;
}

export default Dashboard;